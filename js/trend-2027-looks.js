/* 2027 trend palettes (color-only looks), added November 18, 2026 from the Interior Design Researcher's trend research.
 * No renders or products: those are built from real sourced products only if a look is chosen. */
(function () {
  if (typeof HOUSE === "undefined" || typeof HOUSE.applyExtraLooksFile !== "function") return;
  HOUSE.applyExtraLooksFile({ looks: [
  {
    "id": "tr-moss-clay",
    "group": "house",
    "name": "Moss and Clay",
    "kicker": "2027 trend \u00b7 best with the knotty pine",
    "blurb": "Behr's 2027 olive in the office, a lighter sage on the living and kitchen walls, warm white bedrooms and ceilings, terracotta-clay accents, medium-brown oak.",
    "note": "Color-only look from the November 18, 2026 trend research. Grounded is very dark (LRV about 9 to 11), so it goes in the office and at most one living-room accent wall, not every wall next to the pine. Environmental, from the same Behr 2027 palette, carries the main living walls. No renders or product set yet; those get built from real sourced products only if this look is chosen. Unpainted wood stays unpainted.",
    "hero": "looks/tr-moss-clay-board.jpg",
    "prefix": "tr-moss-clay",
    "board": "looks/tr-moss-clay-board.jpg",
    "rooms": [],
    "nowFiles": {},
    "captions": {},
    "swatches": [
      {
        "id": "grounded",
        "name": "Grounded",
        "hex": "#565344",
        "column": "Accent",
        "use": "Office walls and at most one living accent wall. Behr Grounded T27-01, 2027 Color of the Year; hex from behr.com, checked Nov 18, 2026."
      },
      {
        "id": "environmental",
        "name": "Environmental",
        "hex": "#B1B5A0",
        "column": "Walls",
        "use": "Living room and kitchen walls. Behr Environmental PPU11-09, from Behr's 2027 trend palette."
      },
      {
        "id": "coastal-beige",
        "name": "Coastal Beige",
        "hex": "#F0EBD9",
        "column": "Rooms",
        "use": "Bedrooms and painted ceilings (not the laundry's wood ceiling). Behr Coastal Beige PPU7-13."
      },
      {
        "id": "tuscan-terra",
        "name": "Tuscan Terra",
        "hex": "#784D40",
        "column": "Accent",
        "use": "Clay accent for a door, pottery or textiles. Behr Tuscan Terra T27-02."
      }
    ]
  },
  {
    "id": "tr-smoky-blue",
    "group": "house",
    "name": "Smoky Blue Cottage",
    "kicker": "2027 trend \u00b7 softest",
    "blurb": "Valspar's 2027 blue-gray on the main walls, warm greige elsewhere, a blush accent, light wood floors.",
    "note": "Color-only look from the November 18, 2026 trend research. Cottage Door is a mid-tone (LRV 26), so it reads calm rather than dark. The blush is an accent, not a whole room. Blue next to orange-toned knotty pine is a strong contrast; sample it beside the pine first. No renders or product set yet.",
    "hero": "looks/tr-smoky-blue-board.jpg",
    "prefix": "tr-smoky-blue",
    "board": "looks/tr-smoky-blue-board.jpg",
    "rooms": [],
    "nowFiles": {},
    "captions": {},
    "swatches": [
      {
        "id": "cottage-door",
        "name": "Cottage Door",
        "hex": "#7A8F97",
        "column": "Walls",
        "use": "Living room and office walls. Valspar Cottage Door 8004-38E, 2027 Color of the Year; hex from valspar.com, checked Nov 18, 2026."
      },
      {
        "id": "moon-shot",
        "name": "Moon Shot",
        "hex": "#D4CFC7",
        "column": "Rooms",
        "use": "Bedrooms, halls and ceilings. Valspar Moon Shot 8005-2B."
      },
      {
        "id": "apricot-blush",
        "name": "Apricot Blush",
        "hex": "#F0D4CA",
        "column": "Accent",
        "use": "One accent wall or the front door. Valspar Apricot Blush 8003-8A."
      }
    ]
  },
  {
    "id": "tr-rewild",
    "group": "house",
    "name": "Rewild Cabin",
    "kicker": "2027 trend \u00b7 warmest",
    "blurb": "Warm khaki walls, barn red or bitter chocolate on doors and built-ins, white ceilings, rich brown floors.",
    "note": "Color-only look from the November 18, 2026 trend research. The dark browns go on doors, built-ins or one accent wall only, never on walls touching the knotty pine, where they would muddy together. No renders or product set yet.",
    "hero": "looks/tr-rewild-board.jpg",
    "prefix": "tr-rewild",
    "board": "looks/tr-rewild-board.jpg",
    "rooms": [],
    "nowFiles": {},
    "captions": {},
    "swatches": [
      {
        "id": "universal-khaki",
        "name": "Universal Khaki",
        "hex": "#B8A992",
        "column": "Walls",
        "use": "Main walls. Sherwin-Williams Universal Khaki SW 6150; hex from Sherwin-Williams data, checked Nov 18, 2026."
      },
      {
        "id": "red-barn",
        "name": "Red Barn",
        "hex": "#7C453D",
        "column": "Accent",
        "use": "Interior doors or one accent wall away from the pine. Sherwin-Williams Red Barn SW 7591."
      },
      {
        "id": "bitter-chocolate",
        "name": "Bitter Chocolate",
        "hex": "#4D3C3C",
        "column": "Accent",
        "use": "Built-ins or a door. Sherwin-Williams Bitter Chocolate SW 6013."
      },
      {
        "id": "alabaster",
        "name": "Alabaster",
        "hex": "#EDEAE0",
        "column": "Ceiling",
        "use": "Painted ceilings and painted trim only. Sherwin-Williams Alabaster SW 7008."
      }
    ]
  }
] });
})();
