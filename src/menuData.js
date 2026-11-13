// Menu transcribed from the client's "Updated Menu.pdf" (6 pages, Urdu + English).
// Every dish has one or more variants: { label, price, was? } — `was` is the struck-out normal rate.
// `img` is a key into the photo map in ./menuImages.js.

export const categories = [
  { name: 'Platters', icon: '🍽️', eyebrow: 'Made for sharing', title: 'United BBQ Platters' },
  { name: 'Deals', icon: '⭐', eyebrow: 'House favourites', title: 'United Specials' },
  { name: 'Biryani & Pulao', icon: '🍛', eyebrow: "Karachi's signature", title: 'Biryani & Pulao' },
  { name: 'Deg', icon: '🥘', eyebrow: 'For gatherings & events', title: 'Deg (Per KG Rate)' },
  { name: 'BBQ', icon: '🍢', eyebrow: 'Straight off the coals', title: 'Bar BQ' },
  { name: 'Fry Special', icon: '🍳', eyebrow: 'Hot off the tawa', title: 'Fry Special' },
  { name: 'Pakistani', icon: '🍲', eyebrow: 'Desi khana', title: 'Pakistani Food' },
  { name: 'Chinese', icon: '🥡', eyebrow: 'Wok tossed', title: 'Chinese' },
  { name: 'Burgers', icon: '🍔', eyebrow: 'Stacked & loaded', title: 'Burgers' },
  { name: 'Broast & Wings', icon: '🍗', eyebrow: 'Crispy & golden', title: 'Broast & Wings' },
  { name: 'Pizza', icon: '🍕', eyebrow: 'Fresh from the oven', title: 'United Pizza Flavours' },
  { name: 'Appetizers', icon: '🍝', eyebrow: 'Pasta, lasagna & bites', title: 'Appetizers' },
  { name: 'Sandwiches', icon: '🥪', eyebrow: 'Freshly toasted', title: 'Sandwiches' },
  { name: 'Rolls', icon: '🌯', eyebrow: 'Wrapped & rolled', title: 'Rolls' },
  { name: 'Fries', icon: '🍟', eyebrow: 'Crispy sides', title: 'Fries' },
  { name: 'Drinks', icon: '🥤', eyebrow: 'Ice cold', title: 'Drinks' },
  { name: 'Extras', icon: '🥗', eyebrow: 'Perfect pairing', title: 'Extras & Breads' },
]

const one = (price) => [{ label: 'Regular', price }]
const sml = (s, m, l) => [{ label: 'Small', price: s }, { label: 'Medium', price: m }, { label: 'Large', price: l }]
const sl = (s, l) => [{ label: 'Small', price: s }, { label: 'Large', price: l }]
const halfFull = (half, full) => [{ label: 'Half Plate', price: half }, { label: 'Full Plate', price: full }]

// Photo file name for a dish, e.g. "Chicken Biryani (Plain)" → "chicken-biryani" (src/assets/menu/<slug>.jpg).
export const slug = (name) => name.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

let nextId = 1
// `img` is a photo key in src/assets/menu (closest real photo of that dish type).
const dish = (cat, name, variants, img, desc) => ({ id: nextId++, cat, name, variants: Array.isArray(variants) ? variants : one(variants), img, desc })

const platterSides = 'Raita, salad, fries & chutney'

export const menu = [
  // Page 6 — United Bar BQ Platters
  dish('Platters', 'Platter 01', 750, 'platter1', `Chicken tikka leg (1 pc), seekh kabab (half), rice (380g). ${platterSides}.`),
  dish('Platters', 'Platter 02', 999, 'platter2', `Chicken tikka leg (1 pc), seekh kabab (half), beef boti (half), rice (450g). ${platterSides}.`),
  dish('Platters', 'Platter 03', 1750, 'platter3', `Behari tikka leg (1 pc), malai boti (half), seekh kabab (half plate), chicken boti (half), beef boti (half), rice (800g). ${platterSides}.`),
  dish('Platters', 'Platter 04', 2600, 'platter4', `Behari tikka leg (2 pcs), malai boti (full plate), chicken boti (full plate), beef boti (full plate), rice (1300g). ${platterSides}.`),

  // Page 2 — United Specials & Upcoming Items
  dish('Deals', 'United Albaik Broast', 600, 'albaik', 'Our signature Albaik-style crispy broast.'),
  dish('Deals', 'Supreme Club Sandwich', 480, 'clubSandwich', 'Loaded triple-decker club sandwich.'),
  dish('Deals', 'United Special Nihari', 500, 'nihari', 'Slow-cooked special nihari.'),
  dish('Deals', 'Special Paya', 600, 'paya', 'Rich, slow-simmered paya.'),
  dish('Deals', 'United Special Lab-e-Shireen', 120, 'labeShireen', 'Creamy dessert with fruit, jelly & vermicelli.'),

  // Page 3 — Biryani & Pulao
  dish('Biryani & Pulao', 'Beef Biryani', [{ label: 'Plate (375g)', price: 300 }, { label: 'Full Plate', price: 400 }, { label: '1 KG', price: 800 }], 'beefBiryani', 'Fragrant dum biryani with tender beef.'),
  dish('Biryani & Pulao', 'Chicken Biryani', [{ label: 'Plate (375g)', price: 280 }, { label: 'Full Plate', price: 380 }, { label: '1 KG', price: 760 }], 'chickenBiryani', 'Karachi-style spicy chicken biryani.'),
  dish('Biryani & Pulao', 'Beef Pulao', [{ label: 'Plate (375g)', price: 330 }, { label: 'Full Plate', price: 440 }, { label: '1 KG', price: 880 }], 'pulao', 'Aromatic yakhni pulao with beef.'),
  dish('Biryani & Pulao', 'Beef Biryani Sada (Plain)', [{ label: '1 KG', price: 400 }], 'plainBiryani', 'Plain biryani rice without meat.'),
  dish('Biryani & Pulao', 'Chicken Biryani Sada (Plain)', [{ label: '1 KG', price: 400 }], 'plainBiryani', 'Plain biryani rice without meat.'),
  dish('Biryani & Pulao', 'Beef Pulao Sada (Plain)', [{ label: '1 KG', price: 480 }], 'plainPulao', 'Plain pulao rice without meat.'),

  // Page 5 — Deg (one-kilo rate; struck-out normal rate kept as `was`)
  dish('Deg', 'Chicken Biryani Deg', [{ label: 'Per KG', price: 2300, was: 2500 }], 'deg', 'Bulk deg for gatherings & events.'),
  dish('Deg', 'Beef Biryani Deg', [{ label: 'Per KG', price: 3000 }], 'deg', 'Bulk deg for gatherings & events.'),
  dish('Deg', 'Beef Pulao Deg', [{ label: 'Per KG', price: 3200, was: 3300 }], 'deg', 'Bulk deg for gatherings & events.'),
  dish('Deg', 'Aloo Chana Biryani Deg', [{ label: 'Per KG', price: 1500 }], 'deg', 'Bulk deg for gatherings & events.'),
  dish('Deg', 'Chicken Karahi Deg', [{ label: 'Per KG', price: 2200, was: 2300 }], 'karahi', 'Bulk deg for gatherings & events.'),
  dish('Deg', 'Beef Qorma Deg', [{ label: 'Per KG', price: 2600, was: 2700 }], 'qorma', 'Bulk deg for gatherings & events.'),
  dish('Deg', 'Chicken Achar Gosht Deg', [{ label: 'Per KG', price: 2200, was: 2500 }], 'acharGosht', 'Bulk deg for gatherings & events.'),

  // Page 3 — Bar BQ
  dish('BBQ', 'Beef Boti', halfFull(270, 520), 'beefBoti', 'Char-grilled marinated beef cubes.'),
  dish('BBQ', 'Chicken Boti', halfFull(250, 480), 'chickenBoti', 'Char-grilled spicy chicken cubes.'),
  dish('BBQ', 'Malai Boti', halfFull(270, 520), 'malaiBoti', 'Creamy, mild malai chicken boti.'),
  dish('BBQ', 'Behari Boti', halfFull(280, 540), 'behariBoti', 'Tender behari-style marinated boti.'),
  dish('BBQ', 'Seekh Kabab', halfFull(230, 440), 'seekhKabab', 'Juicy minced seekh kababs off the grill.'),
  dish('BBQ', 'Gola Kabab', [{ label: 'Full Plate', price: 490 }], 'golaKabab', 'Soft, smoky gola kababs.'),
  dish('BBQ', 'Reshmi Kabab', [{ label: 'Full Plate', price: 500 }], 'reshmiKabab', 'Silky, mildly spiced reshmi kababs.'),
  dish('BBQ', 'Chicken Tikka', [{ label: 'Chest', price: 470 }, { label: 'Leg', price: 370 }], 'tikka', 'Classic charcoal chicken tikka.'),
  dish('BBQ', 'Malai Tikka', [{ label: 'Chest', price: 540 }], 'malaiTikka', 'Creamy malai chicken tikka (chest).'),

  // Page 2 — Fry Special
  dish('Fry Special', 'Brown Chicken Fry', 420, 'chickenFry', 'Chicken fried in brown masala.'),
  dish('Fry Special', 'Chicken White Fry', 500, 'whiteFry', 'Creamy white-masala chicken fry.'),
  dish('Fry Special', 'Chicken Hara Masala', 500, 'haraMasala', 'Chicken in green chilli & coriander masala.'),
  dish('Fry Special', 'Beef Fry', 520, 'beefFry', 'Spicy beef tawa fry.'),
  dish('Fry Special', 'Beef White Fry', 600, 'whiteFry', 'Creamy white-masala beef fry.'),
  dish('Fry Special', 'Kata Kat Mix', 500, 'katakat', 'Mixed tawa katakat.'),
  dish('Fry Special', 'Maghz Fry', 550, 'maghz', 'Brain masala fry.'),
  dish('Fry Special', 'Kaleji Fry', 320, 'kaleji', 'Spicy liver fry.'),
  dish('Fry Special', 'Qeema Fry', 360, 'qeema', 'Tawa-fried minced meat.'),
  dish('Fry Special', 'White Qeema', 480, 'qeema', 'Creamy white-masala qeema.'),
  dish('Fry Special', 'Seena Tawa Chicken Tikka', 750, 'tawaTikka', 'Tawa chicken tikka — chest piece.'),
  dish('Fry Special', 'Raan Tawa Chicken Tikka', 550, 'tawaTikka', 'Tawa chicken tikka — leg piece.'),
  dish('Fry Special', 'Daal Mash Fry', 220, 'daal', 'Tarka white lentils.'),
  dish('Fry Special', 'Daal Chana Fry', 200, 'daal', 'Tarka split chickpea lentils.'),
  dish('Fry Special', 'Chana Fry', 190, 'chana', 'Spicy fried chickpeas.'),
  dish('Fry Special', 'Daal Ghotala', 300, 'daal', 'Mashed mixed daal with egg.'),
  dish('Fry Special', 'Anda Ghotala', 220, 'andaGhotala', 'Scrambled egg masala ghotala.'),
  dish('Fry Special', 'Shami Kabab', 80, 'shami', 'Pan-fried shami kabab (1 pc).'),
  dish('Fry Special', 'Shami Kabab Ghotala', 300, 'shami', 'Crumbled shami kabab with egg masala.'),
  dish('Fry Special', 'Shami Kabab Roll', 150, 'roll', 'Shami kabab wrapped in paratha.'),
  dish('Fry Special', 'Paratha', 60, 'paratha', 'Fresh flaky paratha.'),

  // Page 3 — Pakistani Food
  dish('Pakistani', 'Chicken Karahi', 400, 'karahi', 'Tomato-based chicken karahi.'),
  dish('Pakistani', 'Chicken White Karahi', 470, 'whiteKarahi', 'Creamy white chicken karahi.'),
  dish('Pakistani', 'Beef Qorma', 470, 'qorma', 'Rich beef qorma.'),
  dish('Pakistani', 'Chicken Qorma', 440, 'qorma', 'Rich chicken qorma.'),
  dish('Pakistani', 'Beef Achar Gosht', 500, 'acharGosht', 'Tangy pickle-spiced beef.'),
  dish('Pakistani', 'Aloo Qeema', 360, 'alooQeema', 'Minced meat with potatoes.'),
  dish('Pakistani', 'Anda Chana', 190, 'chana', 'Chickpea curry with egg.'),
  dish('Pakistani', 'Chana', 150, 'chana', 'Spiced chickpea curry.'),
  dish('Pakistani', 'Daal Mash', 180, 'daal', 'White lentils.'),
  dish('Pakistani', 'Daal Chana', 180, 'daal', 'Split chickpea lentils.'),
  dish('Pakistani', 'Sabzi', 180, 'sabzi', 'Seasonal vegetable curry.'),
  dish('Pakistani', 'Mix Sabzi', 180, 'sabzi', 'Mixed vegetable curry.'),

  // Page 3 — Chinese
  dish('Chinese', 'Chicken Shashlik & Rice', 750, 'shashlik', 'Chicken shashlik served with rice.'),
  dish('Chinese', 'Chicken Manchurian & Rice', 750, 'manchurian', 'Chicken manchurian served with rice.'),
  dish('Chinese', 'Chicken White Chilli & Rice', 750, 'chilli', 'Chicken in white chilli sauce with rice.'),
  dish('Chinese', 'Dry Chilli', 850, 'chilli', 'Dry chilli chicken.'),
  dish('Chinese', 'Chicken Chowmein', 500, 'chowmein', 'Stir-fried chicken noodles.'),
  dish('Chinese', 'Chicken Vegetable Rice', 450, 'friedRice', 'Chicken & vegetable fried rice.'),
  dish('Chinese', 'Vegetable Rice', 350, 'friedRice', 'Vegetable fried rice.'),
  dish('Chinese', 'Alfredo Pasta', [{ label: 'F-1', price: 450 }, { label: 'F-2', price: 800 }], 'alfredo', 'Creamy chicken alfredo pasta.'),
  dish('Chinese', 'Chinese Chicken Corn Soup', 300, 'cornSoup', 'Chicken corn soup.'),
  dish('Chinese', 'Hot & Sour Soup', 350, 'hotSour', 'Spicy hot & sour soup.'),

  // Page 4 — Fast Food (burgers)
  dish('Burgers', 'United Fajita Burger', 490, 'burger', 'United signature fajita burger.'),
  dish('Burgers', 'United Pizza Burger', 550, 'pizzaBurger', 'Burger topped pizza-style with cheese.'),
  dish('Burgers', 'United Jumbo Zinger Burger', 700, 'zinger', 'Extra-large crispy zinger.'),
  dish('Burgers', 'Mighty Chicken Burger', 420, 'burger', 'Double chicken mighty burger.'),
  dish('Burgers', 'Mighty Chicken Cheese Burger', 470, 'cheeseBurger', 'Mighty chicken burger with cheese.'),
  dish('Burgers', 'Mighty Beef Burger', 470, 'beefBurger', 'Double beef mighty burger.'),
  dish('Burgers', 'Mighty Beef Cheese Burger', 520, 'beefBurger', 'Mighty beef burger with cheese.'),
  dish('Burgers', 'Zinger Burger', 420, 'zinger', 'Classic crispy zinger.'),
  dish('Burgers', 'Zinger Cheese Burger', 470, 'zinger', 'Crispy zinger with cheese.'),
  dish('Burgers', 'Zinger Mayo Garlic Burger', 440, 'zinger', 'Zinger with garlic mayo.'),
  dish('Burgers', 'Junior Zinger Burger', 340, 'zinger', 'Smaller crispy zinger.'),
  dish('Burgers', 'Chicken Burger', 370, 'burger', 'Grilled chicken burger.'),
  dish('Burgers', 'Chicken Cheese Burger', 420, 'cheeseBurger', 'Chicken burger with cheese.'),
  dish('Burgers', 'Chicken BBQ Burger', 360, 'burger', 'Chicken burger with BBQ sauce.'),
  dish('Burgers', 'Chicken Double Decker Burger', 620, 'doubleBurger', 'Two chicken patties stacked high.'),
  dish('Burgers', 'Beef Burger', 370, 'beefBurger', 'Juicy beef burger.'),
  dish('Burgers', 'Beef Cheese Burger', 420, 'beefBurger', 'Beef burger with cheese.'),
  dish('Burgers', 'Beef Double Decker Burger', 620, 'doubleBurger', 'Two beef patties stacked high.'),
  dish('Burgers', 'Anda Burger', 200, 'eggBurger', 'Egg burger.'),
  dish('Burgers', 'Malai Pizza Burger', 430, 'pizzaBurger', 'Malai boti pizza burger.'),
  dish('Burgers', 'Tikka Pizza Burger', 430, 'pizzaBurger', 'Chicken tikka pizza burger.'),

  // Page 4 — Fast Food (broast & wings)
  dish('Broast & Wings', 'Broast Quarter', [{ label: 'Chest', price: 500 }, { label: 'Leg', price: 450 }], 'broast', 'Crispy pressure-fried broast quarter.'),
  dish('Broast & Wings', 'Garlic Broast Quarter', [{ label: 'Chest', price: 550 }, { label: 'Leg', price: 500 }], 'broast', 'Broast quarter with garlic sauce.'),
  dish('Broast & Wings', 'Wings Plate', 570, 'wings', 'Crispy chicken wings.'),
  dish('Broast & Wings', 'Drumsticks (4 pcs)', 600, 'drumsticks', 'Four crispy drumsticks.'),
  dish('Broast & Wings', 'Garlic Drumsticks (4 pcs)', 680, 'drumsticks', 'Four drumsticks with garlic sauce.'),
  dish('Broast & Wings', 'Chicken Nuggets', 320, 'nuggets', 'Golden chicken nuggets.'),
  dish('Broast & Wings', 'Chicken Lollipop', 570, 'lollipop', 'Crispy chicken lollipops.'),

  // Page 1 — United Pizza Flavours
  dish('Pizza', 'Chicken Tikka Pizza', sml(400, 750, 1200), 'tikkaPizza', 'Chicken tikka, onions & mozzarella.'),
  dish('Pizza', 'Chicken Fajita Pizza', sml(400, 750, 1200), 'fajitaPizza', 'Fajita chicken, peppers & mozzarella.'),
  dish('Pizza', 'Afghani Pizza', sml(400, 750, 1200), 'pizza', 'Afghani-style creamy chicken pizza.'),
  dish('Pizza', 'Malai Boti Pizza', sml(430, 780, 1300), 'pizza', 'Malai boti chunks & mozzarella.'),
  dish('Pizza', 'Cheesy Lover Pizza', sml(400, 770, 1250), 'cheesePizza', 'Extra cheese all the way.'),
  dish('Pizza', 'Seekh Kabab Pizza', sml(450, 800, 1300), 'pizza', 'Seekh kabab pieces & mozzarella.'),
  dish('Pizza', 'Chicken Pepperoni Pizza', sml(400, 750, 1200), 'pepperoni', 'Chicken pepperoni & mozzarella.'),
  dish('Pizza', 'Beef Pepperoni Pizza', sml(400, 750, 1200), 'pepperoni', 'Beef pepperoni & mozzarella.'),
  dish('Pizza', 'Creamy Pizza', sml(400, 750, 1250), 'cheesePizza', 'Creamy white-sauce chicken pizza.'),
  dish('Pizza', 'Lava Pizza', sml(550, 950, 1600), 'cheesePizza', 'Molten cheese-filled lava pizza.'),
  dish('Pizza', 'United Special Pizza', sml(450, 850, 1350), 'pizza', 'House special loaded pizza.'),

  // Page 1 — Appetizer
  dish('Appetizers', 'Chicken Lasagna', sl(380, 700), 'lasagna', 'Baked chicken lasagna.'),
  dish('Appetizers', 'Beef Lasagna', sl(480, 850), 'lasagna', 'Baked beef lasagna.'),
  dish('Appetizers', 'Creamy Pasta', sl(380, 700), 'creamyPasta', 'Pasta in creamy white sauce.'),
  dish('Appetizers', 'Cheesy Pasta', sl(380, 700), 'creamyPasta', 'Pasta loaded with cheese.'),
  dish('Appetizers', 'Spicy Pasta', sl(350, 650), 'spicyPasta', 'Pasta in spicy red sauce.'),
  dish('Appetizers', 'Pizza Roll', 430, 'pizzaRoll', 'Baked roll stuffed with pizza filling.'),
  dish('Appetizers', 'Cheesy Sticks', 350, 'cheeseSticks', 'Golden cheese-filled sticks.'),
  dish('Appetizers', 'Mexican Sandwich', 430, 'sandwich', 'Spicy Mexican-style sandwich.'),
  dish('Appetizers', 'Arabian Sandwich', 430, 'sandwich', 'Arabian-style chicken sandwich.'),

  // Page 4 — Sandwiches
  dish('Sandwiches', 'Anda Sandwich', 290, 'sandwich', 'Egg sandwich.'),
  dish('Sandwiches', 'Chicken Sandwich', 390, 'sandwich', 'Chicken sandwich.'),
  dish('Sandwiches', 'Beef Sandwich', 470, 'sandwich', 'Beef sandwich.'),
  dish('Sandwiches', 'Club Sandwich', 420, 'clubSandwich', 'Classic club sandwich.'),
  dish('Sandwiches', 'BBQ Sandwich', 420, 'sandwich', 'BBQ chicken sandwich.'),
  dish('Sandwiches', 'Crispy Sandwich', 450, 'sandwich', 'Crispy chicken sandwich.'),
  dish('Sandwiches', 'Malai Sandwich', 470, 'sandwich', 'Malai boti sandwich.'),
  dish('Sandwiches', 'BBQ Club Sandwich', 470, 'clubSandwich', 'BBQ chicken club sandwich.'),
  dish('Sandwiches', 'Malai Club Sandwich', 520, 'clubSandwich', 'Malai boti club sandwich.'),

  // Page 4 — Rolls
  dish('Rolls', 'Crispy Chutney Roll', 240, 'roll', 'Crispy chicken roll with chutney.'),
  dish('Rolls', 'Crispy Mayo Roll', 250, 'roll', 'Crispy chicken roll with mayo.'),
  dish('Rolls', 'Crispy Cheese Roll', 270, 'roll', 'Crispy chicken roll with cheese.'),
  dish('Rolls', 'Jumbo Crispy Chutney Roll', 440, 'roll', 'Jumbo crispy roll with chutney.'),
  dish('Rolls', 'Jumbo Crispy Mayo Roll', 450, 'roll', 'Jumbo crispy roll with mayo.'),
  dish('Rolls', 'Jumbo Crispy Cheese Roll', 480, 'roll', 'Jumbo crispy roll with cheese.'),
  dish('Rolls', 'Chicken Chutney Roll', 190, 'roll', 'Chicken paratha roll with chutney.'),
  dish('Rolls', 'Chicken Mayo Roll', 200, 'roll', 'Chicken paratha roll with mayo.'),
  dish('Rolls', 'Chicken Cheese Roll', 220, 'roll', 'Chicken paratha roll with cheese.'),
  dish('Rolls', 'Beef Chutney Roll', 200, 'roll', 'Beef paratha roll with chutney.'),
  dish('Rolls', 'Beef Mayo Roll', 220, 'roll', 'Beef paratha roll with mayo.'),
  dish('Rolls', 'Beef Cheese Roll', 220, 'roll', 'Beef paratha roll with cheese.'),
  dish('Rolls', 'Malai Boti Roll', 220, 'roll', 'Malai boti paratha roll.'),
  dish('Rolls', 'Beef Behari Roll', 220, 'roll', 'Beef behari boti paratha roll.'),
  dish('Rolls', 'Beef Seekh Kabab Roll', 200, 'roll', 'Beef seekh kabab paratha roll.'),

  // Page 4 — Fries
  dish('Fries', 'Regular Fries', 150, 'fries', 'Classic salted fries.'),
  dish('Fries', 'Mayo Fries', 200, 'loadedFries', 'Fries topped with mayo.'),
  dish('Fries', 'Cheese Fries', 200, 'loadedFries', 'Fries topped with cheese.'),
  dish('Fries', 'Cheese Potato Fries', 250, 'loadedFries', 'Loaded cheesy potato fries.'),
  dish('Fries', 'Pizza Fries', 350, 'loadedFries', 'Fries loaded pizza-style.'),

  // Page 2 — Drinks (مشروبات)
  dish('Drinks', 'Regular Cold Drink', 70, 'coldDrink', 'Chilled regular glass bottle.'),
  dish('Drinks', 'Cold Drink', [{ label: '345 ml', price: 90 }, { label: '500 ml', price: 110 }, { label: '1 Litre', price: 180 }, { label: '1.5 Litre', price: 220 }, { label: '2.25 Litre', price: 280 }], 'coldDrink', 'Chilled soft drink.'),
  dish('Drinks', 'Cold Drink Can', 140, 'can', 'Chilled can.'),
  dish('Drinks', 'Sting', [{ label: '300 ml', price: 110 }, { label: '500 ml', price: 140 }], 'sting', 'Energy drink.'),
  dish('Drinks', 'Mineral Water', sl(60, 120), 'water', 'Bottled mineral water.'),

  // Page 2 — Extras (ایکسٹرا) + breads
  dish('Extras', 'Naan', 30, 'naan', 'Fresh tandoori naan.'),
  dish('Extras', 'Chapati', 20, 'chapati', 'Fresh chapati.'),
  dish('Extras', 'Puri Paratha', sl(60, 120), 'paratha', 'Flaky puri paratha.'),
  dish('Extras', 'Extra Mayo / Garlic / Cheese', 50, 'dip', 'Extra dip or topping.'),
  dish('Extras', 'Coleslaw', 50, 'coleslaw', 'Creamy coleslaw.'),
  dish('Extras', 'Raita', 60, 'raita', 'Cool yogurt raita.'),
  dish('Extras', 'Salad', 60, 'salad', 'Fresh salad.'),
]

export const startingPrice = (item) => Math.min(...item.variants.map((variant) => variant.price))
