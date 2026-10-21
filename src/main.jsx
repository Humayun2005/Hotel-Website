import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock3, History, MapPin, Minus,
  Plus, Search, ShoppingBag, Truck, Utensils, X, MessageCircle,
} from 'lucide-react'
import './style.css'
import logo from './assets/Red-Png.png'
import whiteLogo from './assets/White-Png.png'

const WHATSAPP_NUMBER = '923112558691'
const categories = ['All items', 'Popular', 'Biryani', 'Pulao', 'Burgers', 'Sandwiches', 'BBQ', 'Broast', 'Appetizers', 'Pasta', 'Lasagna', 'Pakistani Curries', 'Chinese', 'Soups', 'Pizza', 'Fries', 'Sides', 'Drinks', 'Bread', 'Dips']
const categoryIcons = { 'All items': '✦', Popular: '★', Biryani: '🍛', Pulao: '🥘', Burgers: '🍔', Sandwiches: '🥪', BBQ: '🍢', Broast: '🍗', Appetizers: '🥟', Pasta: '🍝', Lasagna: '🍲', 'Pakistani Curries': '🍲', Chinese: '🥡', Soups: '🥣', Pizza: '🍕', Fries: '🍟', Sides: '🍽️', Drinks: '🥤', Bread: '🫓', Dips: '🥣' }
const deliveryZones = [
  ['Tree of Life School / Arsalan School', 60], ['Asifa Aftab School / Iqra School', 60], ['K Area Market / Taj School / Pakora Street', 80], ['J1 Area / Madni Masjid / APWA School', 80], ['Darul Uloom', 70], ['Darul Uloom Basti / J Area Firdous Masjid', 90], ['Burmi Colony / Safaid Masjid', 80], ['Shareef Colony / Imran Sweets', 90], ['36/B Double Road', 90], ['Ghosia Food / Baboo Arain Sweets', 100], ['36/B Double Road National School', 100], ['Mahad Madarsa / 36/B Kiran Bakery', 100], ['Noor Masjid / Atta Ka Thalla', 100], ['36/B Rehmania Masjid / Eid Gah Ground', 100], ['Zamanabad Karachi City School', 130], ['Zamanabad 37/A Sheriya Masjid', 150], ['Memon Institute / Habib Pakwan', 100], ['Area 36/C / Civic Center', 120], ['Landhi 6 / Farooqi Masjid', 110], ['Adnan Medical / JIQ Hospital', 120], ['Shahi Masjid / Master Biryani', 120], ['Bismillah Masjid / Landhi 6 Nagori', 120], ['Khwaja Chowrangi / Hammad Bhai Street', 120], ['L6 Afaq Bhai Street / Ibrahim Machakki', 130], ['Landhi Chiragh Hotel', 150], ['Landhi 4 Police Station Backside', 160], ['Landhi Babar Market', 190], ['Pakitek Ismail Goth Qabristan', 150], ['Landhi Party Fast Food', 220], ['Farooq Villas', 230], ['Khaddi Stop / Ali Hotel / Mughal House', 80], ['Zaman Town Tanzeem Floor Mills', 90], ['Zaman Town Millan / Owais Park', 100], ['Zaman Town Iqra School / Compound', 110], ['Zaman Town Gulshan-e-Muhammadi', 130], ['Kabaddi Ground / Rehan College', 120], ['Labour Square 34/3 Food Qabila', 120], ['Kallu Chowk Around', 110], ['Kamran Autos / Polytechnical', 130], ['Sector 34/2 Kalwa Hotel', 140], ['Korangi 4 / King Broast Area', 120], ['Korangi 4 Police Station / Rent A Car', 130], ['Korangi 5 F Area / Opp Park', 140], ['Civic Center Backside', 120], ['KPS School Korangi 5.5 / Kallu Tyre', 160], ['Rajputana Hospital / Korangi 2.5', 170], ['Korangi 2.5 / Gharib Nawaz Stop', 170], ['Korangi 1.5 / 32-B Labour Square', 180], ['Korangi 1 / 32-B Firdous Masjid', 200], ['LRBT Hospital', 180], ['50-A Madina Colony / Coast Guard', 200], ['Al-Mustafa Trust / TCF School / Chungi', 220], ['Pappan Chowk / Universal Town', 230], ['Nasir Colony / Zia Colony', 180], ['Chakra Goth / Nasir Jump', 200], ['Bhitai Colony', 230], ['Korangi Creek', 250], ['Sharafi Goth / United Towel', 100], ['Sharafi Goth UC Office', 110], ['Muhammad City / Shah Ali Goth', 200], ['Murtuza Baloch Pan Shop', 100], ['Hussain Shaheed Society Murtuza', 150], ['Mansehra Dildar Hotel', 200], ['Future More / Al-Jannat Restaurant', 200], ['Dawood Chowrangi / Zafar Hospital', 230], ['Awami Colony', 100], ['Awami Colony Power House', 110], ['Bagh-e-Korangi Rado Bakery', 160], ['Bagh-e-Korangi Sector 10 Rado Street', 170], ['Sector 10 Millat / Baloch House', 180], ['Bagh-e-Korangi Qabristan / Hafta Bazar', 180], ['Bagh-e-Korangi Madni / Al-Hamra City', 200], ['Saima Luxury Homes', 200], ['Bilal Chowrangi Dak Khana', 150], ['Lucknow Society / P&T Society', 220], ['Ghospak Road 17-K Stop', 180], ['100 Quarters', 220], ['Korangi 6 Girls College', 180], ['51-C Aqil Sweets to Astana', 145], ['Ilyas Goth', 230], ['Jumma Goth Muneem Clinic', 220], ['Gul Ahmed Gate No 8', 280], ['Rizwan Sweets / Landhi 1-D', 220], ['Mansehra Aziz Medical', 170], ['Artistic Denim Mills / Shan Chowrangi', 170], ['Nasir Colony Chishtiya / Babu Hotel', 200], ['Coast Guard W22 Stop', 200], ['Pakistan Safety Glass', 100], ['Getz Pharma / Indus Pharma Singer', 100], ['Naveena Textile / J. Head Office', 100], ['Karachi Paper Mill / Nelson Paints', 100], ['Rujby Waghning / Denim E', 100], ['Razi & Sons / Opp Mahad Madarsa', 100], ['DIC Bulle Shah Packages / Habib Knits', 100], ['Healthtech Awami / Rujby Headoffice', 100], ['Martin Dow Pharma / Herbion Pharma', 100], ['AGI K2 / International / Aspin / Abbott', 110], ['Bykiya Company / Silver Textile Bilal', 150], ['Pie in the Sky / AM14 Bilal Chowrangi', 150], ['AM4 / Reflection Vita Chowrangi', 160], ['Synergies Sourcing / Getz Vita Chowrangi', 160], ['Soorty Unit 9 / Mehran Foods', 180], ['National Oil Refinery / Vita Chowrangi', 190], ['Opal Laboratories / AFM4 Murtuza', 170], ['AM16 / Herbion Pharma Future More', 200], ['Hilton Pharma Godam Chowrangi', 220], ['Sailani K Samne Area Godam Chowrangi', 220], ['Gulzar Colony', 180], ['Mehran Town', 220], ['Shah Faisal No 2300', 230], ['Hospital Chowrangi', 400], ['Nazimabad', 800], ['Other Karachi area (fee confirmed on WhatsApp)', 250],
]
const getDeliveryFee = (zone) => deliveryZones.find(([name]) => name === zone)?.[1] || 250
const getPrimaryCategory = (dish) => {
  const name = dish.name.toLowerCase()
  if (name.includes('biryani')) return 'Biryani'
  if (name.includes('pulao')) return 'Pulao'
  if (name.includes('lasagna')) return 'Lasagna'
  if (name.includes('pasta')) return 'Pasta'
  if (name.includes('pizza')) return 'Pizza'
  if (name.includes('burger')) return 'Burgers'
  if (name.includes('sandwich')) return 'Sandwiches'
  if (name.includes('broast')) return 'Broast'
  if (name.includes('soup')) return 'Soups'
  if (name.includes('fries')) return 'Fries'
  if (name.includes('naan') || name.includes('chapati')) return 'Bread'
  if (name.includes('dip')) return 'Dips'
  if (dish.category === 'Drinks') return 'Drinks'
  if (dish.category === 'Chinese') return 'Chinese'
  if (dish.category === 'Pakistani') return 'Pakistani Curries'
  if (['tikka', 'boti', 'kabab', 'shashlik', 'wings', 'nuggets', 'strips'].some((word) => name.includes(word))) return 'BBQ'
  if (['roll', 'stick', 'spring'].some((word) => name.includes(word))) return 'Appetizers'
  return dish.category
}
const categoryMatches = (dish, category) => {
  if (category === 'All items') return true
  if (category === 'Popular') return dish.id <= 12
  return getPrimaryCategory(dish) === category
}
const CategoryLabel = ({ category }) => <><span className="category-icon">{categoryIcons[category] || '✦'}</span><span>{category}</span></>

const item = (id, category, name, price, image = '🍽️', description = 'Freshly prepared to order in our Karachi kitchen.') => ({ id, category, name, price, image, description, tag: '' })
const menu = [
  item(1, 'Biryani', 'Beef Biryani (Full Plate)', 440, '🍛'), item(2, 'Biryani', 'Chicken Biryani (Full Plate)', 440, '🍛'), item(3, 'Biryani', 'Mutton Biryani (Full Plate)', 480, '🍛'), item(4, 'Biryani', 'Behari Boti Biryani', 460, '🍛'), item(5, 'Biryani', 'Seekh Kabab Biryani', 400, '🍛'), item(6, 'Biryani', 'Chicken Tikka Biryani', 450, '🍛'), item(7, 'Biryani', 'Chicken Tikka Leg Biryani', 370, '🍛'), item(8, 'Biryani', 'Gola Kabab Biryani', 450, '🍛'), item(9, 'Biryani', 'Reshmi Kabab Biryani', 450, '🍛'), item(10, 'Biryani', 'Malai Tikka Biryani', 490, '🍛'), item(11, 'Biryani', 'Beef Boti Biryani (Half Plate)', 220, '🍛'), item(12, 'Biryani', 'Chicken Boti Biryani (Half Plate)', 220, '🍛'), item(13, 'Biryani', 'Malai Boti Biryani (Half Plate)', 240, '🍛'), item(14, 'Biryani', 'Behari Boti Biryani (Half Plate)', 230, '🍛'), item(15, 'Biryani', 'Seekh Kabab Biryani (Half Plate)', 200, '🍛'),
  item(16, 'Biryani', 'Beef Biryani (375g)', 250, '🥘'), item(17, 'Biryani', 'Chicken Biryani (375g)', 240, '🥘'), item(18, 'Biryani', 'Beef Pulao (Half Plate)', 280, '🥘'), item(19, 'Biryani', 'Beef Pulao (Full Plate)', 340, '🥘'), item(20, 'Biryani', 'Chicken Pulao (Full Plate)', 320, '🥘'), item(21, 'Biryani', 'Beef Pulao (1kg)', 380, '🥘'), item(22, 'Biryani', 'Beef Biryani (1kg)', 680, '🥘'), item(23, 'Biryani', 'Chicken Biryani (1kg)', 640, '🥘'), item(24, 'Biryani', 'Beef Pulao (1kg Family)', 760, '🥘'), item(25, 'Biryani', 'Simple Biryani (1kg)', 360, '🥘'),
  item(26, 'Burgers', 'Beef Boti Burger', 440, '🍔'), item(27, 'Burgers', 'Chicken Boti Burger', 440, '🍔'), item(28, 'Burgers', 'Malai Boti Burger', 480, '🍔'), item(29, 'Burgers', 'Behari Boti Burger', 460, '🍔'), item(30, 'Burgers', 'Seekh Kabab Burger', 400, '🍔'), item(31, 'Burgers', 'Chicken Cheese Burger', 450, '🍔'), item(32, 'Burgers', 'Chicken Tikka Burger', 370, '🍔'), item(33, 'Burgers', 'Gola Kabab Burger', 450, '🍔'), item(34, 'Burgers', 'Reshmi Kabab Burger', 450, '🍔'), item(35, 'Burgers', 'Zinger Burger', 490, '🍔'), item(36, 'Burgers', 'Junior Zinger Burger', 300, '🍔'), item(37, 'Burgers', 'United Albaik Broast', 500, '🍗'), item(38, 'Burgers', 'Supreme Club Sandwich', 420, '🥪'),
  item(39, 'BBQ & Fast Food', 'Chicken Tikka', 450, '🍢'), item(40, 'BBQ & Fast Food', 'Chicken Boti', 400, '🍢'), item(41, 'BBQ & Fast Food', 'Malai Boti', 450, '🍢'), item(42, 'BBQ & Fast Food', 'Behari Boti', 400, '🍢'), item(43, 'BBQ & Fast Food', 'Chicken Seekh Kabab', 390, '🍢'), item(44, 'BBQ & Fast Food', 'Beef Seekh Kabab', 440, '🍢'), item(45, 'BBQ & Fast Food', 'Chicken Gola Kabab', 400, '🍢'), item(46, 'BBQ & Fast Food', 'Chicken Reshmi Kabab', 420, '🍢'), item(47, 'BBQ & Fast Food', 'Chicken Cheese Kabab', 500, '🍢'), item(48, 'BBQ & Fast Food', 'Chicken Nuggets', 520, '🍗'), item(49, 'BBQ & Fast Food', 'Chicken Wings', 470, '🍗'), item(50, 'BBQ & Fast Food', 'Dynamite Chicken', 550, '🍗'), item(51, 'BBQ & Fast Food', 'Chicken Broast', 480, '🍗'), item(52, 'BBQ & Fast Food', 'Chicken Strips', 420, '🍗'),
  item(53, 'Pakistani', 'Chicken Shashlik with Rice', 600, '🍲'), item(54, 'Pakistani', 'Chicken Chowmein', 400, '🍜'), item(55, 'Pakistani', 'Chicken Manchurian with Rice', 600, '🍲'), item(56, 'Pakistani', 'Chicken White Handi', 950, '🍲'), item(57, 'Pakistani', 'Chicken Karahi', 900, '🍲'), item(58, 'Pakistani', 'Mutton Karahi', 1450, '🍲'), item(59, 'Pakistani', 'Beef Qorma', 380, '🥘'), item(60, 'Pakistani', 'Chicken Qorma', 370, '🥘'), item(61, 'Pakistani', 'Chicken White Karahi', 1200, '🍲'), item(62, 'Pakistani', 'Achar Gosht', 400, '🍲'), item(63, 'Pakistani', 'Daal Mash', 180, '🥘'), item(64, 'Pakistani', 'Daal Chana', 170, '🥘'), item(65, 'Pakistani', 'Mix Vegetable', 170, '🥗'),
  item(66, 'Chinese', 'Chicken Fried Rice', 420, '🍚'), item(67, 'Chinese', 'Chicken Manchurian', 600, '🍲'), item(68, 'Chinese', 'Chicken Chowmein', 400, '🍜'), item(69, 'Chinese', 'Chicken Sweet & Sour', 500, '🍲'), item(70, 'Chinese', 'Chicken Shashlik', 400, '🍢'), item(71, 'Chinese', 'Chicken Spring Rolls', 200, '🥟'), item(72, 'Chinese', 'Chicken Corn Soup', 250, '🍲'), item(73, 'Chinese', 'Hot & Sour Soup', 250, '🍲'),
  item(74, 'Pizza', 'Chicken Tikka Pizza - Small', 400, '🍕'), item(75, 'Pizza', 'Chicken Tikka Pizza - Regular', 750, '🍕'), item(76, 'Pizza', 'Chicken Tikka Pizza - Large', 1150, '🍕'), item(77, 'Pizza', 'Chicken Fajita Pizza - Small', 400, '🍕'), item(78, 'Pizza', 'Chicken Fajita Pizza - Regular', 750, '🍕'), item(79, 'Pizza', 'Chicken Fajita Pizza - Large', 1150, '🍕'), item(80, 'Pizza', 'Malai Boti Pizza - Small', 430, '🍕'), item(81, 'Pizza', 'Malai Boti Pizza - Regular', 780, '🍕'), item(82, 'Pizza', 'Malai Boti Pizza - Large', 1250, '🍕'), item(83, 'Pizza', 'Afghani Pizza - Small', 400, '🍕'), item(84, 'Pizza', 'Afghani Pizza - Regular', 750, '🍕'), item(85, 'Pizza', 'Afghani Pizza - Large', 1150, '🍕'), item(86, 'Pizza', 'Cheesy Lover Pizza - Small', 400, '🍕'), item(87, 'Pizza', 'Cheesy Lover Pizza - Regular', 770, '🍕'), item(88, 'Pizza', 'Cheesy Lover Pizza - Large', 1200, '🍕'), item(89, 'Pizza', 'Seekh Kabab Pizza - Small', 450, '🍕'), item(90, 'Pizza', 'Seekh Kabab Pizza - Regular', 800, '🍕'), item(91, 'Pizza', 'Seekh Kabab Pizza - Large', 1250, '🍕'), item(92, 'Pizza', 'Chicken Pepperoni Pizza - Small', 400, '🍕'), item(93, 'Pizza', 'Chicken Pepperoni Pizza - Regular', 750, '🍕'), item(94, 'Pizza', 'Chicken Pepperoni Pizza - Large', 1150, '🍕'), item(95, 'Pizza', 'Beef Pepperoni Pizza - Small', 400, '🍕'), item(96, 'Pizza', 'Beef Pepperoni Pizza - Regular', 750, '🍕'), item(97, 'Pizza', 'Beef Pepperoni Pizza - Large', 1150, '🍕'), item(98, 'Pizza', 'Creamy Pizza - Small', 400, '🍕'), item(99, 'Pizza', 'Creamy Pizza - Regular', 750, '🍕'), item(100, 'Pizza', 'Creamy Pizza - Large', 1200, '🍕'), item(101, 'Pizza', 'Lava Pizza - Regular', 950, '🍕'), item(102, 'Pizza', 'Lava Pizza - Large', 1550, '🍕'), item(103, 'Pizza', 'United Special Pizza - Small', 450, '🍕'), item(104, 'Pizza', 'United Special Pizza - Regular', 850, '🍕'), item(105, 'Pizza', 'United Special Pizza - Large', 1300, '🍕'),
  item(106, 'BBQ & Fast Food', 'Chicken Lasagna F2 Large', 600, '🍝'), item(107, 'BBQ & Fast Food', 'Chicken Lasagna F1 Small', 350, '🍝'), item(108, 'BBQ & Fast Food', 'Beef Lasagna F2 Large', 650, '🍝'), item(109, 'BBQ & Fast Food', 'Creamy Pasta F2 Large', 600, '🍝'), item(110, 'BBQ & Fast Food', 'Creamy Pasta F1 Small', 350, '🍝'), item(111, 'BBQ & Fast Food', 'Malai Pizza Burger', 380, '🍔'), item(112, 'BBQ & Fast Food', 'Spicy Pasta F2 Large', 550, '🍝'), item(113, 'BBQ & Fast Food', 'Spicy Pasta F1 Small', 300, '🍝'), item(114, 'BBQ & Fast Food', 'Cheezy Pasta F2 Large', 600, '🍝'), item(115, 'BBQ & Fast Food', 'Cheezy Pasta F1 Small', 350, '🍝'), item(116, 'BBQ & Fast Food', 'Pizza Roll', 350, '🌯'), item(117, 'BBQ & Fast Food', 'Cheezy Stick', 300, '🧀'), item(118, 'BBQ & Fast Food', 'Tikka Pizza Burger', 350, '🍔'), item(119, 'BBQ & Fast Food', 'Mexican Sandwich', 400, '🥪'), item(120, 'BBQ & Fast Food', 'Arabian Sandwich', 400, '🥪'),
  item(121, 'Drinks', 'Pepsi 345ml', 70, '🥤'), item(122, 'Drinks', 'Pepsi 500ml', 90, '🥤'), item(123, 'Drinks', 'Pepsi 1.5 Liter', 170, '🥤'), item(124, 'Drinks', 'Pepsi 2.25 Liter', 220, '🥤'), item(125, 'Drinks', 'Mineral Water Small', 60, '💧'), item(126, 'Drinks', 'Mineral Water Large', 120, '💧'), item(127, 'Drinks', 'Sting 300ml', 110, '🥤'), item(128, 'Drinks', 'Sting 500ml', 130, '🥤'), item(129, 'Drinks', 'Nan', 25, '🫓'), item(130, 'Drinks', 'Chapati', 20, '🫓'), item(131, 'Drinks', 'Mayonnaise Dip', 50, '🥣'),
]

const money = (value) => `Rs ${value.toLocaleString('en-PK')}`

function App() {
  const [activeCategory, setActiveCategory] = useState('Popular')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('united-cart') || '[]'))
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('united-orders') || '[]'))
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [orderMode, setOrderMode] = useState(() => localStorage.getItem('united-order-mode') || '')
  const [destination, setDestination] = useState(() => localStorage.getItem('united-destination') || '')
  const [toast, setToast] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [locationGateOpen, setLocationGateOpen] = useState(() => {
    const savedMode = localStorage.getItem('united-order-mode') || ''
    const savedDestination = localStorage.getItem('united-destination') || ''
    return !savedMode || (savedMode === 'delivery' && !savedDestination)
  })

  useEffect(() => localStorage.setItem('united-cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('united-orders', JSON.stringify(history)), [history])
  useEffect(() => {
    const updateScrollState = () => setShowBackToTop(window.scrollY > 280)
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  const filteredMenu = useMemo(() => menu.filter((item) => {
    const matchesCategory = categoryMatches(item, activeCategory)
    return matchesCategory && `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase())
  }), [activeCategory, search])

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = orderMode === 'delivery' ? getDeliveryFee(destination) : 0
  const grandTotal = subtotal + deliveryFee

  const addToCart = (item, specialInstructions = '') => {
    setCart((current) => {
      const found = current.find((entry) => entry.id === item.id)
      return found ? current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1, specialInstructions: specialInstructions || entry.specialInstructions } : entry) : [...current, { ...item, quantity: 1, specialInstructions }]
    })
    setSelectedItem(null)
    setToast(`${item.name} added to your order`)
    window.setTimeout(() => setToast(''), 2400)
  }

  const updateQuantity = (id, amount) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0))

  const placeOrder = (details) => {
    const orderDeliveryFee = details.type === 'delivery' ? getDeliveryFee(details.destination || destination) : 0
    const orderTotal = subtotal + orderDeliveryFee
    const order = { id: `UB-${Date.now().toString().slice(-6)}`, date: new Date().toLocaleDateString('en-PK'), items: cart, total: orderTotal, ...details }
    const lines = cart.map((item) => `• ${item.name} x${item.quantity} — ${money(item.price * item.quantity)}${item.specialInstructions ? ` (${item.specialInstructions})` : ''}`).join('\n')
    const message = `*New order for United Biryani*\n\nOrder: ${order.id}\n${lines}\n\nSubtotal: ${money(subtotal)}\nDelivery fee: ${money(orderDeliveryFee)}\n*Grand total: ${money(orderTotal)}*\nOrder type: ${details.type === 'delivery' ? 'Delivery' : 'Pickup'}\nArea: ${details.destination || destination}\n${details.address ? `Address: ${details.address}\n` : ''}Name: ${details.name}\nPhone: ${details.phone}\nPayment: Cash on delivery`
    setHistory((current) => [order, ...current].slice(0, 5))
    setCart([])
    setCheckoutOpen(false)
    setCartOpen(false)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const chooseMode = (mode, persist = true) => {
    setOrderMode(mode)
    if (persist) localStorage.setItem('united-order-mode', mode)
    if (persist && mode === 'pickup') {
      setDestination('')
      localStorage.removeItem('united-destination')
    }
  }
  const chooseDestination = (value) => { setDestination(value); localStorage.setItem('united-destination', value) }

  return <div className="app-shell">
    <header className="site-header">
      <div className="announcement"><span className="live-dot" /> Open today · 11:00 AM — 2:00 AM <span className="announcement-separator">|</span> Karachi delivery only</div>
      <nav className="navbar container">
        <a className="brand" href="#home" aria-label="United Biryani home"><img src={logo} alt="United Biryani" /></a>
        <div className="nav-links"><a href="#menu">Menu</a><a href="#about">Our story</a><a href="#delivery">Delivery</a></div>
        <div className="nav-actions">
          <button className="location-button" onClick={() => setLocationGateOpen(true)}><MapPin size={16} /> <span>{destination || 'Karachi'}</span><ChevronDown size={14} /></button>
          <button className="history-button" onClick={() => setOrdersOpen(true)}><History size={17} /> <span>My orders</span></button>
          <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>Order now</span>{itemCount > 0 && <b>{itemCount}</b>}</button>
        </div>
      </nav>
    </header>

    <main id="home">
      <section className="hero-banner" aria-label="United Biryani">
        <div className="hero-banner-inner"><img src={whiteLogo} alt="United Biryani" /><div><p>Pakistan's signature</p><h1>United Biryani</h1><span>Freshly cooked in Karachi · Order for delivery or pickup</span></div><a className="primary-button" href="#menu">View menu <ArrowRight size={18} /></a></div>
      </section>

      <section className="trust-strip"><div className="container trust-content"><span><Check size={17} /> 100% fresh ingredients</span><span><MapPin size={17} /> Karachi delivery</span><span><Truck size={17} /> Cash on delivery</span><span><Utensils size={17} /> Pickup available</span><span><MessageCircle size={17} /> WhatsApp ordering</span></div></section>

      <section className="menu-section container" id="menu">
        <div className="section-heading"><div><p className="eyebrow">Hungry yet?</p><h2>Pick your favourites</h2></div><div className="search-wrap"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the menu..." /></div></div>
        <CategoryNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <div className="menu-grid">{filteredMenu.map((item) => <article className="menu-card" key={item.id} onClick={() => setSelectedItem(item)}><div className="food-image"><span>{item.image}</span>{item.tag && <small>{item.tag}</small>}</div><div className="food-info"><div><h3>{item.name}</h3><p>{item.description}</p></div><div className="food-footer"><strong>{money(item.price)}</strong><button className="add-button" onClick={(event) => { event.stopPropagation(); setSelectedItem(item) }}><Plus size={18} /> Add</button></div></div></article>)}</div>
        {filteredMenu.length === 0 && <div className="empty-state">No dishes found. Try another search or category.</div>}
      </section>

      <section className="experience-section" id="about"><div className="container experience-inner"><div className="experience-mark"><img src={whiteLogo} alt="United Biryani" /></div><div><p className="eyebrow light">A taste of home</p><h2>From our kitchen<br />to your table.</h2><p>We believe the best meals are shared. United Biryani brings the warmth of Karachi's food streets to your doorstep, one fragrant pot at a time.</p></div><div className="experience-stat"><strong>Since<br /><em>1998</em></strong><span>Serving Karachi<br />with love</span></div></div></section>
      <section className="delivery-section container" id="delivery"><div><p className="eyebrow">Order your way</p><h2>Easy ordering.<br />No fuss.</h2></div><div className="delivery-options"><div><span className="option-icon"><Truck /></span><h3>Delivery</h3><p>Fresh food at your doorstep across Karachi. Charges vary by area.</p></div><div><span className="option-icon"><Utensils /></span><h3>Pickup</h3><p>Place your order on WhatsApp and collect it from our Korangi kitchen.</p></div><div><span className="option-icon"><MessageCircle /></span><h3>WhatsApp checkout</h3><p>Cash on delivery only. Your order is confirmed directly by our team.</p></div></div></section>
    </main>

    <footer className="footer"><div className="container footer-top"><img src={whiteLogo} alt="United Biryani" /><div><strong>United Biryani</strong><p>K 19/14 Main Korangi Industrial Road,<br />Sherabad Colony, Landhi Town, Karachi.</p></div><div><strong>Talk to us</strong><a href={`tel:+${WHATSAPP_NUMBER}`}>0311 2558691</a><a href={`https://wa.me/${WHATSAPP_NUMBER}`}>WhatsApp us <ArrowUpRight size={14} /></a></div><div><strong>Hours</strong><p>Open daily<br />11:00 AM — 2:00 AM</p></div></div><div className="container footer-bottom"><span>© 2026 United Biryani. Made for Karachi.</span><span>Cash on delivery · Karachi only</span><span className="footer-credit">Powered by <a href="https://thedigitalcreativity.com" target="_blank" rel="noreferrer">The Digital Creativity</a></span></div></footer>

    {(locationGateOpen || !orderMode || (orderMode === 'delivery' && !destination)) && <LocationGate mode={orderMode} destination={destination} chooseMode={chooseMode} chooseDestination={chooseDestination} close={() => setLocationGateOpen(false)} dismissible={Boolean(orderMode && (orderMode === 'pickup' || destination))} />}
    {selectedItem && <ProductModal item={selectedItem} close={() => setSelectedItem(null)} add={addToCart} />}
    {cartOpen && <CartDrawer cart={cart} subtotal={subtotal} deliveryFee={deliveryFee} grandTotal={grandTotal} updateQuantity={updateQuantity} close={() => setCartOpen(false)} checkout={() => setCheckoutOpen(true)} mode={orderMode} destination={destination} openLocationGate={() => setLocationGateOpen(true)} chooseDestination={chooseDestination} />}
    {checkoutOpen && <CheckoutModal total={grandTotal} deliveryFee={deliveryFee} close={() => setCheckoutOpen(false)} submit={placeOrder} mode={orderMode} destination={destination} />}
    {ordersOpen && <OrderHistory orders={history} close={() => setOrdersOpen(false)} />}
    {toast && <div className="toast"><Check size={17} /> {toast}</div>}
    <button className="floating-search" onClick={() => document.querySelector('.search-wrap input')?.focus()} aria-label="Focus menu search"><Search size={22} /></button>
    <a className={`floating-whatsapp${showBackToTop ? ' with-back-to-top' : ''}`} href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3.2a12.7 12.7 0 0 0-10.9 19L3.3 28.8l6.8-1.7A12.8 12.8 0 1 0 16 3.2Zm0 23.3c-2 0-3.9-.6-5.5-1.6l-.4-.2-4 .9 1-3.9-.3-.4A10.5 10.5 0 1 1 16 26.5Zm5.8-7.8c-.3-.2-1.7-.9-2-.9-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.4.3-.7.1a8.5 8.5 0 0 1-2.4-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.1 3.1c.1.2 2 3.1 4.8 4.3 2.8 1.2 2.8.8 3.3.8.5 0 1.7-.7 1.9-1.4.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.5Z" /></svg></a>
    {showBackToTop && <button className="floating-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ChevronUp size={24} /></button>}
  </div>
}

function LocationSearchSelect({ value, onChange, label = 'Search Karachi areas' }) {
  const [query, setQuery] = useState('')
  const filteredZones = deliveryZones.filter(([name]) => name.toLowerCase().includes(query.toLowerCase()))
  return <div className="location-select"><div className="location-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={label} aria-label={label} /></div><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Select Karachi area</option>{filteredZones.map(([name]) => <option value={name} key={name}>{name}</option>)}</select>{query && filteredZones.length === 0 && <small className="location-search-empty">No matching area found</small>}</div>
}

function LocationGate({ mode, destination, chooseMode, chooseDestination, close, dismissible }) {
  const [area, setArea] = useState(destination)
  const ready = Boolean(mode && (mode === 'pickup' || area))
  const selectArea = (value) => setArea(value)
  return <div className="overlay gate-overlay" onMouseDown={() => dismissible && close()}><div className="location-gate" onMouseDown={(event) => event.stopPropagation()}><img src={logo} alt="United Biryani" /><p className="eyebrow">Welcome to United Biryani</p><h2>How would you like<br /><em>your order?</em></h2><div className="gate-options"><button type="button" className={mode === 'delivery' ? 'selected' : ''} onClick={() => chooseMode('delivery', false)}><Truck size={21} /><strong>Delivery</strong><small>To your doorstep</small></button><button type="button" className={mode === 'pickup' ? 'selected' : ''} onClick={() => chooseMode('pickup', false)}><Utensils size={21} /><strong>Pickup</strong><small>Collect from our kitchen</small></button></div>{mode === 'delivery' && <label>Where should we deliver?<LocationSearchSelect value={area} onChange={selectArea} /></label>}<button type="button" className="primary-button full" disabled={!ready} onClick={() => { if (!ready) return; chooseMode(mode, true); if (mode === 'delivery') chooseDestination(area); close() }}>Start ordering <ArrowRight size={17} /></button><small className="gate-note">Serving Karachi only · Cash on delivery</small></div></div>
}

function CategoryNav({ activeCategory, setActiveCategory }) {
  const navRef = useRef(null)
  const scroll = (amount) => navRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  return <div className="category-shell"><button className="category-arrow left" aria-label="Previous categories" onClick={() => scroll(-260)}><ChevronLeft /></button><div className="category-bar" ref={navRef}><div className="category-brand"><img src={whiteLogo} alt="United Biryani" /><span>Menu</span></div>{categories.map((category) => <button className={activeCategory === category ? 'active' : ''} key={category} onClick={() => setActiveCategory(category)}><CategoryLabel category={category} /></button>)}</div><button className="category-arrow right" aria-label="Next categories" onClick={() => scroll(260)}><ChevronRight /></button></div>
}

function ProductModal({ item, close, add }) {
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')
  return <div className="overlay modal-overlay" onMouseDown={close}><div className="product-modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close icon-button" onClick={close}><X /></button><div className="product-image">{item.image}</div><div className="product-copy"><p className="eyebrow">{item.category}</p><h2>{item.name}</h2><strong className="product-price">{money(item.price)}</strong><p>{item.description}</p><label>Special instructions<textarea rows="3" value={specialInstructions} onChange={(event) => setSpecialInstructions(event.target.value)} placeholder="Less spicy, extra raita, no onions..." /></label><div className="product-actions"><div className="quantity large"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button></div><button className="primary-button" onClick={() => { for (let index = 0; index < quantity; index += 1) add(item, specialInstructions) }}>Add to order · {money(item.price * quantity)} <Plus size={17} /></button></div></div></div></div>
}

function CartDrawer({ cart, subtotal, deliveryFee, grandTotal, updateQuantity, close, checkout, mode, destination, openLocationGate, chooseDestination }) {
  return <div className="overlay" onMouseDown={close}><aside className="drawer" onMouseDown={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">Your order</p><h2>Your cart</h2></div><button className="icon-button" onClick={close}><X /></button></div>{cart.length ? <><div className="drawer-items">{cart.map((item) => <div className="drawer-item" key={item.id}><span className="mini-food">{item.image}</span><div className="drawer-item-copy"><strong>{item.name}</strong><span>{money(item.price)}{item.specialInstructions && ` · ${item.specialInstructions}`}</span></div><div className="quantity"><button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button></div></div>)}<button className="add-more" onClick={close}><Plus size={17} /> Add more items</button></div><div className="drawer-footer"><button className="selected-mode" onClick={openLocationGate}><span>{mode === 'delivery' ? <Truck size={17} /> : <Utensils size={17} />} {mode === 'delivery' ? 'Delivery' : 'Pickup'}</span><span>Change <ChevronRight size={16} /></span></button>{mode === 'delivery' && <label className="compact-label">Destination / location<LocationSearchSelect value={destination} onChange={chooseDestination} label="Search delivery area" /></label>}<div className="summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-row"><span>Delivery fee</span><strong>{mode === 'delivery' ? money(deliveryFee) : 'Free'}</strong></div><div className="total-row"><span>Grand total</span><strong>{money(grandTotal)}</strong></div><p className="cash-note"><Check size={15} /> Cash on delivery · Fee based on selected area</p><button className="primary-button full" onClick={checkout}>Checkout {money(grandTotal)} <ArrowRight size={17} /></button></div></> : <div className="empty-cart"><ShoppingBag size={38} /><h3>Your bag is empty</h3><p>Pick a favourite and we'll take it from there.</p><button className="primary-button" onClick={close}>Browse menu</button></div>}</aside></div>
}

function CheckoutModal({ total, deliveryFee, close, submit, mode, destination }) {
  const [type, setType] = useState(mode || 'delivery')
  const [details, setDetails] = useState({ name: '', phone: '', address: '', destination })
  const canSubmit = details.name.trim() && details.phone.trim() && (type === 'pickup' || (details.destination.trim() && details.address.trim()))
  const currentDeliveryFee = type === 'delivery' ? getDeliveryFee(details.destination) : 0
  const subtotalValue = total - deliveryFee
  const currentTotal = subtotalValue + currentDeliveryFee
  return <div className="overlay" onMouseDown={close}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">Almost there</p><h2>Order details</h2></div><button className="icon-button" onClick={close}><X /></button></div><div className="order-type"><button className={type === 'delivery' ? 'selected' : ''} onClick={() => setType('delivery')}><Truck size={18} /><span><strong>Delivery</strong><small>To your doorstep</small></span></button><button className={type === 'pickup' ? 'selected' : ''} onClick={() => setType('pickup')}><Utensils size={18} /><span><strong>Pickup</strong><small>From our kitchen</small></span></button></div><label>Your name<input value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} placeholder="e.g. Ayesha Khan" /></label><label>Phone number<input value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} placeholder="03XX XXXXXXX" type="tel" /></label>{type === 'delivery' && <><label>Area / destination<LocationSearchSelect value={details.destination} onChange={(value) => setDetails({ ...details, destination: value })} label="Search delivery area" /></label><label>Delivery address<textarea value={details.address} onChange={(event) => setDetails({ ...details, address: event.target.value })} placeholder="House, street, area, Karachi" rows="3" /> </label></>}<div className="checkout-summary"><span>Subtotal</span><b>{money(subtotalValue)}</b><span>Delivery fee</span><b>{type === 'delivery' ? money(currentDeliveryFee) : 'Free'}</b><strong>Grand total</strong><strong>{money(currentTotal)}</strong></div><div className="payment-row"><span><span className="cash-icon">₨</span><span><strong>Cash on delivery</strong><small>Pay when your order arrives</small></span></span><Check size={18} /></div><button className="primary-button full" disabled={!canSubmit} onClick={() => submit({ ...details, type })}>Send order on WhatsApp <ArrowRight size={17} /></button><p className="form-footnote">Your order will open in WhatsApp for confirmation by our team.</p></div></div>
}

function OrderHistory({ orders, close }) {
  return <div className="overlay" onMouseDown={close}><div className="modal history-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">Saved on this device</p><h2>My orders</h2></div><button className="icon-button" onClick={close}><X /></button></div>{orders.length ? <div className="history-list">{orders.map((order) => <div className="history-item" key={order.id}><div><strong>{order.id}</strong><small>{order.date} · {order.type === 'delivery' ? 'Delivery' : 'Pickup'}</small></div><b>{money(order.total)}</b></div>)}</div> : <div className="empty-cart"><History size={35} /><h3>No orders yet</h3><p>Your recent orders will appear here on this device.</p></div>}</div></div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
