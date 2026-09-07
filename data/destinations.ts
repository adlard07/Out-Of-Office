import type { Destination } from "@/lib/types";
import { photo } from "@/lib/images";

/**
 * Mock destination catalogue used everywhere during development.
 * Swap for `services/destinations` once a real content API exists.
 */
export const DESTINATIONS: Destination[] = [
  {
    id: "vietnam",
    name: "Vietnam",
    country: "Vietnam",
    region: "Southeast Asia",
    image: photo("1528127269322-539801943592"),
    gallery: [
      photo("1509030450996-dd1a26dda07a"),
      photo("1583417319070-4a69db38a482"),
      photo("1559592413-7cec4d0cae2b"),
      photo("1528181304800-259b08848526"),
    ],
    tagline: "Motorbikes, night markets, and a boat to sleep on",
    whyItSuitsUs: "Big variety on a small budget — a cruise, a mountain, a beach and a chaotic old town in one trip.",
    whyWeWouldLoveIt:
      "Vietnam is a proper adventure that still lets you eat like royalty for the price of a coffee back home. Ha Long Bay overnight, sleeper train, egg coffee on tiny plastic stools.",
    estimatedCostForTwo: 135000,
    recommendedDays: 9,
    bestMonths: ["February", "March", "April", "November"],
    vibeTags: ["Adventure", "Food", "Culture", "Value"],
    moods: ["adventure", "food", "culture", "roadtrip"],
    overview:
      "A long, thin country that changes completely every few hours on a train. Hanoi's old quarter, an overnight cruise through the limestone karsts of Ha Long / Lan Ha Bay, the lantern-lit town of Hoi An, and beaches in the south.",
    experiences: [
      { title: "Lan Ha Bay overnight cruise", description: "Quieter than Ha Long, same impossible scenery. Kayak at dawn.", approxCost: 18000, tag: "Nature" },
      { title: "Hoi An old town by lantern light", description: "Get clothes tailored, release a candle on the river.", approxCost: 2500, tag: "Culture" },
      { title: "Hanoi street-food walk", description: "Bun cha, egg coffee, banh mi — led by someone who knows.", approxCost: 3200, tag: "Food" },
      { title: "Hai Van Pass by car", description: "The Top Gear road, hire a driver, stop for every view.", approxCost: 5500, tag: "Road Trip" },
    ],
    accommodation: [
      { name: "Hanoi old-quarter boutique", style: "Boutique hotel", pricePerNight: 4200, rating: 4.6, image: photo("1445019980597-93fa8acb246c") },
      { name: "Lan Ha Bay cruise cabin", style: "Cruise", pricePerNight: 16000, rating: 4.7, image: photo("1528127269322-539801943592") },
      { name: "Hoi An riverside resort", style: "Resort", pricePerNight: 6800, rating: 4.7, image: photo("1540541338287-41700207dee6") },
    ],
    travelOptions: [
      { mode: "flight", label: "To Hanoi via Bangkok", duration: "~8h total", approxCost: 38000 },
      { mode: "train", label: "Reunification Express (in-country)", duration: "sleeper legs", approxCost: 4000, note: "Book soft sleeper" },
    ],
    itineraryPreview: [
      "Hanoi — old quarter, street food, water puppets",
      "Transfer to Lan Ha Bay, board the cruise",
      "Kayaking, swimming, sunset on the top deck",
      "Fly central, Hoi An old town and tailoring",
      "Hai Van Pass drive to Hue, imperial city",
      "Beach day near Da Nang before flying home",
    ],
  },
  {
    id: "kashmir",
    name: "Kashmir",
    country: "India",
    region: "Himalayas",
    image: photo("1566837945700-30057527ade0"),
    gallery: [
      photo("1595815771614-ade9d652a65d"),
      photo("1610019913432-8c5d0d9b1b7a"),
      photo("1626621341517-bbf3d9990a23"),
      photo("1580741569354-08fed2f4a3c0"),
    ],
    tagline: "A houseboat, a shikara, and snow on the peaks",
    whyItSuitsUs: "Absurdly romantic and close to home — a floating bedroom on Dal Lake, then meadows an hour away.",
    whyWeWouldLoveIt:
      "Wooden houseboats, gardens built by emperors, and Gulmarg's gondola to near-4000m. It feels like abroad without the long-haul flight or the visa.",
    estimatedCostForTwo: 95000,
    recommendedDays: 6,
    bestMonths: ["March", "April", "May", "September", "October"],
    vibeTags: ["Mountains", "Romantic", "Nature", "Short-haul"],
    moods: ["mountains", "romantic", "adventure", "culture"],
    overview:
      "The Kashmir Valley in northern India: Srinagar's lake life on carved cedar houseboats, Mughal gardens terraced up the hillside, and day trips to the alpine meadows of Gulmarg, Pahalgam and Sonamarg.",
    experiences: [
      { title: "Night on a Dal Lake houseboat", description: "Carved walnut interiors, breakfast delivered by shikara.", approxCost: 7000, tag: "Romantic" },
      { title: "Gulmarg Gondola to Apharwat", description: "One of the highest cable cars in the world; snow even in summer.", approxCost: 3600, tag: "Mountains" },
      { title: "Sunrise shikara ride", description: "Floating flower market, kingfishers, mist burning off the water.", approxCost: 1500, tag: "Nature" },
      { title: "Pahalgam valley walk", description: "Pine forest, the Lidder river, ponies optional.", approxCost: 2800, tag: "Adventure" },
    ],
    accommodation: [
      { name: "Deluxe Dal Lake houseboat", style: "Houseboat", pricePerNight: 6500, rating: 4.5, image: photo("1566837945700-30057527ade0") },
      { name: "Srinagar heritage hotel", style: "Heritage", pricePerNight: 5200, rating: 4.4, image: photo("1590523741831-ab7e8b8f9c7f") },
      { name: "Gulmarg ski lodge", style: "Mountain lodge", pricePerNight: 9000, rating: 4.6, image: photo("1548704806-0c20f7ad0d1f") },
    ],
    travelOptions: [
      { mode: "flight", label: "Domestic to Srinagar", duration: "~1.5–3h", approxCost: 14000 },
      { mode: "drive", label: "Local cab for the valley", duration: "per day", approxCost: 3000 },
    ],
    itineraryPreview: [
      "Fly to Srinagar, check into the houseboat, evening shikara",
      "Mughal gardens — Nishat, Shalimar — and old-city bakeries",
      "Day trip to Gulmarg, gondola, meadow lunch",
      "Pahalgam — Betaab valley, riverside walk",
      "Slow morning, floating market, fly home",
    ],
  },
  {
    id: "thailand",
    name: "Thailand",
    country: "Thailand",
    region: "Southeast Asia",
    image: photo("1552465011-b4e21bf6e79a"),
    gallery: [
      photo("1528181304800-259b08848526"),
      photo("1506665531195-3566af2b4dfa"),
      photo("1537956965359-7573183d1f57"),
      photo("1598935888738-cd2622bcd437"),
    ],
    tagline: "Temples in the morning, islands by the weekend",
    whyItSuitsUs: "Easy, familiar and endlessly fun — great food, great transport, and a beach for every budget.",
    whyWeWouldLoveIt:
      "Thailand just works. Bangkok's rooftop bars and markets, then a short hop to limestone bays and long-tail boats. First-trip-abroad friendly, tenth-trip-abroad still great.",
    estimatedCostForTwo: 145000,
    recommendedDays: 8,
    bestMonths: ["November", "December", "January", "February"],
    vibeTags: ["Beach", "Food", "Nightlife", "Value"],
    moods: ["beach", "food", "adventure", "roadtrip"],
    overview:
      "Bangkok as the gateway — temples, the river, night markets and some of the best street food on earth — then south to the Andaman coast: Krabi, Railay's climbing beaches, Phi Phi and the quieter Koh Lanta.",
    experiences: [
      { title: "Bangkok canal + temple morning", description: "Long-tail through the klongs, Wat Arun, mango sticky rice.", approxCost: 3000, tag: "Culture" },
      { title: "Railay Beach by long-tail", description: "No roads, just cliffs, monkeys and swimming.", approxCost: 2200, tag: "Beach" },
      { title: "Four-island sunset tour from Krabi", description: "Snorkelling, Chicken Island sandbar, dinner on the boat.", approxCost: 4500, tag: "Adventure" },
      { title: "Chef's-table street-food crawl", description: "Chinatown, plastic stools, everything on fire.", approxCost: 3800, tag: "Food" },
    ],
    accommodation: [
      { name: "Bangkok riverside high-rise", style: "City hotel", pricePerNight: 6500, rating: 4.6, image: photo("1566073771259-6a8506099945") },
      { name: "Ao Nang boutique resort", style: "Resort", pricePerNight: 5800, rating: 4.5, image: photo("1540202404-a2f29016b523") },
      { name: "Koh Lanta beach villa", style: "Villa", pricePerNight: 8200, rating: 4.7, image: photo("1544644181-1484b3fdfc62") },
    ],
    travelOptions: [
      { mode: "flight", label: "Direct to Bangkok", duration: "~4h", approxCost: 30000 },
      { mode: "flight", label: "Bangkok → Krabi", duration: "~1.5h", approxCost: 6000 },
    ],
    itineraryPreview: [
      "Bangkok — Grand Palace, river, rooftop bar",
      "Markets, massage, sleeper or flight south",
      "Krabi / Ao Nang, Railay beach afternoon",
      "Four-island boat tour, sunset swim",
      "Ferry to Phi Phi or Lanta, snorkelling",
      "Last beach day, fly home via Bangkok",
    ],
  },
  {
    id: "kerala",
    name: "Kerala",
    country: "India",
    region: "South India",
    image: photo("1602216056096-3b40cc0c9944"),
    gallery: [
      photo("1590050752117-238cb0fb12b1"),
      photo("1609342122563-a43ac8917a3a"),
      photo("1580889240912-c39ee39daad4"),
      photo("1544644181-1484b3fdfc62"),
    ],
    tagline: "A houseboat through the backwaters, tea hills after",
    whyItSuitsUs: "Green, gentle and close — a private boat with a cook, then cool air in the tea estates.",
    whyWeWouldLoveIt:
      "Kerala is the easy reset trip: drift through palm-lined canals on your own houseboat, wake up in Munnar surrounded by tea, eat a banana-leaf feast, get an Ayurvedic massage. No jet lag, all calm.",
    estimatedCostForTwo: 78000,
    recommendedDays: 6,
    bestMonths: ["September", "October", "November", "December", "February"],
    vibeTags: ["Nature", "Romantic", "Wellness", "Short-haul"],
    moods: ["romantic", "food", "mountains", "beach"],
    overview:
      "India's tropical south-west. Alleppey and Kumarakom for the backwater houseboats, Munnar and Thekkady for tea plantations and spice forests, Fort Kochi for colonial streets and Kathakali, and Varkala for a cliff-top beach finish.",
    experiences: [
      { title: "Overnight private houseboat", description: "Kettuvallam with a three-person crew; they cook, you drift.", approxCost: 12000, tag: "Romantic" },
      { title: "Munnar tea-estate walk", description: "Rolling green, a tea-tasting, Anamudi views on a clear day.", approxCost: 2000, tag: "Nature" },
      { title: "Kochi Kathakali + Kalari show", description: "Face paint, drums, martial arts — book the evening slot.", approxCost: 1600, tag: "Culture" },
      { title: "Ayurvedic couples' treatment", description: "Two hours of warm oil and zero conversation required.", approxCost: 5000, tag: "Wellness" },
    ],
    accommodation: [
      { name: "Alleppey premium houseboat", style: "Houseboat", pricePerNight: 11000, rating: 4.6, image: photo("1602216056096-3b40cc0c9944") },
      { name: "Munnar tea-estate bungalow", style: "Plantation stay", pricePerNight: 6800, rating: 4.7, image: photo("1566837945700-30057527ade0") },
      { name: "Fort Kochi heritage homestay", style: "Homestay", pricePerNight: 4200, rating: 4.6, image: photo("1512918728675-ed5a9ecdebfd") },
    ],
    travelOptions: [
      { mode: "flight", label: "Domestic to Kochi", duration: "~1–3h", approxCost: 12000 },
      { mode: "drive", label: "Car + driver for the loop", duration: "per day", approxCost: 3500 },
    ],
    itineraryPreview: [
      "Fly to Kochi, Fort Kochi walk, Kathakali in the evening",
      "Drive to Munnar, tea museum, estate sunset point",
      "Spice plantation and a boat on Periyar lake",
      "Down to Alleppey, board the houseboat at noon",
      "Backwater villages, toddy-shop lunch, sunrise on deck",
      "Varkala cliff beach, then fly home",
    ],
  },
  {
    id: "japan",
    name: "Japan",
    country: "Japan",
    region: "East Asia",
    image: photo("1493976040374-85c8e12f0c0e"),
    gallery: [
      photo("1524413840807-0c3cb6fa808d"),
      photo("1545569341-9eb8b30979d9"),
      photo("1490806843957-31f4c9a91c65"),
      photo("1528360983277-13d401cdc186"),
    ],
    tagline: "Neon, noodle bars, and a temple full of moss",
    whyItSuitsUs: "The trip we plan for a year — bullet trains, tiny bars, and a ryokan with a private onsen.",
    whyWeWouldLoveIt:
      "Japan rewards planning like nowhere else. Tokyo's controlled chaos, Kyoto's quiet, a night in a ryokan on tatami with kaiseki dinner, and the shinkansen gliding you between them at 300km/h.",
    estimatedCostForTwo: 320000,
    recommendedDays: 10,
    bestMonths: ["March", "April", "October", "November"],
    vibeTags: ["Culture", "Food", "City", "Bucket-list"],
    moods: ["culture", "food", "luxury", "adventure"],
    overview:
      "Two weeks' worth of trip you can just about do in ten days: Tokyo (Shinjuku, Shibuya, an early Tsukiji breakfast, a day trip to Hakone for Fuji views), then the shinkansen to Kyoto for temples, bamboo, and Nara's deer, with Osaka as a food-first finale.",
    experiences: [
      { title: "Night in a Hakone ryokan", description: "Private open-air onsen, kaiseki dinner, Fuji from the window.", approxCost: 32000, tag: "Romantic" },
      { title: "Fushimi Inari before sunrise", description: "Thousands of vermilion gates with nobody else in them.", approxCost: 0, tag: "Culture" },
      { title: "Golden Gai bar-hop, Tokyo", description: "Six-seat bars in a two-block warren; one drink each, keep moving.", approxCost: 6000, tag: "Nightlife" },
      { title: "Osaka street-food night in Dotonbori", description: "Takoyaki, okonomiyaki, the running-man sign.", approxCost: 4500, tag: "Food" },
    ],
    accommodation: [
      { name: "Shinjuku design tower", style: "City hotel", pricePerNight: 14000, rating: 4.6, image: photo("1503899036084-c55cdd92da26") },
      { name: "Hakone onsen ryokan", style: "Ryokan", pricePerNight: 30000, rating: 4.9, image: photo("1578469645742-46cae010e5d4") },
      { name: "Kyoto machiya townhouse", style: "Machiya", pricePerNight: 16000, rating: 4.8, image: photo("1545569341-9eb8b30979d9") },
    ],
    travelOptions: [
      { mode: "flight", label: "To Tokyo (Haneda), 1 stop", duration: "~11–13h", approxCost: 78000 },
      { mode: "train", label: "Japan Rail Pass, 7 days", duration: "unlimited shinkansen", approxCost: 24000 },
    ],
    itineraryPreview: [
      "Tokyo — Shibuya, Shinjuku, izakaya dinner",
      "teamLab, Asakusa, Golden Gai at night",
      "Day trip to Hakone, stay the night at a ryokan",
      "Shinkansen to Kyoto, Gion evening walk",
      "Fushimi Inari sunrise, Arashiyama bamboo, Nara deer",
      "Osaka — castle, Dotonbori, kuidaore",
    ],
  },
  {
    id: "sri-lanka",
    name: "Sri Lanka",
    country: "Sri Lanka",
    region: "South Asia",
    image: photo("1566296314736-6eaac1ca0cb9"),
    gallery: [
      photo("1554146115-cc5b4b6e6a44"),
      photo("1588416499018-d8c621e1d3f6"),
      photo("1552055568-f8b5a0b2b8b1"),
      photo("1580889240912-c39ee39daad4"),
    ],
    tagline: "A blue train through tea country to the sea",
    whyItSuitsUs: "Small enough to see properly in a week — safari, hill-country train, and a south-coast beach.",
    whyWeWouldLoveIt:
      "Sri Lanka packs a continent into a teardrop: leopards in Yala, the Kandy-to-Ella train hanging out of the doorway, ancient rock fortresses, and warm surf beaches to end on. Short flight, big trip.",
    estimatedCostForTwo: 120000,
    recommendedDays: 8,
    bestMonths: ["December", "January", "February", "March"],
    vibeTags: ["Adventure", "Nature", "Culture", "Beach"],
    moods: ["adventure", "mountains", "culture", "beach"],
    overview:
      "A loop from Colombo: the cultural triangle (Sigiriya rock, Dambulla caves), Kandy and the temple of the tooth, the famous hill-country train down to Ella, a dawn safari in Yala or Udawalawe, and finishing on the beaches around Mirissa and Weligama.",
    experiences: [
      { title: "Kandy → Ella by train", description: "Seven hours, doors open, tea estates rolling past. Book 1st class.", approxCost: 1200, tag: "Road Trip" },
      { title: "Sigiriya rock at opening time", description: "1,200 steps, frescoes, the lion's paws, the whole plain below.", approxCost: 2600, tag: "Culture" },
      { title: "Dawn jeep safari, Yala", description: "Leopard, elephant, painted stork before breakfast.", approxCost: 9000, tag: "Adventure" },
      { title: "Whale watching from Mirissa", description: "Blue whales offshore between December and April.", approxCost: 5000, tag: "Nature" },
    ],
    accommodation: [
      { name: "Sigiriya jungle lodge", style: "Eco lodge", pricePerNight: 7000, rating: 4.6, image: photo("1571896349842-33c89424de2d") },
      { name: "Ella mountain cabin", style: "Cabin", pricePerNight: 5200, rating: 4.7, image: photo("1520250497591-112f2f40a3f4") },
      { name: "Mirissa beach house", style: "Beach house", pricePerNight: 6000, rating: 4.5, image: photo("1544644181-1484b3fdfc62") },
    ],
    travelOptions: [
      { mode: "flight", label: "Direct to Colombo", duration: "~3.5h", approxCost: 26000 },
      { mode: "drive", label: "Car + driver, whole loop", duration: "per day", approxCost: 5500, note: "The normal way to travel here" },
    ],
    itineraryPreview: [
      "Land Colombo, drive to Sigiriya",
      "Sigiriya rock sunrise, Dambulla caves",
      "Kandy — temple of the tooth, lake walk",
      "Hill-country train to Ella, Nine Arch bridge",
      "Transfer to Yala, dawn safari",
      "South coast — Mirissa, whales, surf, home",
    ],
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    image: photo("1512453979798-5ea266f8880c"),
    gallery: [
      photo("1518684079-3c830dcef090"),
      photo("1526495124232-a04e1849168c"),
      photo("1546412414-e1885259563a"),
      photo("1580674684081-7617fbf3d745"),
    ],
    tagline: "Desert dunes at sunset, skyline from the 148th floor",
    whyItSuitsUs: "A short flight for a big-feeling long weekend — brunch, dunes, and a very tall building.",
    whyWeWouldLoveIt:
      "Dubai is the easy luxury hit: four hours away, everything shiny and air-conditioned, then a red-dune desert camp with camels and a fire. Perfect for a 3–4 night escape that feels like more.",
    estimatedCostForTwo: 175000,
    recommendedDays: 4,
    bestMonths: ["November", "December", "January", "February", "March"],
    vibeTags: ["Luxury", "City", "Desert", "Short-haul"],
    moods: ["luxury", "adventure", "food", "romantic"],
    overview:
      "A city built for the highlight reel: the Burj Khalifa and the fountain show, the old creek and gold souk by abra, a desert safari with dune-bashing and a Bedouin-style dinner, and a beach day at the Palm before flying home.",
    experiences: [
      { title: "Red-dune desert safari", description: "Dune-bashing 4x4, sandboard, camels, dinner under the stars.", approxCost: 9000, tag: "Adventure" },
      { title: "Burj Khalifa 'At the Top' at sunset", description: "Level 124/125, book the golden-hour slot weeks ahead.", approxCost: 5500, tag: "City" },
      { title: "Old Dubai by abra", description: "Cross the creek for 1 dirham, spice souk, gold souk, karak chai.", approxCost: 800, tag: "Culture" },
      { title: "Friday-style rooftop brunch", description: "The Dubai institution — long, lavish, book a window table.", approxCost: 14000, tag: "Food" },
    ],
    accommodation: [
      { name: "Downtown tower, Burj view", style: "City hotel", pricePerNight: 16000, rating: 4.7, image: photo("1512453979798-5ea266f8880c") },
      { name: "Palm Jumeirah beach resort", style: "Beach resort", pricePerNight: 28000, rating: 4.8, image: photo("1544644181-1484b3fdfc62") },
      { name: "Desert night camp", style: "Luxury camp", pricePerNight: 22000, rating: 4.9, image: photo("1518684079-3c830dcef090") },
    ],
    travelOptions: [
      { mode: "flight", label: "Direct to DXB", duration: "~3.5h", approxCost: 24000 },
      { mode: "drive", label: "Car hire / taxis", duration: "per day", approxCost: 2500 },
    ],
    itineraryPreview: [
      "Land, check in downtown, fountain show at night",
      "Old Dubai — creek, souks, then Dubai Mall + Burj Khalifa sunset",
      "Desert safari afternoon into evening",
      "Beach morning at the Palm, fly home",
    ],
  },
];

export function getDestination(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}
