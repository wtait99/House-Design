/* Looks registry: the ONE list of looks every page reads.
 * Added November 11, 2026. Loaded after data.js, extra-looks.js, products-by-look.js
 * nautical-sourced.js and exterior-looks.js, and before shop-builder.js, gallery-shop.js and app.js.
 *
 * What lives where
 * ----------------
 * - LOOKS below decides which looks exist, their order, their status
 *   (active | hidden | archived), their signature accents, and their product set id.
 * - Long copy (blurb, captions, swatches, render prefix) stays in the look definitions in
 *   js/data.js and js/extra-looks.js (HOUSE.looks). Product sets stay in
 *   HOUSE.shopData.looks / lookSlots (js/products-by-look.js, js/nautical-sourced.js).
 *   The registry joins them; pages must not keep their own look lists.
 * - "hidden" looks are kept but not listed anywhere. "archived" looks are kept, listed
 *   nowhere, and their files stay in the repo. A viewer can also hide or archive a look
 *   on their own device (Looks page, edit mode); that is stored per device and also
 *   applies to every page through HOUSE.lookRegistry.active().
 *
 * To add a look: add its definition (extra-looks.js), then add one line here.
 * A look in HOUSE.looks with no line here is treated as hidden and logged as a warning.
 */
(function () {
  if (typeof HOUSE === "undefined") return;

  var LOOKS = [
    /* Exterior paint looks (main house), November 11, 2026 */
    { id: "ext-lodge", status: "active", scope: "exterior", accents: ["Iron Ore siding and trim", "Existing wood door", "Black barn light", "Brass numbers", "Silver Brunnera"] },
    { id: "ext-cottage", status: "active", scope: "exterior", accents: ["Evergreen Fog siding", "Alabaster trim", "Rookwood Dark Green door", "Vintage brass", "Catmint and hydrangea"] },
    { id: "ext-classic", status: "active", scope: "exterior", accents: ["Alabaster siding and trim", "Tricorn Black door", "Matte black lantern", "Boxwood row"] },
    { id: "ext-charcoal-cedar", status: "active", scope: "exterior", accents: ["Peppercorn charcoal siding and trim", "Rough-sawn cedar under the windows", "Existing wood door", "Black barn light", "Brass numbers"] },
    /* Nautical variants, November 11, 2026 */
    { id: "nt-navy", status: "active", accents: ["Navy walls", "Signal-red textiles", "Brass", "Rope", "Stripes"] },
    { id: "nt-keeper", status: "active", accents: ["Rookwood dark green", "Barn-red textiles", "Rope", "Brass", "Weathered teak", "No blue"] },
    { id: "nt-cabin", status: "active", accents: ["Khaki walls", "Iron-ore island and office", "Navy stripes and blankets", "Brass"] },
    /* Whole house */
    { id: "quiet", status: "active", accents: ["Warm white", "Sage", "Pale honey oak"] },
    { id: "northwoods", status: "active", accents: ["Deep olive", "Ochre", "Caramel oak"] },
    { id: "modern", status: "active", accents: ["Cream and oatmeal", "Charcoal green", "Brass and iron"] },
    { id: "farm", status: "active", accents: ["Warm tan", "Barn-red island", "Terracotta"] },
    { id: "moody-lodge", status: "active", accents: ["Near-black olive", "Espresso", "Aged brass", "Walnut-look floors"] },
    { id: "mid-century-cabin", status: "active", accents: ["Mustard island", "Rust office", "Brass", "Walnut-look floors"] },
    { id: "scandi-cabin", status: "active", accents: ["Soft warm white", "Pale oak", "Matte black hardware"] },
    { id: "english-cottage", status: "active", accents: ["Plum island", "Dusty rose", "Muted sage", "Antique brass"] },
    { id: "black-wood-modern", status: "active", accents: ["Matte-black island", "Black hardware", "Mid-tone oak"] },
    { id: "beach", status: "active", accents: ["Natural Linen", "Clary Sage", "Cavern Clay", "Sand oak"] },
    { id: "nautical", status: "active", accents: ["Khaki Shade", "Brass", "Iron Ore", "No navy on walls"] },
    { id: "craftsman", status: "active", accents: ["Roycroft Bronze Green", "Khaki", "Brass", "Existing oak"] },
    { id: "organic-modern", status: "active", accents: ["Natural Linen", "Clay island", "Urbane Bronze", "Pale oak"] },
    { id: "japandi", status: "active", accents: ["Evergreen Fog", "Shoji White", "Pale oak", "Cream cabinets"] },
    { id: "warm-minimalist", status: "active", accents: ["Shoji White", "Low contrast", "Urbane Bronze", "Pale oak"] },
    /* Room studies (earlier, partial rooms) */
    { id: "warmwhite", status: "active", accents: ["Warm white", "Pale oak"] },
    { id: "softsage", status: "active", accents: ["Soft sage", "Warm white", "Pale oak"] },
    { id: "driftwood", status: "active", accents: ["Greige", "Driftwood"] },
    { id: "mossy", status: "active", accents: ["Moss green", "Warm white"] },
    { id: "warmwhite-study", status: "active", accents: ["Warm white"] }
  ];

  var STATUSES = ["active", "hidden", "archived"];
  var USER_KEY = HOUSE.lookStorageKey || "howell-looks-v1";

  function defById(id) {
    var list = HOUSE.looks || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function shopLooks() { return (HOUSE.shopData && HOUSE.shopData.looks) || {}; }
  function lookSlots() { return (HOUSE.shopData && HOUSE.shopData.lookSlots) || {}; }

  function renderPaths(def) {
    var out = {};
    (def.rooms || []).forEach(function (room) {
      var rel = typeof HOUSE.lookFile === "function" ? HOUSE.lookFile(def, room) : ("looks/" + def.prefix + "-" + room + ".jpg");
      if (rel) out[room] = /^assets\//.test(rel) ? rel : "assets/" + rel;
    });
    return out;
  }

  function build() {
    var seen = {};
    var entries = [];
    LOOKS.forEach(function (row) {
      var def = defById(row.id);
      if (!def || seen[row.id]) {
        if (!def && typeof console !== "undefined") console.warn("looks-registry: no definition for", row.id);
        return;
      }
      seen[row.id] = true;
      var setId = row.productSet !== undefined ? row.productSet : (shopLooks()[row.id] ? row.id : null);
      var slots = setId ? (lookSlots()[setId] || {}) : {};
      var pickCount = 0;
      Object.keys(slots).forEach(function (room) { pickCount += Object.keys(slots[room] || {}).length; });
      entries.push({
        id: row.id,
        name: def.name || row.id,
        group: def.group || "house",
        kicker: def.kicker || "",
        description: def.blurb || "",
        palette: (def.swatches || []).map(function (s) { return { name: s.name, hex: s.hex, role: s.column || "", use: s.use || "" }; }),
        accents: (row.accents || []).slice(),
        scope: row.scope || (def.exterior ? "exterior" : "interior"),
        status: STATUSES.indexOf(row.status) !== -1 ? row.status : "active",
        rooms: (def.rooms || []).slice(),
        renders: renderPaths(def),
        productSetId: setId,
        hasProducts: !!setId && pickCount > 0,
        productSetNote: (!!setId && pickCount > 0) ? "" : "No product set yet. Starts with empty picks; add pieces from any look.",
        def: def
      });
    });
    (HOUSE.looks || []).forEach(function (def) {
      if (seen[def.id]) return;
      if (typeof console !== "undefined") console.warn("looks-registry: look not registered, kept hidden:", def.id);
      entries.push({ id: def.id, name: def.name || def.id, group: def.group || "house", kicker: def.kicker || "", description: def.blurb || "",
        palette: [], accents: [], status: "hidden", rooms: (def.rooms || []).slice(), renders: renderPaths(def),
        productSetId: shopLooks()[def.id] ? def.id : null, hasProducts: !!shopLooks()[def.id], productSetNote: "", def: def, unregistered: true });
    });
    return entries;
  }

  var entries = build();

  /* Per-device hide/archive from the Looks page edit mode. Same storage key as before. */
  function readUser() {
    var empty = { hidden: [], archived: [] };
    try {
      var raw = window.localStorage.getItem(USER_KEY);
      if (!raw) return empty;
      var p = JSON.parse(raw);
      return { hidden: Array.isArray(p.hidden) ? p.hidden.slice() : [], archived: Array.isArray(p.archived) ? p.archived.slice() : [] };
    } catch (err) { return empty; }
  }
  var user = readUser();
  function saveUser() {
    try { window.localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch (err) { /* blocked storage */ }
  }
  function userStatus(id) {
    if (user.archived.indexOf(id) !== -1) return "archived";
    if (user.hidden.indexOf(id) !== -1) return "hidden";
    return "visible";
  }
  function setUserStatus(id, status) {
    user.hidden = user.hidden.filter(function (x) { return x !== id; });
    user.archived = user.archived.filter(function (x) { return x !== id; });
    if (status === "hidden") user.hidden.push(id);
    if (status === "archived") user.archived.push(id);
    saveUser();
  }

  function byId(id) {
    for (var i = 0; i < entries.length; i++) if (entries[i].id === id) return entries[i];
    return null;
  }
  /* Looks every page lists: registry status active and not hidden on this device. */
  function active() {
    return entries.filter(function (e) { return e.status === "active" && userStatus(e.id) === "visible"; });
  }
  /* Registry-active looks the viewer hid or archived on this device (Looks page edit mode). */
  function userHidden() {
    return entries.filter(function (e) { return e.status === "active" && userStatus(e.id) !== "visible"; });
  }
  function groups() {
    var list = (HOUSE.lookGroups || [{ id: "house", label: "Whole house" }, { id: "study", label: "Room studies" }]).slice();
    entries.forEach(function (e) {
      if (!list.some(function (g) { return g.id === e.group; })) list.push({ id: e.group, label: "More looks" });
    });
    return list;
  }
  function inGroupOrder(list) {
    var out = [];
    groups().forEach(function (g) { list.forEach(function (e) { if (e.group === g.id) out.push(e); }); });
    return out;
  }

  HOUSE.lookRegistry = {
    entries: function () { return entries.slice(); },
    byId: byId,
    active: function () { return inGroupOrder(active()); },
    activeIds: function () { return inGroupOrder(active()).map(function (e) { return e.id; }); },
    userHidden: function () { return inGroupOrder(userHidden()); },
    forRoom: function (roomKey, includeUserHidden) {
      var list = includeUserHidden ? active().concat(userHidden()) : active();
      return inGroupOrder(list.filter(function (e) { return e.rooms.indexOf(roomKey) !== -1; }));
    },
    groups: groups,
    userStatus: userStatus,
    setUserStatus: setUserStatus,
    renderFor: function (id, roomKey) { var e = byId(id); return (e && e.renders[roomKey]) || null; },
    name: function (id) { var e = byId(id); return e ? e.name : String(id || ""); },
    isActive: function (id) { var e = byId(id); return !!e && e.status === "active"; },
    rebuild: function () { entries = build(); return entries.length; }
  };
})();
