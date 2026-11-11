/* Shop catalog and Renders gallery.
 * Look lists come from HOUSE.lookRegistry (js/looks-registry.js); product sets from HOUSE.shopData.looks.
 * Do not hard-code look ids here.
 */
(function () {
  if (typeof HOUSE === "undefined") return;

  var LEGACY_DUP = {
    kivik: "kivik",
    lack: "lack-bb",
    lamp: "rodflik-floor",
    bed: "slattum",
    dining: "lisabo-2black",
    rug: "tiphede"
  };

  var CATEGORIES = [
    { id: "sofas", label: "Sofas", slots: ["seating"], match: /sofa|loveseat|sectional|settee/i },
    { id: "chairs", label: "Chairs", slots: ["seating", "chairs", "accents", "stools", "bench"], match: /chair|armchair|stool|swivel|bench/i },
    { id: "tables", label: "Tables", slots: ["coffee", "dining-table", "dining-set"] },
    { id: "rugs", label: "Rugs", slots: ["rug"] },
    { id: "lighting", label: "Lighting", slots: ["lamp", "pendant", "vanity", "light"] },
    { id: "fans", label: "Fans", slots: ["fan"] },
    { id: "curtains", label: "Curtains", slots: ["curtains"] },
    { id: "mirrors", label: "Mirrors", slots: ["mirror"] },
    { id: "beds", label: "Beds", slots: ["bed"] },
    { id: "nightstands", label: "Nightstands", slots: ["nightstand"] },
    { id: "storage", label: "Storage", slots: ["desk"] },
    { id: "textiles", label: "Bedding & pillows", slots: ["bedding", "throw", "pillows"] },
    { id: "decor", label: "Decor", slots: ["accents", "pulls", "faucet", "art", "decor"] },
    { id: "paint", label: "Paint & prep", slots: ["bodyPaint", "trimPaint", "doorPaint", "woodPrimer", "metalPrimer", "cleaner", "caulk"] },
    { id: "exterior-accents", label: "Numbers, hardware & planters", slots: ["numbers", "hardware", "planters"] },
    { id: "plants", label: "Plants & mulch", slots: ["potPlant", "shrubs", "perennials", "mulch"] },
    { id: "flooring", label: "Flooring", ids: ["floor"] }
  ];
  HOUSE.SHOP_CATEGORIES = CATEGORIES;

  var PRICE_FILTERS = [
    { id: "", label: "Any price" },
    { id: "under-100", label: "Under $100", max: 10000 },
    { id: "100-300", label: "$100–$300", min: 10000, max: 30000 },
    { id: "300-600", label: "$300–$600", min: 30000, max: 60000 },
    { id: "600-plus", label: "$600 and up", min: 60000 }
  ];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function data() { return HOUSE.shopData || {}; }
  function shopProducts() { return data().products || []; }
  function shopById(id) {
    var list = shopProducts();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function builderRooms() { return data().builderRooms || []; }
  function builderRoom(id) {
    var list = builderRooms();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function lookName(id) {
    return (typeof HOUSE.lookDisplayName === "function") ? HOUSE.lookDisplayName(id) : String(id || "");
  }
  function lookOptions() {
    return (typeof HOUSE.catalogLookOptions === "function") ? HOUSE.catalogLookOptions() : [];
  }
  function inLook(p, lookId) {
    return typeof HOUSE.productInLook === "function" ? HOUSE.productInLook(p, lookId) : true;
  }
  function outsideNote(p, lookId) {
    return typeof HOUSE.outsideLookNote === "function" ? HOUSE.outsideLookNote(p, lookId) : "";
  }
  function editQuery(state) { return state && state.edit ? "?edit=1" : ""; }

  function adaptLegacy(p) {
    if (!p) return null;
    var facts = p.facts || [];
    var size = "";
    facts.forEach(function (f) { if (/size/i.test(f.label || "")) size = f.text || ""; });
    var rooms = [];
    var slots = [];
    var catHint = (p.row || "") + " " + (p.name || "");
    if (/loveseat|sofa/i.test(catHint)) { rooms = ["living"]; slots = ["seating"]; }
    else if (/coffee|side table/i.test(catHint)) { rooms = ["living"]; slots = ["coffee"]; }
    else if (/lamp/i.test(catHint)) { rooms = ["living", "master", "office"]; slots = ["lamp"]; }
    else if (/bed/i.test(catHint)) { rooms = ["master"]; slots = ["bed"]; }
    else if (/table and/i.test(catHint)) { rooms = ["dining", "kitchen"]; slots = ["dining-set"]; }
    else if (/rug/i.test(catHint)) { rooms = ["living"]; slots = ["rug"]; }
    else if (/vinyl|floor/i.test(catHint) || p.id === "floor") { rooms = ["living", "master", "office", "kitchen"]; slots = []; }
    return {
      id: p.id,
      name: p.name,
      maker: p.maker,
      store: p.seller || p.maker || "Shop",
      url: p.href,
      price: p.price,
      dimText: size,
      image: p.image ? (p.image.indexOf("assets/") === 0 ? p.image : "assets/" + p.image) : "",
      imageMissing: p.id === "floor",
      rooms: rooms,
      slots: slots,
      legacy: true,
      verifiedOn: HOUSE.priceChecked || "",
      availability: "Public price rechecked " + (HOUSE.priceChecked || "") + ".",
      looks: []
    };
  }

  function allCatalog(includeLegacyDups) {
    var out = [];
    var seen = {};
    shopProducts().forEach(function (p) {
      out.push(p);
      seen[p.id] = true;
    });
    (HOUSE.products || []).forEach(function (raw) {
      if (!raw || !raw.id || seen[raw.id]) return;
      if (LEGACY_DUP[raw.id] && !includeLegacyDups) return;
      var adapted = adaptLegacy(raw);
      if (adapted) {
        out.push(adapted);
        seen[adapted.id] = true;
      }
    });
    return out;
  }
  function catalogById(id, includeLegacyDups) {
    var list = allCatalog(!!includeLegacyDups);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return shopById(id) || null;
  }
  HOUSE.shopProductById = function (id) { return catalogById(id, true); };
  HOUSE.mapShopId = function (id) { return LEGACY_DUP[id] || id; };

  function categoryOf(p) {
    if (!p) return "decor";
    var name = ((p.name || "") + " " + (p.id || "") + " " + (p.row || "")).toLowerCase();
    var slots = p.slots || [];
    var i, cat;
    for (i = 0; i < CATEGORIES.length; i++) {
      cat = CATEGORIES[i];
      if (cat.ids && cat.ids.indexOf(p.id) !== -1) return cat.id;
    }
    for (i = 0; i < CATEGORIES.length; i++) {
      cat = CATEGORIES[i];
      if ((cat.id === "paint" || cat.id === "plants" || cat.id === "exterior-accents") && slots.some(function (s) { return cat.slots.indexOf(s) !== -1; })) return cat.id;
    }
    if (slots.indexOf("light") !== -1) return "lighting";
    if (slots.indexOf("rug") !== -1) return "rugs";
    if (slots.indexOf("fan") !== -1) return "fans";
    if (slots.indexOf("curtains") !== -1) return "curtains";
    if (slots.indexOf("mirror") !== -1) return "mirrors";
    if (slots.indexOf("bed") !== -1) return "beds";
    if (slots.indexOf("nightstand") !== -1) return "nightstands";
    if (slots.indexOf("coffee") !== -1 || slots.indexOf("dining-table") !== -1 || slots.indexOf("dining-set") !== -1) return "tables";
    if (slots.indexOf("lamp") !== -1 || slots.indexOf("pendant") !== -1 || slots.indexOf("vanity") !== -1) return "lighting";
    if (slots.indexOf("desk") !== -1) return "storage";
    if (slots.indexOf("chairs") !== -1 || slots.indexOf("stools") !== -1 || slots.indexOf("bench") !== -1) return "chairs";
    if (slots.indexOf("bedding") !== -1 || slots.indexOf("throw") !== -1 || slots.indexOf("pillows") !== -1) return "textiles";
    if (slots.indexOf("art") !== -1 || slots.indexOf("decor") !== -1) return "decor";
    if (slots.indexOf("seating") !== -1 || slots.indexOf("accents") !== -1) {
      if (/chair|armchair|stool|swivel/.test(name)) return "chairs";
      if (/sofa|loveseat|sectional|settee/.test(name)) return "sofas";
      if (slots.indexOf("seating") !== -1) return "sofas";
      return "decor";
    }
    if (slots.indexOf("pulls") !== -1 || slots.indexOf("faucet") !== -1) return "decor";
    for (i = 0; i < CATEGORIES.length; i++) {
      cat = CATEGORIES[i];
      if (cat.match && cat.match.test(name)) return cat.id;
    }
    return "decor";
  }
  function categoryById(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
    return null;
  }

  function houseRoomOf(builderId) {
    var rec = builderRoom(builderId);
    return (rec && rec.houseRoomId) || builderId;
  }
  function productFitsRoom(p, roomId) {
    if (!p || !roomId) return true;
    var rooms = p.rooms || [];
    if (!rooms.length) return true;
    if (rooms.indexOf(roomId) !== -1) return true;
    var house = houseRoomOf(roomId);
    if (rooms.indexOf(house) !== -1) return true;
    /* Kitchen and dining share the kitchen photographs. */
    if ((roomId === "dining" || roomId === "kitchen") && (rooms.indexOf("dining") !== -1 || rooms.indexOf("kitchen") !== -1)) return true;
    return false;
  }
  function centsOf(p) {
    if (p && typeof p.priceCents === "number") return p.priceCents;
    if (!p || !p.price) return null;
    var m = String(p.price).replace(/,/g, "").match(/(\d+)(?:\.(\d{1,2}))?/);
    if (!m) return null;
    var d = m[2] ? (m[2].length === 1 ? m[2] + "0" : m[2]) : "00";
    return parseInt(m[1], 10) * 100 + parseInt(d, 10);
  }
  function priceMatches(p, priceId) {
    if (!priceId) return true;
    var rule = null;
    PRICE_FILTERS.forEach(function (item) { if (item.id === priceId) rule = item; });
    if (!rule || !rule.id) return true;
    var cents = centsOf(p);
    if (cents == null) return false;
    if (rule.min != null && cents < rule.min) return false;
    if (rule.max != null && cents >= rule.max) return false;
    return true;
  }
  function storeGroup(store) {
    if (store === "IKEA" || store === "Costco" || store === "Target" || store === "Walmart" || store === "Wayfair" || store === "Amazon") return store;
    return "Other";
  }

  function referenceLook(state) {
    if (state && state.shopLook) return state.shopLook;
    if (typeof HOUSE.rememberedBuilderLook === "function") return HOUSE.rememberedBuilderLook();
    return "";
  }

  function filterProducts(state) {
    var lookId = state.shopLook || "";
    var store = state.shopStore || "";
    var price = state.shopPrice || "";
    var room = state.shopRoom || "";
    var cat = state.shopCategory || "";
    var list = allCatalog(!!(state && state.edit));
    return list.filter(function (p) {
      if (room && !productFitsRoom(p, room)) return false;
      if (cat && categoryOf(p) !== cat) return false;
      if (store && storeGroup(p.store) !== store) return false;
      if (!priceMatches(p, price)) return false;
      if (lookId && !inLook(p, lookId)) return false;
      return true;
    });
  }

  function shopHash(state) {
    state = state || {};
    var hash = "#/shop";
    if (state.shopItemId) hash += "/item/" + encodeURIComponent(state.shopItemId);
    else if (state.shopRoom) {
      hash += "/" + encodeURIComponent(state.shopRoom);
      if (state.shopCategory) hash += "/" + encodeURIComponent(state.shopCategory);
    }
    var bits = [];
    if (state.edit) bits.push("edit=1");
    if (state.shopLook && !state.shopItemId) bits.push("look=" + encodeURIComponent(state.shopLook));
    if (state.shopStore && !state.shopItemId) bits.push("store=" + encodeURIComponent(state.shopStore));
    if (state.shopPrice && !state.shopItemId) bits.push("price=" + encodeURIComponent(state.shopPrice));
    return hash + (bits.length ? "?" + bits.join("&") : "");
  }
  HOUSE.shopHash = shopHash;

  function chipRow(label, items, current, key, state) {
    var html = '<div class="shop-filter-row"><p class="shop-filter-label">' + esc(label) + '</p><div class="shop-chips">';
    items.forEach(function (item) {
      var next = Object.assign({}, state);
      next[key] = item.id;
      next.shopItemId = "";
      var on = (current || "") === item.id ? ' aria-current="true"' : "";
      var data = key === "shopLook" && item.id ? ' data-look-id="' + esc(item.id) + '"' : "";
      html += '<a href="' + esc(shopHash(next)) + '"' + on + data + (item.title ? ' title="' + esc(item.title) + '"' : "") + ">" + esc(item.label) + "</a>";
    });
    html += "</div></div>";
    return html;
  }

  function priceNote(p) {
    if (p.unverified) return "Price from search, confirm on the store page.";
    if (p.verifiedOn) {
      var short = String(p.verifiedOn).replace(/^November\s+/, "Nov ").replace(/^October\s+/, "Oct ").replace(/,\s+2026$/, "").replace(/ 2026$/, "");
      if (/Nov |Oct |checked/i.test(String(p.verifiedOn)) || short) {
        var when = /November 10/.test(String(p.verifiedOn)) ? "Nov 10" : short;
        return "Price checked " + when + ".";
      }
    }
    if (p.legacy && HOUSE.priceChecked) return "Price checked " + String(HOUSE.priceChecked).replace(/^November\s+/, "Nov ").replace(/,\s+2026$/, "") + ".";
    return "";
  }

  function productThumb(p) {
    if (p && p.image && !p.imageMissing) {
      return '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '">';
    }
    return '<div class="shop-fallback" aria-hidden="true"><span>' + esc((p && p.store) || "Shop") + "</span></div>";
  }

  function targetRoom(p, shopRoom) {
    if (shopRoom && productFitsRoom(p, shopRoom) && builderRoom(shopRoom)) return shopRoom;
    var rooms = p.rooms || [];
    for (var i = 0; i < rooms.length; i++) {
      if (builderRoom(rooms[i])) return rooms[i];
      var list = builderRooms();
      for (var j = 0; j < list.length; j++) {
        if (list[j].houseRoomId === rooms[i]) return list[j].id;
      }
    }
    return (builderRooms()[0] && builderRooms()[0].id) || "living";
  }
  function targetSlot(p, categoryId) {
    var slots = p.slots || [];
    var cat = categoryById(categoryId);
    if (cat && cat.slots) {
      for (var i = 0; i < cat.slots.length; i++) {
        if (slots.indexOf(cat.slots[i]) !== -1) return cat.slots[i];
      }
    }
    if (categoryId === "sofas" && slots.indexOf("seating") !== -1) return "seating";
    if (categoryId === "chairs" && slots.indexOf("accents") !== -1 && slots.indexOf("seating") !== -1) return "accents";
    return slots[0] || "";
  }

  function addHref(p, state) {
    var room = targetRoom(p, state.shopRoom);
    var slot = targetSlot(p, state.shopCategory || categoryOf(p));
    if (!room || !slot) return "";
    if (typeof HOUSE.builderHrefWithPick === "function") {
      return HOUSE.builderHrefWithPick(room, slot, p.id, { look: state.shopLook || referenceLook(state) || "", edit: state.edit });
    }
    return "#/plan/build/" + encodeURIComponent(room) + editQuery(state);
  }

  function cardHtml(p, state) {
    var lookRef = referenceLook(state);
    var note = outsideNote(p, lookRef);
    var add = addHref(p, state);
    var room = targetRoom(p, state.shopRoom);
    var roomRec = builderRoom(room);
    var addLabel = roomRec ? "Add to " + roomRec.name : "Add to my room";
    var html = '<article class="browse-card">';
    html += '<a class="browse-card-img" href="' + esc(shopHash(Object.assign({}, state, { shopItemId: p.id }))) + '">' + productThumb(p) + "</a>";
    html += "<h3>" + esc(p.name) + "</h3>";
    html += '<p class="browse-card-meta">' + esc(p.store || p.maker || "") + (p.price ? " · " + esc(p.price) : "") + "</p>";
    if (p.dimText) html += '<p class="browse-card-size">' + esc(p.dimText) + "</p>";
    var checked = priceNote(p);
    if (checked) html += '<p class="browse-card-check">' + esc(checked) + "</p>";
    if (note) html += '<p class="outside-look-note">' + esc(note) + "</p>";
    html += '<p class="browse-card-actions">';
    if (p.url) html += '<a class="browse-link" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">View at store</a>';
    if (add && slotOk(p)) html += '<a class="browse-add" href="' + esc(add) + '" data-shop-add="' + esc(p.id) + '" data-room="' + esc(room) + '" data-slot="' + esc(targetSlot(p, state.shopCategory || categoryOf(p))) + '">' + esc(addLabel) + "</a>";
    html += "</p></article>";
    return html;
  }
  function slotOk(p) { return !!(p.slots && p.slots.length); }

  function shopFiltersHtml(state) {
    var html = "";
    var rooms = [{ id: "", label: "All rooms" }].concat(builderRooms().map(function (r) { return { id: r.id, label: r.name }; }));
    html += chipRow("Room", rooms, state.shopRoom || "", "shopRoom", state);
    var cats = [{ id: "", label: "All types" }].concat(CATEGORIES.map(function (c) { return { id: c.id, label: c.label }; }));
    html += chipRow("Type", cats, state.shopCategory || "", "shopCategory", state);
    var looks = [{ id: "", label: "All looks" }].concat(lookOptions().map(function (l) { return { id: l.id, label: l.name + (l.hasProducts ? "" : " ·  no set"), title: l.hasProducts ? "" : l.note }; }));
    html += chipRow("Look", looks, state.shopLook || "", "shopLook", state);
    var stores = [{ id: "", label: "All stores" }].concat(["IKEA", "Costco", "Target", "Walmart", "Wayfair", "Amazon", "Other"].map(function (s) { return { id: s, label: s }; }));
    html += chipRow("Store", stores, state.shopStore || "", "shopStore", state);
    html += chipRow("Price", PRICE_FILTERS.map(function (p) { return { id: p.id, label: p.label }; }), state.shopPrice || "", "shopPrice", state);
    return html;
  }

  function shopItemHtml(state) {
    var p = catalogById(state.shopItemId, !!(state && state.edit));
    var back = shopHash(Object.assign({}, state, { shopItemId: "" }));
    if (!p) {
      return '<div class="browse-page"><p class="kicker">Shop</p><h1 id="view-title" tabindex="-1">Product</h1><p>That item is not in the catalog.</p><p><a class="ctrl" href="' + esc(back) + '">Back to Shop</a></p></div>';
    }
    var lookRef = referenceLook(state);
    var note = outsideNote(p, lookRef);
    var add = addHref(p, state);
    var room = targetRoom(p, state.shopRoom);
    var roomRec = builderRoom(room);
    var html = '<div class="browse-page browse-item-page">';
    html += '<p class="backline"><a class="ctrl" href="' + esc(back) + '">Back to Shop</a></p>';
    html += '<p class="kicker">' + esc(p.store || "Shop") + "</p>";
    html += '<h1 id="view-title" tabindex="-1">' + esc(p.name) + "</h1>";
    html += '<div class="browse-item-img">' + productThumb(p) + "</div>";
    if (p.price) html += '<p class="browse-card-meta">' + esc(p.price) + "</p>";
    if (p.finish) html += "<p>" + esc(p.finish) + "</p>";
    if (p.dimText) html += "<p><strong>Size.</strong> " + esc(p.dimText) + "</p>";
    if (p.fit) html += "<p>" + esc(p.fit) + "</p>";
    var checked = priceNote(p);
    if (checked) html += '<p class="browse-card-check">' + esc(checked) + "</p>";
    if (p.unverified) html += '<p class="note">' + esc(p.unverified) + "</p>";
    if (note) html += '<p class="outside-look-note">' + esc(note) + "</p>";
    html += '<p class="browse-card-actions">';
    if (p.url) html += '<a class="browse-link" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">View at store</a>';
    if (add && slotOk(p)) html += '<a class="browse-add" href="' + esc(add) + '" data-shop-add="' + esc(p.id) + '" data-room="' + esc(room) + '" data-slot="' + esc(targetSlot(p, categoryOf(p))) + '">' + esc(roomRec ? "Add to " + roomRec.name : "Add to my room") + "</a>";
    html += "</p>";
    html += '<p class="note">This does not place an order. You can add a piece to any room it fits, even if it comes from another look.</p>';
    html += "</div>";
    return html;
  }

  HOUSE.shopBrowseHtml = function (state) {
    if (state.shopItemId) return shopItemHtml(state);
    var list = filterProducts(state);
    var prefer = referenceLook(state);
    if (prefer) {
      list = list.slice().sort(function (a, b) {
        var ia = inLook(a, prefer) ? 0 : 1;
        var ib = inLook(b, prefer) ? 0 : 1;
        return ia - ib;
      });
    }
    var html = '<div class="browse-page">';
    html += '<p class="kicker">Shop</p>';
    html += '<h1 id="view-title" tabindex="-1">Shop</h1>';
    html += '<p class="browse-intro">Browse real products and add them to a room. You can mix pieces from any look.</p>';
    var filtersOpen = typeof window !== "undefined" && window.innerWidth >= 800;
    html += '<details class="shop-filters"' + (filtersOpen ? " open" : "") + '><summary>Filter by room, type, look, store, or price</summary>';
    html += shopFiltersHtml(state);
    html += "</details>";
    var shopLookEntry = state.shopLook && HOUSE.lookRegistry ? HOUSE.lookRegistry.byId(state.shopLook) : null;
    if (shopLookEntry && !shopLookEntry.hasProducts) html += '<p class="note" data-shop-no-set>' + esc(shopLookEntry.name + ": " + shopLookEntry.productSetNote) + "</p>";
    if (!list.length) {
      html += '<p class="empty">Nothing matches these filters. Try All rooms, All types, or All stores.</p>';
    } else {
      html += '<p class="browse-count">' + list.length + (list.length === 1 ? " item" : " items") + "</p>";
      html += '<div class="browse-grid">';
      list.forEach(function (p) { html += cardHtml(p, state); });
      html += "</div>";
    }
    html += "</div>";
    return html;
  };

  /* ---------- Renders gallery ---------- */
  function rendersIndex() {
    return (HOUSE.rendersIndex && HOUSE.rendersIndex.renders) || {};
  }
  function renderSlug(key, rec) {
    if (rec && rec.image) {
      var base = rec.image.split("/").pop().replace(/\.jpe?g$/i, "");
      if (base) return base;
    }
    return encodeURIComponent(key);
  }
  function findRender(slug) {
    if (!slug) return null;
    var index = rendersIndex();
    if (index[slug]) return { key: slug, rec: index[slug] };
    var decoded = slug;
    try { decoded = decodeURIComponent(slug); } catch (err) { decoded = slug; }
    if (index[decoded]) return { key: decoded, rec: index[decoded] };
    var key;
    for (key in index) {
      if (!Object.prototype.hasOwnProperty.call(index, key)) continue;
      if (renderSlug(key, index[key]) === slug) return { key: key, rec: index[key] };
    }
    return null;
  }
  HOUSE.findRenderBySlug = findRender;
  HOUSE.renderSlug = renderSlug;

  function rendersHash(state) {
    var hash = "#/renders";
    if (state && state.renderSlug) hash += "/" + encodeURIComponent(state.renderSlug);
    var bits = [];
    if (state && state.edit) bits.push("edit=1");
    if (state && state.renderSlug && state.renderBg && state.renderBg !== "staged") bits.push("bg=" + encodeURIComponent(state.renderBg));
    if (state && !state.renderSlug && state.renderRoom) bits.push("room=" + encodeURIComponent(state.renderRoom));
    if (state && !state.renderSlug && state.renderLook) bits.push("look=" + encodeURIComponent(state.renderLook));
    return hash + (bits.length ? "?" + bits.join("&") : "");
  }
  HOUSE.rendersHash = rendersHash;

  function roomDisplayName(roomId) {
    var rec = builderRoom(roomId);
    if (rec) return rec.name;
    if (HOUSE.rooms) {
      for (var i = 0; i < HOUSE.rooms.length; i++) if (HOUSE.rooms[i].id === roomId) return HOUSE.rooms[i].name;
    }
    return roomId;
  }
  function lookPhotoFor(roomId, lookId) {
    if (!HOUSE.lookRegistry || !lookId) return null;
    var rec = builderRoom(roomId);
    var key = (rec && rec.lookKey) || roomId;
    return HOUSE.lookRegistry.renderFor(lookId, key);
  }
  function builderHrefForRender(key, rec, state) {
    if (typeof HOUSE.builderHrefForRecord === "function") return HOUSE.builderHrefForRecord(rec, { edit: state && state.edit });
    var room = rec.room || "living";
    var bits = ["bg=staged"];
    if (rec.look) bits.push("look=" + encodeURIComponent(rec.look));
    if (state && state.edit) bits.push("edit=1");
    return "#/plan/build/" + encodeURIComponent(room) + "?" + bits.join("&");
  }

  function productLink(id) {
    return "#/shop/item/" + encodeURIComponent(id);
  }

  function galleryDetailHtml(state, found) {
    var rec = found.rec;
    var key = found.key;
    var bg = state.renderBg || "staged";
    if (bg !== "original" && bg !== "look") bg = "staged";
    var original = rec.original || "";
    var lookImg = lookPhotoFor(rec.room, rec.look);
    var staged = rec.image || "";
    if (lookImg && staged && lookImg.replace(/^assets\//, "") === staged.replace(/^assets\//, "")) lookImg = null;
    var src = bg === "original" ? original : (bg === "look" && lookImg ? lookImg : staged);
    if (!src) src = staged || original;
    var isClosest = rec.status === "closest";
    var html = '<div class="gallery-page gallery-detail">';
    html += '<p class="backline"><a class="ctrl" href="' + esc(rendersHash({ edit: state.edit })) + '">All renders</a></p>';
    html += '<p class="kicker">Renders</p>';
    html += '<h1 id="view-title" tabindex="-1">' + esc(roomDisplayName(rec.room)) + " · " + esc(lookName(rec.look)) + "</h1>";
    html += '<figure class="gallery-hero">';
    html += '<img src="' + esc(src) + '" alt="' + esc(roomDisplayName(rec.room) + ", " + (bg === "original" ? "original photograph" : bg === "look" ? "look idea" : "staged render")) + '">';
    if (isClosest && bg === "staged") html += '<div class="builder-closest-overlay">Closest match, not exact.</div>';
    html += '<div class="builder-bg-toggle">';
    ["original", "look", "staged"].forEach(function (kind) {
      var label = kind === "original" ? "Original" : (kind === "look" ? "Look" : "Staged");
      var href = rendersHash({ edit: state.edit, renderSlug: state.renderSlug, renderBg: kind });
      var on = bg === kind ? ' aria-current="true"' : "";
      var available = kind === "original" ? !!original : (kind === "look" ? !!lookImg : !!staged);
      if (!available && kind !== "staged") return;
      html += '<a href="' + esc(href) + '"' + on + ">" + label + "</a>";
    });
    html += "</div></figure>";
    if (isClosest) {
      html += '<p class="builder-closest-banner"><strong>Closest match, not exact.</strong> ' + esc(rec.disclaimer || "") + "</p>";
    } else if (rec.caveats && bg === "staged") {
      html += '<p class="builder-staged-note">' + esc(rec.caveats) + "</p>";
    }
    var picks = rec.picks || {};
    if (Object.keys(picks).length) html += '<p class="gallery-open"><a class="builder-render-btn" href="' + esc(builderHrefForRender(key, rec, state)) + '">Open in builder</a></p>';
    else html += '<p class="builder-staged-note">A whole-look concept render. Its pieces are styling ideas, not picked products, so it does not open in the builder.</p>';
    var slots = Object.keys(picks);
    if (slots.length) {
      html += '<h2 class="section-label">Pieces in this render</h2>';
      html += '<div class="browse-grid gallery-picks">';
      slots.forEach(function (slot) {
        var p = catalogById(picks[slot], true) || shopById(picks[slot]);
        if (!p) {
          html += "<p>" + esc(slot) + " · " + esc(picks[slot]) + "</p>";
          return;
        }
        var note = outsideNote(p, rec.look);
        html += '<article class="browse-card">';
        html += '<a class="browse-card-img" href="' + esc(productLink(p.id)) + '">' + productThumb(p) + "</a>";
        html += "<h3>" + esc(p.name) + "</h3>";
        html += '<p class="browse-card-meta">' + esc(p.store || "") + (p.price ? " · " + esc(p.price) : "") + "</p>";
        if (note) html += '<p class="outside-look-note">' + esc(note) + "</p>";
        html += "</article>";
      });
      html += "</div>";
    }
    html += "</div>";
    return html;
  }

  function galleryFilterHtml(state, allKeys, index, roomF, lookF) {
    var rooms = [], counts = {};
    allKeys.forEach(function (key) {
      var rec = index[key];
      if (rec.room && rooms.indexOf(rec.room) === -1) rooms.push(rec.room);
      if (rec.look) counts[rec.look] = (counts[rec.look] || 0) + 1;
    });
    /* Every active look from the registry, in registry order, so this filter matches the
       other pages. Looks with no staged renders yet show (0). */
    var looks = HOUSE.lookRegistry ? HOUSE.lookRegistry.activeIds() : Object.keys(counts);
    var order = (HOUSE.rooms || []).map(function (r) { return r.id; });
    rooms.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
    function chip(label, room, look, on, isLook) {
      var href = rendersHash({ edit: state.edit, renderRoom: room, renderLook: look });
      var data = isLook && look ? ' data-look-id="' + esc(look) + '"' : "";
      return '<a class="ctrl filter-chip' + (isLook && look && !counts[look] ? " is-empty" : "") + '" href="' + esc(href) + '"' + data + (on ? ' aria-current="true"' : "") + ">" + esc(label) + "</a>";
    }
    var html = '<div class="gallery-filters" role="group" aria-label="Filter renders">';
    html += '<p class="gallery-filter-row"><span class="gallery-filter-label">Room</span>' + chip("All rooms", "", lookF, !roomF);
    rooms.forEach(function (r) { html += chip(roomDisplayName(r), r, lookF, roomF === r); });
    html += "</p>";
    html += '<p class="gallery-filter-row"><span class="gallery-filter-label">Look</span>' + chip("All looks", roomF, "", !lookF);
    looks.forEach(function (l) { html += chip(lookName(l) + " (" + (counts[l] || 0) + ")", roomF, l, lookF === l, true); });
    html += "</p></div>";
    return html;
  }

  function galleryListHtml(state) {
    var index = rendersIndex();
    var allKeys = Object.keys(index);
    var roomF = state.renderRoom || "";
    var lookF = state.renderLook || "";
    var keys = allKeys.filter(function (key) {
      var rec = index[key];
      return (!roomF || rec.room === roomF) && (!lookF || rec.look === lookF);
    });
    var html = '<div class="gallery-page">';
    html += '<p class="kicker">Renders</p>';
    html += '<h1 id="view-title" tabindex="-1">Renders</h1>';
    html += '<p class="browse-intro">Finished pictures of rooms with the pieces you picked. New ones show up here when they are ready.</p>';
    if (!keys.length) {
      html += '<p class="empty">No rendered rooms yet. Open the room builder, pick a look and some pieces, then tap Make a render.</p>';
      html += '<p><a class="builder-render-btn" href="#/plan/build">Open the room builder</a></p>';
    } else {
      html += galleryFilterHtml(state, allKeys, index, roomF, lookF);
      if (!keys.length) html += '<p class="empty">No renders match this filter. <a href="' + esc(rendersHash({ edit: state.edit })) + '">Show all renders</a>.</p>';
      html += '<div class="gallery-grid">';
      keys.forEach(function (key) {
        var rec = index[key];
        var slug = renderSlug(key, rec);
        var href = rendersHash({ edit: state.edit, renderSlug: slug, renderBg: "staged" });
        html += '<a class="gallery-card" href="' + esc(href) + '">';
        if (rec.image) html += '<img src="' + esc(rec.image) + '" alt="' + esc(roomDisplayName(rec.room) + ", " + lookName(rec.look)) + '">';
        html += '<span class="gallery-card-text"><strong>' + esc(roomDisplayName(rec.room)) + "</strong>";
        html += "<span>" + esc(lookName(rec.look)) + "</span>";
        if (rec.status === "closest") html += '<span class="closest-badge">Closest match</span>';
        html += "</span></a>";
      });
      html += "</div>";
    }
    html += "</div>";
    return html;
  }

  HOUSE.rendersGalleryHtml = function (state) {
    if (state.renderSlug) {
      var found = findRender(state.renderSlug);
      if (found) return galleryDetailHtml(state, found);
      return '<div class="gallery-page"><p class="kicker">Renders</p><h1 id="view-title" tabindex="-1">Render</h1><p>That render is not in the list yet.</p><p><a class="ctrl" href="#/renders">All renders</a></p></div>';
    }
    return galleryListHtml(state);
  };

  var galleryTimer = null;
  function refreshGalleryIndex() {
    if (typeof location !== "undefined" && location.protocol === "file:") return;
    fetch("renders/renders.json?t=" + Date.now(), { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("missing");
      return res.json();
    }).then(function (data) {
      if (!data || !data.renders) return;
      var before = JSON.stringify(rendersIndex());
      HOUSE.rendersIndex = data;
      var after = JSON.stringify(rendersIndex());
      if (before !== after) {
        try { window.dispatchEvent(new Event("howell:renders-updated")); } catch (err) { /* ignore */ }
      }
    }).catch(function () { /* ignore */ });
  }
  HOUSE.refreshRendersIndex = refreshGalleryIndex;
  HOUSE.startRendersGalleryPoll = function () {
    if (galleryTimer) return;
    if (typeof location !== "undefined" && location.protocol === "file:") return;
    galleryTimer = setInterval(refreshGalleryIndex, 20000);
    refreshGalleryIndex();
  };
  HOUSE.stopRendersGalleryPoll = function () {
    if (galleryTimer) { clearInterval(galleryTimer); galleryTimer = null; }
  };

  document.addEventListener("click", function (event) {
    var add = event.target.closest && event.target.closest("[data-shop-add]");
    if (!add) return;
    var id = add.getAttribute("data-shop-add");
    var room = add.getAttribute("data-room");
    var slot = add.getAttribute("data-slot");
    if (!id || !room || !slot) return;
    if (typeof HOUSE.setBuilderPick === "function") HOUSE.setBuilderPick(room, slot, id);
  });
})();
