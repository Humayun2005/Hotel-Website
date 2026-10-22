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

const WHATSAPP_NUMBER = '923112558691'
const checkoutSchema = z.object({
  type: z.enum(['delivery', 'pickup']),
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer').regex(/^[A-Za-z ]+$/, 'Name can contain only letters and spaces'),
  phone: z.string().trim().min(1, 'Phone number is required').max(20, 'Phone number must be 20 characters or fewer').regex(/^[0-9+() ]+$/, 'Phone can contain only numbers, +, brackets, and spaces'),
  email: z.string().trim().max(100, 'Email must be 100 characters or fewer').email('Enter a valid email address').or(z.literal('')),
  destination: z.string().trim(),
  address: z.string().max(1000, 'Address must be 1000 characters or fewer'),
  instructions: z.string().max(1000, 'Instructions must be 1000 characters or fewer'),
}).superRefine((details, context) => {
  if (details.type === 'delivery') {
    if (!details.destination) context.addIssue({ code: z.ZodIssueCode.custom, path: ['destination'], message: 'Delivery area is required' })
    if (!details.address.trim()) context.addIssue({ code: z.ZodIssueCode.custom, path: ['address'], message: 'Delivery address is required' })
  }
})
const categories = ['Biryani', 'Pulao', 'Burgers', 'Sandwiches', 'BBQ', 'Broast', 'Appetizers', 'Pasta', 'Lasagna', 'Pakistani Curries', 'Chinese', 'Soups', 'Pizza', 'Fries', 'Sides', 'Drinks', 'Bread', 'Dips']
const categoryIcons = { Biryani: '🍛', Pulao: '🥘', Burgers: '🍔', Sandwiches: '🥪', BBQ: '🍢', Broast: '🍗', Appetizers: '🥟', Pasta: '🍝', Lasagna: '🍲', 'Pakistani Curries': '🍲', Chinese: '🥡', Soups: '🥣', Pizza: '🍕', Fries: '🍟', Sides: '🍽️', Drinks: '🥤', Bread: '🫓', Dips: '🥣' }
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
  if (name.includes('naan') || name.includes('chapati') || name === 'nan') return 'Bread'
  if (name.includes('dip')) return 'Dips'
  if (dish.category === 'Drinks') return 'Drinks'
  if (dish.category === 'Chinese') return 'Chinese'
  if (dish.category === 'Pakistani') return 'Pakistani Curries'
  if (['tikka', 'boti', 'kabab', 'shashlik', 'wings', 'nuggets', 'strips'].some((word) => name.includes(word))) return 'BBQ'
  if (['roll', 'stick', 'spring'].some((word) => name.includes(word))) return 'Appetizers'
  return dish.category
}
const sectionId = (category) => `cat-${category.toLowerCase().replace(/[^a-z]+/g, '-')}`

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
const heroSlides = [
  { image: biryaniPhoto, title: 'Dum Biryani', label: 'Biryani' },
  { image: bbqPhoto, title: 'Smoky BBQ', label: 'BBQ' },
  { image: karahiPhoto, title: 'Desi Karahi', label: 'Pakistani Curries' },
  { image: burgerPhoto, title: 'Loaded Burgers', label: 'Burgers' },
  { image: pizzaPhoto, title: 'Cheesy Pizza', label: 'Pizza' },
  { image: biryaniBowlPhoto, title: 'Chicken Pulao', label: 'Pulao' },
]
const sectionMeta = {
  Biryani: ["Karachi's signature", 'Biryani (Per Plate)'], Pulao: ['Slow cooked', 'Pulao & Rice'], Burgers: ['Stacked & loaded', 'Burgers'],
  Sandwiches: ['Freshly toasted', 'Sandwiches'], BBQ: ['Straight off the coals', 'BBQ & Grill'], Broast: ['Crispy & golden', 'Broast'],
  Appetizers: ['Little bites', 'Appetizers'], Pasta: ['Creamy & cheesy', 'Pasta'], Lasagna: ['Oven baked', 'Lasagna'],
  'Pakistani Curries': ['Handi & karahi', 'Desi Food (Curries)'], Chinese: ['Wok tossed', 'Chinese'], Soups: ['Warm & comforting', 'Soups'],
  Pizza: ['Fresh from the oven', 'Pizza'], Fries: ['Crispy sides', 'Fries'], Sides: ['Perfect pairing', 'Sides'], Drinks: ['Ice cold', 'Drinks'],
  Bread: ['Fresh from the tandoor', 'Naan & Bread'], Dips: ['Extra flavour', 'Dips'],
}
const deliveryAreaCount = deliveryZones.length - 1
const searchHints = ['chicken biryani', 'zinger burger', 'malai boti', 'chicken karahi', 'lava pizza']

const money = (value) => `Rs.${value.toLocaleString('en-PK')}`

function App() {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('united-cart') || '[]'))
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('united-orders') || '[]'))
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [orderMode, setOrderMode] = useState(() => localStorage.getItem('united-order-mode') || '')
  const [destination, setDestination] = useState(() => localStorage.getItem('united-destination') || '')
  const [toast, setToast] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [locationGateOpen, setLocationGateOpen] = useState(() => {
    const savedMode = localStorage.getItem('united-order-mode') || ''
    const savedDestination = localStorage.getItem('united-destination') || ''
    return !savedMode || (savedMode === 'delivery' && !savedDestination)
  })

  useEffect(() => localStorage.setItem('united-cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('united-orders', JSON.stringify(history)), [history])

  const sections = useMemo(() => categories.map((category) => ({
    category,
    items: menu.filter((dish) => getPrimaryCategory(dish) === category && `${dish.name} ${dish.description}`.toLowerCase().includes(search.toLowerCase())),
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
  const deliveryFee = orderMode === 'delivery' ? getDeliveryFee(destination) : 0
  const grandTotal = subtotal + deliveryFee
  const quantityOf = (id) => cart.find((entry) => entry.id === id)?.quantity || 0

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }

  const addToCart = (dish, quantity = 1, specialInstructions = '') => {
    setCart((current) => {
      const found = current.find((entry) => entry.id === dish.id)
      return found ? current.map((entry) => entry.id === dish.id ? { ...entry, quantity: entry.quantity + quantity, specialInstructions: specialInstructions || entry.specialInstructions } : entry) : [...current, { ...dish, quantity, specialInstructions }]
    })
    setSelectedItem(null)
    notify(`${dish.name} added to cart`)
  }

  const updateQuantity = (id, amount) => setCart((current) => current.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity + amount } : entry).filter((entry) => entry.quantity > 0))

  const placeOrder = (details) => {
    const orderDeliveryFee = details.type === 'delivery' ? getDeliveryFee(details.destination || destination) : 0
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
${details.destination || destination ? `Area: ${details.destination || destination}\n` : ''}${details.address ? `Address: ${details.address}\n` : ''}
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
    if (persist && mode === 'pickup') {
      setDestination('')
      localStorage.removeItem('united-destination')
    }
  }
  const chooseDestination = (value) => { setDestination(value); localStorage.setItem('united-destination', value) }
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
  const locationLabel = orderMode === 'pickup' ? 'Korangi Kitchen' : destination || 'Select area'
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
              {items.map((dish) => <MenuCard key={dish.id} dish={dish} quantity={quantityOf(dish.id)} open={() => setSelectedItem(dish)} increase={() => addToCart(dish)} decrease={() => updateQuantity(dish.id, -1)} />)}
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
              <div><b><CountUp value={deliveryAreaCount} suffix="+" /></b><span>Delivery areas</span></div>
              <div><b><CountUp value={100} suffix="%" /></b><span>Fresh ingredients</span></div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={whiteLogo} alt="United Biryani" />
            <p>Karachi's signature biryani, BBQ and fast food. Freshly cooked and delivered hot, straight to your doorstep.</p>
            <div className="footer-socials">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={19} /></a>
              <a href={`tel:+${WHATSAPP_NUMBER}`} aria-label="Call us"><Phone size={18} /></a>
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
    </div>

    {cartBarVisible && <button className="view-cart-bar" onClick={() => setCartOpen(true)}><span className="view-cart-count">{itemCount}</span><b>View Cart</b><b>{money(subtotal)}</b></button>}
    {sideMenuOpen && <SideMenu close={() => setSideMenuOpen(false)} sections={sections} jumpTo={jumpTo} openOrders={() => setOrdersOpen(true)} openLocation={() => setLocationGateOpen(true)} openCart={() => setCartOpen(true)} scrollToId={scrollToId} itemCount={itemCount} />}

    {(locationGateOpen || !orderMode || (orderMode === 'delivery' && !destination)) && <LocationGate mode={orderMode} destination={destination} chooseMode={chooseMode} chooseDestination={chooseDestination} close={() => setLocationGateOpen(false)} dismissible={Boolean(orderMode && (orderMode === 'pickup' || destination))} />}
    {selectedItem && <ProductModal item={selectedItem} close={() => setSelectedItem(null)} add={addToCart} />}
    {cartOpen && <CartDrawer cart={cart} subtotal={subtotal} deliveryFee={deliveryFee} grandTotal={grandTotal} updateQuantity={updateQuantity} clearCart={() => setCart([])} close={() => setCartOpen(false)} checkout={() => { setCartOpen(false); setCheckoutOpen(true) }} mode={orderMode} destination={destination} chooseDestination={chooseDestination} />}
    {checkoutOpen && <CheckoutModal total={grandTotal} deliveryFee={deliveryFee} close={() => setCheckoutOpen(false)} submit={placeOrder} mode={orderMode} destination={destination} />}
    {ordersOpen && <OrderHistory orders={history} close={() => setOrdersOpen(false)} />}
    {toast && <div className="toast"><Check size={17} /> {toast}</div>}
    <button className={`floating-search${cartBarVisible ? ' over-bar' : ''}`} onClick={focusSearch} aria-label="Search the menu"><Search size={22} /></button>
    <a className={`floating-whatsapp${showBackToTop ? ' with-top' : ''}${cartBarVisible ? ' over-bar' : ''}`} href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3.2a12.7 12.7 0 0 0-10.9 19L3.3 28.8l6.8-1.7A12.8 12.8 0 1 0 16 3.2Zm0 23.3c-2 0-3.9-.6-5.5-1.6l-.4-.2-4 .9 1-3.9-.3-.4A10.5 10.5 0 1 1 16 26.5Zm5.8-7.8c-.3-.2-1.7-.9-2-.9-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.4.3-.7.1a8.5 8.5 0 0 1-2.4-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.1 3.1c.1.2 2 3.1 4.8 4.3 2.8 1.2 2.8.8 3.3.8.5 0 1.7-.7 1.9-1.4.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.5Z" /></svg></a>
    {showBackToTop && <button className={`floating-top${cartBarVisible ? ' over-bar' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ChevronUp size={24} /></button>}
  </div>
}

const HERO_INTERVAL = 5500

function HeroSlider({ onOrder, onExplore }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % heroSlides.length), HERO_INTERVAL)
    return () => window.clearTimeout(timer)
  }, [index])
  const go = (step) => setIndex((current) => (current + step + heroSlides.length) % heroSlides.length)
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
    <div className="hero-card">
      <div className="hero-card-top">
        <span className="hero-card-icon"><Truck size={26} /></span>
        <div><b>{deliveryAreaCount}+ Areas</b><small>Karachi delivery</small></div>
      </div>
      <div className="hero-thumbs">
        {heroSlides.map((item, itemIndex) => <button key={item.image} className={itemIndex === index ? 'active' : ''} onClick={() => setIndex(itemIndex)} aria-label={`Show ${item.title}`}><img src={item.image} alt="" /></button>)}
      </div>
      <span className="hero-card-note"><Clock3 size={13} /> Open daily 11 AM — 2 AM</span>
    </div>
    <button className="hero-arrow prev" onClick={() => go(-1)} aria-label="Previous slide"><ChevronLeft size={26} /></button>
    <button className="hero-arrow next" onClick={() => go(1)} aria-label="Next slide"><ChevronRight size={26} /></button>
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
        <span className="feature-icon"><MessageCircle size={26} /></span>
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
      <button className={`tab-arrow tab-left${canScroll.left ? '' : ' is-hidden'}`} onClick={() => scroll(-300)} aria-label="Scroll left" tabIndex={canScroll.left ? 0 : -1}><ChevronLeft size={20} /></button>
      <div className="tab-container" ref={trackRef}>
        {sections.map(({ category }) => <button key={category} className={`tab-item${activeCategory === category ? ' tab-active' : ''}`} onClick={() => jumpTo(category)}>{category}</button>)}
      </div>
      <button className={`tab-arrow tab-right${canScroll.right ? '' : ' is-hidden'}`} onClick={() => scroll(300)} aria-label="Scroll right" tabIndex={canScroll.right ? 0 : -1}><ChevronRight size={20} /></button>
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

function MenuCard({ dish, quantity, open, increase, decrease }) {
  return <article className="menu-card" onClick={open}>
    <div className="card-img"><span>{dish.image}</span></div>
    <div className="card-content">
      <h4>{dish.name}</h4>
      <p>{dish.description}</p>
      <div className="card-footer">
        <span className="price">{money(dish.price)}</span>
        {quantity > 0
          ? <div className="card-stepper" onClick={(event) => event.stopPropagation()}><button onClick={decrease} aria-label="Decrease">{quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</button><b>{quantity}</b><button onClick={increase} aria-label="Increase"><Plus size={14} /></button></div>
          : <button className="icon-btn" onClick={(event) => { event.stopPropagation(); open() }} aria-label={`Add ${dish.name}`}><ShoppingCart size={15} /></button>}
      </div>
    </div>
  </article>
}

function LocationSearchSelect({ value, onChange, label = 'Select an Area' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const selectRef = useRef(null)
  const filteredZones = deliveryZones.filter(([name]) => name.toLowerCase().includes(query.toLowerCase()))
  useEffect(() => {
    const closeResults = (event) => {
      if (!selectRef.current?.contains(event.target)) { setQuery(''); setOpen(false) }
    }
    document.addEventListener('mousedown', closeResults, true)
    return () => document.removeEventListener('mousedown', closeResults, true)
  }, [])
  const selectArea = (name) => { onChange(name); setQuery(''); setOpen(false) }
  return <div ref={selectRef} className={`area-select${open ? ' is-open' : ''}`}>
    <div className="area-control">
      <input value={open ? query : value} onFocus={() => { setOpen(true); setQuery('') }} onChange={(event) => { setOpen(true); setQuery(event.target.value) }} placeholder={value || label} aria-label={label} />
      <span className="area-separator" /><ChevronDown size={18} />
    </div>
    {open && <div className="area-menu" role="listbox">
      {filteredZones.map(([name, fee]) => <button type="button" role="option" aria-selected={name === value} key={name} onClick={() => selectArea(name)}><span>{name}</span><small>{money(fee)}</small></button>)}
      {filteredZones.length === 0 && <small className="area-empty">No options</small>}
    </div>}
  </div>
}

function ModeToggle({ mode, onChange }) {
  return <div className="mode-toggle">
    <button type="button" className={mode === 'delivery' ? 'active' : ''} onClick={() => onChange('delivery')}>DELIVERY</button>
    <button type="button" className={mode === 'pickup' ? 'active' : ''} onClick={() => onChange('pickup')}>PICKUP</button>
  </div>
}

function LocationGate({ mode, destination, chooseMode, chooseDestination, close, dismissible }) {
  const [area, setArea] = useState(destination)
  const [localMode, setLocalMode] = useState(mode || 'delivery')
  const ready = localMode === 'pickup' || Boolean(area)
  const submit = (event) => {
    event.preventDefault()
    if (!ready) return
    chooseMode(localMode, true)
    if (localMode === 'delivery') chooseDestination(area)
    close()
  }
  return <div className="overlay center" onMouseDown={() => dismissible && close()}>
    <form className="area-modal" onMouseDown={(event) => event.stopPropagation()} onSubmit={submit}>
      <div className="area-modal-body">
        <img className="area-modal-logo" src={logo} alt="United Biryani" />
        <p className="branch-text">{localMode === 'pickup' ? 'Please Select Branch' : 'Please Select your area'}</p>
        <ModeToggle mode={localMode} onChange={setLocalMode} />
        {localMode === 'delivery'
          ? <LocationSearchSelect value={area} onChange={setArea} />
          : <div className="branch-card"><Utensils size={18} /><span><b>Korangi Kitchen</b><small>K 19/14 Main Korangi Industrial Road, Landhi Town</small></span><Check size={18} /></div>}
        {localMode === 'delivery' && area && <p className="area-fee">Delivery fee for this area: <b>{money(getDeliveryFee(area))}</b></p>}
      </div>
      <div className="area-modal-footer"><button type="submit" className="btn-primary full" disabled={!ready}>Select</button></div>
    </form>
  </div>
}

function ProductModal({ item: dish, close, add }) {
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')
  return <div className="overlay center" onMouseDown={close}>
    <div className="item-modal" onMouseDown={(event) => event.stopPropagation()}>
      <div className="item-modal-close"><button className="round-btn" onClick={close} aria-label="Close"><X size={16} /></button></div>
      <div className="item-modal-body">
        <div className="item-left">
          <div className="item-img"><span>{dish.image}</span></div>
          <h3>{dish.name}</h3>
          <h5>{money(dish.price)}</h5>
          <p>{dish.description}</p>
        </div>
        <div className="item-right">
          <h6>Select Option</h6>
          <label className="item-option selected"><span><input type="radio" checked readOnly /> Regular</span><span>{money(dish.price)}</span></label>
          <label className="item-field">Special Instructions<textarea rows="3" value={specialInstructions} onChange={(event) => setSpecialInstructions(event.target.value)} placeholder="Please enter instructions about this item" /></label>
        </div>
      </div>
      <div className="item-modal-footer">
        <div className="counter"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease"><Minus size={16} /></button><input readOnly value={quantity} aria-label="Quantity" /><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase"><Plus size={16} /></button></div>
        <button className="btn-primary" onClick={() => add(dish, quantity, specialInstructions)}>Add to Cart - {money(dish.price * quantity)}</button>
      </div>
    </div>
  </div>
}

function CartDrawer({ cart, subtotal, deliveryFee, grandTotal, updateQuantity, clearCart, close, checkout, mode, destination, chooseDestination }) {
  return <div className="overlay" onMouseDown={close}>
    <aside className="cart-drawer" onMouseDown={(event) => event.stopPropagation()}>
      <div className="cart-head">
        <span>Your Cart</span>
        <div>{cart.length > 0 && <button className="clear-cart" onClick={clearCart}>Clear Cart</button>}<button className="round-btn" onClick={close} aria-label="Close cart"><X size={16} /></button></div>
      </div>
      {cart.length ? <div className="cart-body">
        {cart.map((entry) => <div className="cart-item" key={entry.id}>
          <span className="cart-img">{entry.image}</span>
          <div className="cart-copy"><span>{entry.name}</span>{entry.specialInstructions && <small>{entry.specialInstructions}</small>}<b>{money(entry.price)}</b></div>
          <div className="cart-stepper"><button onClick={() => updateQuantity(entry.id, -1)} aria-label="Decrease">{entry.quantity === 1 ? <Trash2 size={13} className="trash" /> : <Minus size={13} />}</button><span>{entry.quantity}</span><button onClick={() => updateQuantity(entry.id, 1)} aria-label="Increase"><Plus size={13} /></button></div>
        </div>)}
        <button className="add-more" onClick={close}><Plus size={16} /> Add More Items</button>
        {mode === 'delivery' && <label className="cart-area">Delivery area<LocationSearchSelect value={destination} onChange={chooseDestination} label="Search delivery area" /></label>}
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

function CheckoutModal({ total, deliveryFee, close, submit, mode, destination }) {
  const [type, setType] = useState(mode || '')
  const [details, setDetails] = useState({ name: '', phone: '', email: '', address: '', destination, instructions: '' })
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
    validate(details, nextType)
  }
  const canSubmit = checkoutSchema.safeParse({ ...details, type }).success
  const currentDeliveryFee = type === 'delivery' ? getDeliveryFee(details.destination) : 0
  const subtotalValue = total - deliveryFee
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
          <label>Area <b className="required-mark">*</b><LocationSearchSelect value={details.destination} onChange={(value) => updateDetails('destination', value)} label="Select an Area" />{fieldError('destination', details.destination)}</label>
          <label>Delivery address <b className="required-mark">*</b><textarea maxLength="1000" value={details.address} onChange={(event) => updateDetails('address', event.target.value)} placeholder="House, street, area, Karachi" rows="3" />{fieldError('address', details.address)}{characterCount(details.address, 1000)}</label>
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
