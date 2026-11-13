// Delivery location + fee: road distance from the restaurant pin × Rs per km.
// Address lookup uses OpenStreetMap Nominatim; road distance uses the public OSRM router.

export const RESTAURANT = { lat: 24.8416037, lon: 67.1645468, address: 'K 19/14 Main Korangi Industrial Road, Sherabad Colony, Sector 36-A, Landhi Town, Karachi' }
export const RATE_PER_KM = 30 // charged for every km beyond 4 km
export const MIN_FEE = 80
export const MAX_KM = 25

// Distance slabs (road km): 0–1 Rs 80, 1–2 Rs 100, 2–3 Rs 140, 3–4 Rs 180,
// then Rs 180 + Rs 30 per extra km, rounded up to the next Rs 10.
export const feeForKm = (km) => {
  if (km <= 1) return 80
  if (km <= 2) return 100
  if (km <= 3) return 140
  if (km <= 4) return 180
  return 180 + Math.ceil(((km - 4) * RATE_PER_KM) / 10) * 10
}

const KARACHI_VIEWBOX = '66.80,25.15,67.45,24.75'

const shortAddress = (place) => {
  const a = place.address || {}
  const parts = [a.house_number && a.road ? `${a.house_number} ${a.road}` : a.road || place.name, a.neighbourhood || a.quarter, a.suburb || a.city_district, a.city || a.town || 'Karachi']
  const unique = [...new Set(parts.filter(Boolean).map((part) => part.replace(/\s*Division$/i, '')))]
  return unique.length > 1 ? unique.join(', ') : place.display_name.split(',').slice(0, 4).join(',')
}

const straightKm = (lat, lon) => {
  const rad = (deg) => (deg * Math.PI) / 180
  const dLat = rad(lat - RESTAURANT.lat)
  const dLon = rad(lon - RESTAURANT.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(RESTAURANT.lat)) * Math.cos(rad(lat)) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

export async function roadKm(lat, lon) {
  try {
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${RESTAURANT.lon},${RESTAURANT.lat};${lon},${lat}?overview=false`)
    const data = await response.json()
    if (data.code === 'Ok') return data.routes[0].distance / 1000
  } catch { /* fall through to the estimate */ }
  return straightKm(lat, lon) * 1.35 // typical Karachi road-to-straight-line ratio
}

export async function reverseGeocode(lat, lon) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=en&zoom=18&lat=${lat}&lon=${lon}`)
  const place = await response.json()
  return place?.display_name ? shortAddress(place) : `${lat.toFixed(5)}, ${lon.toFixed(5)}`
}

// Karachi bounding box: results outside it are dropped.
const BOUNDS = { west: 66.8, south: 24.75, east: 67.45, north: 25.15 }
const inKarachi = ({ lat, lon }) => lat >= BOUNDS.south && lat <= BOUNDS.north && lon >= BOUNDS.west && lon <= BOUNDS.east

// Small in-memory cache + throttle so typing never floods the free map services.
const cache = new Map()
let lastCall = 0
const throttle = async () => {
  const gap = Date.now() - lastCall
  if (gap < 350) await new Promise((resolve) => setTimeout(resolve, 350 - gap))
  lastCall = Date.now()
}
const clean = (text) => text.replace(/[<>{}"`\\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80)

const photonLabel = (p) => {
  const parts = [p.name, p.housenumber && p.street ? `${p.housenumber} ${p.street}` : p.street !== p.name ? p.street : '', p.district || p.locality, 'Karachi']
  return [...new Set(parts.filter(Boolean).map((part) => part.split(',')[0].trim()))].join(', ')
}

// Prefix / typo tolerant search (Photon) with Nominatim as a fallback; nearest results first.
export async function searchAddress(rawQuery, signal) {
  const query = clean(rawQuery)
  if (query.length < 3) return []
  const key = query.toLowerCase()
  if (cache.has(key)) return cache.get(key)
  await throttle()
  if (signal?.aborted) return []
  let results = []
  try {
    const params = new URLSearchParams({ q: query, limit: '10', lang: 'en', lat: String(RESTAURANT.lat), lon: String(RESTAURANT.lon), bbox: `${BOUNDS.west},${BOUNDS.south},${BOUNDS.east},${BOUNDS.north}` })
    const response = await fetch(`https://photon.komoot.io/api/?${params}`, { signal })
    const data = await response.json()
    results = (data.features || []).map((f) => ({ lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], address: photonLabel(f.properties) }))
  } catch (error) { if (signal?.aborted) throw error }
  if (!results.length) {
    try {
      const params = new URLSearchParams({ q: `${query}, Karachi`, format: 'jsonv2', addressdetails: '1', limit: '8', countrycodes: 'pk', viewbox: KARACHI_VIEWBOX, bounded: '1', 'accept-language': 'en' })
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { signal })
      results = (await response.json()).map((place) => ({ lat: Number(place.lat), lon: Number(place.lon), address: shortAddress(place) }))
    } catch (error) { if (signal?.aborted) throw error }
  }
  const seen = new Set()
  results = results.filter(inKarachi)
    .filter((r) => { const k = r.address.toLowerCase(); return !seen.has(k) && seen.add(k) })
    .sort((a, b) => straightKm(a.lat, a.lon) - straightKm(b.lat, b.lon))
    .slice(0, 8)
  if (cache.size > 100) cache.clear()
  cache.set(key, results)
  return results
}

// Builds the saved delivery location: address, distance and fee.
export async function buildLocation(lat, lon, address) {
  const km = await roadKm(lat, lon)
  return { lat, lon, address: address || (await reverseGeocode(lat, lon)), km: Math.round(km * 10) / 10, fee: feeForKm(km), outOfRange: km > MAX_KM }
}

export function currentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Location is not supported on this device.'))
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
      (error) => reject(new Error(error.code === 1 ? 'Location permission was denied. Please allow location or search your address below.' : 'Could not get your location. Please search your address below.')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )
  })
}

export const mapsLink = (location) => `https://maps.google.com/?q=${location.lat},${location.lon}`
