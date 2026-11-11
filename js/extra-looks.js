/* Extra whole-house looks s5–s9.
 * Compiled from vacant-2026-11-09/looks/themes-s5-s9.json on November 10, 2026.
 * Loaded locally as a classic script. It does not fetch anything.
 *
 * How to add later looks
 * ----------------------
 * 1. Put display copies in assets/looks/ as prefix-room.jpg
 *    (living, kitchen, master, bed3, office, laundry) and prefix-board.jpg.
 *    Do not include rejected files, and do not invent a missing room.
 * 2. Append another HOUSE.addLooks([...]) call in this file, using the same
 *    shape as the looks below. Optional fields: files, nowFiles, board, trends.
 *    nowFiles.office should be "rooms/office-7401.jpg" when the render uses
 *    the closet view (E55A7401), which s1–s9 all do.
 *
 * Room keys: living, kitchen, master (Primary bedroom), bed3, office, laundry.
 */
(function () {
  if (typeof HOUSE === "undefined" || typeof HOUSE.applyExtraLooksFile !== "function") return;
  HOUSE.applyExtraLooksFile({
  "looks": [
    {
      "id": "moody-lodge",
      "group": "house",
      "name": "Moody Lodge",
      "kicker": "Most dramatic",
      "blurb": "Near-black olive living and kitchen, espresso office, deep olive master, greige-cream 3rd bedroom, walnut-look bedroom floors, aged brass.",
      "note": "The most dramatic of these five. Dark walls stay off the ceiling and off real wood. The 3rd bedroom is kept light so the house can breathe. Existing hard floors stay.",
      "hero": "looks/s5-living.jpg",
      "prefix": "s5",
      "board": "looks/s5-board.jpg",
      "rooms": [
        "living",
        "kitchen",
        "master",
        "bed3",
        "office",
        "laundry"
      ],
      "captions": {
        "living": "Near-black olive walls, white ceiling, existing hardwood kept.",
        "kitchen": "The same olive on the walls and island, cream cabinets, aged brass, cooktop and rounded island corner kept.",
        "master": "Deep olive on the manufactured paneling, white ceiling, walnut-look plank over the carpet.",
        "bed3": "Warm greige-cream bedroom, the same walnut-look floor.",
        "office": "Espresso walls. Wood closets and wardrobe stay unpainted.",
        "laundry": "Leather-brown walls. Tile and the wood ceiling stay."
      },
      "swatches": [
        {
          "id": "greenblack",
          "name": "Near-black olive",
          "hex": "#2A3328",
          "column": "Walls",
          "use": "Living room and kitchen walls, and the kitchen island, on surfaces that can be painted. In the range of a shutter green or greenblack, as a sample only."
        },
        {
          "id": "espresso",
          "name": "Espresso",
          "hex": "#3F3730",
          "column": "Rooms",
          "use": "The office, on surfaces that can be painted. In the range of Benjamin Moore Silhouette AF-655, as a sample only."
        },
        {
          "id": "deep-olive",
          "name": "Deep olive",
          "hex": "#3C4634",
          "column": "Rooms",
          "use": "Master bedroom manufactured paneling. In the range of a grounded olive, as a sample only."
        },
        {
          "id": "walnut-oak",
          "name": "Walnut-look oak",
          "hex": "#A67B52",
          "column": "Floor",
          "use": "A medium walnut oak look for the carpeted rooms, able to continue later."
        }
      ],
      "nowFiles": {
        "office": "rooms/office-7401.jpg"
      },
      "trends": {
        "budget": "Paint is the main spend: dark olive in the living room and kitchen, espresso in the office, a slightly lighter olive in the master. Swap the two carpets for a mid-tone vinyl plank. Add aged-brass-look knobs and a faucet from a big-box or IKEA aisle, and later a thrifted leather chair or rust throw. Do not recast the existing hardwood until a later, measured decision.",
        "interpretation": "Moody Lodge uses the near-black olive and espresso those sources actually describe, keeps ceilings white per Bill’s preference, and uses a light 3rd bedroom so the dark rooms have somewhere to contrast.",
        "sources": [
          {
            "id": "homes-gardens-dark-2026",
            "title": "Will Dark Paint Colors Still Be Trendy in 2026?",
            "url": "https://www.homesandgardens.com/interior-design/will-dark-colors-still-be-on-trend-in-2026",
            "date": "December 27, 2025"
          },
          {
            "id": "apartment-therapy-2026",
            "title": "10 Home Trends Designers Say Are Still In for 2026",
            "url": "https://www.apartmenttherapy.com/home-trends-still-in-for-2026-37686257",
            "date": "August 5, 2026"
          },
          {
            "id": "bm-coty-2026",
            "title": "Benjamin Moore Announces Silhouette AF-655 as its Color of the Year 2026",
            "url": "https://www.benjaminmoore.com/en-us/press/benjamin-moore-announces-color-of-the-year-2026",
            "date": "October 16, 2025"
          },
          {
            "id": "behr-coty-2027",
            "title": "Behr Paint Company Announces 2027 Color of the Year: Grounded",
            "url": "https://corporate.behr.com/news/behr-paint-company-announces-2027-color-of-the-year-grounded",
            "date": "August 26, 2026"
          }
        ]
      }
    },
    {
      "id": "mid-century-cabin",
      "group": "house",
      "name": "Mid-Century Cabin",
      "kicker": "Khaki, mustard, rust",
      "blurb": "Warm khaki living and kitchen, mustard island, rust office, cream bedrooms, walnut-look bedroom floors, brass.",
      "note": "Walnut and mustard give it a mid-century tone without changing the architecture. The rust office is the dramatic room. Existing hard floors stay.",
      "hero": "looks/s6-living.jpg",
      "prefix": "s6",
      "board": "looks/s6-board.jpg",
      "rooms": [
        "living",
        "kitchen",
        "master",
        "bed3",
        "office",
        "laundry"
      ],
      "captions": {
        "living": "Warm khaki walls, white ceiling, existing hardwood kept.",
        "kitchen": "The same khaki, a mustard island, cream cabinets, brass, cooktop and rounded island corner kept.",
        "master": "Warm cream on the manufactured paneling, walnut-look plank over the carpet.",
        "bed3": "Warm cream bedroom, the same walnut-look floor.",
        "office": "Rust walls. Wood closets and wardrobe stay unpainted.",
        "laundry": "Mustard-ochre walls. Tile and the wood ceiling stay."
      },
      "swatches": [
        {
          "id": "khaki",
          "name": "Warm khaki",
          "hex": "#C8B48A",
          "column": "Walls",
          "use": "Living room and kitchen walls, on surfaces that can be painted. In the range of Sherwin-Williams Universal Khaki SW 6150, as a sample only."
        },
        {
          "id": "mustard",
          "name": "Mustard",
          "hex": "#C4A03A",
          "column": "Accents",
          "use": "The kitchen island, and the laundry walls in a closely related ochre."
        },
        {
          "id": "rust",
          "name": "Rust",
          "hex": "#B85C38",
          "column": "Rooms",
          "use": "The office, on surfaces that can be painted."
        },
        {
          "id": "dark-walnut",
          "name": "Walnut-look oak",
          "hex": "#8B5A2B",
          "column": "Floor",
          "use": "A darker walnut oak look for the carpeted rooms, able to continue later."
        }
      ],
      "nowFiles": {
        "office": "rooms/office-7401.jpg"
      },
      "trends": {
        "budget": "Paint the main rooms khaki, the island mustard, and the office rust. Use brass-look knobs and a faucet from Target, IKEA, or a hardware aisle. Put a walnut-look vinyl in the two carpeted bedrooms. Later, add one or two walnut-toned or tapered-leg pieces from a thrift store rather than a matched mid-century suite.",
        "interpretation": "Khaki as the field color is taken from the Sherwin-Williams 2026 COTY. Mustard, rust, and a walnut-look bedroom floor are this look’s mid-century reading of Houzz’s warm woods and earthy colors, not a claim that those sources specified this exact scheme.",
        "sources": [
          {
            "id": "sw-coty-2026",
            "title": "Color of the Year 2026, Universal Khaki SW 6150",
            "url": "https://www.sherwin-williams.com/en-us/color/color-of-the-year/2026",
            "date": "2025 announcement for the 2026 year"
          },
          {
            "id": "houzz-fall-2026",
            "title": "2026 U.S. Houzz Fall Design Trends Report",
            "url": "https://www.houzz.com/magazine/2026-u-s-houzz-fall-design-trends-report-stsetivw-vs~185743042",
            "date": "September 2, 2026"
          },
          {
            "id": "house-beautiful-dirty-neutrals",
            "title": "Designers Say “Dirty Neutrals” Are Replacing Plain White Walls",
            "url": "https://www.housebeautiful.com/design-inspiration/a73376576/dirty-neutrals-paint-trend/",
            "date": "August 7, 2026"
          },
          {
            "id": "pinterest-predicts-2026",
            "title": "Pinterest Predicts: Nonconformity, self-preservation, and escapism drive 21 trends for 2026",
            "url": "https://newsroom.pinterest.com/en-gb/news/pinterest-predicts-nonconformity-self-preservation-and-escapism-drive-21-trends-for-2026/",
            "date": "December 9, 2025"
          }
        ]
      }
    },
    {
      "id": "scandi-cabin",
      "group": "house",
      "name": "Scandi Cabin",
      "kicker": "Calmest of the five",
      "blurb": "Soft warm white, pale oak in the carpeted bedrooms, matte black hardware, a pale oatmeal office.",
      "note": "The calm contrast to Moody Lodge. Black shows up only as hardware and small fixtures. Existing hard floors stay. White ceilings throughout the painted rooms.",
      "hero": "looks/s7-living.jpg",
      "prefix": "s7",
      "board": "looks/s7-board.jpg",
      "rooms": [
        "living",
        "kitchen",
        "master",
        "bed3",
        "office",
        "laundry"
      ],
      "captions": {
        "living": "Soft warm white walls, white ceiling, existing hardwood kept.",
        "kitchen": "The same warm white, pale counters, matte black hardware, cooktop and rounded island corner kept.",
        "master": "Soft warm white on the manufactured paneling, pale oak over the carpet.",
        "bed3": "The same soft white bedroom, the same pale oak floor.",
        "office": "Pale oatmeal walls. Wood closets and wardrobe stay unpainted.",
        "laundry": "Soft greige walls. Tile and the wood ceiling stay."
      },
      "swatches": [
        {
          "id": "soft-white",
          "name": "Soft warm white",
          "hex": "#F7F1E6",
          "column": "Walls",
          "use": "Most rooms, on surfaces that can be painted."
        },
        {
          "id": "oatmeal",
          "name": "Pale oatmeal",
          "hex": "#E8DFD0",
          "column": "Rooms",
          "use": "The office, on surfaces that can be painted."
        },
        {
          "id": "greige",
          "name": "Soft greige",
          "hex": "#D5CEC3",
          "column": "Rooms",
          "use": "Laundry walls."
        },
        {
          "id": "pale-oak",
          "name": "Pale white oak",
          "hex": "#D9C5A8",
          "column": "Floor",
          "use": "A pale biscuit or white-oak look for the carpeted rooms, able to continue later."
        }
      ],
      "nowFiles": {
        "office": "rooms/office-7401.jpg"
      },
      "trends": {
        "budget": "A few gallons of warm white, pale vinyl plank in the two carpeted bedrooms, and matte-black IKEA or big-box hardware and a matching faucet do most of the work. Keep furnishings sparse. Linen-look bedding and one pale wood or black lamp from Target or IKEA are enough later staging.",
        "interpretation": "Scandi Cabin is the restrained, light end of the same warm-materials story, with black used only as hardware. It is an interpretation, not a named 2026 ‘Scandi Cabin’ trend in these sources.",
        "sources": [
          {
            "id": "houzz-fall-2026",
            "title": "2026 U.S. Houzz Fall Design Trends Report",
            "url": "https://www.houzz.com/magazine/2026-u-s-houzz-fall-design-trends-report-stsetivw-vs~185743042",
            "date": "September 2, 2026"
          },
          {
            "id": "apartment-therapy-2026",
            "title": "10 Home Trends Designers Say Are Still In for 2026",
            "url": "https://www.apartmenttherapy.com/home-trends-still-in-for-2026-37686257",
            "date": "August 5, 2026"
          },
          {
            "id": "sw-coty-2027",
            "title": "Color of the Year 2027, Celery SW 6421",
            "url": "https://www.sherwin-williams.com/en-us/color/color-of-the-year/2027",
            "date": "September 15, 2026"
          }
        ]
      }
    },
    {
      "id": "english-cottage",
      "group": "house",
      "name": "English Cottage",
      "kicker": "Cream, rose, sage, plum",
      "blurb": "Warm cream living and kitchen, a plum island, dusty-rose master, muted sage 3rd bedroom, plum office, honey oak bedroom floors, antique brass.",
      "note": "Cozy and a little romantic, with the drama in the plum office and island. No duck-egg or other blue. Existing hard floors stay.",
      "hero": "looks/s8-living.jpg",
      "prefix": "s8",
      "board": "looks/s8-board.jpg",
      "rooms": [
        "living",
        "kitchen",
        "master",
        "bed3",
        "office",
        "laundry"
      ],
      "captions": {
        "living": "Warm cream walls, white ceiling, existing hardwood kept.",
        "kitchen": "The same cream, a deep plum island, antique brass, cooktop and rounded island corner kept.",
        "master": "Dusty rose on the manufactured paneling, honey oak over the carpet.",
        "bed3": "Muted sage bedroom, the same honey oak floor.",
        "office": "Deep plum walls. Wood closets and wardrobe stay unpainted.",
        "laundry": "Rose-tan walls. Tile and the wood ceiling stay."
      },
      "swatches": [
        {
          "id": "cream",
          "name": "Warm cream",
          "hex": "#EFE2C8",
          "column": "Walls",
          "use": "Living room and kitchen walls, and cream cabinets, on surfaces that can be painted. In the range of Swiss Coffee, as a sample only."
        },
        {
          "id": "dusty-rose",
          "name": "Dusty rose",
          "hex": "#D4A8A0",
          "column": "Rooms",
          "use": "Master bedroom manufactured paneling. In the range of First Crush, as a sample only."
        },
        {
          "id": "muted-sage",
          "name": "Muted sage",
          "hex": "#8F9A7A",
          "column": "Rooms",
          "use": "3rd bedroom manufactured paneling. In the range of Valspar Warm Eucalyptus 8004-28F, as a sample only."
        },
        {
          "id": "plum",
          "name": "Deep plum",
          "hex": "#5A2E3C",
          "column": "Accents",
          "use": "The office walls and, in a closely related oxblood, the kitchen island."
        }
      ],
      "nowFiles": {
        "office": "rooms/office-7401.jpg"
      },
      "trends": {
        "budget": "Paint is again the lever: cream in the main rooms, rose in the master, sage in the 3rd bedroom, plum in the office and on the island. Antique-brass-look hardware from a hardware aisle, honey vinyl in the two carpeted rooms, and later a few thrifted floral pillows, a vintage lamp, or mismatched frames, which lines up with the thrift-and-collected direction in Houzz and in the BHG 2026 vintage summary.",
        "interpretation": "Cream, dusty rose, muted sage, and plum are this look’s reading of those heritage and aubergine notes, with blue deliberately left out. Vacant renders do not show floral textiles; those would be a later staging layer.",
        "sources": [
          {
            "id": "homes-gardens-cottage-colors",
            "title": "5 English Cottage Colors Designers Are Suddenly Using Again",
            "url": "https://www.homesandgardens.com/decor/paint/forgotten-english-cottage-colors-designers-are-using-again",
            "date": ""
          },
          {
            "id": "valspar-coty-2026",
            "title": "Valspar Announces Warm Eucalyptus as 2026 Color of the Year",
            "url": "https://www.prnewswire.com/news-releases/valspar-announces-warm-eucalyptus-as-2026-color-of-the-year-302522300.html",
            "date": "August 7, 2025"
          },
          {
            "id": "apartment-therapy-2026",
            "title": "10 Home Trends Designers Say Are Still In for 2026",
            "url": "https://www.apartmenttherapy.com/home-trends-still-in-for-2026-37686257",
            "date": "August 5, 2026"
          },
          {
            "id": "bm-coty-2026",
            "title": "Benjamin Moore Announces Silhouette AF-655 as its Color of the Year 2026",
            "url": "https://www.benjaminmoore.com/en-us/press/benjamin-moore-announces-color-of-the-year-2026",
            "date": "October 16, 2025"
          }
        ]
      }
    },
    {
      "id": "black-wood-modern",
      "group": "house",
      "name": "Black and Wood Modern",
      "kicker": "Crisp white, matte black",
      "blurb": "Crisp warm white rooms, a matte-black island and black hardware, mid-tone oak in the carpeted bedrooms, a light greige office and laundry.",
      "note": "The most current-looking of the five. Drama comes from the black island and hardware, not from dark walls. Existing hardwood already does the ‘wood’ half of the name.",
      "hero": "looks/s9-living.jpg",
      "prefix": "s9",
      "board": "looks/s9-board.jpg",
      "rooms": [
        "living",
        "kitchen",
        "master",
        "bed3",
        "office",
        "laundry"
      ],
      "captions": {
        "living": "Crisp warm white walls, white ceiling, existing hardwood kept.",
        "kitchen": "White cabinets, a matte-black island and faucet, cooktop and rounded island corner kept.",
        "master": "Crisp warm white on the manufactured paneling, mid-tone oak over the carpet.",
        "bed3": "The same white bedroom, the same mid-tone oak floor.",
        "office": "Light warm greige walls. Wood closets and wardrobe stay unpainted.",
        "laundry": "Light warm greige walls. Tile and the wood ceiling stay."
      },
      "swatches": [
        {
          "id": "crisp-white",
          "name": "Crisp warm white",
          "hex": "#F5F0E8",
          "column": "Walls",
          "use": "Living room, kitchen, and bedrooms, on surfaces that can be painted."
        },
        {
          "id": "matte-black",
          "name": "Matte black",
          "hex": "#1A1A1A",
          "column": "Accents",
          "use": "The kitchen island, hardware, and faucet."
        },
        {
          "id": "warm-greige",
          "name": "Light warm greige",
          "hex": "#D9D2C6",
          "column": "Rooms",
          "use": "Office and laundry walls, on surfaces that can be painted."
        },
        {
          "id": "mid-oak",
          "name": "Mid natural oak",
          "hex": "#C4A574",
          "column": "Floor",
          "use": "A medium natural oak look for the carpeted rooms, able to continue later."
        }
      ],
      "nowFiles": {
        "office": "rooms/office-7401.jpg"
      },
      "trends": {
        "budget": "Warm white paint, a quart or two of matte black for the island, black IKEA or Home Depot hardware and a black faucet, and a mid-tone vinyl in the two carpeted bedrooms. Leave the existing hardwood and the wood beam alone. This is one of the cheaper looks to stage later, because the furniture can stay simple.",
        "interpretation": "The black island is the one clearly dramatic move, which matches the ‘dark color on an island’ idea from that Homes & Gardens piece. The rest of the house stays a warm white so the existing wood can read as the other half of the scheme.",
        "sources": [
          {
            "id": "houzz-fall-2026",
            "title": "2026 U.S. Houzz Fall Design Trends Report",
            "url": "https://www.houzz.com/magazine/2026-u-s-houzz-fall-design-trends-report-stsetivw-vs~185743042",
            "date": "September 2, 2026"
          },
          {
            "id": "pinterest-predicts-2026",
            "title": "Pinterest Predicts: Nonconformity, self-preservation, and escapism drive 21 trends for 2026",
            "url": "https://newsroom.pinterest.com/en-gb/news/pinterest-predicts-nonconformity-self-preservation-and-escapism-drive-21-trends-for-2026/",
            "date": "December 9, 2025"
          },
          {
            "id": "homes-gardens-dark-2026",
            "title": "Will Dark Paint Colors Still Be Trendy in 2026?",
            "url": "https://www.homesandgardens.com/interior-design/will-dark-colors-still-be-on-trend-in-2026",
            "date": "December 27, 2025"
          }
        ]
      }
    }
  ]
});


/* Six looks added November 10, 2026. */
HOUSE.applyExtraLooksFile({
  "looks": [
    {
      "id": "beach",
      "group": "house",
      "name": "Beach",
      "kicker": "Sand and linen",
      "blurb": "Sun-warmed linen walls, sage in the primary bedroom, sand and clay accents, existing oak kept in the living room.",
      "note": "Elevated 2025\u20132026 coastal, not a souvenir-shop beach house. No blue on main-house walls or ceilings. Real knotty pine and the wood beam stay unpainted. Painted ceilings stay white. Living room and primary bedroom are color renders; kitchen, 3rd bedroom, office, and laundry are palette cards only. Alternate floor renders were not made this turn.",
      "hero": "looks/beach-living.jpg",
      "prefix": "beach",
      "board": "looks/beach-board.jpg",
      "rooms": [
        "living",
        "master"
      ],
      "nowFiles": {
        "living": "rooms/living.jpg",
        "master": "rooms/master.jpg"
      },
      "captions": {
        "living": "Natural Linen walls, white ceiling, existing oak hardwood kept, wood trim and beam unpainted.",
        "master": "Clary Sage on the manufactured paneling, grooves kept, white ceiling, sand-oak plank over the carpet."
      },
      "swatches": [
        {
          "id": "natural-linen",
          "name": "Natural Linen",
          "hex": "#DFD3C3",
          "column": "Walls",
          "use": "Living room and kitchen walls, on surfaces that can be painted. Sherwin-Williams Natural Linen SW 9109, official hex checked November 10, 2026. Sample on site next to the pine."
        },
        {
          "id": "clary-sage",
          "name": "Clary Sage",
          "hex": "#ACAD97",
          "column": "Rooms",
          "use": "Primary bedroom manufactured paneling. Sherwin-Williams Clary Sage SW 6178."
        },
        {
          "id": "alabaster",
          "name": "Alabaster",
          "hex": "#EDEAE0",
          "column": "Ceiling",
          "use": "Painted ceilings. Not the laundry\u2019s wood plank ceiling. Sherwin-Williams Alabaster SW 7008."
        },
        {
          "id": "cavern-clay",
          "name": "Cavern Clay",
          "hex": "#AC6B53",
          "column": "Accent",
          "use": "A clay island or office, used sparingly. Sherwin-Williams Cavern Clay SW 7701."
        },
        {
          "id": "sand-oak",
          "name": "Sand oak",
          "hex": "#D4C0A0",
          "column": "Floor",
          "use": "A sand or pale honey oak look in the carpeted bedrooms. Existing living-room oak is kept in this render."
        }
      ]
    },
    {
      "id": "nautical",
      "group": "house",
      "name": "Nautical",
      "kicker": "Khaki and brass",
      "blurb": "Ship-cabin khaki walls, a light linen bedroom, brass, and no navy on the walls.",
      "note": "A modern ship-cabin reading of nautical: khaki, brass, and one or two cues, not an anchor inventory. Typical nautical would put navy on the walls; here that stays optional in textiles only. Living room and primary bedroom are color renders; other rooms are palette cards only. Alternate floor renders were not made this turn.",
      "hero": "looks/nautical-living.jpg",
      "prefix": "nautical",
      "board": "looks/nautical-board.jpg",
      "rooms": [
        "living",
        "master"
      ],
      "nowFiles": {
        "living": "rooms/living.jpg",
        "master": "rooms/master.jpg"
      },
      "captions": {
        "living": "Khaki Shade walls, white ceiling, existing oak kept, wood trim and beam unpainted. No navy walls.",
        "master": "Khaki Shade on the manufactured paneling, grooves kept, white ceiling, mid oak plank over the carpet."
      },
      "swatches": [
        {
          "id": "khaki-shade",
          "name": "Khaki Shade",
          "hex": "#C0AF97",
          "column": "Walls",
          "use": "Main living and kitchen walls. Sherwin-Williams Khaki Shade SW 7533, official hex checked November 10, 2026."
        },
        {
          "id": "natural-linen",
          "name": "Natural Linen",
          "hex": "#DFD3C3",
          "column": "Rooms",
          "use": "A lighter cream bedroom or field. Sherwin-Williams Natural Linen SW 9109."
        },
        {
          "id": "alabaster",
          "name": "Alabaster",
          "hex": "#EDEAE0",
          "column": "Ceiling",
          "use": "Painted ceilings and trim. Not the laundry\u2019s wood plank ceiling. Sherwin-Williams Alabaster SW 7008."
        },
        {
          "id": "iron-ore",
          "name": "Iron Ore",
          "hex": "#434341",
          "column": "Accent",
          "use": "Charcoal punctuation on a door or island \u2014 not a navy wall. Sherwin-Williams Iron Ore SW 7069."
        },
        {
          "id": "mid-oak",
          "name": "Mid oak",
          "hex": "#C4965A",
          "column": "Floor",
          "use": "A medium-warm oak look in the carpeted bedrooms. Existing living-room oak is kept in this render."
        }
      ]
    },
    {
      "id": "craftsman",
      "group": "house",
      "name": "Craftsman",
      "kicker": "Arts and Crafts olive",
      "blurb": "Roycroft Bronze Green living and kitchen, a lighter khaki bedroom, existing oak, brass.",
      "note": "A Midwest Arts and Crafts reading against unpainted knotty pine. Dark walls stay off the ceiling and off real wood. The primary bedroom is kept lighter so the house can breathe. Living room and primary bedroom are color renders; other rooms are palette cards only. Alternate floor renders were not made this turn.",
      "hero": "looks/craftsman-living.jpg",
      "prefix": "craftsman",
      "board": "looks/craftsman-board.jpg",
      "rooms": [
        "living",
        "master"
      ],
      "nowFiles": {
        "living": "rooms/living.jpg",
        "master": "rooms/master.jpg"
      },
      "captions": {
        "living": "Roycroft Bronze Green walls, cream kitchen cabinets, white ceiling, existing oak kept, wood trim and beam unpainted.",
        "master": "Khaki Shade on the manufactured paneling, grooves kept, white ceiling, mid oak plank over the carpet."
      },
      "swatches": [
        {
          "id": "roycroft-bronze-green",
          "name": "Roycroft Bronze Green",
          "hex": "#575449",
          "column": "Walls",
          "use": "Living room and kitchen walls. Sherwin-Williams Roycroft Bronze Green SW 2846, official hex checked November 10, 2026. A historic Arts and Crafts green-bronze, not blue."
        },
        {
          "id": "khaki-shade",
          "name": "Khaki Shade",
          "hex": "#C0AF97",
          "column": "Rooms",
          "use": "Primary bedroom manufactured paneling, kept lighter than the living room. Sherwin-Williams Khaki Shade SW 7533."
        },
        {
          "id": "alabaster",
          "name": "Alabaster",
          "hex": "#EDEAE0",
          "column": "Ceiling",
          "use": "Painted ceilings. Not the laundry\u2019s wood plank ceiling. Sherwin-Williams Alabaster SW 7008."
        },
        {
          "id": "accessible-beige",
          "name": "Accessible Beige",
          "hex": "#D1C7B8",
          "column": "Rooms",
          "use": "A lighter greige option for the 3rd bedroom. Sherwin-Williams Accessible Beige SW 7036. Sample next to the pine."
        },
        {
          "id": "mid-oak",
          "name": "Mid oak",
          "hex": "#C4965A",
          "column": "Floor",
          "use": "A mid-tone oak look in the carpeted bedrooms. Existing living-room oak is kept in this render."
        }
      ]
    },
    {
      "id": "organic-modern",
      "group": "house",
      "name": "Organic Modern",
      "kicker": "Linen, clay, and oak",
      "blurb": "Warm linen walls, a clay island, pale oak in the bedroom, existing living-room oak kept.",
      "note": "Current organic modern: linen, clay, and oak, with no coastal motifs and no blue walls. In the accepted living-room render the clay also spread onto the kitchen walls, not only the island \u2014 treat that as a closest-match note, not a promise that only the island is clay. Living room and primary bedroom are color renders; other rooms are palette cards only. Alternate floor renders were not made this turn.",
      "hero": "looks/organic-modern-living.jpg",
      "prefix": "organic-modern",
      "board": "looks/organic-modern-board.jpg",
      "rooms": [
        "living",
        "master"
      ],
      "nowFiles": {
        "living": "rooms/living.jpg",
        "master": "rooms/master.jpg"
      },
      "captions": {
        "living": "Natural Linen walls, Cavern Clay on the island (the kitchen walls also picked up clay in this render), white ceiling, existing oak kept.",
        "master": "Natural Linen on the manufactured paneling, grooves kept, white ceiling, pale oak plank over the carpet."
      },
      "swatches": [
        {
          "id": "natural-linen",
          "name": "Natural Linen",
          "hex": "#DFD3C3",
          "column": "Walls",
          "use": "Main walls. Sherwin-Williams Natural Linen SW 9109, official hex checked November 10, 2026."
        },
        {
          "id": "cavern-clay",
          "name": "Cavern Clay",
          "hex": "#AC6B53",
          "column": "Accent",
          "use": "Intended for the island only. Sherwin-Williams Cavern Clay SW 7701. The living render also tinted nearby kitchen walls; sample on site."
        },
        {
          "id": "alabaster",
          "name": "Alabaster",
          "hex": "#EDEAE0",
          "column": "Ceiling",
          "use": "Painted ceilings. Not the laundry\u2019s wood plank ceiling. Sherwin-Williams Alabaster SW 7008."
        },
        {
          "id": "urbane-bronze",
          "name": "Urbane Bronze",
          "hex": "#54504A",
          "column": "Rooms",
          "use": "A darker office if a dramatic note is wanted. Sherwin-Williams Urbane Bronze SW 7048."
        },
        {
          "id": "pale-oak",
          "name": "Pale oak",
          "hex": "#D4C0A0",
          "column": "Floor",
          "use": "A pale honey oak look in the carpeted bedrooms. Existing living-room oak is kept in this render."
        }
      ]
    },
    {
      "id": "japandi",
      "group": "house",
      "name": "Japandi",
      "kicker": "Dusky sage \u2014 not Scandi Cabin",
      "blurb": "Evergreen Fog living walls, a lighter linen bedroom, pale oak, cream cabinets rather than bright white.",
      "note": "Japandi here is duskier and more Japanese than the existing Scandi Cabin look: Evergreen Fog instead of bright white, low rattan, a paper lantern, and all-wood dining instead of white chairs. No blue walls. Living room and primary bedroom are color renders; other rooms are palette cards only. Alternate floor renders were not made this turn.",
      "hero": "looks/japandi-living.jpg",
      "prefix": "japandi",
      "board": "looks/japandi-board.jpg",
      "rooms": [
        "living",
        "master"
      ],
      "nowFiles": {
        "living": "rooms/living.jpg",
        "master": "rooms/master.jpg"
      },
      "captions": {
        "living": "Evergreen Fog walls, cream cabinets, white ceiling, existing oak kept, wood trim and beam unpainted.",
        "master": "Natural Linen on the manufactured paneling, grooves kept, white ceiling, pale oak plank over the carpet."
      },
      "swatches": [
        {
          "id": "evergreen-fog",
          "name": "Evergreen Fog",
          "hex": "#95978A",
          "column": "Walls",
          "use": "Living room and kitchen walls, a muted sage-gray distinct from Scandi Cabin\u2019s bright white. Sherwin-Williams Evergreen Fog SW 9130, official hex checked November 10, 2026."
        },
        {
          "id": "natural-linen",
          "name": "Natural Linen",
          "hex": "#DFD3C3",
          "column": "Rooms",
          "use": "Primary bedroom manufactured paneling, kept lighter than the living room. Sherwin-Williams Natural Linen SW 9109."
        },
        {
          "id": "alabaster",
          "name": "Alabaster",
          "hex": "#EDEAE0",
          "column": "Ceiling",
          "use": "Painted ceilings. Not the laundry\u2019s wood plank ceiling. Sherwin-Williams Alabaster SW 7008."
        },
        {
          "id": "shoji-white",
          "name": "Shoji White",
          "hex": "#E6DFD3",
          "column": "Trim",
          "use": "A quieter warm white for laundry or trim. Sherwin-Williams Shoji White SW 7042."
        },
        {
          "id": "pale-oak",
          "name": "Pale oak",
          "hex": "#D4C0A0",
          "column": "Floor",
          "use": "A pale white-oak look in the carpeted bedrooms. Existing living-room oak is kept in this render."
        }
      ]
    },
    {
      "id": "warm-minimalist",
      "group": "house",
      "name": "Warm Minimalist",
      "kicker": "Quiet cream and oak",
      "blurb": "Shoji White walls, almost no contrast, pale oak in the bedroom, existing living-room oak kept.",
      "note": "Warm minimalism: fewer objects, cream walls, one wood tone. The knotty pine is already busy, so the furniture stays very quiet. No blue walls. Living room and primary bedroom are color renders; other rooms are palette cards only. Alternate floor renders were not made this turn. The paneling grooves in the bedroom were kept, unlike an earlier smooth-wall Scandi study.",
      "hero": "looks/warm-minimalist-living.jpg",
      "prefix": "warm-minimalist",
      "board": "looks/warm-minimalist-board.jpg",
      "rooms": [
        "living",
        "master"
      ],
      "nowFiles": {
        "living": "rooms/living.jpg",
        "master": "rooms/master.jpg"
      },
      "captions": {
        "living": "Shoji White walls, white ceiling, existing oak kept, wood trim and beam unpainted. No color-blocked island.",
        "master": "Shoji White on the manufactured paneling, grooves kept, white ceiling, pale oak plank over the carpet."
      },
      "swatches": [
        {
          "id": "shoji-white",
          "name": "Shoji White",
          "hex": "#E6DFD3",
          "column": "Walls",
          "use": "Main walls, slightly duskier than a stark gallery white. Sherwin-Williams Shoji White SW 7042, official hex checked November 10, 2026."
        },
        {
          "id": "alabaster",
          "name": "Alabaster",
          "hex": "#EDEAE0",
          "column": "Ceiling",
          "use": "Painted ceilings and a very light bedroom field. Not the laundry\u2019s wood plank ceiling. Sherwin-Williams Alabaster SW 7008."
        },
        {
          "id": "natural-linen",
          "name": "Natural Linen",
          "hex": "#DFD3C3",
          "column": "Rooms",
          "use": "A slightly more lived-in wall option. Sherwin-Williams Natural Linen SW 9109."
        },
        {
          "id": "urbane-bronze",
          "name": "Urbane Bronze",
          "hex": "#54504A",
          "column": "Accent",
          "use": "Thin punctuation on a door or metal, not a high-contrast black box. Sherwin-Williams Urbane Bronze SW 7048."
        },
        {
          "id": "pale-oak",
          "name": "Pale oak",
          "hex": "#D4C0A0",
          "column": "Floor",
          "use": "A pale honey oak look in the carpeted bedrooms. Existing living-room oak is kept in this render."
        }
      ]
    }
  ]
});
})();

/* Nautical variants, November 11, 2026. Three looks x seven rooms (living, kitchen,
 * master, bed3, office [closet view E55A7401], laundry, foyer). Bath excluded by the brief.
 * Renders are also listed in renders/renders.json for the Renders gallery. */
(function () {
  if (typeof HOUSE === "undefined" || typeof HOUSE.applyExtraLooksFile !== "function") return;
  HOUSE.applyExtraLooksFile({
  "groups": [
    {
      "id": "nautical",
      "label": "Nautical variants",
      "note": "Three nautical directions, added November 11, 2026, each rendered in all seven main-house rooms with furniture and decor. Harbor Navy uses navy on walls, Lighthouse Keeper has no blue, Ship Cabin keeps navy to textiles. None is approved. Closest-match renders are labeled."
    }
  ],
  "looks": [
    {
      "id": "nt-navy",
      "group": "nautical",
      "name": "Harbor Navy",
      "kicker": "Classic navy and white",
      "blurb": "Deep navy on the living room, primary bedroom, office and foyer walls; crisp white kitchen, laundry and 3rd bedroom; red as a small accent; brass, rope, stripes and one chart.",
      "note": "The classic version Bill asked about: navy and white with a little red. Blue on walls is allowed (Bill's November 11 correction), so navy goes on paintable drywall and the manufactured bedroom paneling only. Ceilings stay white. Unpainted wood trim, wood doors, the office's wood closets and wardrobe, and the laundry's wood ceiling and cabinets stay as they are. Concept renders, not exact products; colors are approximate.",
      "hero": "looks/nt-navy-living.jpg",
      "prefix": "nt-navy",
      "rooms": [
        "living",
        "kitchen",
        "master",
        "bed3",
        "office",
        "laundry",
        "foyer"
      ],
      "nowFiles": {
        "living": "rooms/living.jpg",
        "kitchen": "rooms/kitchen.jpg",
        "master": "rooms/master.jpg",
        "bed3": "rooms/bed3.jpg",
        "office": "rooms/office-7401.jpg",
        "laundry": "rooms/laundry.jpg",
        "foyer": "rooms/foyer.jpg"
      },
      "captions": {
        "living": "Navy walls, white plank ceiling, wood beam and trim unpainted, white slipcovered sofa, navy stripe rug and pillows, one red pillow, brass lantern, one chart. Closest match, not exact.",
        "kitchen": "White walls and cabinets, navy island base, brass knobs, caged ship light in the same spot, navy stripe runner. Backsplash, cooktop and rounded island kept.",
        "master": "Navy on the manufactured paneling, grooves kept, white ceiling, white bed with a navy stripe throw, sea chest, brass lamp, oak-look plank over the carpet.",
        "bed3": "Crisp white paneling, ticking-stripe bedding with a red blanket, brass lantern, navy stripe rug, one chart, oak-look plank floor.",
        "office": "Navy walls; the wood closets, wardrobe and window trim stay natural. Navy stripe runner, brass ship's clock and lamp.",
        "laundry": "Coral walls repainted white; wood ceiling, skylight, cabinets and equipment stay. Navy stripe runner, rope basket, brass hooks.",
        "foyer": "Navy walls, white ceiling, front door and French door unpainted, white bench with a striped cushion, brass porthole mirror and lantern."
      },
      "swatches": [
        {
          "id": "naval",
          "name": "Naval",
          "hex": "#2F3D4C",
          "column": "Walls",
          "use": "Living room, primary-bedroom paneling, office and foyer walls, and the kitchen island base. Sherwin-Williams Naval SW 6244, official hex checked November 10, 2026. Sample next to the wood trim."
        },
        {
          "id": "alabaster",
          "name": "Alabaster",
          "hex": "#EDEAE0",
          "column": "Rooms",
          "use": "Kitchen, laundry and 3rd-bedroom walls, ceilings and painted trim. Not the laundry's wood ceiling. Sherwin-Williams Alabaster SW 7008."
        },
        {
          "id": "signal-red",
          "name": "Signal red (textiles)",
          "hex": "#A8322D",
          "column": "Accent",
          "use": "One red pillow or blanket per room. Screen color only, not a paint match."
        },
        {
          "id": "brass",
          "name": "Brass",
          "hex": "#B08D57",
          "column": "Accent",
          "use": "Lanterns, ship lights, knobs, hooks. Screen color only."
        },
        {
          "id": "mid-oak",
          "name": "Mid oak",
          "hex": "#C4965A",
          "column": "Floor",
          "use": "Medium warm oak-look vinyl plank over the bedroom carpet in the renders. Existing hard floors and tile stay."
        }
      ]
    },
    {
      "id": "nt-keeper",
      "group": "nautical",
      "name": "Lighthouse Keeper",
      "kicker": "Nautical with no blue",
      "blurb": "Sandy linen walls, white ceilings, deep green and barn-red accents, rope, brass, and weathered teak and driftwood. No blue anywhere in the styling.",
      "note": "The no-blue nautical: sand and linen walls, a deep green island and office, barn red only in textiles, and rope, brass, canvas, teak and driftwood doing the nautical work. Ceilings stay white. Unpainted wood stays unpainted. The laundry's existing blue pressure tank is equipment, not decor, and stays in the picture. Concept renders, not exact products; colors are approximate.",
      "hero": "looks/nt-keeper-living.jpg",
      "prefix": "nt-keeper",
      "rooms": [
        "living",
        "kitchen",
        "master",
        "bed3",
        "office",
        "laundry",
        "foyer"
      ],
      "nowFiles": {
        "living": "rooms/living.jpg",
        "kitchen": "rooms/kitchen.jpg",
        "master": "rooms/master.jpg",
        "bed3": "rooms/bed3.jpg",
        "office": "rooms/office-7401.jpg",
        "laundry": "rooms/laundry.jpg",
        "foyer": "rooms/foyer.jpg"
      },
      "captions": {
        "living": "Sandy linen walls, white ceiling, forest-green sofa, barn-red stripe pillows, teak table, brass lantern, rope lamp, jute rug. Closest match, not exact.",
        "kitchen": "Sandy linen walls, white cabinets, deep green island base, brass knobs and caged light, barn-red stripe runner. Backsplash and cooktop kept.",
        "master": "Linen-sand paneling, white ceiling, teak bed, deep green blanket, barn-red stripe pillow, rope-handled sea chest, brass lamp, oak-look plank floor.",
        "bed3": "Soft white paneling, barn-red stripe blanket, green pillow, brass lantern, rope coil on a driftwood hook, jute rug, oak-look plank floor.",
        "office": "Deep green walls; wood closets, wardrobe and window trim stay natural. Barn-red stripe runner, brass clock and lamp, rope pencil cup.",
        "laundry": "Sandy linen walls; wood ceiling, skylight, cabinets and equipment stay (the pressure tank is blue equipment). Barn-red runner, rope basket. Closest match, not exact.",
        "foyer": "Sandy linen walls, white ceiling, teak bench with a green cushion, rope-hung brass mirror, lantern, barn-red stripe runner."
      },
      "swatches": [
        {
          "id": "natural-linen",
          "name": "Natural Linen",
          "hex": "#DFD3C3",
          "column": "Walls",
          "use": "Living room, kitchen, primary-bedroom paneling, laundry and foyer walls. Sherwin-Williams Natural Linen SW 9109, official hex checked November 10, 2026."
        },
        {
          "id": "shoji-white",
          "name": "Shoji White",
          "hex": "#E6DFD3",
          "column": "Rooms",
          "use": "A softer warm white for the 3rd-bedroom paneling. Sherwin-Williams Shoji White SW 7042."
        },
        {
          "id": "rookwood-dark-green",
          "name": "Rookwood Dark Green",
          "hex": "#33433A",
          "column": "Accent",
          "use": "Kitchen island base and office walls. Sherwin-Williams Rookwood Dark Green SW 2816; name and code confirmed on the Sherwin-Williams page November 11, 2026. The page did not give a hex, so this swatch is a screen approximation only."
        },
        {
          "id": "barn-red",
          "name": "Barn red (textiles)",
          "hex": "#8E2F2A",
          "column": "Accent",
          "use": "Striped runners, blankets and pillows. Screen color only. If a painted barn red is wanted later, Sherwin-Williams Fired Brick SW 6335 is a confirmed name and code (hex not taken)."
        },
        {
          "id": "alabaster",
          "name": "Alabaster",
          "hex": "#EDEAE0",
          "column": "Ceiling",
          "use": "Painted ceilings. Not the laundry's wood ceiling. Sherwin-Williams Alabaster SW 7008."
        },
        {
          "id": "teak",
          "name": "Weathered teak",
          "hex": "#8A6A4A",
          "column": "Accent",
          "use": "Teak and driftwood furniture tones. Screen color only."
        }
      ]
    },
    {
      "id": "nt-cabin",
      "group": "nautical",
      "name": "Ship Cabin",
      "kicker": "Khaki, brass and a little navy",
      "blurb": "The existing Nautical khaki-and-brass palette, now furnished in every room: khaki walls, a cream 3rd bedroom, an iron-ore island and office, navy only in stripes and blankets.",
      "note": "Builds on the November 10 Nautical look and research (khaki, brass, canvas, one lantern, one stripe, one chart), carried into all seven main-house rooms with furniture and decor. Navy stays in textiles here; walls are khaki, cream and iron ore. Ceilings stay white and unpainted wood stays unpainted. Concept renders, not exact products; colors are approximate.",
      "hero": "looks/nt-cabin-living.jpg",
      "prefix": "nt-cabin",
      "rooms": [
        "living",
        "kitchen",
        "master",
        "bed3",
        "office",
        "laundry",
        "foyer"
      ],
      "nowFiles": {
        "living": "rooms/living.jpg",
        "kitchen": "rooms/kitchen.jpg",
        "master": "rooms/master.jpg",
        "bed3": "rooms/bed3.jpg",
        "office": "rooms/office-7401.jpg",
        "laundry": "rooms/laundry.jpg",
        "foyer": "rooms/foyer.jpg"
      },
      "captions": {
        "living": "Khaki walls, white ceiling, wood beam and trim unpainted, canvas sofa with navy awning-stripe pillows, leather campaign chair, brass lantern and swing-arm lamp, one lake chart. Closest match, not exact.",
        "kitchen": "Khaki walls, white cabinets, iron-ore island base, brass knobs and schoolhouse light, navy stripe runner. Backsplash and cooktop kept.",
        "master": "Khaki paneling, white ceiling, dark wood bed, navy blanket, black campaign nightstand with brass, jute rug, oak-look plank floor.",
        "bed3": "Cream paneling, white bedding with a khaki coverlet and navy stripe pillow, brass lamp, one chart, oak-look plank floor.",
        "office": "Iron-ore walls; wood closets, wardrobe and window trim stay natural. Navy stripe runner, brass clock and lamp.",
        "laundry": "Khaki walls; wood ceiling, skylight, cabinets and equipment stay. Navy stripe runner, rope basket, brass hooks, one chart. Closest match, not exact.",
        "foyer": "Khaki walls, white ceiling, dark wood bench with a canvas cushion, brass mirror and lantern, navy stripe runner."
      },
      "swatches": [
        {
          "id": "khaki-shade",
          "name": "Khaki Shade",
          "hex": "#C0AF97",
          "column": "Walls",
          "use": "Living room, kitchen, primary-bedroom paneling, laundry and foyer walls. Sherwin-Williams Khaki Shade SW 7533, official hex checked November 10, 2026."
        },
        {
          "id": "natural-linen",
          "name": "Natural Linen",
          "hex": "#DFD3C3",
          "column": "Rooms",
          "use": "3rd-bedroom paneling. Sherwin-Williams Natural Linen SW 9109."
        },
        {
          "id": "iron-ore",
          "name": "Iron Ore",
          "hex": "#434341",
          "column": "Accent",
          "use": "Kitchen island base and office walls. Sherwin-Williams Iron Ore SW 7069."
        },
        {
          "id": "naval",
          "name": "Naval (textiles)",
          "hex": "#2F3D4C",
          "column": "Accent",
          "use": "Striped pillows, runners and a bed blanket. Sherwin-Williams Naval SW 6244 as a color reference."
        },
        {
          "id": "alabaster",
          "name": "Alabaster",
          "hex": "#EDEAE0",
          "column": "Ceiling",
          "use": "Painted ceilings. Not the laundry's wood ceiling. Sherwin-Williams Alabaster SW 7008."
        },
        {
          "id": "mid-oak",
          "name": "Mid oak",
          "hex": "#C4965A",
          "column": "Floor",
          "use": "Medium warm oak-look vinyl plank over the bedroom carpet in the renders. Existing hard floors and tile stay."
        }
      ]
    }
  ]
});
  /* Show the newest request first on the Looks page. */
  if (HOUSE.lookGroups) {
    var at = -1;
    HOUSE.lookGroups.forEach(function (g, i) { if (g.id === "nautical") at = i; });
    if (at > 0) HOUSE.lookGroups.unshift(HOUSE.lookGroups.splice(at, 1)[0]);
  }
})();
