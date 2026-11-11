/* Floor options for whole-house looks. Classic script. No network.
 * Costs are planning figures in USD per square foot, compiled November 10, 2026.
 * They are not quotes. LifeProof is one mid-range LVP candidate, not a required brand.
 */
(function () {
  if (typeof HOUSE === "undefined") return;

  HOUSE.floorStorageKey = "howell-house-floors-v1";

  HOUSE.floorMeta = {
    priceChecked: "November 10, 2026",
    shownIn: "Floor renders were made for the living room and the primary bedroom only. Other rooms keep the look’s current render, with a swatch and a cost note.",
    subfloor: "The primary and 3rd bedroom are carpeted, probably over old OSB, which is not confirmed. Reddit flooring threads warn that the failing layer may be particle board, that delaminating board must be replaced before LVP, that the floor should be flatter than about 3/16 inch over 10 feet, and that a second underlayment pad can break locking joints and void a warranty. Lift a corner before pricing a bedroom floor.",
    areas: {
      bedrooms: 205.5,
      hardFloors: 596.5,
      hardPlusBedrooms: 802,
      laundry: 99,
      kitchen: 143.75
    },
    areaNote: "Living 253.5, kitchen 143.75, dining 109.25, office 90, primary 115.5, 3rd bedroom 90, laundry 99, assuming 8 ft ceilings. Laundry tile stays unless a kitchen or laundry tile option says otherwise. Planning areas only.",
    sources: [
      { id: "dgfloors-lvp-2026-05", title: "dgfloors LVP tiers and install adders", date: "May 2, 2026", url: "https://dgfloors.com/how-much-is-lvp-per-square-foot/" },
      { id: "angi-vinyl-2026-09", title: "Angi vinyl flooring costs, 2026 data", date: "September 4, 2026", url: "https://www.angi.com/articles/how-much-does-installing-vinyl-or-linoleum-flooring-cost.htm" },
      { id: "angi-hardwood-2026-09", title: "Angi hardwood flooring costs, 2026 data", date: "September 3, 2026", url: "https://www.angi.com/articles/how-much-does-hardwood-flooring-cost.htm" },
      { id: "angi-laminate-2026-08", title: "Angi laminate flooring costs, 2026 data", date: "August 31, 2026", url: "https://www.angi.com/articles/how-much-does-laminate-flooring-cost.htm" },
      { id: "angi-tile-2026", title: "Angi tile installation costs, 2026 data", date: "2026", url: "https://www.angi.com/articles/tile-installation-cost.htm" }
    ]
  };

  function cost(diyLow, diyHigh, diyKind, hiredLow, hiredHigh, hiredKind, diyNote, hiredNote) {
    return {
      diy: { low: diyLow, high: diyHigh, kind: diyKind, note: diyNote || "" },
      hired: { low: hiredLow, high: hiredHigh, kind: hiredKind, note: hiredNote || "" }
    };
  }

  var LVP = cost(2.5, 5.5, "mixed", 4.0, 8.99, "checked-price-extended",
    "Mid-range LVP material $2.50–$4.99/sf (dgfloors, May 2, 2026; LifeProof is cited there at $2.79–$3.49 as one mid example) plus a planning allowance for trim or underlayment.",
    "Mid-range material $2.50–$4.99 plus professional labor $1.50–$4.00/sf (dgfloors, May 2, 2026). Angi (Sep 4, 2026) publishes a wider national installed band of $2–$22, which is not used for the summed range.");
  var LAMINATE = cost(1.3, 5.6, "mixed", 3, 13, "checked-range",
    "Angi materials $1–$5/sf (Aug 31, 2026) plus a planning underlayment allowance.",
    "Angi installed laminate $3–$13/sf (Aug 31, 2026). Labor alone is cited at $2–$8/sf. Laminate is not a wet-area material.");
  var ENGINEERED = cost(3.5, 9, "mixed", 4.5, 16, "checked-range",
    "Angi 3/8-inch hardwood materials $3–$8/sf (Sep 3, 2026) plus a planning underlayment and trim allowance. Engineered planks can be a DIY click-lock job; site-finished work is harder.",
    "Angi engineered hardwood installed $4.50–$16/sf (Sep 3, 2026). Better than vinyl in a dry living room; still not a wet-area floor.");
  var REFINISH = cost(1.5, 3.5, "planning-estimate", 3, 8, "checked-range",
    "Planning only: sander rental, stain, and polyurethane. Not a dated local quote.",
    "Angi traditional refinishing $3–$8/sf; dustless $5–$8/sf (Sep 3, 2026). Applies to existing hard-floor rooms only, after the boards are confirmed sandable.");
  var HERRINGBONE_ENG = cost(4.5, 11, "planning-estimate", 12, 21, "mixed",
    "Engineered or wood-look material plus extra waste and layout time. Planning estimate; herringbone is slower for DIY.",
    "Angi (Sep 3, 2026) cites about $12/sf for a hardwood herringbone layout, or about 30% on top of a standard install. The $12–$21 band is that $12 figure together with 30% over the engineered installed high end, as a planning range.");
  var TILE = cost(3, 18, "mixed", 8, 25, "planning-estimate",
    "Angi porcelain material $2–$15/sf (2026 tile guide) plus planning thinset, grout, and tools.",
    "Combines Angi porcelain material $2–$15 with labor $3–$15/sf as a planning installed band. A wider ceramic installed band on Angi is $12–$45 and is not used here.");

  function opt(spec) { return spec; }

  HOUSE.floorsByLook = {
    quiet: [
      opt({
        id: "current", short: "Pale oak", name: "Pale honey oak LVP", current: true,
        caption: "The current Quiet Lake renders already recast the living-room floor, and the carpeted bedrooms, as a pale honey oak plank. Laundry tile stays.",
        material: "Luxury vinyl plank",
        swatches: [{ name: "Pale honey oak", hex: "#D4C0A0" }, { name: "Light biscuit", hex: "#E2D3B8" }],
        durability: "Waterproof LVP holds up to pets and spills better than laminate. Fine in living spaces; laundry tile can stay. Confirm the bedroom subfloor before you order.",
        costs: LVP, scope: "Living, kitchen, dining, office, and both bedrooms, about 802 sq ft. Laundry tile stays.",
        renders: { living: null, master: null }
      }),
      opt({
        id: "mid-oak", short: "Mid oak", name: "Mid-tone engineered oak",
        caption: "A warmer caramel mid-tone oak through the same rooms, as an engineered hardwood rather than vinyl.",
        material: "Engineered hardwood",
        swatches: [{ name: "Caramel oak", hex: "#C4965A" }, { name: "Honey mid", hex: "#C4A574" }],
        durability: "A real-wood wear layer can be refinished once or twice. Keep water off it. Not for the laundry; that tile stays. Pets will dent it more than they dent LVP.",
        costs: ENGINEERED, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: "looks/floors/s1-living-mid-oak.jpg", master: "looks/floors/s1-master-mid-oak.jpg" }
      }),
      opt({
        id: "existing", short: "Existing oak", name: "Keep or refinish the existing oak",
        caption: "Put the house’s current medium-warm oak back in the living area, and match it with a similar plank in the bedrooms. Refinishing the hard floors is optional.",
        material: "Refinish existing + matching LVP in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Warm mixed oak", hex: "#C08A52" }],
        durability: "The existing floor is already in the wet-adjacent kitchen; refinishing does not make it more waterproof. Bedroom LVP is the moisture-friendly half. Confirm the subfloor under the carpet first.",
        costs: LVP, refinish: REFINISH,
        scope: "Bedroom LVP on about 205.5 sq ft. Optional refinish of the existing hard floors, about 596.5 sq ft, at the refinish rates below.",
        renders: { living: "looks/floors/s1-living-existing.jpg", master: "looks/floors/s1-master-existing.jpg" }
      })
    ],
    northwoods: [
      opt({
        id: "current", short: "Caramel oak", name: "Caramel oak LVP", current: true,
        caption: "The current Northwoods renders already show a caramel oak plank in the living room and the bedrooms. Laundry tile stays.",
        material: "Luxury vinyl plank",
        swatches: [{ name: "Caramel oak", hex: "#C4965A" }, { name: "Mid honey", hex: "#C4A05A" }],
        durability: "Waterproof LVP is a practical match for pets and the kitchen. Confirm the bedroom subfloor before you order.",
        costs: LVP, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: null, master: null }
      }),
      opt({
        id: "walnut", short: "Walnut", name: "Dark walnut engineered oak",
        caption: "A darker walnut-look engineered plank through the same rooms, against the deep olive walls.",
        material: "Engineered hardwood",
        swatches: [{ name: "Dark walnut", hex: "#5C3A24" }, { name: "Walnut oak", hex: "#7A4A2E" }],
        durability: "Richer wood look, limited refinishing, and it will show dust. Keep water off it. Laundry tile stays.",
        costs: ENGINEERED, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: "looks/floors/s2-living-walnut.jpg", master: "looks/floors/s2-master-walnut.jpg" }
      }),
      opt({
        id: "existing", short: "Existing oak", name: "Keep or refinish the existing oak",
        caption: "Return the living area to the house’s current medium-warm oak, and match it in the bedrooms.",
        material: "Refinish existing + matching LVP in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Warm mixed oak", hex: "#C08A52" }],
        durability: "Same as a keep-and-match plan: refinish does not waterproof the kitchen, and the bedroom subfloor still has to be checked.",
        costs: LVP, refinish: REFINISH,
        scope: "Bedroom LVP on about 205.5 sq ft, plus an optional refinish of about 596.5 sq ft of existing hard floor.",
        renders: { living: null, master: "looks/floors/s2-master-existing.jpg" }
      })
    ],
    modern: [
      opt({
        id: "current", short: "Natural oak", name: "Natural oak LVP", current: true,
        caption: "The current Modern Country renders already show a medium natural oak plank in the living room and the bedrooms. Laundry tile stays.",
        material: "Luxury vinyl plank",
        swatches: [{ name: "Natural oak", hex: "#C4A574" }, { name: "Medium oak", hex: "#C4965A" }],
        durability: "Waterproof LVP for pets and spills. Confirm the bedroom subfloor first.",
        costs: LVP, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: null, master: null }
      }),
      opt({
        id: "pale-laminate", short: "Light laminate", name: "Pale white-oak laminate",
        caption: "A lighter, more uniform white-oak-look laminate — the budget wood look — through the same rooms.",
        material: "Laminate",
        swatches: [{ name: "Pale laminate", hex: "#E6D7BE" }, { name: "Cool light oak", hex: "#DDD0B8" }],
        durability: "Click-lock and often cheaper than LVP, but it swells with standing water. Not for the laundry, and risky in a kitchen spill path. Pets can wear the printed surface. Confirm the bedroom subfloor.",
        costs: LAMINATE, scope: "About 802 sq ft, laundry tile stays. Think twice before running laminate through the kitchen.",
        renders: { living: "looks/floors/s3-living-pale-laminate.jpg", master: "looks/floors/s3-master-pale-laminate.jpg" }
      }),
      opt({
        id: "existing", short: "Existing oak", name: "Keep or refinish the existing oak",
        caption: "Return the living area to the current medium-warm oak, and match it in the bedrooms.",
        material: "Refinish existing + matching LVP in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Warm mixed oak", hex: "#C08A52" }],
        durability: "Optional refinish on the existing boards; LVP only where the carpet comes up, after a subfloor check.",
        costs: LVP, refinish: REFINISH,
        scope: "Bedroom LVP on about 205.5 sq ft, plus an optional refinish of about 596.5 sq ft.",
        renders: { living: "looks/floors/s3-living-existing.jpg", master: "looks/floors/s3-master-existing.jpg" }
      })
    ],
    farm: [
      opt({
        id: "current", short: "Brown oak", name: "Rich brown oak LVP", current: true,
        caption: "The current Old-Farm Country renders already show a richer brown oak plank in the living room and the bedrooms. Laundry tile stays.",
        material: "Luxury vinyl plank",
        swatches: [{ name: "Rich brown oak", hex: "#8B5E3C" }, { name: "Brown oak", hex: "#9A6238" }],
        durability: "Waterproof LVP for pets and spills. Confirm the bedroom subfloor first.",
        costs: LVP, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: null, master: null }
      }),
      opt({
        id: "mid-oak", short: "Mid oak", name: "Mid-tone engineered oak",
        caption: "A lighter caramel mid-tone oak as engineered hardwood, so the farm rooms feel a little airier than the rich brown.",
        material: "Engineered hardwood",
        swatches: [{ name: "Mid oak", hex: "#C4965A" }, { name: "Honey oak", hex: "#C4A574" }],
        durability: "Real-wood wear layer, limited refinishing, keep water off it. Laundry tile stays.",
        costs: ENGINEERED, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: "looks/floors/s4-living-mid-oak.jpg", master: "looks/floors/s4-master-mid-oak.jpg" }
      }),
      opt({
        id: "existing", short: "Existing oak", name: "Keep or refinish the existing oak",
        caption: "Return the living area to the house’s current medium-warm oak, and match it in the bedrooms.",
        material: "Refinish existing + matching LVP in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Warm mixed oak", hex: "#C08A52" }],
        durability: "Optional refinish on the existing boards; LVP only where the carpet comes up, after a subfloor check.",
        costs: LVP, refinish: REFINISH,
        scope: "Bedroom LVP on about 205.5 sq ft, plus an optional refinish of about 596.5 sq ft.",
        renders: { living: "looks/floors/s4-living-existing.jpg", master: "looks/floors/s4-master-existing.jpg" }
      })
    ],
    "moody-lodge": [
      opt({
        id: "current", short: "Existing oak", name: "Existing oak, walnut bedrooms", current: true,
        caption: "The current Moody Lodge renders keep the existing hard floors and put a walnut-look plank only in the two carpeted bedrooms. Laundry tile stays.",
        material: "Keep existing + walnut-look LVP in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Walnut-look oak", hex: "#A67B52" }],
        durability: "Lowest disruption in the living areas. Bedroom LVP is waterproof once the subfloor is sound. The existing kitchen floor is unchanged.",
        costs: LVP, scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors are kept, with no install cost on those rooms.",
        renders: { living: null, master: null }
      }),
      opt({
        id: "walnut", short: "Walnut", name: "Dark walnut LVP throughout",
        caption: "Continue a darker walnut-look vinyl through the living areas as well as the bedrooms.",
        material: "Luxury vinyl plank",
        swatches: [{ name: "Dark walnut", hex: "#5C3A24" }, { name: "Walnut oak", hex: "#7A4A2E" }],
        durability: "Waterproof and practical with pets. A dark floor will show dust and grit. Laundry tile can stay.",
        costs: LVP, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: "looks/floors/s5-living-walnut.jpg", master: null }
      }),
      opt({
        id: "herringbone", short: "Herringbone", name: "Walnut herringbone, plus brick-look tile later",
        caption: "A dark walnut herringbone in the living room and primary bedroom. A brick-look porcelain in the kitchen or laundry is a later, separate tile choice — shown as a swatch only, not in these renders.",
        material: "Herringbone engineered wood or wood-look, plus optional porcelain tile",
        swatches: [{ name: "Walnut herringbone", hex: "#5C3A24" }, { name: "Brick-look tile", hex: "#8E4B32" }],
        durability: "Herringbone is a pattern, not a material: engineered wood still dislikes standing water; a vinyl herringbone would be more washable. Brick-look porcelain is the wet-area choice for a kitchen or laundry. Pets are fine on both if the surface is dense.",
        costs: HERRINGBONE_ENG, tile: TILE,
        scope: "Herringbone in the living areas and bedrooms, about 802 sq ft. Optional brick-look tile in the kitchen (143.75 sf) or laundry (99 sf) at the tile rates, not stacked into the herringbone total.",
        renders: { living: "looks/floors/s5-living-herringbone.jpg", master: "looks/floors/s5-master-herringbone.jpg" }
      })
    ],
    "mid-century-cabin": [
      opt({
        id: "current", short: "Existing oak", name: "Existing oak, walnut bedrooms", current: true,
        caption: "The current Mid-Century Cabin renders keep the existing hard floors and put a darker walnut-look plank in the carpeted bedrooms. Laundry tile stays.",
        material: "Keep existing + walnut-look LVP in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Walnut-look oak", hex: "#6B4426" }],
        durability: "Lowest disruption in the living areas. Check the bedroom subfloor before the LVP goes down.",
        costs: LVP, scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors are kept.",
        renders: { living: null, master: null }
      }),
      opt({
        id: "walnut", short: "Walnut", name: "Dark walnut LVP throughout",
        caption: "Continue the darker walnut-look vinyl through the living areas as well.",
        material: "Luxury vinyl plank",
        swatches: [{ name: "Dark walnut", hex: "#5C3A24" }, { name: "Walnut oak", hex: "#7A4A2E" }],
        durability: "Waterproof and practical with pets. Dark floors show dust. Laundry tile stays.",
        costs: LVP, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: "looks/floors/s6-living-walnut.jpg", master: null }
      }),
      opt({
        id: "teak", short: "Teak oak", name: "Teak-look engineered plank",
        caption: "A mid-century golden teak or amber oak engineered plank through the living areas and bedrooms.",
        material: "Engineered hardwood",
        swatches: [{ name: "Teak oak", hex: "#B67A3C" }, { name: "Amber teak", hex: "#C4893E" }],
        durability: "Warm wood look with a limited refinish life. Keep water off it. Laundry tile stays.",
        costs: ENGINEERED, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: "looks/floors/s6-living-teak.jpg", master: null }
      })
    ],
    "scandi-cabin": [
      opt({
        id: "current", short: "Existing oak", name: "Existing oak, pale oak bedrooms", current: true,
        caption: "The current Scandi Cabin renders keep the existing hard floors and put a pale white-oak plank in the carpeted bedrooms. Laundry tile stays.",
        material: "Keep existing + pale oak LVP in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Pale white oak", hex: "#D4C0A0" }],
        durability: "Lowest disruption in the living areas. Pale LVP in the bedrooms will show less dust than a dark floor. Check the subfloor first.",
        costs: LVP, scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors are kept.",
        renders: { living: null, master: null }
      }),
      opt({
        id: "pale-oak", short: "Pale oak", name: "Pale white-oak LVP throughout",
        caption: "Continue the pale biscuit or white-oak vinyl through the living areas, the usual Scandi move.",
        material: "Luxury vinyl plank",
        swatches: [{ name: "Pale white oak", hex: "#D4C0A0" }, { name: "Light biscuit", hex: "#E2D3B8" }],
        durability: "Waterproof and light underfoot. Pale floors hide dust and show grit. Laundry tile stays.",
        costs: LVP, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: "looks/floors/s7-living-pale-oak.jpg", master: "looks/floors/s7-master-pale-oak.jpg" }
      }),
      opt({
        id: "limed-oak", short: "Limed oak", name: "Whitewashed limed-oak laminate",
        caption: "A cooler, chalkier limed or whitewashed oak laminate — even paler than the pale honey oak.",
        material: "Laminate",
        swatches: [{ name: "Limed oak", hex: "#E8E0D0" }, { name: "Frosted oak", hex: "#E4DCC8" }],
        durability: "The palest look, and usually the lowest material cost, but laminate swells with standing water. Risky in the kitchen; skip the laundry. Confirm the bedroom subfloor.",
        costs: LAMINATE, scope: "About 802 sq ft, laundry tile stays. Think twice before running laminate through the kitchen.",
        renders: { living: "looks/floors/s7-living-limed-oak.jpg", master: "looks/floors/s7-master-limed-oak.jpg" }
      })
    ],
    "english-cottage": [
      opt({
        id: "current", short: "Existing oak", name: "Existing oak, honey oak bedrooms", current: true,
        caption: "The current English Cottage renders keep the existing hard floors and put a honey oak plank in the carpeted bedrooms. Laundry tile stays.",
        material: "Keep existing + honey oak LVP in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Honey oak", hex: "#C4A06A" }],
        durability: "Lowest disruption in the living areas. Check the bedroom subfloor first.",
        costs: LVP, scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors are kept.",
        renders: { living: null, master: null }
      }),
      opt({
        id: "honey-oak", short: "Honey oak", name: "Honey oak engineered plank",
        caption: "A warm honey oak engineered plank through the living areas and bedrooms.",
        material: "Engineered hardwood",
        swatches: [{ name: "Honey oak", hex: "#C4A06A" }, { name: "Golden oak", hex: "#D0A85C" }],
        durability: "Cottage warmth with a limited refinish life. Keep water off it. Laundry tile stays.",
        costs: ENGINEERED, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: "looks/floors/s8-living-honey-oak.jpg", master: "looks/floors/s8-master-honey-oak.jpg" }
      }),
      opt({
        id: "herringbone", short: "Herringbone", name: "Honey herringbone, plus brick-look tile later",
        caption: "A honey oak herringbone in the living room and primary bedroom. A brick-look or terracotta porcelain in the kitchen or laundry is a later tile choice — shown as a swatch only, not in these renders.",
        material: "Herringbone engineered wood or wood-look, plus optional porcelain tile",
        swatches: [{ name: "Honey herringbone", hex: "#C4A06A" }, { name: "Terracotta tile", hex: "#B85A32" }],
        durability: "Herringbone is the pattern. Engineered wood still dislikes standing water; porcelain is the wet-area choice for a kitchen or laundry.",
        costs: HERRINGBONE_ENG, tile: TILE,
        scope: "Herringbone in the living areas and bedrooms, about 802 sq ft. Optional brick-look tile in the kitchen or laundry at the tile rates, not stacked into the herringbone total.",
        renders: { living: "looks/floors/s8-living-herringbone.jpg", master: "looks/floors/s8-master-herringbone.jpg" }
      })
    ],
    "black-wood-modern": [
      opt({
        id: "current", short: "Existing oak", name: "Existing oak, mid-oak bedrooms", current: true,
        caption: "The current Black and Wood Modern renders keep the existing hard floors — the wood half of the name — and put a mid-tone oak plank in the carpeted bedrooms. Laundry tile stays.",
        material: "Keep existing + mid-tone oak LVP in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Mid natural oak", hex: "#C4A574" }],
        durability: "Lowest disruption in the living areas. Check the bedroom subfloor first.",
        costs: LVP, scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors are kept.",
        renders: { living: null, master: null }
      }),
      opt({
        id: "mid-oak", short: "Mid oak", name: "Mid-tone oak engineered plank",
        caption: "A more even mid-tone natural oak engineered plank through the living areas as well, against the crisp white walls.",
        material: "Engineered hardwood",
        swatches: [{ name: "Mid natural oak", hex: "#C4A574" }, { name: "Even oak", hex: "#C8A86A" }],
        durability: "The modern wood look with a limited refinish life. Keep water off it. Laundry tile stays.",
        costs: ENGINEERED, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: "looks/floors/s9-living-mid-oak.jpg", master: "looks/floors/s9-master-mid-oak.jpg" }
      }),
      opt({
        id: "walnut", short: "Walnut", name: "Dark walnut LVP throughout",
        caption: "A dark walnut-look vinyl through the living areas and bedrooms, for a sharper contrast with the white walls and black island.",
        material: "Luxury vinyl plank",
        swatches: [{ name: "Dark walnut", hex: "#5C3A24" }, { name: "Walnut oak", hex: "#7A4A2E" }],
        durability: "Waterproof and practical with pets. A dark floor will show dust. Laundry tile stays.",
        costs: LVP, scope: "About 802 sq ft, laundry tile stays.",
        renders: { living: "looks/floors/s9-living-walnut.jpg", master: "looks/floors/s9-master-walnut.jpg" }
      })
    ],
    beach: [
      opt({
        id: "current", short: "Existing + sand oak", name: "Existing oak in living areas, sand oak in the bedrooms", current: true,
        caption: "The Beach living-room render keeps the house's existing medium-warm oak. The primary-bedroom render shows a sand or pale honey oak plank over the carpet. Laundry tile stays. Alternate floor renders were not made this turn.",
        material: "Existing hardwood + luxury vinyl plank in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Sand oak", hex: "#D4C0A0" }],
        durability: "The existing floor stays in the wet-adjacent kitchen. Bedroom LVP is the moisture-friendly half. Confirm the bedroom subfloor before you order.",
        costs: LVP,
        scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors, about 596.5 sq ft, stay as they are in this look's living render. Laundry tile stays.",
        renders: { living: null, master: null }
      })
    ],
    nautical: [
      opt({
        id: "current", short: "Existing + mid oak", name: "Existing oak in living areas, mid oak in the bedrooms", current: true,
        caption: "The Nautical living-room render keeps the existing medium-warm oak. The primary-bedroom render shows a mid-tone oak plank over the carpet. Laundry tile stays. Alternate floor renders were not made this turn.",
        material: "Existing hardwood + luxury vinyl plank in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Mid oak", hex: "#C4965A" }],
        durability: "The existing floor stays in the wet-adjacent kitchen. Bedroom LVP is the moisture-friendly half. Confirm the bedroom subfloor before you order.",
        costs: LVP,
        scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors, about 596.5 sq ft, stay as they are in this look's living render. Laundry tile stays.",
        renders: { living: null, master: null }
      })
    ],
    craftsman: [
      opt({
        id: "current", short: "Existing + mid oak", name: "Existing oak in living areas, mid oak in the bedrooms", current: true,
        caption: "The Craftsman living-room render keeps the existing medium-warm oak against the bronze-green walls. The primary-bedroom render shows a mid-tone oak plank over the carpet. Laundry tile stays. Alternate floor renders were not made this turn.",
        material: "Existing hardwood + luxury vinyl plank in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Mid oak", hex: "#C4965A" }],
        durability: "The existing floor stays in the wet-adjacent kitchen. Bedroom LVP is the moisture-friendly half. Confirm the bedroom subfloor before you order.",
        costs: LVP,
        scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors, about 596.5 sq ft, stay as they are in this look's living render. Laundry tile stays.",
        renders: { living: null, master: null }
      })
    ],
    "organic-modern": [
      opt({
        id: "current", short: "Existing + pale oak", name: "Existing oak in living areas, pale oak in the bedrooms", current: true,
        caption: "The Organic Modern living-room render keeps the existing medium-warm oak. The primary-bedroom render shows a pale honey oak plank over the carpet. Laundry tile stays. Alternate floor renders were not made this turn.",
        material: "Existing hardwood + luxury vinyl plank in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Pale oak", hex: "#D4C0A0" }],
        durability: "The existing floor stays in the wet-adjacent kitchen. Bedroom LVP is the moisture-friendly half. Confirm the bedroom subfloor before you order.",
        costs: LVP,
        scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors, about 596.5 sq ft, stay as they are in this look's living render. Laundry tile stays.",
        renders: { living: null, master: null }
      })
    ],
    japandi: [
      opt({
        id: "current", short: "Existing + pale oak", name: "Existing oak in living areas, pale oak in the bedrooms", current: true,
        caption: "The Japandi living-room render keeps the existing oak. The primary-bedroom render shows a pale white-oak plank over the carpet. Laundry tile stays. Alternate floor renders were not made this turn.",
        material: "Existing hardwood + luxury vinyl plank in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Pale oak", hex: "#D4C0A0" }],
        durability: "The existing floor stays in the wet-adjacent kitchen. Bedroom LVP is the moisture-friendly half. Confirm the bedroom subfloor before you order.",
        costs: LVP,
        scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors, about 596.5 sq ft, stay as they are in this look's living render. Laundry tile stays.",
        renders: { living: null, master: null }
      })
    ],
    "warm-minimalist": [
      opt({
        id: "current", short: "Existing + pale oak", name: "Existing oak in living areas, pale oak in the bedrooms", current: true,
        caption: "The Warm Minimalist living-room render keeps the existing medium-warm oak. The primary-bedroom render shows a pale honey oak plank over the carpet. Laundry tile stays. Alternate floor renders were not made this turn.",
        material: "Existing hardwood + luxury vinyl plank in the bedrooms",
        swatches: [{ name: "Existing oak", hex: "#B07848" }, { name: "Pale oak", hex: "#D4C0A0" }],
        durability: "The existing floor stays in the wet-adjacent kitchen. Bedroom LVP is the moisture-friendly half. Confirm the bedroom subfloor before you order.",
        costs: LVP,
        scope: "Bedroom LVP on about 205.5 sq ft. Existing hard floors, about 596.5 sq ft, stay as they are in this look's living render. Laundry tile stays.",
        renders: { living: null, master: null }
      })
    ]
  };

  var storedFloors = null;

  function loadFloors() {
    if (storedFloors) return storedFloors;
    storedFloors = {};
    try {
      var raw = window.localStorage.getItem(HOUSE.floorStorageKey);
      if (raw) storedFloors = JSON.parse(raw) || {};
    } catch (err) {
      storedFloors = {};
    }
    return storedFloors;
  }

  function saveFloors() {
    try {
      window.localStorage.setItem(HOUSE.floorStorageKey, JSON.stringify(storedFloors || {}));
    } catch (err) {}
  }

  HOUSE.floorOptions = function (look) {
    if (!look) return [];
    return HOUSE.floorsByLook[look.id] || [];
  };

  HOUSE.floorOption = function (look, id) {
    var list = HOUSE.floorOptions(look);
    var i, current = null;
    for (i = 0; i < list.length; i++) {
      if (list[i].current) current = list[i];
      if (list[i].id === id) return list[i];
    }
    return current || list[0] || null;
  };

  HOUSE.selectedFloorId = function (lookId) {
    var stored = loadFloors();
    var look = null;
    (HOUSE.looks || []).forEach(function (item) { if (item.id === lookId) look = item; });
    var options = HOUSE.floorOptions(look);
    if (!options.length) return null;
    var id = stored[lookId];
    var i;
    for (i = 0; i < options.length; i++) {
      if (options[i].id === id) return id;
    }
    for (i = 0; i < options.length; i++) {
      if (options[i].current) return options[i].id;
    }
    return options[0].id;
  };

  HOUSE.setSelectedFloorId = function (lookId, optionId) {
    loadFloors();
    storedFloors[lookId] = optionId;
    saveFloors();
  };

  HOUSE.floorHasRender = function (look, roomKey, option) {
    if (!option) option = HOUSE.floorOption(look, HOUSE.selectedFloorId(look && look.id));
    if (!option) return false;
    if (option.current) return true;
    return !!(option.renders && option.renders[roomKey]);
  };

  HOUSE.floorFile = function (look, roomKey, optionId) {
    var option = HOUSE.floorOption(look, optionId || HOUSE.selectedFloorId(look && look.id));
    if (!option) return HOUSE.lookFile(look, roomKey);
    if (option.current) return HOUSE.lookFile(look, roomKey);
    if (option.renders && option.renders[roomKey]) return option.renders[roomKey];
    return HOUSE.lookFile(look, roomKey);
  };

  HOUSE.floorRangeText = function (band) {
    if (!band) return "";
    var fmt = function (n) {
      return "$" + (Math.round(n * 100) / 100).toFixed(n % 1 === 0 ? 0 : 2).replace(/\.00$/, "");
    };
    return fmt(band.low) + "–" + fmt(band.high) + "/sf";
  };

  HOUSE.floorChipText = function (option) {
    if (!option || !option.costs) return "";
    return "DIY " + HOUSE.floorRangeText(option.costs.diy) + " · hired " + HOUSE.floorRangeText(option.costs.hired);
  };
})();
