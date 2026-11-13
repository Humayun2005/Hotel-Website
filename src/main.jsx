import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { z } from 'zod'
import {
  ArrowRight, Banknote, Check, ChefHat, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock3, Flame, History, Home, Leaf,
  MapPin, Menu, MessageCircle, Minus, Phone, Play, Plus, Search, ShieldCheck, ShoppingCart, Trash2, Truck, Utensils, X,
} from 'lucide-react'
import './style.css'
import logo from './assets/Red-Png.png'
import whiteLogo from './assets/White-Png.png'
import biryaniPhoto from './assets/hero/biryani.jpg'
import bbqPhoto from './assets/hero/bbq.jpg'
import karahiPhoto from './assets/hero/karahi.jpg'
import burgerPhoto from './assets/hero/burger.jpg'
import pizzaPhoto from './assets/hero/pizza.jpg'
import biryaniBowlPhoto from './assets/hero/biryani-bowl.jpg'
import { categories as categoryList, menu, startingPrice } from './menuData.js'
import { menuImages } from './menuImages.js'
import { MAX_KM, RESTAURANT, buildLocation, currentPosition, mapsLink, searchAddress } from './location.js'
import { LoaderCircle, LocateFixed, Mail } from 'lucide-react'

const SUPPORT_EMAIL = 'unitedfastfood51@gmail.com'

const WHATSAPP_NUMBER = '923112558691'
const checkoutSchema = z.object({
  type: z.enum(['delivery', 'pickup']),
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer').regex(/^[A-Za-z ]+$/, 'Name can contain only letters and spaces'),
  phone: z.string().trim().min(1, 'Phone number is required').max(20, 'Phone number must be 20 characters or fewer').regex(/^[0-9+() ]+$/, 'Phone can contain only numbers, +, brackets, and spaces'),
  email: z.string().trim().max(100, 'Email must be 100 characters or fewer').email('Enter a valid email address').or(z.literal('')),
  address: z.string().max(1000, 'Address must be 1000 characters or fewer'),
  instructions: z.string().max(1000, 'Instructions must be 1000 characters or fewer'),
}).superRefine((details, context) => {
  if (details.type === 'delivery') {
    if (!details.address.trim()) context.addIssue({ code: z.ZodIssueCode.custom, path: ['address'], message: 'House / flat, street and landmark are required' })
  }
})
const categories = categoryList.map((category) => category.name)
const categoryIcons = Object.fromEntries(categoryList.map((category) => [category.name, category.icon]))
const sectionMeta = Object.fromEntries(categoryList.map((category) => [category.name, [category.eyebrow, category.title]]))
const sectionId = (category) => `cat-${category.toLowerCase().replace(/[^a-z]+/g, '-')}`

const heroSlides = [
  { image: biryaniPhoto, title: 'Dum Biryani', label: 'Biryani' },
  { image: bbqPhoto, title: 'Smoky BBQ', label: 'BBQ' },
  { image: karahiPhoto, title: 'Desi Karahi', label: 'Pakistani Curries' },
  { image: burgerPhoto, title: 'Loaded Burgers', label: 'Burgers' },
  { image: pizzaPhoto, title: 'Cheesy Pizza', label: 'Pizza' },
  { image: biryaniBowlPhoto, title: 'Chicken Pulao', label: 'Pulao' },
]
const searchHints = ['chicken biryani', 'bbq platter', 'zinger burger', 'malai boti', 'chicken karahi', 'lava pizza', 'nihari']

const money = (value) => `Rs.${value.toLocaleString('en-PK')}`
const readSavedLocation = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('united-location') || 'null')
    return saved && typeof saved.lat === 'number' && typeof saved.fee === 'number' ? saved : null
  } catch { return null }
}

function App() {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('united-cart-v2') || '[]') } catch { return [] }
  })
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('united-orders') || '[]'))
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [orderMode, setOrderMode] = useState(() => localStorage.getItem('united-order-mode') || '')
  const [location, setLocation] = useState(readSavedLocation)
  const [toast, setToast] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [locationGateOpen, setLocationGateOpen] = useState(() => {
    const savedMode = localStorage.getItem('united-order-mode') || ''
    return !savedMode || (savedMode === 'delivery' && !readSavedLocation())
  })

  useEffect(() => { localStorage.setItem('united-cart-v2', JSON.stringify(cart)); localStorage.removeItem('united-cart') }, [cart])
  useEffect(() => localStorage.setItem('united-orders', JSON.stringify(history)), [history])

  const sections = useMemo(() => categories.map((category) => ({
    category,
    items: menu.filter((dish) => dish.cat === category && `${dish.name} ${dish.desc} ${category}`.toLowerCase().includes(search.trim().toLowerCase())),
  })).filter((section) => section.items.length), [search])

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 280)
      const offset = 150
      let current = sections[0]?.category
      for (const { category } of sections) {
        const element = document.getElementById(sectionId(category))
        if (element && element.getBoundingClientRect().top - offset <= 0) current = category
      }
      if (current) setActiveCategory(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sections])

  const itemCount = cart.reduce((sum, entry) => sum + entry.quantity, 0)
  const subtotal = cart.reduce((sum, entry) => sum + entry.price * entry.quantity, 0)
  const deliveryFee = orderMode === 'delivery' && location ? location.fee : 0
  const grandTotal = subtotal + deliveryFee
  const quantityOf = (id) => cart.filter((entry) => entry.id === id).reduce((sum, entry) => sum + entry.quantity, 0)

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }

  // One cart line per dish + size/portion; the variant label is shown and sent with the order.
  const addToCart = (dish, variant = dish.variants[0], quantity = 1, specialInstructions = '') => {
    const key = `${dish.id}:${variant.label}`
    const label = dish.variants.length > 1 ? `${dish.name} (${variant.label})` : dish.name
    setCart((current) => {
      const found = current.find((entry) => entry.key === key)
      return found
        ? current.map((entry) => entry.key === key ? { ...entry, quantity: entry.quantity + quantity, specialInstructions: specialInstructions || entry.specialInstructions } : entry)
        : [...current, { key, id: dish.id, name: label, price: variant.price, img: dish.img, quantity, specialInstructions }]
    })
    setSelectedItem(null)
    notify(`${label} added to cart`)
  }

  const updateQuantity = (key, amount) => setCart((current) => current.map((entry) => entry.key === key ? { ...entry, quantity: entry.quantity + amount } : entry).filter((entry) => entry.quantity > 0))
  const singleKey = (dish) => `${dish.id}:${dish.variants[0].label}`

  const placeOrder = (details) => {
    // Basic spam guard: one order every 30 seconds from this browser.
    const last = Number(sessionStorage.getItem('united-last-order') || 0)
    if (Date.now() - last < 30000) { notify('Please wait a few seconds before placing another order'); return }
    sessionStorage.setItem('united-last-order', String(Date.now()))
    const orderDeliveryFee = details.type === 'delivery' && location ? location.fee : 0
    const orderTotal = subtotal + orderDeliveryFee
    const order = { id: `UB-${Date.now().toString().slice(-6)}`, date: new Date().toLocaleDateString('en-PK'), items: cart, total: orderTotal, ...details }
    const lines = cart.map((entry) => `• ${entry.name}\n  Quantity: ${entry.quantity}\n  Price: ${money(entry.price * entry.quantity)}${entry.specialInstructions ? `\n  Special instructions: ${entry.specialInstructions}` : ''}`).join('\n\n')
    const message = `*NEW ORDER — UNITED BIRYANI*

*Order ID:* ${order.id}

*ITEMS*
${lines}

*ORDER SUMMARY*
Subtotal: ${money(subtotal)}
Delivery fee: ${money(orderDeliveryFee)}
*Grand total: ${money(orderTotal)}*

*ORDER DETAILS*
Order type: ${details.type === 'delivery' ? 'Delivery' : 'Pickup'}
${details.type === 'delivery' && location ? `House / street: ${details.address}\nLocation: ${location.address}\nDistance: ${location.km} km\nMap: ${mapsLink(location)}\n` : `Pickup from: ${RESTAURANT.address}\n`}
*CUSTOMER DETAILS*
Name: ${details.name}
Phone: ${details.phone}
${details.email ? `Email: ${details.email}\n` : ''}${details.instructions ? `Other instructions: ${details.instructions}\n` : ''}
Payment: Cash on delivery`
    setHistory((current) => [order, ...current].slice(0, 5))
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const chooseMode = (mode, persist = true) => {
    setOrderMode(mode)
    if (persist) localStorage.setItem('united-order-mode', mode)
  }
  const chooseLocation = (value) => {
    setLocation(value)
    try { localStorage.setItem('united-location', JSON.stringify(value)); localStorage.removeItem('united-destination') } catch { /* storage unavailable */ }
  }
  const jumpTo = (category) => {
    const element = document.getElementById(sectionId(category))
    if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
  }
  const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const focusSearch = () => {
    const input = document.getElementById('search')
    if (!input) return
    window.scrollTo({ top: input.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' })
    window.setTimeout(() => input.focus({ preventScroll: true }), 450)
  }
  const locationLabel = orderMode === 'pickup' ? 'Korangi Kitchen' : location?.address || 'Select location'
  const cartBarVisible = itemCount > 0 && !cartOpen

  return <div className="frame">
    <header className="topbar">
      <div className="topbar-side">
        <button className="outline-pill location" onClick={() => setLocationGateOpen(true)} aria-label="Change location">
          <MapPin size={18} />
          <span className="outline-pill-text"><small>{orderMode === 'pickup' ? 'Pickup from' : 'Change Location'}</small><b>{locationLabel}</b></span>
          <ChevronRight size={16} className="outline-pill-chevron" />
        </button>
        <a className="outline-pill phone" href={`tel:+${WHATSAPP_NUMBER}`}><Phone size={17} /><b>0311-2558691</b></a>
      </div>
      <a className="topbar-logo" href="#top" aria-label="United Biryani home"><img src={whiteLogo} alt="United Biryani" /></a>
      <div className="topbar-side right">
        <button className="outline-circle" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingCart size={21} />{itemCount > 0 && <span className="circle-badge">{itemCount}</span>}</button>
        <button className="outline-circle" onClick={() => setSideMenuOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
      </div>
    </header>

    <div className="frame-inner">
      <main>
        <HeroSlider onOrder={() => scrollToId('menu')} onExplore={() => setSideMenuOpen(true)} />
        <div id="menu" className="menu-anchor" />
        <CategoryTabs sections={sections} activeCategory={activeCategory} jumpTo={jumpTo} />
        <SearchBar search={search} setSearch={setSearch} />

        <div className="menu-container">
          {sections.map(({ category, items }, index) => <section className="menu-section" id={sectionId(category)} key={category}>
            <SectionHeading category={category} index={index} next={sections[index + 1]?.category} jumpTo={jumpTo} count={items.length} />
            <div className="menu-grid">
              {items.map((dish) => <MenuCard key={dish.id} dish={dish} quantity={quantityOf(dish.id)} open={() => setSelectedItem(dish)} increase={() => addToCart(dish)} decrease={() => updateQuantity(singleKey(dish), -1)} />)}
            </div>
          </section>)}
          {sections.length === 0 && <div className="empty-state"><Search size={34} /><p>No dishes found for “{search}”.</p><button className="btn-primary" onClick={() => setSearch('')}>Clear search</button></div>}
        </div>

        <Features />
        <section className="cta-section">
          <Reveal className="cta-card">
            <div className="cta-glow" />
            <h2><span>Hungry yet?</span><span className="dark">Let's fix that.</span></h2>
            <button className="cta-button" onClick={() => scrollToId('menu')}>Start your order <ArrowRight size={20} /></button>
          </Reveal>
        </section>
        <section className="about-section" id="about">
          <Reveal className="about-card">
            <h2>About <span>United</span></h2>
            <p>United Biryani brings the warmth of Karachi's food streets to your doorstep. Fragrant biryani, smoky BBQ, desi karahi and fresh fast food, cooked to order in our Korangi kitchen and delivered hot across Karachi.</p>
            <div className="about-stats">
              <div><b><CountUp value={menu.length} suffix="+" /></b><span>Menu items</span></div>
              <div><b><CountUp value={categories.length} /></b><span>Menu categories</span></div>
              <div><b><CountUp value={100} suffix="%" /></b><span>Fresh ingredients</span></div>
            </div>
          </Reveal>
        </section>
      </main>
    </div>

    <footer className="footer" id="contact">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={whiteLogo} alt="United Biryani" />
          <p>Karachi's signature biryani, BBQ and fast food. Freshly cooked and delivered hot, straight to your doorstep.</p>
          <div className="footer-socials">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsAppIcon size={21} /></a>
            <a href={`tel:+${WHATSAPP_NUMBER}`} aria-label="Call us"><Phone size={18} /></a>
            <a href={`mailto:${SUPPORT_EMAIL}`} aria-label="Email us"><Mail size={18} /></a>
            <a href="https://maps.google.com/?q=Main+Korangi+Industrial+Road+Landhi+Karachi" target="_blank" rel="noreferrer" aria-label="Find us on the map"><MapPin size={19} /></a>
          </div>
        </div>
        <div>
          <h6>Explore</h6>
          <nav className="footer-links">
            <button onClick={() => scrollToId('menu')}>View menu</button>
            <button onClick={() => setOrdersOpen(true)}>My orders</button>
            <button onClick={() => setLocationGateOpen(true)}>Delivery areas</button>
            <button onClick={() => scrollToId('about')}>About us</button>
          </nav>
        </div>
        <div>
          <h6>Contact</h6>
          <div className="footer-contact">
            <span className="contact-icon"><MapPin size={18} /></span><p>K 19/14 Main Korangi Industrial Road, Sherabad Colony, Landhi Town, Karachi.</p>
            <span className="contact-icon"><Phone size={18} /></span><a className="strong" href={`tel:+${WHATSAPP_NUMBER}`}>0311-2558691</a>
            <span className="contact-icon"><Mail size={18} /></span><a className="email" href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Query - United Biryani')}`}>{SUPPORT_EMAIL}</a>
            <span className="contact-icon"><Clock3 size={18} /></span><p>Open daily · 11:00 AM — 2:00 AM</p>
          </div>
        </div>
        <div>
          <h6>Order Online</h6>
          <p className="footer-note">Cash on delivery across Karachi, or pick up from our Korangi kitchen.</p>
          <button className="footer-order" onClick={() => scrollToId('menu')}><span>View full menu</span><b>Order</b></button>
        </div>
      </div>
      <div className="footer-bottom">
        <span><i className="live-dot" />© 2026 United Biryani. All rights reserved</span>
        <span>Powered by <a href="https://thedigitalcreativity.com" target="_blank" rel="noreferrer">The Digital Creativity</a></span>
      </div>
    </footer>

    {cartBarVisible && <button className="view-cart-bar" onClick={() => setCartOpen(true)}><span className="view-cart-count">{itemCount}</span><b>View Cart</b><b>{money(subtotal)}</b></button>}
    {sideMenuOpen && <SideMenu close={() => setSideMenuOpen(false)} sections={sections} jumpTo={jumpTo} openOrders={() => setOrdersOpen(true)} openLocation={() => setLocationGateOpen(true)} openCart={() => setCartOpen(true)} scrollToId={scrollToId} itemCount={itemCount} />}

    {(locationGateOpen || !orderMode || (orderMode === 'delivery' && !location)) && <LocationGate mode={orderMode} location={location} chooseMode={chooseMode} chooseLocation={chooseLocation} close={() => setLocationGateOpen(false)} dismissible={Boolean(orderMode && (orderMode === 'pickup' || location))} />}
    {selectedItem && <ProductModal item={selectedItem} close={() => setSelectedItem(null)} add={addToCart} />}
    {cartOpen && <CartDrawer cart={cart} subtotal={subtotal} deliveryFee={deliveryFee} grandTotal={grandTotal} updateQuantity={updateQuantity} clearCart={() => setCart([])} close={() => setCartOpen(false)} checkout={() => { setCartOpen(false); setCheckoutOpen(true) }} mode={orderMode} location={location} changeLocation={() => setLocationGateOpen(true)} />}
    {checkoutOpen && <CheckoutModal subtotal={subtotal} close={() => setCheckoutOpen(false)} submit={placeOrder} mode={orderMode} location={location} chooseMode={chooseMode} changeLocation={() => setLocationGateOpen(true)} />}
    {ordersOpen && <OrderHistory orders={history} close={() => setOrdersOpen(false)} />}
    {toast && <div className="toast"><Check size={17} /> {toast}</div>}
    <button className={`floating-search${cartBarVisible ? ' over-bar' : ''}`} onClick={focusSearch} aria-label="Search the menu"><Search size={22} /></button>
    <a className={`floating-whatsapp${showBackToTop ? ' with-top' : ''}${cartBarVisible ? ' over-bar' : ''}`} href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><WhatsAppIcon /></a>
    {showBackToTop && <button className={`floating-top${cartBarVisible ? ' over-bar' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ChevronUp size={24} /></button>}
  </div>
}

const HERO_INTERVAL = 5500

function WhatsAppIcon({ size }) {
  return <svg className="whatsapp-icon" viewBox="0 0 32 32" width={size} height={size} aria-hidden="true"><path fill="currentColor" d="M16 3.2a12.7 12.7 0 0 0-10.9 19L3.3 28.8l6.8-1.7A12.8 12.8 0 1 0 16 3.2Zm0 23.3c-2 0-3.9-.6-5.5-1.6l-.4-.2-4 .9 1-3.9-.3-.4A10.5 10.5 0 1 1 16 26.5Zm5.8-7.8c-.3-.2-1.7-.9-2-.9-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.4.3-.7.1a8.5 8.5 0 0 1-2.4-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.1 3.1c.1.2 2 3.1 4.8 4.3 2.8 1.2 2.8.8 3.3.8.5 0 1.7-.7 1.9-1.4.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.5Z" /></svg>
}

function HeroSlider({ onOrder, onExplore }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % heroSlides.length), HERO_INTERVAL)
    return () => window.clearTimeout(timer)
  }, [index])
  const slide = heroSlides[index]
  return <section className="hero" id="top" aria-roledescription="carousel">
    <div className="hero-bg" aria-hidden="true">
      {heroSlides.map((item, itemIndex) => <img key={item.image} src={item.image} alt="" className={itemIndex === index ? 'active' : ''} loading={itemIndex === 0 ? 'eager' : 'lazy'} />)}
    </div>
    <div className="hero-shade" />
    <div className="hero-content">
      <div className="hero-eyebrow"><span />Karachi's signature taste</div>
      <h1>
        <span className="hero-line"><span>Freshly Cooked</span></span>
        <span className="hero-line"><span className="fancy-text light" key={slide.title}>{slide.title}</span></span>
      </h1>
      <p>Cooked to order in our Korangi kitchen and delivered hot across Karachi. Cash on delivery or quick pickup.</p>
      <div className="hero-ctas">
        <button className="hero-btn primary" onClick={onOrder}><span className="shine" />Order Now <ArrowRight size={20} /></button>
        <button className="hero-btn glass" onClick={onExplore}>Explore Menu <Play size={17} fill="currentColor" /></button>
      </div>
    </div>
    <div className="hero-progress">
      {heroSlides.map((item, itemIndex) => <button key={item.image} onClick={() => setIndex(itemIndex)} className={itemIndex === index ? 'active' : itemIndex < index ? 'done' : ''} aria-label={`Slide ${itemIndex + 1}`}><i style={{ animationDuration: `${HERO_INTERVAL}ms` }} /></button>)}
    </div>
    <div className="hero-scroll" aria-hidden="true"><span>Scroll</span><i /></div>
  </section>
}

function Reveal({ as: Tag = 'div', className = '', children, ...props }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <Tag ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} {...props}>{children}</Tag>
}

function CountUp({ value, suffix = '' }) {
  const ref = useRef(null)
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / 1400)
        setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3))))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    observer.observe(element)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [value])
  return <span ref={ref}>{current}{suffix}</span>
}

function SectionHeading({ category, index, next, jumpTo, count }) {
  const [eyebrow, title] = sectionMeta[category] || ["Karachi's signature", category]
  const flipped = index % 2 === 1
  return <Reveal className={`section-head${flipped ? ' flipped' : ''}`}>
    <div className="section-title">
      <div className="section-eyebrow"><span className="eyebrow-line" />{eyebrow}</div>
      <h3 className="fancy-text">{title}</h3>
    </div>
    {next
      ? <button className="section-next" onClick={() => jumpTo(next)}><span>Next: {next}</span><ChevronRight size={18} /></button>
      : <span className="section-next static">{count} items</span>}
  </Reveal>
}

function Features() {
  return <section className="features">
    <Reveal className="feature-main">
      <ShieldCheck className="feature-watermark" aria-hidden="true" />
      <span className="feature-icon"><ShieldCheck size={26} /></span>
      <h3>Fresh Every Day<br /><em>Cooked to Order</em></h3>
      <p>Every biryani, karahi and burger is prepared fresh in our Korangi kitchen after you order. No reheated trays, just bold Karachi flavour.</p>
      <div className="feature-chips"><span><ChefHat size={15} /> Cooked to order</span><span><Leaf size={15} /> Fresh ingredients</span><span><Flame size={15} /> Live BBQ</span></div>
    </Reveal>
    <div className="feature-stack">
      <Reveal className="feature-tile red">
        <span className="feature-icon light"><Banknote size={26} /></span>
        <h4>Cash on Delivery</h4>
        <p>Pay when your food arrives. No cards, no hassle.</p>
      </Reveal>
      <Reveal className="feature-tile">
        <span className="feature-icon"><WhatsAppIcon size={28} /></span>
        <h4>WhatsApp Ordering</h4>
        <p>Your order is confirmed directly by our team on WhatsApp.</p>
      </Reveal>
    </div>
  </section>
}

function SideMenu({ close, sections, jumpTo, openOrders, openLocation, openCart, scrollToId, itemCount }) {
  const run = (action) => { close(); window.setTimeout(action, 60) }
  return <div className="overlay" onMouseDown={close}>
    <aside className="side-menu" onMouseDown={(event) => event.stopPropagation()}>
      <div className="side-menu-head"><img src={whiteLogo} alt="United Biryani" /><button className="round-btn light" onClick={close} aria-label="Close menu"><X size={18} /></button></div>
      <nav className="side-menu-links">
        <button onClick={() => run(() => window.scrollTo({ top: 0, behavior: 'smooth' }))}><Home size={19} /> Home</button>
        <button onClick={() => run(openCart)}><ShoppingCart size={19} /> Cart {itemCount > 0 && <small>{itemCount}</small>}</button>
        <button onClick={() => run(openOrders)}><History size={19} /> My orders</button>
        <button onClick={() => run(openLocation)}><MapPin size={19} /> Change location</button>
        <button onClick={() => run(() => scrollToId('about'))}><Utensils size={19} /> About us</button>
        <a href={`tel:+${WHATSAPP_NUMBER}`}><Phone size={19} /> 0311-2558691</a>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"><WhatsAppIcon size={19} /> WhatsApp us</a>
        <a href={`mailto:${SUPPORT_EMAIL}`}><Mail size={19} /> Email support</a>
      </nav>
      <p className="side-menu-label">Menu categories</p>
      <div className="side-menu-cats">{sections.map(({ category, items }) => <button key={category} onClick={() => run(() => jumpTo(category))}><span>{categoryIcons[category]}</span>{category}<small>{items.length}</small></button>)}</div>
    </aside>
  </div>
}

function CategoryTabs({ sections, activeCategory, jumpTo }) {
  const trackRef = useRef(null)
  const [listOpen, setListOpen] = useState(false)
  const [canScroll, setCanScroll] = useState({ left: false, right: false })
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => {
      const left = track.scrollLeft > 4
      const right = track.scrollLeft + track.clientWidth < track.scrollWidth - 4
      setCanScroll((current) => current.left === left && current.right === right ? current : { left, right })
    }
    update()
    track.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(track)
    return () => { track.removeEventListener('scroll', update); observer.disconnect() }
  }, [sections])
  useEffect(() => {
    const active = trackRef.current?.querySelector('.tab-active')
    if (active && trackRef.current) trackRef.current.scrollTo({ left: active.offsetLeft - trackRef.current.clientWidth / 2 + active.clientWidth / 2, behavior: 'smooth' })
  }, [activeCategory])
  const scroll = (amount) => trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  return <div className="tabs-wrapper">
    <div className="tab-slider">
      <button className="tab-arrow tab-menu" onClick={() => setListOpen((open) => !open)} aria-label="All categories"><Menu size={22} /></button>
      <div className="tab-scroll">
        <button className={`tab-arrow tab-left${canScroll.left ? '' : ' is-hidden'}`} onClick={() => scroll(-300)} aria-label="Scroll left" tabIndex={canScroll.left ? 0 : -1}><ChevronLeft size={22} /></button>
        <div className="tab-container" ref={trackRef}>
          {sections.map(({ category }) => <button key={category} className={`tab-item${activeCategory === category ? ' tab-active' : ''}`} onClick={() => jumpTo(category)}>{category}</button>)}
        </div>
        <button className={`tab-arrow tab-right${canScroll.right ? '' : ' is-hidden'}`} onClick={() => scroll(300)} aria-label="Scroll right" tabIndex={canScroll.right ? 0 : -1}><ChevronRight size={22} /></button>
      </div>
    </div>
    {listOpen && <div className="category-list">{sections.map(({ category, items }) => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => { setListOpen(false); jumpTo(category) }}><span>{categoryIcons[category]} {category}</span><small>{items.length}</small></button>)}</div>}
  </div>
}

function SearchBar({ search, setSearch }) {
  const [hint, setHint] = useState('')
  useEffect(() => {
    let word = 0
    let letter = 0
    let deleting = false
    const timer = window.setInterval(() => {
      const target = searchHints[word]
      letter += deleting ? -1 : 1
      setHint(target.slice(0, letter))
      if (!deleting && letter === target.length + 6) deleting = true
      if (deleting && letter <= 0) { deleting = false; word = (word + 1) % searchHints.length }
    }, 110)
    return () => window.clearInterval(timer)
  }, [])
  return <section className="search-section">
    <div className="input-wrapper">
      <input id="search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={hint || 'Search'} aria-label="Search the menu" />
      <button onClick={() => document.getElementById('search')?.focus()} aria-label="Search"><ArrowRight size={20} /></button>
    </div>
  </section>
}

function DishImage({ img, alt, eager = false }) {
  const src = menuImages[img]
  return src ? <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" /> : <span className="img-fallback">🍽️</span>
}

function MenuCard({ dish, quantity, open, increase, decrease }) {
  const multi = dish.variants.length > 1
  const first = dish.variants[0]
  return <article className="menu-card" onClick={open}>
    <div className="card-img">
      <DishImage img={dish.img} alt={dish.name} />
      {first.was && <span className="card-badge">Save {money(first.was - first.price)}</span>}
    </div>
    <div className="card-content">
      <h4>{dish.name}</h4>
      <p>{dish.desc}</p>
      {multi && <div className="card-sizes">{dish.variants.map((variant) => <span key={variant.label}>{variant.label}</span>)}</div>}
      <div className="card-footer">
        <span className="price">{multi && <small>From </small>}{money(startingPrice(dish))}{!multi && first.label !== 'Regular' && <small> / {first.label}</small>}{first.was && !multi && <s>{money(first.was)}</s>}</span>
        {quantity > 0 && !multi
          ? <div className="card-stepper" onClick={(event) => event.stopPropagation()}><button onClick={decrease} aria-label="Decrease">{quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</button><b>{quantity}</b><button onClick={increase} aria-label="Increase"><Plus size={14} /></button></div>
          : <button className="icon-btn" onClick={(event) => { event.stopPropagation(); open() }} aria-label={`Add ${dish.name}`}>{quantity > 0 ? <b className="icon-btn-count">{quantity}</b> : <ShoppingCart size={15} />}</button>}
      </div>
    </div>
  </article>
}

// "Use Current Location" + address search. Every pick is priced by road distance × Rs per km.
function LocationPicker({ value, onChange }) {
  const [status, setStatus] = useState({ busy: false, error: '' })
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const term = query.trim()
    if (term.length < 3) { setResults([]); return undefined }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setSearching(true)
      try { setResults(await searchAddress(term, controller.signal)) } catch { if (!controller.signal.aborted) setResults([]) }
      if (!controller.signal.aborted) setSearching(false)
    }, 450)
    return () => { controller.abort(); window.clearTimeout(timer) }
  }, [query])

  const pick = async (lat, lon, address) => {
    setStatus({ busy: true, error: '' })
    try {
      onChange(await buildLocation(lat, lon, address))
      setQuery(''); setResults([])
      setStatus({ busy: false, error: '' })
    } catch {
      setStatus({ busy: false, error: 'Could not work out the distance. Please check your internet and try again.' })
    }
  }
  const useCurrent = async () => {
    setStatus({ busy: true, error: '' })
    try {
      const { lat, lon } = await currentPosition()
      await pick(lat, lon)
    } catch (error) {
      setStatus({ busy: false, error: error.message })
    }
  }
  // Ask for location access as soon as the delivery popup opens (the browser shows its permission prompt).
  const askedRef = useRef(false)
  useEffect(() => {
    if (!value && !askedRef.current) { askedRef.current = true; useCurrent() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="loc-picker">
    <p className="loc-hint">Please select your location</p>
    <button type="button" className="loc-current" onClick={useCurrent} disabled={status.busy}>
      {status.busy ? <LoaderCircle size={18} className="spin" /> : <LocateFixed size={18} />} {status.busy ? 'Finding your location…' : 'Use Current Location'}
    </button>
    <div className="loc-or"><span>or search your address</span></div>
    <div className={`area-select${results.length || searching ? ' is-open' : ''}`}>
      <div className="area-control">
        <Search size={17} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. Korangi 5, Zaman Town, Shah Faisal" aria-label="Search your address" />
        {searching && <LoaderCircle size={17} className="spin" />}
      </div>
      {(results.length > 0 || (searching === false && query.trim().length >= 3)) && <div className="area-menu" role="listbox">
        {results.map((place) => <button type="button" role="option" aria-selected="false" key={`${place.lat},${place.lon}`} onClick={() => pick(place.lat, place.lon, place.address)}><MapPin size={15} /><span>{place.address}</span></button>)}
        {results.length === 0 && <small className="area-empty">No matching address in Karachi. Try a nearby landmark or use current location.</small>}
      </div>}
    </div>
    {status.error && <p className="loc-error">{status.error}</p>}
    {value && <div className={`loc-card${value.outOfRange ? ' out' : ''}`}>
      <span className="loc-card-icon"><MapPin size={18} /></span>
      <div>
        <b>{value.address}</b>
        {value.outOfRange
          ? <small className="loc-warn">This is beyond our {MAX_KM} km delivery range. Please choose pickup or message us on WhatsApp.</small>
          : <span className="loc-fee">Delivery fee <b>{money(value.fee)}</b></span>}
      </div>
    </div>}
  </div>
}

function ModeToggle({ mode, onChange }) {
  return <div className="mode-toggle">
    <button type="button" className={mode === 'delivery' ? 'active' : ''} onClick={() => onChange('delivery')}>DELIVERY</button>
    <button type="button" className={mode === 'pickup' ? 'active' : ''} onClick={() => onChange('pickup')}>PICKUP</button>
  </div>
}

function LocationGate({ mode, location, chooseMode, chooseLocation, close, dismissible }) {
  const [picked, setPicked] = useState(location)
  const [localMode, setLocalMode] = useState(mode || 'delivery')
  const ready = localMode === 'pickup' || Boolean(picked && !picked.outOfRange)
  const submit = (event) => {
    event.preventDefault()
    if (!ready) return
    chooseMode(localMode, true)
    if (localMode === 'delivery') chooseLocation(picked)
    close()
  }
  return <div className="overlay center gate-overlay" onMouseDown={() => dismissible && close()}>
    <form className="area-modal" onMouseDown={(event) => event.stopPropagation()} onSubmit={submit}>
      <div className="area-modal-head"><span><img src={logo} alt="United Biryani" /></span></div>
      <div className="area-modal-body">
        <p className="branch-text">Select Your Order Type</p>
        <ModeToggle mode={localMode} onChange={setLocalMode} />
        {localMode === 'delivery'
          ? <LocationPicker value={picked} onChange={setPicked} />
          : <div className="branch-card"><Utensils size={18} /><span><b>Korangi Kitchen</b><small>{RESTAURANT.address}</small></span><Check size={18} /></div>}
      </div>
      <div className="area-modal-footer"><button type="submit" className="btn-primary full" disabled={!ready}>Select</button></div>
    </form>
  </div>
}

function ProductModal({ item: dish, close, add }) {
  const [quantity, setQuantity] = useState(1)
  const [variant, setVariant] = useState(dish.variants[0])
  const [specialInstructions, setSpecialInstructions] = useState('')
  const multi = dish.variants.length > 1
  return <div className="overlay center" onMouseDown={close}>
    <div className="item-modal" onMouseDown={(event) => event.stopPropagation()}>
      <div className="item-modal-close"><button className="round-btn" onClick={close} aria-label="Close"><X size={16} /></button></div>
      <div className="item-modal-body">
        <div className="item-left">
          <div className="item-img"><DishImage img={dish.img} alt={dish.name} eager /></div>
          <h3>{dish.name}</h3>
          <h5>{money(variant.price)}{variant.was && <s>{money(variant.was)}</s>}</h5>
          <p>{dish.desc}</p>
        </div>
        <div className="item-right">
          <h6>{multi ? 'Select Size / Portion' : 'Option'}</h6>
          <div className="item-options">
            {dish.variants.map((option) => <label key={option.label} className={`item-option${option.label === variant.label ? ' selected' : ''}`}>
              <span><input type="radio" name="variant" checked={option.label === variant.label} onChange={() => setVariant(option)} /> {option.label}</span>
              <span>{money(option.price)}</span>
            </label>)}
          </div>
          <label className="item-field">Special Instructions<textarea rows="3" value={specialInstructions} onChange={(event) => setSpecialInstructions(event.target.value)} placeholder="Please enter instructions about this item" /></label>
        </div>
      </div>
      <div className="item-modal-footer">
        <div className="counter"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease"><Minus size={16} /></button><input readOnly value={quantity} aria-label="Quantity" /><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase"><Plus size={16} /></button></div>
        <button className="btn-primary" onClick={() => add(dish, variant, quantity, specialInstructions)}>Add to Cart - {money(variant.price * quantity)}</button>
      </div>
    </div>
  </div>
}

function CartDrawer({ cart, subtotal, deliveryFee, grandTotal, updateQuantity, clearCart, close, checkout, mode, location, changeLocation }) {
  return <div className="overlay" onMouseDown={close}>
    <aside className="cart-drawer" onMouseDown={(event) => event.stopPropagation()}>
      <div className="cart-head">
        <span>Your Cart</span>
        <div>{cart.length > 0 && <button className="clear-cart" onClick={clearCart}>Clear Cart</button>}<button className="round-btn" onClick={close} aria-label="Close cart"><X size={16} /></button></div>
      </div>
      {cart.length ? <div className="cart-body">
        {cart.map((entry) => <div className="cart-item" key={entry.key}>
          <span className="cart-img"><DishImage img={entry.img} alt="" /></span>
          <div className="cart-copy"><span>{entry.name}</span>{entry.specialInstructions && <small>{entry.specialInstructions}</small>}<b>{money(entry.price)}</b></div>
          <div className="cart-stepper"><button onClick={() => updateQuantity(entry.key, -1)} aria-label="Decrease">{entry.quantity === 1 ? <Trash2 size={13} className="trash" /> : <Minus size={13} />}</button><span>{entry.quantity}</span><button onClick={() => updateQuantity(entry.key, 1)} aria-label="Increase"><Plus size={13} /></button></div>
        </div>)}
        <button className="add-more" onClick={close}><Plus size={16} /> Add More Items</button>
        {mode === 'delivery' && <DeliveryTo location={location} change={changeLocation} />}
        <div className="totals">
          <div><span>Total</span><span>{money(subtotal)}</span></div>
          <div><span>Delivery fee</span><span>{mode === 'delivery' ? money(deliveryFee) : 'Rs.0'}</span></div>
          <div className="grand"><span>Grand Total</span><span>{money(grandTotal)}</span></div>
        </div>
        <p className="cash-note"><Check size={15} /> Cash on delivery</p>
        <button className="btn-primary full checkout-btn" onClick={checkout}>Checkout <ArrowRight size={17} /></button>
      </div> : <div className="cart-empty"><ShoppingCart size={46} /><b>Your cart is empty</b><span>Add items to get started</span></div>}
    </aside>
  </div>
}

function DeliveryTo({ location, change }) {
  return <div className="deliver-to">
    <span className="loc-card-icon"><MapPin size={17} /></span>
    <div>
      <small>Delivering to</small>
      <b>{location ? location.address : 'No location selected'}</b>
      {location && <small>Delivery fee {money(location.fee)}</small>}
    </div>
    <button type="button" onClick={change}>Change</button>
  </div>
}

function CheckoutModal({ subtotal, close, submit, mode, location, chooseMode, changeLocation }) {
  const [type, setType] = useState(mode || '')
  const [details, setDetails] = useState({ name: '', phone: '', email: '', address: '', instructions: '' })
  const [errors, setErrors] = useState({})
  const validate = (nextDetails = details, nextType = type) => {
    const result = checkoutSchema.safeParse({ ...nextDetails, type: nextType })
    const nextErrors = result.success ? {} : result.error.issues.reduce((all, issue) => ({ ...all, [issue.path[0]]: issue.message }), {})
    setErrors(nextErrors)
    return result.success
  }
  const updateDetails = (field, value) => {
    const nextDetails = { ...details, [field]: value }
    setDetails(nextDetails)
    validate(nextDetails)
  }
  const chooseType = (nextType) => {
    setType(nextType)
    chooseMode(nextType, true)
    validate(details, nextType)
    if (nextType === 'delivery' && !location) changeLocation()
  }
  const locationReady = type !== 'delivery' || Boolean(location && !location.outOfRange)
  const canSubmit = checkoutSchema.safeParse({ ...details, type }).success && locationReady
  const currentDeliveryFee = type === 'delivery' && location ? location.fee : 0
  const subtotalValue = subtotal
  const currentTotal = subtotalValue + currentDeliveryFee
  const fieldError = (field, value) => errors[field] && value.trim() && <small className="field-error">{errors[field]}</small>
  const characterCount = (value, limit) => <small className="character-count">{value.length}/{limit}</small>
  return <div className="overlay center" onMouseDown={close}>
    <div className="checkout-modal" onMouseDown={(event) => event.stopPropagation()}>
      <div className="checkout-head"><h5>Checkout</h5><button className="round-btn" onClick={close} aria-label="Close"><X size={16} /></button></div>
      <div className="checkout-body">
        <ModeToggle mode={type} onChange={chooseType} />
        <label>Your name <b className="required-mark">*</b><input maxLength="100" value={details.name} onChange={(event) => updateDetails('name', event.target.value)} placeholder="e.g. Ayesha Khan" />{fieldError('name', details.name)}{characterCount(details.name, 100)}</label>
        <label>Phone number <b className="required-mark">*</b><input maxLength="20" value={details.phone} onChange={(event) => updateDetails('phone', event.target.value)} placeholder="03XX XXXXXXX" type="tel" />{fieldError('phone', details.phone)}{characterCount(details.phone, 20)}</label>
        <label>Email <span className="optional-label">(optional)</span><input maxLength="100" value={details.email} onChange={(event) => updateDetails('email', event.target.value)} placeholder="e.g. ayesha@example.com" type="email" />{fieldError('email', details.email)}</label>
        {type === 'delivery' && <>
          <DeliveryTo location={location} change={changeLocation} />
          <label>Exact address <b className="required-mark">*</b><textarea maxLength="1000" value={details.address} onChange={(event) => updateDetails('address', event.target.value)} placeholder="House / flat no., floor, street, block and a nearby landmark" rows="3" />{fieldError('address', details.address)}{characterCount(details.address, 1000)}</label>
        </>}
        <label>Other instructions <span className="optional-label">(optional)</span><textarea maxLength="1000" value={details.instructions} onChange={(event) => updateDetails('instructions', event.target.value)} placeholder="Any other instructions for your order..." rows="3" />{fieldError('instructions', details.instructions)}</label>
        <div className="totals">
          <div><span>Total</span><span>{money(subtotalValue)}</span></div>
          <div><span>Delivery fee</span><span>{type === 'delivery' ? money(currentDeliveryFee) : 'Rs.0'}</span></div>
          <div className="grand"><span>Grand Total</span><span>{money(currentTotal)}</span></div>
        </div>
        <div className="payment-row"><span className="cash-icon">₨</span><span><b>Cash on delivery</b><small>Pay when your order arrives</small></span><Check size={18} /></div>
      </div>
      <div className="checkout-foot">
        <button className="btn-primary full" disabled={!canSubmit} onClick={() => { if (validate()) submit({ ...details, type }) }}>Place Order</button>
        {!type && <small className="field-error center">Please select Delivery or Pickup</small>}
        {type === 'delivery' && !locationReady && <small className="field-error center">Please select a delivery location within {MAX_KM} km</small>}
      </div>
    </div>
  </div>
}

function OrderHistory({ orders, close }) {
  return <div className="overlay center" onMouseDown={close}>
    <div className="checkout-modal history-modal" onMouseDown={(event) => event.stopPropagation()}>
      <div className="checkout-head"><h5>My Orders</h5><button className="round-btn" onClick={close} aria-label="Close"><X size={16} /></button></div>
      <div className="checkout-body">
        {orders.length ? orders.map((order) => <div className="history-item" key={order.id}><div><b>{order.id}</b><small>{order.date} · {order.type === 'delivery' ? 'Delivery' : 'Pickup'}</small></div><b>{money(order.total)}</b></div>)
          : <div className="cart-empty"><History size={40} /><b>No orders yet</b><span>Your recent orders will appear here on this device.</span></div>}
      </div>
    </div>
  </div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
