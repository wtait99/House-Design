/* Project facts for the local main-house view. Classic script. No network. */
var HOUSE = {
  title: "Main house",
  place: "Howell, Michigan",
  tagline: "Design ideas for the main house. Not a construction set.",
  conceptBadge: "Concept, not construction-accurate",
  priceChecked: "November 8, 2026",
  screenNote: "Colors are approximate, for discussion only. They are not manufacturer chips and they do not match a can of paint.",
  shortNote: "Ideas only. None is approved. Colors are approximate. Renders are concepts, not construction-accurate.",
  ideaNote: "All looks are ideas. None is approved. Renders are concepts, not construction-accurate. Laundry tile and the wood plank ceiling stay. Unpainted knotty pine and real wood are preserved.",
  record: {
    href: "https://cursor.com/canvas/store-98ce45c0-50a2-4781-8d4f-35303dfc9f74/8d1ff081-624c-4eeb-8d5c-0ac494f9d27f",
    label: "Open the planning record",
    status: "A shared view of design ideas for the main house. It does not purchase, submit, or approve anything.",
    authority: "Decisions stay open until Bill approves them."
  },
  lookStorageKey: "howell-house-looks-v1",
  lookGroups: [
    { id: "house", label: "Whole house", note: "Fifteen looks. The six added November 10, 2026 show living-room and primary-bedroom color renders; kitchen, 3rd bedroom, office, and laundry are described with palette cards." },
    { id: "study", label: "Room studies", note: "Earlier or partial ideas. Each is labeled with how many rooms it covers." }
  ],
  rooms: [
    {
      id: "living",
      lookKey: "living",
      name: "Living room",
      captionNow: "Now: empty room, November 9, 2026.",
      captionEarlier: "Earlier photograph, with belongings still in the room.",
      photos: [
        { file: "rooms/living.jpg", alt: "Living room, vacant, looking toward the kitchen. Beam, ceiling fan, and the large side window are in view.", kind: "vacant" },
        { file: "earlier/living-03.jpg", alt: "Living room, earlier photograph 1 of 2, with belongings still in the room.", kind: "earlier" },
        { file: "earlier/living-04.jpg", alt: "Living room, earlier photograph 2 of 2, with belongings still in the room.", kind: "earlier" }
      ],
      notes: [
        { label: "Retained", text: "Existing hard floor, beam, openings, and fireplace stay." },
        { label: "Open", text: "Paint on surfaces that can take it, and a future floor that could continue from the carpeted rooms." },
        { label: "Unmeasured", text: "Clearances." }
      ]
    },
    {
      id: "kitchen",
      lookKey: "kitchen",
      name: "Kitchen",
      captionNow: "Now: empty room, November 9, 2026.",
      captionEarlier: "Earlier photograph, with belongings still in the room.",
      photos: [
        { file: "rooms/kitchen.jpg", alt: "Kitchen, vacant, looking toward the island, cooktop, and sink wall, with the office door open on the left.", kind: "vacant" },
        { file: "rooms/kitchen-7386.jpg", alt: "Kitchen, vacant, from the north end looking south along the sink wall and the island.", kind: "vacant" },
        { file: "rooms/kitchen-7391.jpg", alt: "Kitchen, vacant, looking toward the living room past the island, with the fireplace ahead.", kind: "vacant" },
        { file: "rooms/kitchen-7456.jpg", alt: "Kitchen, vacant, from the dining area looking toward the kitchen peninsula and cooktop, with the main bath visible through the hall on the right.", kind: "vacant" },
        { file: "earlier/kitchen-05.jpg", alt: "Kitchen, earlier photograph from the north end looking south along the sink wall, with belongings still in the room.", kind: "earlier" },
        { file: "earlier/kitchen-06.jpg", alt: "Kitchen, earlier photograph looking toward the island and sink, with a dining table in the foreground and belongings still in the room.", kind: "earlier" }
      ],
      notes: [
        { label: "Retained", text: "Hard floor, cabinets, the island’s rounded corner, the cooktop in the island, and the sink under the window." },
        { label: "Open", text: "Paint, counters, and a future floor that could continue from the carpeted rooms." },
        { label: "Unmeasured", text: "A compact dining table. It depends on measurements." }
      ]
    },
    {
      id: "master",
      lookKey: "master",
      name: "Primary bedroom",
      captionNow: "Now: empty room, November 9, 2026.",
      captionEarlier: "Earlier photograph, with belongings still in the room.",
      photos: [
        { file: "rooms/master.jpg", alt: "Primary bedroom, vacant, with manufactured vertical paneling, two windows, and green carpet.", kind: "vacant" },
        { file: "earlier/master-02.jpg", alt: "Primary bedroom, earlier photograph, with belongings still in the room.", kind: "earlier" }
      ],
      notes: [
        { label: "Visible", text: "Manufactured vertical paneling, which may be painted. Green carpet is a candidate for replacement." },
        { label: "Stays", text: "Window locations and the small rectangular access panel under the left window." },
        { label: "To do", text: "Measure the room." }
      ]
    },
    {
      id: "bed3",
      lookKey: "bed3",
      name: "3rd bedroom",
      captionNow: "Now: empty room, November 9, 2026.",
      captionEarlier: "Earlier photograph, with belongings still in the room.",
      photos: [
        { file: "rooms/bed3.jpg", alt: "Third bedroom, vacant, with manufactured vertical paneling, one window, and worn pale carpet.", kind: "vacant" },
        { file: "earlier/bed3-01.jpg", alt: "Third bedroom, earlier photograph, with belongings still in the room.", kind: "earlier" }
      ],
      notes: [
        { label: "Visible", text: "Manufactured vertical paneling, which may be painted. Worn carpet is a candidate for replacement." },
        { label: "To do", text: "Measure the room and inspect the substrate." }
      ]
    },
    {
      id: "office",
      lookKey: "office",
      name: "Office",
      captionNow: "Now: empty room, November 9, 2026.",
      captionEarlier: "Earlier photograph, with belongings still in the room.",
      photos: [
        { file: "rooms/office.jpg", alt: "Office, vacant, painted walls, two wood-trimmed windows, and a wood floor. Portrait photograph.", kind: "vacant" },
        { file: "rooms/office-7401.jpg", alt: "Office, vacant, second angle toward the closets and wardrobe wall.", kind: "vacant" }
      ],
      notes: [
        { label: "Retained", text: "Window locations, wood trim, closets, and the existing wood floor until a later whole-house floor is chosen." },
        { label: "Open", text: "Paint on walls that can take it." }
      ]
    },
    {
      id: "laundry",
      lookKey: "laundry",
      name: "Laundry / mud room",
      captionNow: "Now: empty room, November 9, 2026.",
      captionEarlier: "Earlier photograph, with belongings still in the room.",
      photos: [
        { file: "rooms/laundry.jpg", alt: "Laundry and mud room, vacant, with the wood plank ceiling, skylight, cabinets, appliances, tank, and furnace.", kind: "vacant" },
        { file: "rooms/laundry-7381.jpg", alt: "Laundry and mud room, vacant, second angle toward the upper cabinets, tank, and washer.", kind: "vacant" }
      ],
      notes: [
        { label: "Stays", text: "The unpainted wood plank ceiling, the skylight, cabinets, appliances, tank, furnace, and the tile floor." },
        { label: "Open", text: "Paint on walls that can take it. Loose clutter in the photograph is not a finish to keep." }
      ]
    },
    {
      id: "foyer",
      lookKey: "foyer",
      name: "Foyer",
      captionNow: "Now: empty room, November 9, 2026.",
      photos: [
        { file: "rooms/foyer.jpg", alt: "Foyer, vacant, looking south toward the front door, oval window, glass sidelight, and tile floor.", kind: "vacant" }
      ],
      notes: [
        { label: "Visible", text: "Front door, sidelight, tile floor, and a window on the side wall." },
        { label: "Open", text: "Finish decisions follow the rest of the house. The three Nautical variants (November 11, 2026) are the only concept renders for this room so far." }
      ]
    },
    {
      id: "bath",
      lookKey: null,
      name: "Main bath",
      captionNow: "Now: empty room, November 9, 2026.",
      photos: [
        { file: "rooms/bath.jpg", alt: "Main bath, vacant, from the hall door looking toward the pedestal sink, toilet, and shower-tub.", kind: "vacant" }
      ],
      notes: [
        { label: "Scope", text: "Bathroom planning is in the wider project. Fixture and plumbing locations stay. No concept render yet." },
        { label: "Not this room", text: "The guest bath is a different room, in the deferred guest house." }
      ]
    },
    {
      id: "exterior",
      lookKey: null,
      name: "Exterior and garage",
      captionNow: "Now: vacant photographs, November 9, 2026. No concept renders.",
      photos: [
        { file: "rooms/exterior-7256.jpg", alt: "Approach to the house from the yard.", kind: "vacant", title: "Approach to the house" },
        { file: "rooms/exterior-7261.jpg", alt: "Main house from the yard.", kind: "vacant", title: "Main house from the yard" },
        { file: "rooms/exterior-7286.jpg", alt: "House with the chimney.", kind: "vacant", title: "House with the chimney" },
        { file: "rooms/exterior-7266.jpg", alt: "Side of the house.", kind: "vacant", title: "Side of the house" },
        { file: "rooms/exterior-7291.jpg", alt: "Another side of the house.", kind: "vacant", title: "Side of the house" },
        { file: "rooms/exterior-7296.jpg", alt: "Side of the house, with a car and a shed.", kind: "vacant", title: "Side of the house, car, and shed" },
        { file: "rooms/exterior-7281.jpg", alt: "Yard and a distant outbuilding.", kind: "vacant", title: "Yard and a distant outbuilding" },
        { file: "rooms/exterior-7316.jpg", alt: "Outbuilding or garage from the yard.", kind: "vacant", title: "Outbuilding from the yard" },
        { file: "rooms/exterior-7301.jpg", alt: "Shed or outbuilding.", kind: "vacant", title: "Shed or outbuilding" },
        { file: "rooms/garage-7311.jpg", alt: "Garage interior, looking out the open door.", kind: "vacant", title: "Garage interior" },
        { file: "rooms/exterior-7251.jpg", alt: "Yard and trees.", kind: "vacant", title: "Yard and trees" },
        { file: "rooms/exterior-7306.jpg", alt: "Yard and trees, another view.", kind: "vacant", title: "Yard and trees" },
        { file: "rooms/exterior-7371.jpg", alt: "Yard and trees, another view.", kind: "vacant", title: "Yard and trees" },
        { file: "rooms/exterior-7276.jpg", alt: "Close view of the siding.", kind: "vacant", title: "Close view of the siding" },
        { file: "rooms/exterior-7326.jpg", alt: "Close view of the siding, another spot.", kind: "vacant", title: "Close view of the siding" }
      ],
      notes: [
        { label: "Scope", text: "Exterior planning covers the main house, the garage, and the guest house. These are photographs only. There are no exterior concept renders." },
        { label: "Open", text: "Garage order is not set. Siding and condition are not established as approved work." }
      ]
    },
    {
      id: "guest",
      lookKey: null,
      name: "Guest house",
      deferred: true,
      deferredNote: "The guest house is later. Photographs are here for reference and are collapsed until you open them.",
      captionNow: "Now: vacant photographs, November 9, 2026. Deferred. No concept renders.",
      photos: [
        { file: "rooms/guest-7331.jpg", alt: "Guest house living and kitchen, vacant.", kind: "vacant", title: "Living and kitchen" },
        { file: "rooms/guest-7336.jpg", alt: "Guest house living and kitchen, another angle.", kind: "vacant", title: "Living and kitchen, another angle" },
        { file: "rooms/guest-7341.jpg", alt: "Guest house living and kitchen, looking toward interior doors.", kind: "vacant", title: "Looking toward the interior doors" },
        { file: "rooms/guest-7346.jpg", alt: "Guest house bedroom, vacant, with wood walls, wood ceiling, and red carpet.", kind: "vacant", title: "Bedroom" },
        { file: "rooms/guest-7351.jpg", alt: "Guest house bedroom, another angle.", kind: "vacant", title: "Bedroom, another angle" },
        { file: "rooms/guest-7361.jpg", alt: "Guest house bedroom, looking along the red carpet.", kind: "vacant", title: "Bedroom, along the carpet" },
        { file: "rooms/guest-7366.jpg", alt: "Guest house bedroom or hall, wood walls and wood ceiling.", kind: "vacant", title: "Bedroom or hall" },
        { file: "rooms/guest-7356.jpg", alt: "Guest house bathroom, with wood walls and a water heater in the room. Not the main bath.", kind: "vacant", title: "Bathroom" }
      ],
      notes: [
        { label: "Deferred", text: "The main house comes first. These photographs are not on the main-house plan." },
        { label: "Not the main bath", text: "The bathroom photograph is the guest bath, which has a water heater in the room." }
      ]
    }
  ],
  looks: [
    {
      id: "quiet",
      group: "house",
      name: "Quiet Lake",
      kicker: "Safest for resale",
      blurb: "Warm white, sage in the office and bedrooms, pale honey oak.",
      note: "Warm white through the living room and kitchen, sage in the office and bedrooms, white ceilings, and a pale honey oak floor. The calmest of the four whole-house looks.",
      hero: "looks/s1-living.jpg",
      prefix: "s1",
      board: "looks/s1-board.jpg",
      rooms: ["living", "kitchen", "master", "bed3", "office", "laundry"],
      captions: {
        living: "Warm white walls, white ceiling, pale honey oak floor.",
        kitchen: "The same warm white, with the island’s rounded corner and cooktop kept.",
        master: "Sage on the manufactured paneling, white ceiling, pale oak over the carpet.",
        bed3: "Sage bedroom, white ceiling, the same pale oak floor.",
        office: "Sage walls, white ceiling, pale oak.",
        laundry: "A light, quiet wall. Tile and the wood ceiling stay."
      },
      swatches: [
        { id: "warm-white", name: "Warm white", hex: "#EDE3D0", column: "Walls", use: "Living room and kitchen walls, on surfaces that can be painted. In the range of Swiss Coffee, as a sample only." },
        { id: "sage", name: "Sage", hex: "#8B9A7A", column: "Rooms", use: "Office and bedrooms, on surfaces that can be painted." },
        { id: "white-ceiling", name: "White ceiling", hex: "#F7F4EE", column: "Ceiling", use: "Painted ceilings. Not the laundry’s wood plank ceiling." },
        { id: "pale-oak", name: "Pale honey oak", hex: "#D4C0A0", column: "Floor", use: "A pale biscuit or honey white-oak look for the carpeted rooms, able to continue later." }
      ]
    },
    {
      id: "northwoods",
      group: "house",
      name: "Northwoods Lake",
      kicker: "Current pick — not approved",
      blurb: "Deep olive living and kitchen, warm white bedrooms, caramel oak.",
      note: "Deep olive in the living room, kitchen, and office, warm white bedrooms, ochre in the laundry, and a caramel oak floor. Home Design’s working preference among these ideas. It is not an approval.",
      hero: "looks/s2-living.jpg",
      prefix: "s2",
      board: "looks/s2-board.jpg",
      rooms: ["living", "kitchen", "master", "bed3", "office", "laundry"],
      captions: {
        living: "Deep olive walls, white ceiling, caramel oak floor.",
        kitchen: "The same olive, with ochre and rust used sparingly.",
        master: "Warm white bedroom, caramel oak over the carpet.",
        bed3: "Warm white bedroom, the same caramel oak floor.",
        office: "Deep olive office.",
        laundry: "Ochre walls. Tile and the wood ceiling stay."
      },
      swatches: [
        { id: "olive", name: "Deep olive", hex: "#3F4A3A", column: "Walls", use: "Living room, kitchen, and office, on surfaces that can be painted. In the range of Narragansett Green, as a sample only." },
        { id: "warm-white", name: "Warm white", hex: "#F3EDE0", column: "Rooms", use: "Bedrooms, on surfaces that can be painted." },
        { id: "ochre", name: "Ochre", hex: "#C4A05A", column: "Accents", use: "Laundry walls, with rust used in small amounts." },
        { id: "caramel-oak", name: "Caramel oak", hex: "#C4965A", column: "Floor", use: "A mid-honey or caramel oak look for the carpeted rooms, able to continue later." }
      ]
    },
    {
      id: "modern",
      group: "house",
      name: "Modern Country",
      kicker: "Cream and iron",
      blurb: "Cream and oatmeal, charcoal-green office, natural oak, brass and iron.",
      note: "Cream and oatmeal through most rooms, khaki in the laundry, a charcoal-green office that may read slightly cool, a medium natural oak floor, and brass with black iron.",
      hero: "looks/s3-living.jpg",
      prefix: "s3",
      board: "looks/s3-board.jpg",
      rooms: ["living", "kitchen", "master", "bed3", "office", "laundry"],
      captions: {
        living: "Cream walls, natural oak floor, brass and black iron in small amounts.",
        kitchen: "The same oatmeal field, with darker metal on details.",
        master: "Cream bedroom, natural oak over the carpet.",
        bed3: "Cream bedroom, the same natural oak floor.",
        office: "Charcoal-green office. It may read slightly cool.",
        laundry: "Khaki walls. Tile and the wood ceiling stay."
      },
      swatches: [
        { id: "cream", name: "Cream", hex: "#E8DCC8", column: "Walls", use: "Most rooms, on surfaces that can be painted." },
        { id: "khaki", name: "Khaki", hex: "#C4B395", column: "Rooms", use: "Laundry, and as a deeper oatmeal. In the range of Universal Khaki, as a sample only." },
        { id: "charcoal-green", name: "Charcoal green", hex: "#3A4240", column: "Accents", use: "The office. This sample may read slightly cool." },
        { id: "natural-oak", name: "Natural oak", hex: "#C4A574", column: "Floor", use: "A medium natural oak look for the carpeted rooms, able to continue later." }
      ]
    },
    {
      id: "farm",
      group: "house",
      name: "Old-Farm Country",
      kicker: "Can get heavy",
      blurb: "Warm tan, barn-red island, terracotta laundry, rich brown oak.",
      note: "Warm tan through the house, a barn-red island, terracotta in the laundry, and a rich brown oak floor. Worn reds add weight. Brown on brown can feel heavy.",
      hero: "looks/s4-living.jpg",
      prefix: "s4",
      board: "looks/s4-board.jpg",
      rooms: ["living", "kitchen", "master", "bed3", "office", "laundry"],
      captions: {
        living: "Warm tan walls, rich brown oak floor.",
        kitchen: "The same tan, with a barn-red island.",
        master: "Warm tan bedroom, rich brown oak over the carpet.",
        bed3: "Warm tan bedroom, the same rich brown oak floor.",
        office: "Warm tan office.",
        laundry: "Terracotta walls. Tile and the wood ceiling stay."
      },
      swatches: [
        { id: "tan", name: "Warm tan", hex: "#C6A37A", column: "Walls", use: "Most rooms, on surfaces that can be painted. In the range of Sherwood Tan, as a sample only." },
        { id: "barn-red", name: "Barn red", hex: "#8B3A32", column: "Accents", use: "The kitchen island, and worn reds in small amounts." },
        { id: "terracotta", name: "Terracotta", hex: "#C0704A", column: "Rooms", use: "Laundry and mud room walls. In the range of Southwest Pottery, as a sample only." },
        { id: "brown-oak", name: "Rich brown oak", hex: "#8B5E3C", column: "Floor", use: "A richer brown oak look for the carpeted rooms, able to continue later." }
      ]
    },
    {
      id: "warmwhite",
      group: "study",
      name: "Warm White",
      kicker: "Room study · five rooms",
      blurb: "A warm-white pass on the living room, kitchen, primary bedroom, office, and 3rd bedroom.",
      note: "An earlier warm-white study, not a complete whole-house look. There is no laundry render in this set.",
      hero: "looks/warmwhite-living.jpg",
      prefix: "warmwhite",
      rooms: ["living", "kitchen", "master", "office", "bed3"],
      captions: {
        living: "Warm white living room, from the room-study set.",
        kitchen: "Warm white kitchen, from the same study.",
        master: "Warm white on the manufactured paneling in the primary bedroom.",
        office: "Warm white office walls.",
        bed3: "Warm white 3rd bedroom."
      },
      swatches: [
        { id: "warm-white", name: "Warm white", hex: "#F3EDE0", column: "Walls", use: "Surfaces that can be painted, in this study." },
        { id: "pale-oak", name: "Pale oak", hex: "#D4C0A0", column: "Floor", use: "A light oak look in the study renders." }
      ]
    },
    {
      id: "softsage",
      group: "study",
      name: "Soft Sage",
      kicker: "Room study · four rooms",
      blurb: "A soft-sage pass on the living room, primary bedroom, office, and 3rd bedroom.",
      note: "An earlier soft-sage study, not a complete whole-house look. There is no kitchen or laundry render in this set.",
      hero: "looks/softsage-living.jpg",
      prefix: "softsage",
      rooms: ["living", "master", "office", "bed3"],
      captions: {
        living: "Sage and white living room, from the room-study set.",
        master: "Sage on the manufactured paneling in the primary bedroom.",
        office: "Sage office walls.",
        bed3: "Sage 3rd bedroom."
      },
      swatches: [
        { id: "sage", name: "Soft sage", hex: "#8B9A7A", column: "Walls", use: "Surfaces that can be painted, in this study." },
        { id: "warm-white", name: "Warm white", hex: "#F3EDE0", column: "Rooms", use: "Lighter walls used with the sage." },
        { id: "pale-oak", name: "Pale oak", hex: "#D4C0A0", column: "Floor", use: "A light oak look in the study renders." }
      ]
    },
    {
      id: "driftwood",
      group: "study",
      name: "Driftwood",
      kicker: "Room study · two rooms",
      blurb: "Greige living room and primary bedroom. Two rooms only.",
      note: "A greige living room and primary bedroom from an earlier pass. Only these two rooms were mocked up. Not a whole-house set.",
      hero: "looks/driftwood-living.jpg",
      prefix: "driftwood",
      rooms: ["living", "master"],
      captions: {
        living: "Greige living room, from an earlier exploration.",
        master: "Greige primary bedroom, from the same exploration."
      },
      swatches: [
        { id: "greige", name: "Greige", hex: "#D5CEC3", column: "Walls", use: "A soft greige on walls that can be painted." },
        { id: "driftwood", name: "Driftwood", hex: "#B8B0A4", column: "Accents", use: "A slightly deeper greige for trim or textiles." },
        { id: "pale-oak", name: "Pale oak", hex: "#D4C0A0", column: "Floor", use: "A light oak look in the exploration renders." }
      ]
    },
    {
      id: "mossy",
      group: "study",
      name: "Mossy",
      kicker: "Room study · two rooms",
      blurb: "Mossy green living room and primary bedroom. Two rooms only.",
      note: "A mossy green living room and primary bedroom from an earlier pass. Only these two rooms were mocked up. Not a whole-house set.",
      hero: "looks/mossy-living.jpg",
      prefix: "mossy",
      rooms: ["living", "master"],
      captions: {
        living: "Mossy green living room, from an earlier exploration.",
        master: "Mossy green primary bedroom, from the same exploration."
      },
      swatches: [
        { id: "moss", name: "Moss", hex: "#6B7A55", column: "Walls", use: "A mossy green on walls that can be painted." },
        { id: "warm-white", name: "Warm white", hex: "#F3EDE0", column: "Rooms", use: "Lighter walls in the bedroom exploration." },
        { id: "oak", name: "Oak floor", hex: "#C4A574", column: "Floor", use: "A natural oak look in the exploration renders." }
      ]
    },
    {
      id: "warmwhite-study",
      group: "study",
      name: "Warm white primary",
      kicker: "Room study · one room",
      blurb: "A separate warm-white study of the primary bedroom only.",
      note: "A single-room exploration of a warm-white primary bedroom. It is not the five-room Warm White study, and it is not a whole-house look.",
      hero: "looks/warmwhite-study-master.jpg",
      prefix: "warmwhite-study",
      rooms: ["master"],
      files: { master: "looks/warmwhite-study-master.jpg" },
      captions: {
        master: "Warm white primary bedroom, from a one-room exploration."
      },
      swatches: [
        { id: "warm-white", name: "Warm white", hex: "#F3EDE0", column: "Walls", use: "Manufactured paneling in this one-room study." }
      ]
    }
  ],
  products: [
    {
      id: "floor",
      name: "Fresh Oak",
      maker: "LifeProof",
      seller: "The Home Depot",
      row: "30 mil vinyl, not laminate",
      price: "$2.99 / sq ft",
      priceExtra: "$60.10 per case (20.1 sq ft).",
      image: "product-floor.jpg",
      href: "https://www.homedepot.com/p/Lifeproof-Fresh-Oak-30-MIL-x-8-7-in-W-x-48-in-L-Click-Lock-Waterproof-Luxury-Vinyl-Plank-Flooring-20-1-sq-ft-case-I96711LP3/326107553",
      linkLabel: "Home Depot page",
      facts: [
        { label: "What it is", text: "Luxury vinyl plank, 30 mil wear layer. Not laminate. Model I96711LP3." },
        { label: "Size", text: "8.7 in wide, nominal 48 in long, 7 mm thick." },
        { label: "To resolve", text: "Climate, warranty, and the instructions for this model. The sale end date is unknown. Local stock, fit, and quantity." }
      ]
    },
    {
      id: "kivik",
      name: "KIVIK",
      maker: "IKEA",
      seller: "IKEA",
      row: "Loveseat, Tibbleby beige-gray",
      price: "$749",
      priceExtra: "",
      image: "product-kivik.jpg",
      href: "https://www.ikea.com/us/en/p/kivik-loveseat-tibbleby-beige-gray-s89440595/",
      linkLabel: "IKEA page",
      facts: [
        { label: "Cover", text: "Tibbleby beige-gray. Removable polyester cover." },
        { label: "Size", text: "74 3/4 in wide × 37 3/8 in deep × 32 5/8 in high." },
        { label: "To resolve", text: "Fit, access, and comfort." }
      ]
    },
    {
      id: "lack",
      name: "LACK",
      maker: "IKEA",
      seller: "IKEA",
      row: "Coffee table, black-brown",
      price: "$29.99",
      priceExtra: "",
      image: "product-lack.jpg",
      href: "https://www.ikea.com/us/en/p/lack-coffee-table-black-brown-40104294/",
      linkLabel: "IKEA page",
      facts: [
        { label: "Size", text: "35 3/8 in long × 21 5/8 in wide × 17 3/4 in high." },
        { label: "Construction", text: "Lightweight paper and wood-based budget construction." },
        { label: "To resolve", text: "Durability." }
      ]
    },
    {
      id: "lamp",
      name: "RÖDFLIK",
      maker: "IKEA",
      seller: "IKEA",
      row: "Floor reading lamp, gray-green",
      price: "$59.99",
      priceExtra: "",
      image: "product-lamp.jpg",
      href: "https://www.ikea.com/us/en/p/roedflik-floor-reading-lamp-gray-green-80563581/",
      linkLabel: "IKEA page",
      facts: [
        { label: "Size", text: "55 in high × 16 in wide. Base diameter 10 in." },
        { label: "Bulb", text: "E26 bulb is separate. 16 W maximum." },
        { label: "On the IKEA page", text: "A California Proposition 65 lead warning." }
      ]
    },
    {
      id: "vihals",
      name: "VIHALS",
      maker: "IKEA",
      seller: "IKEA",
      row: "Side table, white",
      price: "$39.99",
      priceExtra: "",
      image: "product-vihals.jpg",
      href: "https://www.ikea.com/us/en/p/vihals-nightstand-white-80488737/",
      linkLabel: "IKEA page",
      facts: [
        { label: "Size", text: "14 5/8 in long × 14 5/8 in wide × 22 7/8 in high." },
        { label: "Construction", text: "Painted particleboard, with casters." },
        { label: "To resolve", text: "No locking-caster promise. Confirm the casters are acceptable." }
      ]
    },
    {
      id: "bed",
      name: "SLATTUM",
      maker: "IKEA",
      seller: "IKEA",
      row: "Upholstered bed, Vissle dark gray, Full",
      price: "$129",
      priceExtra: "",
      image: "product-bed.jpg",
      href: "https://www.ikea.com/us/en/p/slattum-upholstered-bed-frame-vissle-dark-gray-40571253/",
      linkLabel: "IKEA page",
      facts: [
        { label: "Size", text: "77 1/8 in long × 54 3/4 in wide. Headboard 33 1/2 in high." },
        { label: "Included", text: "Slats and midbeam. Mattress and linens are separate. The cover is fixed and not washable." },
        { label: "To resolve", text: "Reported wobble, slat, and support concerns. A cautious staging candidate." }
      ]
    },
    {
      id: "dining",
      name: "LISABO",
      maker: "IKEA",
      seller: "IKEA",
      row: "Table and 2 chairs, black",
      price: "$359.99",
      priceExtra: "Conditional IKEA Family price $319.99, November 5–24, 2026, or while supplies last. Eligibility and local stock were not verified.",
      image: "product-dining.jpg",
      href: "https://www.ikea.com/us/en/p/lisabo-lisabo-table-and-2-chairs-black-black-s49545090/",
      linkLabel: "IKEA page",
      facts: [
        { label: "Table", text: "34 5/8 in long × 30 3/4 in wide × 29 1/8 in high." },
        { label: "Each chair", text: "18 1/8 in wide × 20 1/8 in deep × 31 1/2 in high." },
        { label: "To resolve", text: "Eligibility for the Family price, local stock, and whether the set fits the measured dining space." }
      ]
    },
    {
      id: "rug",
      name: "TIPHEDE",
      maker: "IKEA",
      seller: "IKEA",
      row: "Flatwoven rug, natural-black",
      price: "$39.99",
      priceExtra: "",
      image: "product-rug.jpg",
      href: "https://www.ikea.com/us/en/p/tiphede-rug-flatwoven-natural-black-40559166/",
      linkLabel: "IKEA page",
      facts: [
        { label: "Size", text: "7 ft 3 in × 9 ft 2 in. Article 405.591.66. Cotton flatweave." },
        { label: "Support", text: "Anti-slip support is extra." },
        { label: "To resolve", text: "Care wording for this large size conflicts on the source page. Do not assume it is machine washable." }
      ]
    }
  ],
  planPage: {
    decided: [
      "The house is in Howell, Michigan.",
      "The main house comes first. The guest house is later. Garage order is not set.",
      "Existing architecture stays. Natural knotty pine and real wood stay unpainted. Manufactured bedroom paneling may be painted.",
      "The laundry’s tile floor and unpainted wood plank ceiling stay.",
      "Bathroom planning is in scope. Fixture and plumbing locations stay. The main-bath photograph is the vacant hall-door view from November 9, 2026. The guest bath is a different room, in the deferred guest house.",
      "Exteriors of the main house, the garage, and the guest house are in the wider scope. Vacant exterior and garage photographs are in Exterior and garage. There are no exterior concept renders.",
      "Blue is out of the running."
    ],
    open: [
      "The nine whole-house looks, and the room studies. None is approved.",
      "Brands and materials. LifeProof Fresh Oak is one flooring candidate, not a required brand.",
      "Floor options on each whole-house look. None is approved. Renders cover the living room and primary bedroom only, and costs are planning estimates.",
      "Every candidate listed under Candidates. None is an order.",
      "Budget, measured floor plan, and spending. Rough budget ideas now sit under Plan; they are not quotes, and nothing is approved.",
      "Paint only where a surface proves eligible.",
      "Compact seating, compact dining, and clearances. They are not measured."
    ],
    photographs: "Room views labeled Now are vacant photographs from November 9, 2026. Earlier furnished photographs are kept in a separate Earlier set under each matching room. The Photo map places a main-house photograph on the CubiCasa floor plan only when a tour frame matches that view. Photographs without a matching tour frame are listed as not on the tour map, with their room only, and no camera spot or direction is inferred. Look images are concept renders of vacant photographs. They are not construction-accurate and they do not promise a manufacturer color or product. Exterior, garage, and guest-house photographs are not placed on the interior plan. The guest house is deferred.",
    activity: [
      { date: "November 10, 2026", text: "Each whole-house look now has three floor options, with a toggle on the look page. New floor renders were made for the living room and the primary bedroom only. Costs are rough per-square-foot planning figures, not quotes." },

      { date: "November 10, 2026", text: "Budget ideas were added under Plan, with sample palettes, rough cost tiers, and source links. No third-party images were copied into the site." },
      { date: "November 10, 2026", text: "Five more whole-house looks were added: Moody Lodge, Mid-Century Cabin, Scandi Cabin, English Cottage, and Black and Wood Modern." },
      { date: "November 10, 2026", text: "The view was reorganized around Looks, Rooms, Map, and Plan. Exterior and garage photographs were added. The guest house is listed as deferred. Room studies were added beside the four whole-house looks. Hide and archive remain, in edit mode only." },
      { date: "November 10, 2026", text: "The Photo map was rebuilt from the CubiCasa tour frames. Pins sit on the tour markers and arrows follow the tour cones. Photographs without a matching tour frame are listed as not on the tour map, without inferred spots." },
      { date: "November 10, 2026", text: "A Photo Map was added from the CubiCasa floor plan. Each placed vacant and earlier main-house photograph has a room, a camera spot, and a viewing direction. Room sizes on the map are approximate CubiCasa scan figures in feet." },
      { date: "November 9, 2026", text: "This view was updated with the vacant main-house photographs and four whole-house looks, plus earlier explorations." },
      { date: "November 8, 2026", text: "Public prices for the eight shortlist candidates were rechecked on the retailer pages. Figures are before tax, delivery, and installation. Local stock was not confirmed." }
    ]
  },
  plan: {
    file: "plan/main-house-plan.png",
    width: 759,
    height: 872,
    sizeNote: "Approximate CubiCasa scan figures in feet. Confirm with a tape before ordering.",
    sizes: [
      { id: "laundry", label: "Laundry / mud room", size: "11′ × 9′" },
      { id: "kitchen", label: "Kitchen", size: "11½′ × 12½′" },
      { id: "office", label: "Office", size: "7½′ × 12′" },
      { id: "dining", label: "Dining area", size: "11½′ × 9½′" },
      { id: "living", label: "Living room", size: "19½′ × 13′" },
      { id: "master", label: "Primary bedroom", size: "11′ × 10½′" }
    ]
  },
  photoMap: [
    { id: "v7376", number: 1, source: "E55A7376.jpg", set: "vacant", file: "rooms/laundry.jpg", roomId: "laundry", room: "Laundry / mud room", x: 115, y: 283, heading: 327, method: "tour", confidence: "high", tour: 1, photoIndex: 1, taken: "Toward the window wall and the pressure tank, from the kitchen-door side of the laundry.", direction: "Toward the window wall and the pressure tank, from the kitchen-door side of the laundry.", shows: "Wood plank ceiling and skylight, tall cabinets, washer and dryer, pressure tank, furnace, and the window at the far wall. The kitchen door is on the left." },
    { id: "v7381", number: 2, source: "E55A7381.jpg", set: "vacant", file: "rooms/laundry-7381.jpg", roomId: "laundry", room: "Laundry / mud room", x: 27, y: 277, heading: 52, method: "tour", confidence: "high", tour: 2, photoIndex: 2, taken: "Toward the window, the pressure tank, and the furnace, from the far side of the laundry.", direction: "Toward the window, the pressure tank, and the furnace, from the far side of the laundry.", shows: "The same utility, closer to the far wall: window, washer, upper cabinets, pressure tank, a scale, and the furnace." },
    { id: "v7386", number: 3, source: "E55A7386.jpg", set: "vacant", file: "rooms/kitchen-7386.jpg", roomId: "kitchen", room: "Kitchen", x: 135, y: 365, heading: 211, method: "tour", confidence: "high", tour: 3, photoIndex: 2, taken: "Toward the sink wall and along the length of the kitchen, from the end near the laundry door.", direction: "Toward the sink wall and along the length of the kitchen, from the end near the laundry door.", shows: "Cooktop at the near left, refrigerator, sink under the window, dishwasher, and white cabinets." },
    { id: "v7396", number: 4, source: "E55A7396.jpg", set: "vacant", file: "rooms/office.jpg", roomId: "office", room: "Office", x: 223, y: 587, heading: 227, method: "tour", confidence: "high", tour: 4, photoIndex: 1, taken: "Toward the two windows, from the office doorway.", direction: "Toward the two windows, from the office doorway.", shows: "Mint walls, wood floor, the large window ahead, and a second window on the right. Portrait photograph." },
    { id: "v7401", number: 5, source: "E55A7401.jpg", set: "vacant", file: "rooms/office-7401.jpg", roomId: "office", room: "Office", x: 27, y: 694, heading: 58, method: "tour", confidence: "high", tour: 5, photoIndex: 2, taken: "Toward the closets and the doorway, from the far corner of the office.", direction: "Toward the closets and the doorway, from the far corner of the office.", shows: "Sliding closet doors, built-in wardrobe, mint walls, a window on the right, and the door ahead." },
    { id: "v7411", number: 6, source: "E55A7411.jpg", set: "vacant", file: "rooms/foyer.jpg", roomId: "foyer", room: "Foyer", x: 358, y: 555, heading: 164, method: "tour", confidence: "high", tour: 6, photoIndex: 1, taken: "Toward the front door, from the dining opening into the foyer.", direction: "Toward the front door, from the dining opening into the foyer.", shows: "Front door with the oval window, a glass sidelight, tile floor, and a window on the left wall." },
    { id: "v7431", number: 7, source: "E55A7431.jpg", set: "vacant", file: "rooms/living.jpg", roomId: "living", room: "Living room", x: 654, y: 359, heading: 233, method: "tour", confidence: "high", tour: 7, photoIndex: 1, taken: "Toward the kitchen, with the large window on the left, from the fireplace end of the living room.", direction: "Toward the kitchen, with the large window on the left, from the fireplace end of the living room.", shows: "White plank ceiling, beam, ceiling fan, wood floor, the large window on the left, a doorway, and the kitchen ahead." },
    { id: "v7436", number: 8, source: "E55A7436.jpg", set: "vacant", file: "rooms/master.jpg", roomId: "master", room: "Primary bedroom", x: 518, y: 288, heading: 44, method: "tour", confidence: "high", tour: 8, photoIndex: 1, taken: "Toward the two windows, from the primary bedroom doorway.", direction: "Toward the two windows, from the primary bedroom doorway.", shows: "Manufactured vertical paneling, green carpet, a window ahead, and a window on the right." },
    { id: "v7441", number: 9, source: "E55A7441.jpg", set: "vacant", file: "rooms/bed3.jpg", roomId: "bed3", room: "3rd bedroom", x: 431, y: 299, heading: 312, method: "tour", confidence: "high", tour: 9, photoIndex: 1, taken: "Into the 3rd bedroom, toward the left wall and the window, from the doorway.", direction: "Into the 3rd bedroom, toward the left wall and the window, from the doorway.", shows: "Manufactured vertical paneling, worn pale carpet, a white tile ceiling, and a window on the right. The CubiCasa tour labeled this frame Exterior." },
    { id: "v7446", number: 10, source: "E55A7446.jpg", set: "vacant", file: "rooms/bath.jpg", roomId: "bath", room: "Main bath", x: 240, y: 257, heading: 326, method: "tour", confidence: "high", tour: 10, photoIndex: 1, taken: "Into the main bath, from the hall at the bathroom door.", direction: "Into the main bath, from the hall at the bathroom door.", shows: "Pedestal sink, toilet, and shower-tub. The CubiCasa tour labeled this frame Exterior. This is the main bath, not the guest bath." },
    { id: "v7456", number: 11, source: "E55A7456.jpg", set: "vacant", file: "rooms/kitchen-7456.jpg", roomId: "kitchen", room: "Kitchen", x: 353, y: 499, heading: 312, method: "tour", confidence: "high", tour: 11, photoIndex: 4, taken: "Toward the kitchen peninsula and cooktop, from the dining area.", direction: "Toward the kitchen peninsula and cooktop, from the dining area.", shows: "The back of the peninsula and cooktop, the kitchen sink ahead, and the hall with the main bath visible on the right. The CubiCasa tour labeled this frame Dining Area." },
    { id: "e05", number: 3, source: "05.jpg", set: "earlier", file: "earlier/kitchen-05.jpg", roomId: "kitchen", room: "Kitchen", x: 135, y: 365, heading: 211, method: "same-spot", sameSpotAs: 3, confidence: "high", tour: 3, photoIndex: 1, taken: "Toward the sink wall and along the length of the kitchen, from the end near the laundry door. Same spot as tour photograph 3.", direction: "Toward the sink wall and along the length of the kitchen, from the end near the laundry door. Same spot as tour photograph 3.", shows: "Earlier furnished kitchen: cooktop and island on the left, sink under the window, and belongings on the counters." },
    { id: "e02", number: 8, source: "02.jpg", set: "earlier", file: "earlier/master-02.jpg", roomId: "master", room: "Primary bedroom", x: 518, y: 288, heading: 44, method: "same-spot", sameSpotAs: 8, confidence: "high", tour: 8, photoIndex: 1, taken: "Toward the two windows, from the primary bedroom doorway. Same spot as tour photograph 8.", direction: "Toward the two windows, from the primary bedroom doorway. Same spot as tour photograph 8.", shows: "Earlier view with belongings still in the room: green carpet, manufactured paneling, white tile ceiling, and both windows." },
    { id: "e01", number: 9, source: "01.jpg", set: "earlier", file: "earlier/bed3-01.jpg", roomId: "bed3", room: "3rd bedroom", x: 431, y: 299, heading: 312, method: "same-spot", sameSpotAs: 9, confidence: "high", tour: 9, photoIndex: 1, taken: "Into the 3rd bedroom, toward the left wall and the window, from the doorway. Same spot as tour photograph 9.", direction: "Into the 3rd bedroom, toward the left wall and the window, from the doorway. Same spot as tour photograph 9.", shows: "Earlier furnished view of the same room: white tile ceiling, wood paneling, a window, a patterned rug, and belongings still in the room." }
  ],
  photoMapUnpinned: [
    { id: "v7391", source: "E55A7391.jpg", set: "vacant", file: "rooms/kitchen-7391.jpg", roomId: "kitchen", room: "Kitchen", method: "unpinned", photoIndex: 3, reason: "Not on the tour map. The photograph looks toward the living room past the island, with the fireplace ahead. No selected tour frame shows this view.", shows: "Fireplace ahead, open living room, island and cooktop in the right foreground, refrigerator, and the office door." },
    { id: "v7451", source: "E55A7451.jpg", set: "vacant", file: "rooms/kitchen.jpg", roomId: "kitchen", room: "Kitchen", method: "unpinned", photoIndex: 1, reason: "Not on the tour map. The photograph looks toward the island, cooktop, and sink wall, with the office door open on the left. This is not the same crop as tour photograph 11.", shows: "Island with the cooktop, sink under the window, dishwasher, refrigerator, and the office door open on the left." },
    { id: "e03", source: "03.jpg", set: "earlier", file: "earlier/living-03.jpg", roomId: "living", room: "Living room", method: "unpinned", photoIndex: 1, reason: "Not on the tour map. Earlier furnished living room looking toward the window wall and the sofa. This is not the same view as tour photograph 7.", shows: "Earlier furnished living room: sofa under the large window, a side window on the left, the ceiling beam, and belongings still in the room." },
    { id: "e04", source: "04.jpg", set: "earlier", file: "earlier/living-04.jpg", roomId: "living", room: "Living room", method: "unpinned", photoIndex: 2, reason: "Not on the tour map. Earlier furnished living room looking toward the fireplace, with the large windows on the right. No selected tour frame shows this view.", shows: "Earlier furnished living room: fireplace on the left, windows on the right, sofa facing the fireplace, ceiling fan, and belongings still in the room." },
    { id: "e06", source: "06.jpg", set: "earlier", file: "earlier/kitchen-06.jpg", roomId: "kitchen", room: "Kitchen", method: "unpinned", photoIndex: 2, reason: "Not on the tour map. Earlier furnished view looking toward the kitchen from behind a dining table. The camera is farther from the peninsula than tour photograph 11.", shows: "Earlier furnished view: dining table in the foreground, island and stools, a person at the sink, and the hall door on the right." }
  ]
};

HOUSE.lookFile = function (look, roomKey) {
  if (!look || !roomKey) return "";
  if (look.files && look.files[roomKey]) return look.files[roomKey];
  return "looks/" + look.prefix + "-" + roomKey + ".jpg";
};

HOUSE.looksForRoom = function (roomKey) {
  return (HOUSE.looks || []).filter(function (look) {
    return look.rooms && look.rooms.indexOf(roomKey) !== -1;
  });
};

HOUSE.roomCountLabel = function (look) {
  var n = look && look.rooms ? look.rooms.length : 0;
  if (n === 1) return "One room";
  if (n === 6) return "Six rooms";
  var words = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  return (words[n] || String(n)) + " rooms";
};

/* Merge extra looks by id. Used by js/extra-looks.js so a later job can add s5–s9
   without editing this file. later looks with the same id replace earlier ones. */
HOUSE.addLooks = function (list) {
  if (!Array.isArray(list) || !list.length) return;
  if (!HOUSE.looks) HOUSE.looks = [];
  list.forEach(function (look) {
    if (!look || !look.id) return;
    var i;
    for (i = 0; i < HOUSE.looks.length; i++) {
      if (HOUSE.looks[i].id === look.id) {
        HOUSE.looks[i] = look;
        return;
      }
    }
    HOUSE.looks.push(look);
    if (look.group && HOUSE.lookGroups) {
      var found = false;
      for (i = 0; i < HOUSE.lookGroups.length; i++) {
        if (HOUSE.lookGroups[i].id === look.group) found = true;
      }
      if (!found) {
        HOUSE.lookGroups.splice(Math.max(0, HOUSE.lookGroups.length - 1), 0, {
          id: look.group,
          label: look.groupLabel || "More looks",
          note: look.groupNote || ""
        });
      }
    }
  });
};

HOUSE.applyExtraLooksFile = function (data) {
  if (!data) return;
  if (Array.isArray(data)) {
    HOUSE.addLooks(data);
    return;
  }
  if (data.groups && Array.isArray(data.groups)) {
    data.groups.forEach(function (group) {
      var found = false;
      (HOUSE.lookGroups || []).forEach(function (item) { if (item.id === group.id) found = true; });
      if (!found) {
        if (!HOUSE.lookGroups) HOUSE.lookGroups = [];
        var studiesAt = HOUSE.lookGroups.length;
        HOUSE.lookGroups.forEach(function (item, i) { if (item.id === "study") studiesAt = i; });
        HOUSE.lookGroups.splice(studiesAt, 0, group);
      }
    });
  }
  if (Array.isArray(data.looks)) HOUSE.addLooks(data.looks);
};

HOUSE.nowPhotoForLook = function (look, roomKey) {
  var room = null;
  (HOUSE.rooms || []).forEach(function (item) {
    if (item.lookKey === roomKey) room = item;
  });
  var file = null;
  if (look && look.nowFiles && look.nowFiles[roomKey]) file = look.nowFiles[roomKey];
  else if (roomKey === "office" && look && look.prefix && /^s[1-9]$/.test(look.prefix)) {
    file = "rooms/office-7401.jpg";
  }
  if (file && room && room.photos) {
    var i;
    for (i = 0; i < room.photos.length; i++) {
      if (room.photos[i].file === file) return room.photos[i];
    }
    return { file: file, alt: (room.name || "Office") + ", vacant photograph used for this concept.", kind: "vacant" };
  }
  if (!room || !room.photos) return null;
  for (i = 0; i < room.photos.length; i++) {
    if (room.photos[i].kind !== "earlier") return room.photos[i];
  }
  return room.photos[0] || null;
};

