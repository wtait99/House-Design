/* Local main-house view. Classic script. Reads HOUSE from data.js. No network calls. */
(function () {
  "use strict";

  if (typeof HOUSE === "undefined") {
    document.body.textContent = "The data file did not load beside this page.";
    return;
  }

  var desktopQuery = window.matchMedia("(min-width: 1100px)");
  var memory = { roomId: "living", set: "now", photo: 1, lookId: null, filter: "all" };
  var booted = false;
  var prevState = null;
  var focusCtrlName = null;
  var focusHref = null;

  function desktop() { return desktopQuery.matches; }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function roomById(id) { return findById(HOUSE.rooms, id); }
  function mapPhotoById(id) {
    return findById(HOUSE.photoMap || [], id) || findById(HOUSE.photoMapUnpinned || [], id);
  }
  function mapPhotos() { return HOUSE.photoMap || []; }
  function mapUnpinned() { return HOUSE.photoMapUnpinned || []; }
  function mapPhotosForRoom(roomId) {
    return mapPhotos().filter(function (item) { return item.roomId === roomId; });
  }
  function mapUnpinnedForRoom(roomId) {
    return mapUnpinned().filter(function (item) { return item.roomId === roomId; });
  }
  function mapItemForFile(file) {
    var all = mapPhotos().concat(mapUnpinned());
    var i;
    for (i = 0; i < all.length; i++) if (all[i].file === file) return all[i];
    return null;
  }
  function mapPoint(item) {
    var x = item.x, y = item.y;
    if (item.method === "same-spot") {
      var rad = ((item.heading + 90) % 360) * Math.PI / 180;
      x += Math.sin(rad) * 28;
      y += -Math.cos(rad) * 28;
    }
    return { x: x, y: y };
  }
  function mapPinStyle(item) {
    var plan = HOUSE.plan;
    if (item == null || item.x == null || item.y == null) return "display:none";
    var pt = mapPoint(item);
    var left = (pt.x / plan.width * 100).toFixed(2);
    var top = (pt.y / plan.height * 100).toFixed(2);
    return "left:" + left + "%;top:" + top + "%;--heading:" + item.heading + "deg";
  }
  function mapKindLabel(item) {
    var kind = item.set === "earlier" ? "Earlier" : "Vacant";
    var method = item.method === "same-spot"
      ? ("same spot as tour photograph " + (item.sameSpotAs || item.tour))
      : item.method === "unpinned"
        ? "not on the tour map"
        : "tour match";
    return kind + " · " + method + (item.confidence ? " · " + item.confidence : "");
  }
  function mapCardKicker(item) {
    if (item.method === "same-spot") {
      return "Earlier photograph · same spot as tour photograph " + (item.sameSpotAs || item.tour);
    }
    if (item.method === "unpinned") return "Not on the tour map";
    return "Tour photograph " + item.number;
  }
  function lookById(id) {
    var e = HOUSE.lookRegistry.byId(id);
    return e && e.status === "active" ? e.def : null;
  }
  function productById(id) { return findById(HOUSE.products, id); }
  function budgetIdeas() { return HOUSE.budgetIdeas || []; }
  function budgetIdeaById(id) { return findById(budgetIdeas(), id); }
  function moneyRange(low, high) {
    function fmt(n) {
      if (n === null || n === undefined || n === "") return "";
      return "$" + Number(n).toLocaleString("en-US");
    }
    if (low == null && high == null) return "";
    if (low == null) return fmt(high);
    if (high == null || low === high) return fmt(low);
    return fmt(low) + "–" + fmt(high);
  }
  function budgetSourceAnchor(url, label) {
    if (!url || !/^https:\/\//.test(url)) return esc(label);
    var host = "";
    try { host = new URL(url).hostname; } catch (err) { return esc(label); }
    var allowed = /^(newsroom\.)?pinterest\.com$|^(www\.)?(houzz|angi|carolinarenew|vanderkolkpainting|limewashpros|dgfloors|compositepaint|andersonandgrant|reddit|homesandgardens|housebeautiful|bhg|sherwin-williams|benjaminmoore|behr|prnewswire)\.com$|^corporate\.behr\.com$|^creators\.yahoo\.com$|^(www\.)?yahoo\.com$|^2ok\.lol$/;
    if (!allowed.test(host)) return esc(label);
    return '<a class="out" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
      esc(label) + '<span class="sr"> (opens a new tab)</span></a>';
  }
  function roomByLookKey(key) {
    for (var i = 0; i < HOUSE.rooms.length; i++) if (HOUSE.rooms[i].lookKey === key) return HOUSE.rooms[i];
    return null;
  }

  function swatchById(look, id) {
    if (!look) return null;
    for (var i = 0; i < look.swatches.length; i++) if (look.swatches[i].id === id) return look.swatches[i];
    return null;
  }

  function photosOf(room, set) {
    if (!room || !room.photos) return [];
    if (set === "earlier") return room.photos.filter(function (p) { return p.kind === "earlier"; });
    return room.photos.filter(function (p) { return p.kind !== "earlier"; });
  }
  function hasEarlier(room) { return photosOf(room, "earlier").length > 0; }
  function photoCount(room) { return room && room.photos ? room.photos.length : 0; }

  function vacantPhoto(room) {
    var list = photosOf(room, "now");
    return list[0] || null;
  }

  /* Look lists come only from HOUSE.lookRegistry (js/looks-registry.js). */
  function registryDefs(list) { return list.map(function (e) { return e.def; }); }
  function visibleLooks() {
    return registryDefs(HOUSE.lookRegistry.active());
  }
  function looksForRoom(roomKey, includeHidden) {
    return registryDefs(HOUSE.lookRegistry.forRoom(roomKey, !!includeHidden));
  }
  function parseCompareIds(raw) {
    var out = [];
    String(raw || "").split(",").forEach(function (id) {
      id = id.trim();
      if (lookById(id) && out.indexOf(id) === -1 && out.length < 2) out.push(id);
    });
    return out;
  }

  function lookStatus(id) { return HOUSE.lookRegistry.userStatus(id); }

  function setLookStatus(id, status) { HOUSE.lookRegistry.setUserStatus(id, status); }

  function hiddenCount() {
    return HOUSE.lookRegistry.userHidden().length;
  }

  function looksForFilter(filter) {
    return registryDefs(filter === "hidden" ? HOUSE.lookRegistry.userHidden() : HOUSE.lookRegistry.active());
  }

  function lookFile(look, roomKey) {
    return HOUSE.lookFile(look, roomKey);
  }

  function conceptFile(look, roomKey) {
    if (look && typeof HOUSE.floorFile === "function") return HOUSE.floorFile(look, roomKey);
    return lookFile(look, roomKey);
  }

  function blankState() {
    return {
      section: "looks",
      edit: false,
      roomId: "living",
      set: "now",
      photo: 1,
      frame: false,
      lookId: null,
      lookRoom: null,
      ba: "concept",
      swatchId: null,
      filter: "all",
      compare: [],
      comparing: false,
      productId: null,
      planPane: "overview",
      mapId: null,
      guestOpen: false
    };
  }

  function parse(hash) {
    var raw = (hash || "").replace(/^#/, "");
    var q = raw.indexOf("?");
    var path = q >= 0 ? raw.slice(0, q) : raw;
    var query = q >= 0 ? raw.slice(q + 1) : "";
    var parts = path.split("/").filter(Boolean);
    var params = new URLSearchParams(query);
    var state = blankState();
    if (params.get("edit") === "1") state.edit = true;
    try {
      if (!state.edit && new URLSearchParams(window.location.search).get("edit") === "1") state.edit = true;
    } catch (err) { /* ignore */ }

    var section = parts[0] || "looks";
    if (section === "shortlist" || section === "more") section = "plan";
    if (section === "gallery") section = "renders";
    if (section === "room") section = "rooms";
    if (section === "look") section = "looks";
    if (section === "photomap") section = "map";

    if (section === "rooms") {
      state.section = "rooms";
      var room = roomById(parts[1]) || roomById("living");
      state.roomId = room.id;
      /* === shop-builder hook === */
      if (parts[2] === "build") {
        state.section = "plan";
        state.planPane = "build";
        state.buildRoom = parts[3] || room.id;
        if (params.get("bg") === "staged") state.builderBg = "staged";
        else if (params.get("bg") === "look") state.builderBg = "look";
        state.builderFrom = params.get("from") || "";
        state.builderLook = params.get("look") || "";
        state.builderStore = params.get("store") || "";
        state.builderSlot = params.get("slot") || "";
        if (params.get("p")) state.buildPicks = decodeURIComponent(params.get("p"));
        if (params.get("item")) state.shopItem = params.get("item");
        return state;
      }
      var set = "now";
      var photo = 1;
      var frame = false;
      var i = 2;
      if (parts[2] === "earlier" || parts[2] === "now" || parts[2] === "looks" || parts[2] === "compare") {
        set = parts[2];
        i = 3;
      } else if (room.deferred) {
        state.roomId = room.id;
        state.set = "now";
        state.photo = 1;
        state.frame = false;
        state.guestOpen = false;
        return state;
      }
      if (set === "compare") {
        state.set = "compare";
        state.comparing = true;
        state.compare = parseCompareIds(parts[3]);
        if (parts[4] === "now" || parts[4] === "before") state.ba = "now";
        if (parts[4] === "frame" || parts[5] === "frame") state.frame = true;
        if (room.deferred) state.guestOpen = true;
        return state;
      }
      if (set === "looks") {
        state.set = "looks";
        if (parts[3] && lookById(parts[3])) state.lookId = parts[3];
        if (parts[4] === "now" || parts[4] === "before") state.ba = "now";
        if (parts[4] === "frame" || parts[5] === "frame") state.frame = true;
        if (room.deferred) state.guestOpen = true;
        return state;
      }
      if (set === "earlier" && !hasEarlier(room)) set = "now";
      var list = photosOf(room, set);
      for (; i < parts.length; i++) {
        if (parts[i] === "frame") frame = true;
        else if (/^\d+$/.test(parts[i])) photo = parseInt(parts[i], 10);
      }
      if (!list.length) {
        state.set = "now";
        state.photo = 1;
        state.frame = false;
        state.guestOpen = !room.deferred;
        return state;
      }
      if (photo < 1) photo = 1;
      if (photo > list.length) photo = list.length;
      state.set = set;
      state.photo = photo;
      state.frame = frame;
      if (room.deferred) state.guestOpen = true;
      return state;
    }

    if (section === "looks") {
      state.section = "looks";
      state.filter = params.get("filter") === "hidden" ? "hidden" : "all";
      if (parts[1] === "compare") {
        state.comparing = true;
        state.compare = parseCompareIds(parts[2]);
        if (parts[3] && lookById(state.compare[0]) && lookById(state.compare[0]).rooms.indexOf(parts[3]) !== -1) {
          state.lookRoom = parts[3];
        }
        if (parts[4] === "now" || parts[4] === "before" || parts[3] === "now" || parts[3] === "before") state.ba = "now";
        if (parts.indexOf("frame") !== -1) state.frame = true;
        return state;
      }
      if (parts[1]) {
        var look = lookById(parts[1]);
        if (look) {
          state.lookId = look.id;
          if (parts[2] === "shop") {
            /* === shop-builder hook === */
            state.shopItem = parts[3] || params.get("item");
          } else if (parts[2] && look.rooms.indexOf(parts[2]) !== -1) state.lookRoom = parts[2];
          if (parts[3] === "before" || parts[3] === "now" || params.get("ba") === "before" || params.get("ba") === "now") state.ba = "now";
          if (parts[3] === "after" || parts[3] === "concept") state.ba = "concept";
          if (parts[3] === "frame" || parts[4] === "frame") state.frame = true;
          if (parts[2] && swatchById(look, parts[2]) && !state.lookRoom) state.swatchId = parts[2];
        }
      }
      var hold = parseCompareIds(params.get("hold") || params.get("compare") || "");
      if (hold.length) state.compare = hold;
      return state;
    }

    if (section === "shop") {
      state.section = "shop";
      if (parts[1] === "item") {
        state.shopItemId = parts[2] || "";
      } else {
        state.shopRoom = parts[1] || "";
        state.shopCategory = parts[2] || "";
      }
      state.shopLook = params.get("look") || "";
      state.shopStore = params.get("store") || "";
      state.shopPrice = params.get("price") || "";
      if (params.get("item") && !state.shopItemId) state.shopItemId = params.get("item");
      return state;
    }

    if (section === "renders") {
      state.section = "renders";
      if (parts[1]) {
        try { state.renderSlug = decodeURIComponent(parts.slice(1).join("/")); }
        catch (err) { state.renderSlug = parts.slice(1).join("/"); }
      } else {
        state.renderSlug = "";
      }
      if (params.get("k") && !state.renderSlug) {
        try { state.renderSlug = decodeURIComponent(params.get("k")); }
        catch (err) { state.renderSlug = params.get("k"); }
      }
      state.renderBg = params.get("bg") === "original" || params.get("bg") === "look" ? params.get("bg") : "staged";
      state.renderRoom = params.get("room") || "";
      state.renderLook = params.get("look") || "";
      return state;
    }

    if (section === "plan") {
      state.section = "plan";
      if (parts[1] === "budget" || parts[1] === "ideas") {
        state.planPane = "budget";
        if (budgetIdeaById(parts[2])) state.budgetId = parts[2];
      } else if (parts[1] === "build") {
        /* === shop-builder hook === */
        state.planPane = "build";
        state.buildRoom = parts[2] || "living";
        if (params.get("bg") === "staged") state.builderBg = "staged";
        else if (params.get("bg") === "look") state.builderBg = "look";
        state.builderFrom = params.get("from") || "";
        state.builderLook = params.get("look") || "";
        state.builderStore = params.get("store") || "";
        state.builderSlot = params.get("slot") || "";
        if (params.get("p")) state.buildPicks = decodeURIComponent(params.get("p"));
        if (params.get("item")) state.shopItem = params.get("item");
      } else if (parts[1] === "candidates" || parts[1] === "shortlist") {
        state.section = "shop";
        var candId = parts[2] || "";
        if (candId) state.shopItemId = (typeof HOUSE.mapShopId === "function" ? HOUSE.mapShopId(candId) : candId);
        if (params.get("edit") === "1" && candId) state.shopItemId = candId;
        return state;
      } else if (productById(parts[1])) {
        state.section = "shop";
        state.shopItemId = (typeof HOUSE.mapShopId === "function" ? HOUSE.mapShopId(parts[1]) : parts[1]);
        if (params.get("edit") === "1") state.shopItemId = parts[1];
        return state;
      }
      return state;
    }

    if (section === "map") {
      state.section = "map";
      var mapped = mapPhotoById(parts[1]);
      state.mapId = mapped ? mapped.id : null;
      state.frame = parts[2] === "frame" || parts[1] === "frame";
      if (parts[1] === "frame") state.mapId = null;
      return state;
    }

    state.section = "looks";
    return state;
  }

  function queryFrom(state) {
    var bits = [];
    if (state && state.edit) bits.push("edit=1");
    if (state && state.section === "looks" && state.filter === "hidden" && state.edit) bits.push("filter=hidden");
    if (state && state.section === "looks" && !state.comparing && state.compare && state.compare.length && !state.lookId) {
      bits.push("compare=" + state.compare.join(","));
    }
    return bits.length ? "?" + bits.join("&") : "";
  }

  function buildHash(state) {
    if (state.section === "rooms") {
      var room = roomById(state.roomId) || roomById("living");
      if (room.deferred && !state.guestOpen && state.set !== "looks" && state.set !== "compare") {
        return "#/rooms/" + room.id + queryFrom(state);
      }
      if (state.set === "compare" && state.compare && state.compare.length) {
        return "#/looks/compare/" + state.compare.join(",") + (room.lookKey ? "/" + room.lookKey : "") + queryFrom({ edit: state.edit });
      }
      if (state.set === "looks") {
        var lHash = "#/rooms/" + room.id + "/looks";
        if (state.lookId) lHash += "/" + state.lookId;
        if (state.ba === "now") lHash += "/now";
        if (state.frame) lHash += "/frame";
        return lHash + queryFrom(state);
      }
      var set = state.set === "earlier" && hasEarlier(room) ? "earlier" : "now";
      var list = photosOf(room, set);
      if (!list.length) return "#/rooms/" + room.id + queryFrom(state);
      var photo = state.photo || 1;
      if (photo < 1) photo = 1;
      if (photo > list.length) photo = list.length;
      var hash = "#/rooms/" + room.id + "/" + set + "/" + photo;
      if (state.frame) hash += "/frame";
      return hash + queryFrom(state);
    }
    if (state.section === "looks") {
      if (state.comparing && state.compare && state.compare.length) {
        var cmp = "#/looks/compare/" + state.compare.join(",");
        if (state.lookRoom) {
          cmp += "/" + state.lookRoom;
          if (state.ba === "now") cmp += "/now";
          if (state.frame) cmp += "/frame";
        }
        return cmp + queryFrom({ edit: state.edit });
      }
      var lookHash = "#/looks";
      if (state.lookId) {
        lookHash += "/" + state.lookId;
        /* === shop-builder hook === */
        if (state.shopItem) {
          lookHash += "/shop/" + state.shopItem;
        } else if (state.lookRoom) {
          lookHash += "/" + state.lookRoom;
          if (state.ba === "now") lookHash += "/now";
          if (state.frame) lookHash += "/frame";
        } else if (state.swatchId) {
          lookHash += "/" + state.swatchId;
        }
      }
      return lookHash + queryFrom(state);
    }
    if (state.section === "shop") {
      if (typeof HOUSE.shopHash === "function") return HOUSE.shopHash(state);
      return "#/shop" + queryFrom(state);
    }
    if (state.section === "renders") {
      if (typeof HOUSE.rendersHash === "function") return HOUSE.rendersHash(state);
      return "#/renders" + queryFrom(state);
    }
    if (state.section === "plan") {
      if (state.planPane === "candidates") {
        if (typeof HOUSE.shopHash === "function") return HOUSE.shopHash({ shopItemId: state.productId, edit: state.edit });
        return (state.productId ? "#/plan/candidates/" + state.productId : "#/plan/candidates") + queryFrom(state);
      }
      if (state.planPane === "budget") {
        return (state.budgetId ? "#/plan/budget/" + state.budgetId : "#/plan/budget") + queryFrom(state);
      }
      /* === shop-builder hook === */
      if (state.planPane === "build") {
        if (typeof HOUSE.builderHash === "function") return HOUSE.builderHash(state);
        return "#/plan/build" + (state.buildRoom ? "/" + state.buildRoom : "") + queryFrom(state);
      }
      return "#/plan" + queryFrom(state);
    }
    if (state.section === "map") {
      var mapHash = "#/map";
      if (state.mapId) {
        mapHash += "/" + state.mapId;
        if (state.frame) mapHash += "/frame";
      }
      return mapHash + queryFrom(state);
    }
    return "#/looks" + queryFrom(state);
  }

  function isSheet(state) {
    if (desktop()) return false;
    if (state.section === "plan" && (state.productId || state.budgetId)) return true;
    if (state.section === "looks" && state.shopItem) return true;
    if (state.section === "looks" && state.swatchId && !state.lookRoom) return true;
    return false;
  }

  function remember(state) {
    if (state.section === "rooms") {
      memory.roomId = state.roomId;
      memory.set = state.set;
      memory.photo = state.photo;
    }
    if (state.section === "looks") {
      memory.filter = state.filter;
      if (state.lookId) memory.lookId = state.lookId;
    }
  }

  function roomsHash(state) {
    var room = roomById(memory.roomId) || roomById("living");
    return buildHash({
      section: "rooms",
      roomId: room.id,
      set: memory.roomId === room.id ? (memory.set === "looks" || memory.set === "compare" ? "now" : (memory.set || "now")) : "now",
      photo: memory.roomId === room.id ? (memory.photo || 1) : 1,
      edit: state && state.edit,
      frame: false
    });
  }

  function looksIndexHash(filter, state) {
    return buildHash({
      section: "looks",
      lookId: null,
      lookRoom: null,
      swatchId: null,
      comparing: false,
      compare: (state && state.compare) || [],
      filter: (state && state.edit && filter) || "all",
      edit: state && state.edit,
      frame: false
    });
  }

  function navHref(section, state) {
    if (section === "rooms") return roomsHash(state);
    if (section === "looks") {
      if (state.section === "looks" && (state.lookId || state.comparing)) return looksIndexHash(state.filter, state);
      return looksIndexHash(state.section === "looks" ? state.filter : "all", state);
    }
    if (section === "shop") return "#/shop" + queryFrom({ edit: state.edit });
    if (section === "renders") return "#/renders" + queryFrom({ edit: state.edit });
    if (section === "map") return "#/map" + queryFrom({ edit: state.edit });
    return "#/plan" + queryFrom({ edit: state.edit });
  }

  function externalAnchor(url, label) {
    if (!/^https:\/\/(www\.)?(homedepot\.com|ikea\.com|cursor\.com)\//.test(url)) {
      return esc(label);
    }
    return '<a class="out" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
      esc(label) + '<span class="sr"> (opens a new tab)</span></a>';
  }

  function notesHtml(items) {
    var html = '<dl class="notes">';
    items.forEach(function (item) {
      html += "<div><dt>" + esc(item.label) + "</dt><dd>" + esc(item.text) + "</dd></div>";
    });
    return html + "</dl>";
  }

  function ctrlLink(href, label, ctrl, disabled) {
    if (disabled) {
      return '<span class="ctrl" data-ctrl="' + esc(ctrl) + '" aria-disabled="true">' + esc(label) + "</span>";
    }
    return '<a class="ctrl" data-ctrl="' + esc(ctrl) + '" href="' + esc(href) + '">' + esc(label) + "</a>";
  }

  function photoAt(room, setOrIndex, maybeIndex) {
    if (typeof setOrIndex === "string") {
      var list = photosOf(room, setOrIndex);
      return list[(maybeIndex || 1) - 1];
    }
    return room && room.photos ? room.photos[(setOrIndex || 1) - 1] : null;
  }

  function photoKindLabel(photo) {
    if (!photo) return "";
    if (photo.kind === "earlier") return "Earlier photograph";
    return "Now · vacant photograph";
  }

  function conceptBadge() {
    return '<span class="concept-badge">' + esc(HOUSE.conceptBadge || "Concept, not construction-accurate") + "</span>";
  }

  function nowCaption() {
    return "Now: the vacant photograph of this room, before any concept.";
  }

  function lookHref(look, roomKey, ba, frame, state) {
    return buildHash({
      section: "looks",
      lookId: look.id,
      lookRoom: roomKey || null,
      swatchId: null,
      filter: (state && state.filter) || "all",
      compare: (state && state.compare) || [],
      ba: ba || "concept",
      frame: !!frame,
      edit: state && state.edit
    });
  }

  function roomHref(room, set, photo, frame, state) {
    return buildHash({
      section: "rooms",
      roomId: room.id,
      set: set || "now",
      photo: photo || 1,
      frame: !!frame,
      edit: state && state.edit
    });
  }

  function renderNav(state) {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      var section = link.getAttribute("data-nav");
      link.setAttribute("href", navHref(section, state));
      var current = state.section;
      if (current === "map") current = "rooms";
      if (section === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    var sub = document.getElementById("rail-sub");
    if (state.section === "rooms") {
      var html = '<p class="rail-kicker">Rooms</p>';
      HOUSE.rooms.forEach(function (room) {
        var current = state.roomId === room.id ? ' aria-current="true"' : "";
        var href = room.deferred && !(state.roomId === room.id && state.guestOpen)
          ? ("#/rooms/" + room.id + queryFrom({ edit: state.edit }))
          : roomHref(room, state.roomId === room.id ? (state.set === "earlier" && hasEarlier(room) ? "earlier" : "now") : "now", state.roomId === room.id ? state.photo : 1, false, state);
        var label = room.name + (room.deferred ? " · later" : "");
        html += '<a data-room="' + esc(room.id) + '" href="' + esc(href) + '"' + current + ">" + esc(label) + "</a>";
      });
      sub.innerHTML = html;
      return;
    }
    if (state.section === "map") {
      var mapHtml = '<p class="rail-kicker">Photo map</p>';
      mapHtml += '<a href="#/map' + queryFrom({ edit: state.edit }) + '"' + (!state.mapId ? ' aria-current="true"' : "") + ">Whole plan</a>";
      HOUSE.rooms.forEach(function (room) {
        var pins = mapPhotosForRoom(room.id);
        if (!pins.length) return;
        var current = "";
        if (state.mapId) {
          var selected = mapPhotoById(state.mapId);
          if (selected && selected.roomId === room.id) current = ' aria-current="true"';
        }
        mapHtml += '<a href="#/map/' + esc(pins[0].id) + queryFrom({ edit: state.edit }) + '"' + current + ">" + esc(room.name) + " (" + pins.length + ")</a>";
      });
      sub.innerHTML = mapHtml;
      return;
    }
    if (state.section === "shop") {
      var shopHtml = '<p class="rail-kicker">Shop</p>';
      shopHtml += '<a href="#/shop' + queryFrom({ edit: state.edit }) + '"' + (!state.shopRoom && !state.shopItemId ? ' aria-current="true"' : "") + ">All rooms</a>";
      var shopRooms = (HOUSE.shopData && HOUSE.shopData.builderRooms) || [];
      shopRooms.forEach(function (item) {
        var cur = state.shopRoom === item.id && !state.shopItemId ? ' aria-current="true"' : "";
        shopHtml += '<a href="#/shop/' + encodeURIComponent(item.id) + queryFrom({ edit: state.edit }) + '"' + cur + ">" + esc(item.name) + "</a>";
      });
      sub.innerHTML = shopHtml;
      return;
    }
    if (state.section === "renders") {
      var rendHtml = '<p class="rail-kicker">Renders</p>';
      rendHtml += '<a href="#/renders' + queryFrom({ edit: state.edit }) + '"' + (!state.renderSlug && !state.renderLook && !state.renderRoom ? ' aria-current="true"' : "") + ">All renders</a>";
      var index = (HOUSE.rendersIndex && HOUSE.rendersIndex.renders) || {};
      var railKeys = Object.keys(index);
      if (railKeys.length > 8 && typeof HOUSE.rendersHash === "function") {
        var railLooks = [];
        railKeys.forEach(function (key) { if (railLooks.indexOf(index[key].look) === -1) railLooks.push(index[key].look); });
        rendHtml += '<p class="rail-kicker">By look</p>';
        railLooks.forEach(function (lookId) {
          var lbl = typeof HOUSE.lookDisplayName === "function" ? HOUSE.lookDisplayName(lookId) : lookId;
          var on = !state.renderSlug && state.renderLook === lookId && !state.renderRoom ? ' aria-current="true"' : "";
          rendHtml += '<a href="' + esc(HOUSE.rendersHash({ edit: state.edit, renderLook: lookId })) + '"' + on + ">" + esc(lbl) + "</a>";
        });
        sub.innerHTML = rendHtml;
        return;
      }
      railKeys.forEach(function (key) {
        var rec = index[key];
        var slug = typeof HOUSE.renderSlug === "function" ? HOUSE.renderSlug(key, rec) : key;
        var lookLabel = typeof HOUSE.lookDisplayName === "function" ? HOUSE.lookDisplayName(rec.look) : rec.look;
        var roomLabel = rec.room;
        var rooms = (HOUSE.shopData && HOUSE.shopData.builderRooms) || [];
        rooms.forEach(function (item) { if (item.id === rec.room) roomLabel = item.name; });
        var cur = state.renderSlug === slug ? ' aria-current="true"' : "";
        rendHtml += '<a href="#/renders/' + encodeURIComponent(slug) + queryFrom({ edit: state.edit }) + '"' + cur + ">" + esc(roomLabel) + " · " + esc(lookLabel) + "</a>";
      });
      sub.innerHTML = rendHtml;
      return;
    }
    if (state.section === "looks") {
      var lookHtml = '<p class="rail-kicker">Looks</p>';
      lookHtml += '<a href="' + esc(looksIndexHash("all", state)) + '"' + (state.filter === "all" && !state.lookId && !state.comparing ? ' aria-current="true"' : "") + ">All looks</a>";
      if (state.edit) {
        lookHtml += '<a href="' + esc(looksIndexHash("hidden", state)) + '"' + (state.filter === "hidden" && !state.lookId && !state.comparing ? ' aria-current="true"' : "") + ">Hidden (" + hiddenCount() + ")</a>";
      }
      var railLooks = looksForFilter(state.edit && state.filter === "hidden" ? "hidden" : "all");
      var railGroups = HOUSE.lookRegistry.groups();
      railGroups.forEach(function (group) {
        railLooks.filter(function (look) { return (look.group || "house") === group.id; }).forEach(function (look) {
          var current = state.lookId === look.id ? ' aria-current="true"' : "";
          lookHtml += '<a data-look="' + esc(look.id) + '" href="' + esc(lookHref(look, null, "concept", false, state)) + '"' + current + ">" + esc(look.name) + "</a>";
        });
      });
      railLooks.filter(function (look) {
        return railGroups.every(function (group) { return (look.group || "house") !== group.id; });
      }).forEach(function (look) {
        var current = state.lookId === look.id ? ' aria-current="true"' : "";
        lookHtml += '<a data-look="' + esc(look.id) + '" href="' + esc(lookHref(look, null, "concept", false, state)) + '"' + current + ">" + esc(look.name) + "</a>";
      });
      sub.innerHTML = lookHtml;
      return;
    }
    if (state.section === "plan") {
      var planHtml = '<p class="rail-kicker">Plan</p>';
      planHtml += '<a href="#/plan' + queryFrom({ edit: state.edit }) + '"' + (!state.planPane || state.planPane === "overview" ? ' aria-current="true"' : "") + ">Overview</a>";
      planHtml += '<a href="#/plan/budget' + queryFrom({ edit: state.edit }) + '"' + (state.planPane === "budget" && !state.budgetId ? ' aria-current="true"' : "") + ">Budget ideas</a>";
      /* === shop-builder hook === */
      planHtml += '<a href="#/plan/build' + queryFrom({ edit: state.edit }) + '"' + (state.planPane === "build" && !state.buildRoom ? ' aria-current="true"' : "") + ">Room builder</a>";
      if (state.planPane === "build" && state.buildRoom) {
        var buildLabel = state.buildRoom;
        var bRooms = (HOUSE.shopData && HOUSE.shopData.builderRooms) || [];
        bRooms.forEach(function (item) { if (item.id === state.buildRoom) buildLabel = item.name; });
        planHtml += '<a href="#/plan/build/' + esc(state.buildRoom) + queryFrom({ edit: state.edit }) + '" aria-current="true">' + esc(buildLabel) + "</a>";
      }
      if (state.planPane === "budget" && state.budgetId && budgetIdeaById(state.budgetId)) {
        planHtml += '<a href="#/plan/budget/' + esc(state.budgetId) + queryFrom({ edit: state.edit }) + '" aria-current="true">' + esc(budgetIdeaById(state.budgetId).name) + "</a>";
      }
      planHtml += '<a href="#/shop' + queryFrom({ edit: state.edit }) + '">Shop</a>';
      planHtml += '<a href="#/renders' + queryFrom({ edit: state.edit }) + '">Renders</a>';
      sub.innerHTML = planHtml;
      return;
    }
    sub.innerHTML = "";
  }

  function heroHtml(room, photo, index, set) {
    var list = photosOf(room, set);
    var label = "Open the entire photograph. " + room.name + ", " + index + " of " + list.length + ".";
    return '<div class="hero">' +
      '<button type="button" class="hero-hit" data-action="open-frame" data-ctrl="frame" aria-label="' + esc(label) + '">' +
      '<img data-photo data-file="' + esc(photo.file) + '" alt="' + esc(photo.alt) + '" src="assets/' + esc(photo.file) + '">' +
      "</button>" +
      '<div class="missing" hidden>' +
      '<p class="missing-title">Photograph not in this folder</p>' +
      '<p class="missing-file">assets/' + esc(photo.file) + "</p>" +
      "<p>No other picture is substituted.</p>" +
      "</div></div>";
  }

  function captionHtml(room, index, set, state) {
    var list = photosOf(room, set);
    var photo = list[index - 1];
    var prev = roomHref(room, set, index - 1, false, state);
    var next = roomHref(room, set, index + 1, false, state);
    var frame = roomHref(room, set, index, true, state);
    var caption = set === "earlier"
      ? (room.captionEarlier || "Earlier photograph, with belongings still in the room.")
      : (photo && photo.title ? photo.title + ". " + (room.captionNow || "") : (room.captionNow || "Now: empty room, November 9, 2026."));
    var html = '<div class="caption-band"><div class="measure">' +
      '<h1 id="view-title" tabindex="-1">' + esc(room.name) + "</h1>" +
      '<p class="caption">' + esc(caption.trim()) + "</p>" +
      '<p class="fileline">' + esc(photoKindLabel(photo)) + " · " + index + " of " + list.length + (set === "earlier" ? " in Earlier" : " in Now") + "</p>" +
      '<p class="crop-note">This view is cropped. Tap the photo to see the whole picture.</p>' +
      '<div class="ctrl-row">' +
      ctrlLink(frame, "Entire photograph", "frame", false);
    if (list.length > 1) {
      html += ctrlLink(prev, "Previous", "prev", index <= 1);
      html += ctrlLink(next, "Next", "next", index >= list.length);
    }
    html += "</div></div></div>";
    return html;
  }

  function setTabsHtml(room, state) {
    var nowCount = photosOf(room, "now").length;
    var earlierCount = photosOf(room, "earlier").length;
    if (!earlierCount && nowCount <= 1 && !room.lookKey) return "";
    var html = '<div class="set-tabs" role="tablist" aria-label="Photographs in this room">';
    if (nowCount) {
      var nowOn = state.set === "now";
      html += '<a class="set-tab' + (nowOn ? " is-on" : "") + '" href="' + esc(roomHref(room, "now", 1, false, state)) + '"' + (nowOn ? ' aria-current="true"' : "") + ">Now (" + nowCount + ")</a>";
    }
    if (earlierCount) {
      var earlierOn = state.set === "earlier";
      html += '<a class="set-tab' + (earlierOn ? " is-on" : "") + '" href="' + esc(roomHref(room, "earlier", 1, false, state)) + '"' + (earlierOn ? ' aria-current="true"' : "") + ">Earlier (" + earlierCount + ")</a>";
    }
    html += "</div>";
    return html;
  }

  function roomIndexHtml(currentId, state) {
    var html = '<h2 class="section-label">Rooms</h2>';
    HOUSE.rooms.forEach(function (room) {
      var now = photosOf(room, "now").length;
      var earlier = photosOf(room, "earlier").length;
      var href = room.deferred
        ? "#/rooms/" + room.id + queryFrom({ edit: state && state.edit })
        : roomHref(room, "now", 1, false, state);
      var current = room.id === currentId ? ' aria-current="true"' : "";
      var meta = room.deferred
        ? "Deferred"
        : (room.id === currentId ? "Showing" : (earlier ? now + " now, " + earlier + " earlier" : (now === 1 ? "1 photograph" : now + " photographs")));
      var first = vacantPhoto(room);
      if (!first) {
        html += '<a class="roomlink no-thumb" data-room="' + esc(room.id) + '" href="' + esc(href) + '"' + current + ">" +
          '<span><span class="roomlink-name">' + esc(room.name) + '</span><span class="roomlink-meta">' + esc(meta) + "</span></span></a>";
        return;
      }
      html += '<a class="roomlink" data-room="' + esc(room.id) + '" href="' + esc(href) + '"' + current + ">" +
        '<span class="thumb"><img data-photo data-file="' + esc(first.file) + '" alt="" src="assets/' + esc(first.file) + '">' +
        '<span class="missing" hidden>' + esc(first.file) + "</span></span>" +
        '<span><span class="roomlink-name">' + esc(room.name) + '</span><span class="roomlink-meta">' + esc(meta) + "</span></span></a>";
    });
    return html;
  }

  function lookCarousel(room, looks, currentId, state) {
    if (!looks.length) return "";
    var idx = 0;
    looks.forEach(function (look, i) { if (look.id === currentId) idx = i; });
    var look = looks[idx];
    var file = conceptFile(look, room.lookKey);
    var floorOpt = HOUSE.floorOption ? HOUSE.floorOption(look, HOUSE.selectedFloorId(look.id)) : null;
    var prev = looks[(idx + looks.length - 1) % looks.length];
    var next = looks[(idx + 1) % looks.length];
    var href = "#/rooms/" + room.id + "/looks/" + look.id + queryFrom({ edit: state.edit });
    var prevHref = "#/rooms/" + room.id + "/looks/" + prev.id + queryFrom({ edit: state.edit });
    var nextHref = "#/rooms/" + room.id + "/looks/" + next.id + queryFrom({ edit: state.edit });
    var open = lookHref(look, room.lookKey, "concept", false, state);
    var html = '<div class="look-carousel" aria-roledescription="carousel" aria-label="Looks for ' + esc(room.name) + '">';
    html += '<p class="carousel-kicker">Look ' + (idx + 1) + " of " + looks.length + "</p>";
    html += '<div class="carousel-frame">';
    if (looks.length > 1) html += ctrlLink(prevHref, "Previous look", "prev-look", false);
    html += '<a class="carousel-hit" href="' + esc(open) + '">';
    html += '<span class="carousel-media"><span class="floor-media" data-floor-host="' + esc(look.id) + '" data-room-key="' + esc(room.lookKey) + '"><img data-photo data-file="' + esc(file) + '" alt="' + esc(room.name + ", " + look.name + " concept") + '" src="assets/' + esc(file) + '">' + conceptBadge() + floorOverlay(look, room.lookKey, floorOpt, false) + '<span class="missing" hidden></span></span></span>';
    html += '<span class="carousel-name">' + esc(look.name) + "</span>";
    html += '<span class="carousel-meta">' + esc((look.kicker || "") + (HOUSE.roomCountLabel ? " · " + HOUSE.roomCountLabel(look) : "")) + "</span>";
    html += "</a>";
    if (looks.length > 1) html += ctrlLink(nextHref, "Next look", "next-look", false);
    html += "</div>" + floorToggleHtml(look) + "</div>";
    return html;
  }

  function lookGridForRoom(room, looks, state) {
    if (!looks.length) return "";
    var html = '<div class="room-look-grid">';
    looks.forEach(function (look) {
      var file = conceptFile(look, room.lookKey);
      var href = lookHref(look, room.lookKey, "concept", false, state);
      var floorOpt = HOUSE.floorOption ? HOUSE.floorOption(look, HOUSE.selectedFloorId(look.id)) : null;
      html += '<a class="room-look-card" href="' + esc(href) + '">';
      html += '<span class="room-look-media"><span class="floor-media" data-floor-host="' + esc(look.id) + '" data-room-key="' + esc(room.lookKey) + '"><img data-photo data-file="' + esc(file) + '" alt="" src="assets/' + esc(file) + '">' + conceptBadge() + floorOverlay(look, room.lookKey, floorOpt, false) + '<span class="missing" hidden></span></span></span>';
      html += '<span class="room-look-name">' + esc(look.name) + "</span>";
      html += '<span class="room-look-meta">' + esc(HOUSE.roomCountLabel ? HOUSE.roomCountLabel(look) : (look.rooms.length + " rooms")) + "</span>";
      html += "</a>";
    });
    html += "</div>";
    return html;
  }

  function comparePicker(looks, roomKey, state) {
    if (!looks || looks.length < 2) return "";
    var a = (state.compare && state.compare[0]) || looks[0].id;
    var b = (state.compare && state.compare[1]) || looks[1].id;
    if (a === b && looks[1]) b = looks[1].id;
    var html = '<form class="compare-picker" data-compare-form data-room="' + esc(roomKey || "") + '" action="#">';
    html += '<p class="section-label">Compare two looks</p>';
    html += '<div class="compare-fields">';
    ["a", "b"].forEach(function (name, i) {
      var selected = i === 0 ? a : b;
      html += '<label class="compare-label">' + (i === 0 ? "First look" : "Second look") + '<select name="' + name + '">';
      looks.forEach(function (look) {
        html += '<option value="' + esc(look.id) + '"' + (look.id === selected ? " selected" : "") + ">" + esc(look.name) + "</option>";
      });
      html += "</select></label>";
    });
    var go = "#/looks/compare/" + a + "," + b + (roomKey ? "/" + roomKey : "") + queryFrom({ edit: state.edit });
    html += '<a class="ctrl compare-go" data-compare-go href="' + esc(go) + '">Compare</a>';
    html += "</div></form>";
    return html;
  }

  function renderRoomStage(state) {
    var room = roomById(state.roomId);
    if (room.deferred && !state.guestOpen && state.set !== "looks") {
      return '<div class="pending-stage deferred-stage">' +
        '<p class="kicker">Later</p>' +
        '<h1 id="view-title" class="pending-title" tabindex="-1">' + esc(room.name) + "</h1>" +
        '<p class="pending-body">' + esc(room.deferredNote || "Photographs are collapsed until you open them.") + "</p>" +
        '<p class="ctrl-row">' + ctrlLink("#/rooms/" + room.id + "/now/1" + queryFrom({ edit: state.edit }), "Show photographs", "open-guest", false) + "</p>" +
        (desktop() ? "" : '<div class="room-copy">' + notesHtml(room.notes) + roomIndexHtml(room.id, state) + "</div>") +
        "</div>";
    }
    if (!photoCount(room)) {
      return '<div class="pending-stage">' +
        '<p class="kicker">' + esc(room.name) + "</p>" +
        '<h1 id="view-title" class="pending-title" tabindex="-1">' + esc(room.pendingTitle || room.name) + "</h1>" +
        '<p class="pending-body">' + esc(room.pendingBody || "") + "</p></div>" +
        (desktop() ? "" : '<div class="room-copy">' + notesHtml(room.notes) + roomIndexHtml(room.id, state) + "</div>");
    }
    var set = state.set === "earlier" && hasEarlier(room) ? "earlier" : "now";
    var list = photosOf(room, set);
    var photo = list[state.photo - 1] || list[0];
    var index = list.indexOf(photo) + 1;
    var looks = room.lookKey ? looksForRoom(room.lookKey, false) : [];
    var html = '<div class="room-stage">';
    html += setTabsHtml(room, { set: set, edit: state.edit });
    html += heroHtml(room, photo, index, set) + captionHtml(room, index, set, state);
    if (looks.length) {
      html += '<section class="room-looks-block">';
      html += '<h2 class="section-label">Looks for this room</h2>';
      html += '<div class="look-phone">' + lookCarousel(room, looks, state.lookId || looks[0].id, state) + "</div>";
      html += '<div class="look-desk">' + lookGridForRoom(room, looks, state) + "</div>";
      html += comparePicker(looks, room.lookKey, state);
      html += "</section>";
    }
    if (!desktop()) {
      var currentMap = mapPhotosForRoom(room.id).filter(function (item) {
        return item.file === photo.file;
      })[0];
      html += '<div class="room-copy">' + notesHtml(room.notes) + renderMiniPlan(room.id, currentMap ? currentMap.id : null, true, photo.file) + roomIndexHtml(room.id, state) + "</div>";
    }
    /* === shop-builder hook === */
    var buildRooms = {};
    ((HOUSE.shopData && HOUSE.shopData.builderRooms) || []).forEach(function (item) { buildRooms[item.id] = item.id; });
    html += '<p class="ctrl-row">';
    if (buildRooms[room.id]) {
      html += '<a class="ctrl" href="#/plan/build/' + esc(buildRooms[room.id]) + queryFrom({ edit: state.edit }) + '">Furnish this room</a>';
      if (room.id === "kitchen") html += ' <a class="ctrl" href="#/plan/build/dining' + queryFrom({ edit: state.edit }) + '">Furnish the dining area</a>';
    }
    html += ' <a class="ctrl" href="#/map' + queryFrom({ edit: state.edit }) + '">Photo map</a>';
    html += "</p>";
    html += "</div>";
    return html;
  }

  function chipsHtml(look, compact) {
    var html = '<div class="chips' + (compact ? " chips-compact" : "") + '" aria-hidden="true">';
    look.swatches.forEach(function (swatch) {
      html += '<span class="chip" title="' + esc(swatch.name) + '" data-hex="' + esc(swatch.hex) + '" style="background-color:' + esc(swatch.hex) + '"></span>';
    });
    html += "</div>";
    return html;
  }

  function swatchRoleLine(swatch) {
    var bare = swatch.use.replace(/\.$/, "");
    if (bare.toLowerCase() === swatch.column.toLowerCase()) return swatch.column;
    return swatch.column + " — " + swatch.use;
  }

  function swatchRows(look, state) {
    return look.swatches.map(function (swatch) {
      var href = buildHash({
        section: "looks",
        lookId: look.id,
        lookRoom: null,
        swatchId: swatch.id,
        filter: state.filter,
        ba: "concept",
        frame: false,
        edit: state.edit
      });
      return '<a class="swatch-row" data-swatch="' + esc(swatch.id) + '" href="' + esc(href) + '">' +
        '<span class="chip" data-hex="' + esc(swatch.hex) + '" style="background-color:' + esc(swatch.hex) + '" aria-hidden="true"></span>' +
        "<span><span class=\"swatch-name\">" + esc(swatch.name) + "</span>" +
        '<span class="swatch-role">' + esc(swatchRoleLine(swatch)) + "</span>" +
        '<span class="hex">' + esc(swatch.hex) + " · approximate</span></span></a>";
    }).join("");
  }

  function bindComparePickers() {
    document.querySelectorAll("[data-compare-form]").forEach(function (form) {
      var go = form.querySelector("[data-compare-go]");
      if (!go) return;
      function update() {
        var a = form.querySelector('select[name="a"]');
        var b = form.querySelector('select[name="b"]');
        var ids = [a && a.value, b && b.value].filter(Boolean);
        var room = form.getAttribute("data-room") || "";
        var edit = document.getElementById("shell") && document.getElementById("shell").dataset.edit === "1" ? "?edit=1" : "";
        if (ids.length === 2 && ids[0] !== ids[1]) {
          go.setAttribute("href", "#/looks/compare/" + ids.join(",") + (room ? "/" + room : "") + edit);
          go.removeAttribute("aria-disabled");
        } else {
          go.setAttribute("href", "#/looks" + edit);
          go.setAttribute("aria-disabled", "true");
        }
      }
      form.addEventListener("change", update);
      form.addEventListener("submit", function (event) { event.preventDefault(); });
      update();
    });
  }

  function nowPhotoForLook(look, roomKey) {
    if (typeof HOUSE.nowPhotoForLook === "function") return HOUSE.nowPhotoForLook(look, roomKey);
    var host = roomByLookKey(roomKey);
    return host ? vacantPhoto(host) : null;
  }

  function lookActions(look, state) {
    if (!state || !state.edit) return "";
    var status = lookStatus(look.id);
    var html = '<div class="ctrl-row look-actions">';
    if (status === "visible") {
      html += '<button type="button" class="ctrl" data-action="hide-look" data-look="' + esc(look.id) + '" data-ctrl="hide-' + esc(look.id) + '">Hide</button>';
      html += '<button type="button" class="ctrl" data-action="archive-look" data-look="' + esc(look.id) + '" data-ctrl="archive-' + esc(look.id) + '">Archive</button>';
    } else {
      html += '<button type="button" class="ctrl" data-action="restore-look" data-look="' + esc(look.id) + '" data-ctrl="restore-' + esc(look.id) + '">Show again</button>';
      html += '<span class="status-pill">' + (status === "archived" ? "Archived" : "Hidden") + "</span>";
    }
    html += "</div>";
    return html;
  }

  function filterBar(state) {
    if (!state || !state.edit) return "";
    var allCurrent = state.filter === "all" ? ' aria-current="true"' : "";
    var hidCurrent = state.filter === "hidden" ? ' aria-current="true"' : "";
    return '<div class="filter-bar" role="tablist" aria-label="Look visibility">' +
      '<a class="filter" href="' + esc(looksIndexHash("all", state)) + '"' + allCurrent + ">All looks</a>" +
      '<a class="filter" href="' + esc(looksIndexHash("hidden", state)) + '"' + hidCurrent + ">Hidden (" + hiddenCount() + ")</a>" +
      "</div>";
  }

  function lookProductMeta(id) {
    var e = HOUSE.lookRegistry.byId(id);
    if (!e) return "";
    return e.hasProducts ? " · Product set" : " · No product set yet";
  }

  function lookCard(look, state) {
    var href = lookHref(look, null, "concept", false, state);
    var status = lookStatus(look.id);
    var meta = look.kicker || (HOUSE.roomCountLabel ? HOUSE.roomCountLabel(look) : "");
    if (status !== "visible") meta = (status === "archived" ? "Archived" : "Hidden") + (meta ? " · " + meta : "");
    var countLabel = HOUSE.roomCountLabel ? HOUSE.roomCountLabel(look) : (look.rooms.length + " rooms");
    return '<article class="look-card" data-look-card="' + esc(look.id) + '" data-look-id="' + esc(look.id) + '">' +
      '<a class="look-card-hit" href="' + esc(href) + '">' +
      '<span class="look-card-media"><img data-photo data-file="' + esc(look.hero) + '" alt="" src="assets/' + esc(look.hero) + '">' + conceptBadge() + '<span class="missing" hidden></span></span>' +
      '<span class="look-card-body">' +
      (meta ? '<span class="kicker">' + esc(meta) + "</span>" : "") +
      '<span class="look-card-name">' + esc(look.name) + "</span>" +
      '<span class="look-card-note">' + esc(look.blurb || look.note) + "</span>" +
      chipsHtml(look, true) +
      '<span class="look-card-meta">' + esc(countLabel) + lookProductMeta(look.id) + "</span>" +
      "</span></a>" +
      lookActions(look, state) +
      "</article>";
  }


  function floorOptionsOf(look) {
    return (look && typeof HOUSE.floorOptions === "function") ? HOUSE.floorOptions(look) : [];
  }

  function floorOverlay(look, roomKey, option, showingNow) {
    if (showingNow || !option || option.current || !floorOptionsOf(look).length) return "";
    if (roomKey !== "living" && roomKey !== "master") {
      return '<span class="floor-overlay">Floor shown in living and primary only</span>';
    }
    if (option.renders && option.renders[roomKey]) return "";
    var hex = (option.swatches && option.swatches[0] && option.swatches[0].hex) || "#C4A574";
    return '<span class="floor-missing-render"><span class="floor-swatch-lg" style="background:' + esc(hex) + '"></span><p>Render not available. ' + esc(option.name) + ' is shown as a sample swatch.</p></span>';
  }

  function floorToggleHtml(look) {
    var options = floorOptionsOf(look);
    if (!options.length) return "";
    var selected = HOUSE.selectedFloorId(look.id);
    var html = '<div class="floor-toggle" role="group" aria-label="Floor options for ' + esc(look.name) + '">';
    options.forEach(function (option) {
      var on = option.id === selected;
      var hex = (option.swatches && option.swatches[0] && option.swatches[0].hex) || "";
      html += '<button type="button" class="floor-opt' + (on ? " is-on" : "") + '" data-action="set-floor" data-look="' + esc(look.id) + '" data-floor="' + esc(option.id) + '" data-ctrl="floor-' + esc(look.id) + '-' + esc(option.id) + '" aria-pressed="' + (on ? "true" : "false") + '">';
      if (hex) html += '<span class="floor-swatch" style="background:' + esc(hex) + '" aria-hidden="true"></span>';
      html += esc(option.short) + "</button>";
    });
    html += "</div>";
    var option = HOUSE.floorOption(look, selected);
    if (option) {
      html += '<p class="floor-chip" data-floor-chip="' + esc(look.id) + '">' + esc(HOUSE.floorChipText(option)) + " · planning estimates</p>";
    }
    return html;
  }

  function floorCostLine(band, label) {
    if (!band) return "";
    var kind = band.kind === "planning-estimate" ? "planning estimate" : (band.kind === "checked-range" ? "dated source range" : (band.kind === "checked-price-extended" ? "extended from a dated unit price" : "planning estimate, partly from dated unit prices"));
    return "<li><strong>" + esc(label) + " " + esc(HOUSE.floorRangeText(band)) + ".</strong> " + esc(band.note || "") + ' <span class="note">(' + esc(kind) + ")</span></li>";
  }

  function floorDetailHtml(look) {
    var options = floorOptionsOf(look);
    if (!options.length) return "";
    var selected = HOUSE.selectedFloorId(look.id);
    var meta = HOUSE.floorMeta || {};
    var html = '<section class="floor-detail"><h3>Floor options</h3>';
    html += '<p class="note">' + esc(meta.shownIn || "Floor renders were made for the living room and the primary bedroom only.") + "</p>";
    options.forEach(function (option) {
      html += '<div class="floor-option-block' + (option.id === selected ? " is-on" : "") + '">';
      html += "<h4>" + esc(option.name) + (option.current ? " · current render" : "") + "</h4>";
      html += "<p>" + esc(option.caption) + "</p>";
      html += '<p class="note">' + esc(option.material) + ". " + esc(option.scope || "") + "</p>";
      html += '<div class="floor-swatch-row" aria-hidden="true">';
      (option.swatches || []).forEach(function (swatch) {
        html += '<span style="background:' + esc(swatch.hex) + '" title="' + esc(swatch.name) + '"></span>';
      });
      html += "</div>";
      (option.swatches || []).forEach(function (swatch) {
        html += '<p class="hex">' + esc(swatch.name) + " · " + esc(swatch.hex) + " · sample only</p>";
      });
      html += "<p>" + esc(option.durability || "") + "</p>";
      html += "<ul>";
      html += floorCostLine(option.costs && option.costs.diy, "DIY");
      html += floorCostLine(option.costs && option.costs.hired, "Hired");
      if (option.refinish) {
        html += floorCostLine(option.refinish.diy, "Optional refinish, DIY");
        html += floorCostLine(option.refinish.hired, "Optional refinish, hired");
      }
      if (option.tile) {
        html += floorCostLine(option.tile.diy, "Optional kitchen or laundry tile, DIY");
        html += floorCostLine(option.tile.hired, "Optional kitchen or laundry tile, hired");
      }
      html += "</ul>";
      html += '<p class="floor-chip">' + esc(HOUSE.floorChipText(option)) + " · planning estimates</p>";
      html += "</div>";
    });
    if (meta.subfloor) html += "<p>" + esc(meta.subfloor) + "</p>";
    if (meta.areaNote) html += '<p class="note">' + esc(meta.areaNote) + "</p>";
    if (meta.sources && meta.sources.length) {
      html += "<p class=\"note\">Sources, rechecked " + esc(meta.priceChecked || "") + ":</p><ul>";
      meta.sources.forEach(function (src) {
        var label = src.title + (src.date ? " · " + src.date : "");
        if (typeof budgetSourceAnchor === "function" && src.url) html += "<li>" + budgetSourceAnchor(src.url, label) + "</li>";
        else html += "<li>" + esc(label) + "</li>";
      });
      html += "</ul>";
    }
    html += '<p class="caveat">Rough costs only, before tax and before subfloor work. Local quotes will differ. This does not place an order.</p>';
    html += "</section>";
    return html;
  }

  function applyFloorSelection(lookId) {
    var look = lookById(lookId);
    if (!look) return;
    var selected = HOUSE.selectedFloorId(lookId);
    var option = HOUSE.floorOption(look, selected);
    document.querySelectorAll('[data-action="set-floor"][data-look="' + lookId + '"]').forEach(function (btn) {
      var on = btn.getAttribute("data-floor") === selected;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.querySelectorAll('[data-floor-chip="' + lookId + '"]').forEach(function (chip) {
      if (option) chip.textContent = HOUSE.floorChipText(option) + " · planning estimates";
    });
    document.querySelectorAll('[data-floor-host="' + lookId + '"]').forEach(function (host) {
      var roomKey = host.getAttribute("data-room-key");
      var file = conceptFile(look, roomKey);
      var img = host.querySelector("img[data-photo]");
      if (img && img.getAttribute("data-file") !== file) {
        var clone = img.cloneNode(true);
        clone.classList.add("floor-out");
        clone.removeAttribute("data-photo");
        clone.style.opacity = "1";
        img.parentNode.insertBefore(clone, img);
        img.setAttribute("data-file", file);
        img.setAttribute("src", "assets/" + file);
        img.style.opacity = "0";
        requestAnimationFrame(function () { img.style.opacity = "1"; clone.style.opacity = "0"; });
        setTimeout(function () { if (clone.parentNode) clone.parentNode.removeChild(clone); }, 240);
      }
      var old = host.querySelector(".floor-overlay, .floor-missing-render");
      if (old) old.parentNode.removeChild(old);
      host.insertAdjacentHTML("beforeend", floorOverlay(look, roomKey, option, false));
    });
    var state = parse(location.hash);
    if (state.section === "looks") renderDetail(state);
    var live = document.getElementById("live");
    if (live && option) live.textContent = look.name + ", " + option.name + ". " + HOUSE.floorChipText(option);
  }

  function baViewer(look, roomKey, state, opts) {
    opts = opts || {};
    var room = roomByLookKey(roomKey);
    var before = nowPhotoForLook(look, roomKey);
    var afterFile = conceptFile(look, roomKey);
    var isCurrent = !opts.skipCurrent && state.lookRoom === roomKey && (!state.comparing || opts.forceCurrent);
    var showingNow = (isCurrent && state.ba === "now") || opts.ba === "now";
    if (opts.ba === "concept") showingNow = false;
    var file = showingNow && before ? before.file : afterFile;
    var alt = showingNow && before
      ? before.alt
      : (room ? room.name + ", " + look.name + " concept. " + ((look.captions && look.captions[roomKey]) || "") : look.name);
    var caption = showingNow
      ? nowCaption()
      : (((look.captions && look.captions[roomKey]) || "") + " Concept render. Not construction-accurate.").replace(/^\s+/, "");
    var afterHash = lookHref(look, roomKey, "concept", false, state);
    var beforeHash = lookHref(look, roomKey, "now", false, state);
    var frameHash = lookHref(look, roomKey, showingNow ? "now" : "concept", true, state);
    if (state.comparing && state.compare && state.compare.length) {
      afterHash = buildHash({ section: "looks", comparing: true, compare: state.compare, lookRoom: roomKey, ba: "concept", frame: false, edit: state.edit });
      beforeHash = buildHash({ section: "looks", comparing: true, compare: state.compare, lookRoom: roomKey, ba: "now", frame: false, edit: state.edit });
      frameHash = buildHash({ section: "looks", comparing: true, compare: state.compare, lookRoom: roomKey, ba: showingNow ? "now" : "concept", frame: true, edit: state.edit });
    }
    var html = '<section class="ba-block" id="look-room-' + esc(roomKey) + (opts.suffix || "") + '"' + (isCurrent ? ' data-current="1"' : "") + ">" +
      '<div class="ba-head"><h2>' + esc((opts.titlePrefix ? opts.titlePrefix + " · " : "") + (room ? room.name : roomKey)) + "</h2></div>" +
      '<div class="ba hero-ba">' +
      '<button type="button" class="hero-hit ba-hit" data-action="open-look-frame" data-look="' + esc(look.id) + '" data-room-key="' + esc(roomKey) + '" data-ctrl="frame-' + esc(roomKey) + (opts.suffix || "") + '" aria-label="Open the entire ' + esc(showingNow ? "photograph" : "concept") + ", " + esc(room ? room.name : roomKey) + '.">';
    if (showingNow) {
      html += '<img data-photo data-file="' + esc(file) + '" alt="' + esc(alt) + '" src="assets/' + esc(file) + '">';
    } else {
      var floorOpt = HOUSE.floorOption ? HOUSE.floorOption(look, HOUSE.selectedFloorId(look.id)) : null;
      html += '<span class="floor-media" data-floor-host="' + esc(look.id) + '" data-room-key="' + esc(roomKey) + '">';
      html += '<img data-photo data-file="' + esc(file) + '" alt="' + esc(alt) + '" src="assets/' + esc(file) + '">';
      html += conceptBadge();
      html += floorOverlay(look, roomKey, floorOpt, false);
      html += "</span>";
    }
    html += "</button>" +
      '<div class="missing" hidden><p class="missing-title">File not in this folder</p><p class="missing-file">assets/' + esc(file) + "</p></div>" +
      "</div>" +
      '<div class="ba-tools">' +
      '<div class="ba-toggle" role="group" aria-label="Now or concept">' +
      '<a class="ba-opt' + (showingNow ? " is-on" : "") + '" href="' + esc(beforeHash) + '"' + (showingNow ? ' aria-current="true"' : "") + ">Now</a>" +
      '<a class="ba-opt' + (!showingNow ? " is-on" : "") + '" href="' + esc(afterHash) + '"' + (!showingNow ? ' aria-current="true"' : "") + ">Concept</a>" +
      "</div>" +
      ctrlLink(frameHash, "Entire image", "frame-" + roomKey + (opts.suffix || ""), false) +
      "</div>" +
      '<p class="ba-caption">' + esc(caption) + "</p>" +
      "</section>";
    return html;
  }

  function boardHtml(look) {
    if (!look.board) return "";
    return '<figure class="look-board">' +
      '<img data-photo data-file="' + esc(look.board) + '" alt="' + esc(look.name) + ' color and material board" src="assets/' + esc(look.board) + '">' +
      '<figcaption>Sample board for ' + esc(look.name) + ". Colors are approximate.</figcaption>" +
      '<span class="missing" hidden></span></figure>';
  }

  function renderLooksIndex(state) {
    var list = looksForFilter(state.edit && state.filter === "hidden" ? "hidden" : "all");
    var title = state.edit && state.filter === "hidden" ? "Hidden looks" : "Looks";
    var html = '<div class="looks-page"><p class="kicker">Looks</p>' +
      '<h1 id="view-title" tabindex="-1">' + title + "</h1>" +
      '<p class="note">' + esc(HOUSE.shortNote || HOUSE.ideaNote) + "</p>";
    if (!(state.edit && state.filter === "hidden")) html += '<a class="build-banner" href="#/plan/build"><strong>Room builder</strong><span>Pick a look, choose pieces, make a render</span></a>';
    html += filterBar(state);
    if (!list.length) {
      html += state.filter === "hidden"
        ? '<p class="empty">No looks are hidden. Hide one from All looks, then restore it here.</p>'
        : '<p class="empty">Every look is hidden. Open Hidden to show one again.</p>';
    } else {
      var groups = HOUSE.lookRegistry.groups();
      groups.forEach(function (group) {
        var items = list.filter(function (look) { return (look.group || "house") === group.id; });
        if (!items.length) return;
        html += '<h2 class="section-label">' + esc(group.label) + "</h2>";
        if (group.note) html += '<p class="group-note">' + esc(group.note) + "</p>";
        html += '<div class="look-grid">';
        items.forEach(function (look) { html += lookCard(look, state); });
        html += "</div>";
      });
      var leftover = list.filter(function (look) {
        return groups.every(function (group) { return (look.group || "house") !== group.id; });
      });
      if (leftover.length) {
        html += '<h2 class="section-label">More looks</h2><div class="look-grid">';
        leftover.forEach(function (look) { html += lookCard(look, state); });
        html += "</div>";
      }
    }
    html += comparePicker(list, "", state);
    html += "</div>";
    return html;
  }

  function compareRooms(looks) {
    if (!looks.length) return [];
    var keys = looks[0].rooms.slice();
    looks.slice(1).forEach(function (look) {
      keys = keys.filter(function (key) { return look.rooms.indexOf(key) !== -1; });
    });
    return keys;
  }

  function renderCompare(state) {
    var looks = (state.compare || []).map(lookById).filter(Boolean);
    var back = looksIndexHash("all", state);
    if (looks.length < 2) {
      return '<div class="looks-page"><p class="backline">' + ctrlLink(back, "All looks", "back-looks", false) + "</p>" +
        '<h1 id="view-title" tabindex="-1">Compare looks</h1><p class="note">Choose two looks to compare.</p>' +
        comparePicker(visibleLooks(), "", state) + "</div>";
    }
    var rooms = compareRooms(looks);
    var roomKey = state.lookRoom && rooms.indexOf(state.lookRoom) !== -1 ? state.lookRoom : (rooms[0] || null);
    var html = '<div class="looks-page compare-page"><p class="kicker">Compare</p>';
    html += '<p class="backline">' + ctrlLink(back, "All looks", "back-looks", false) + "</p>";
    html += '<h1 id="view-title" tabindex="-1">' + esc(looks[0].name) + " and " + esc(looks[1].name) + "</h1>";
    if (!rooms.length) {
      html += '<p class="note">These two looks do not share a room.</p></div>';
      return html;
    }
    html += '<div class="compare-rooms" role="tablist" aria-label="Shared rooms">';
    rooms.forEach(function (key) {
      var room = roomByLookKey(key);
      var href = buildHash({ section: "looks", comparing: true, compare: state.compare, lookRoom: key, ba: state.ba, frame: false, edit: state.edit });
      var on = roomKey === key;
      html += '<a class="set-tab' + (on ? " is-on" : "") + '" href="' + esc(href) + '"' + (on ? ' aria-current="true"' : "") + ">" + esc(room ? room.name : key) + "</a>";
    });
    html += "</div>";
    html += '<div class="compare-grid">';
    looks.forEach(function (look, i) {
      html += '<div class="compare-col">' + baViewer(look, roomKey, state, { titlePrefix: look.name, suffix: "-c" + i, forceCurrent: true }) + floorToggleHtml(look) + "</div>";
    });
    html += "</div></div>";
    return html;
  }

  function renderLookDetail(state) {
    var look = lookById(state.lookId);
    var back = looksIndexHash(state.filter, state);
    var html = '<div class="looks-page look-detail"><p class="kicker">' + esc(look.kicker || "Look") + "</p>" +
      '<p class="backline">' + ctrlLink(back, state.filter === "hidden" ? "Hidden looks" : "All looks", "back-looks", false) + "</p>" +
      '<h1 id="view-title" tabindex="-1">' + esc(look.name) + "</h1>" +
      '<p class="look-count">' + esc(HOUSE.roomCountLabel ? HOUSE.roomCountLabel(look) : (look.rooms.length + " rooms")) + "</p>" +
      '<p class="note">' + esc(look.note) + "</p>" +
      chipsHtml(look, false) +
      lookActions(look, state) +
      trendNoteHtml(look) +
      boardHtml(look) +
      floorToggleHtml(look) +
      '<div class="ba-gallery">';
    look.rooms.forEach(function (key) { html += baViewer(look, key, state); });
    html += "</div>";
    if (!desktop()) html += '<h2 class="section-label">Colors</h2>' + swatchRows(look, state);
    /* === shop-builder hook === */
    if (typeof HOUSE.shopLookHtml === "function") html += HOUSE.shopLookHtml(look, state);
    html += "</div>";
    return html;
  }

  function renderLookStage(state) {
    if (state.comparing) return renderCompare(state);
    if (state.lookId && lookById(state.lookId)) return renderLookDetail(state);
    return renderLooksIndex(state);
  }

  function mapLegend() {
    return '<ul class="map-legend" aria-label="Photograph marks">' +
      '<li><span class="legend-swatch pin-vacant" aria-hidden="true"></span> Now — vacant photographs from November 9</li>' +
      '<li><span class="legend-swatch pin-earlier" aria-hidden="true"></span> Earlier — furnished photographs</li>' +
      "</ul>";
  }


  function renderBudgetCards(state) {
    var html = '<div class="budget-grid">';
    budgetIdeas().forEach(function (idea) {
      var current = state.budgetId === idea.id ? ' aria-current="true"' : "";
      html += '<a class="budget-card" href="#/plan/budget/' + esc(idea.id) + queryFrom({ edit: state.edit }) + '"' + current + ">";
      html += '<div class="budget-swatches" aria-hidden="true">';
      (idea.swatches || []).forEach(function (swatch) {
        html += '<span class="budget-chip" style="background:' + esc(swatch.hex) + '" title="' + esc(swatch.name) + '"></span>';
      });
      html += "</div>";
      html += '<p class="budget-card-kicker">' + (idea.dramatic ? "More dramatic" : "Softer") + "</p>";
      html += "<h3>" + esc(idea.name) + "</h3>";
      html += '<p class="budget-card-caption">' + esc(idea.caption) + "</p>";
      html += '<p class="budget-cost-chip">' + esc(idea.chip) + "</p>";
      html += "</a>";
    });
    html += "</div>";
    return html;
  }

  function renderBudgetStage(state) {
    var meta = HOUSE.budgetMeta || {};
    var html = '<div class="budget-page">';
    html += '<p class="kicker">Plan</p>';
    html += '<h1 id="view-title" tabindex="-1">Budget ideas</h1>';
    html += '<p class="note">Ten trending low-cost ideas, priced roughly for this house.</p>';
    html += '<details class="budget-pitfalls"><summary>How these costs work</summary><p class="note">' + esc(meta.intro || "") + '</p><p class="note">' + esc(meta.assumptions || "") + "</p></details>";
    if (!desktop() && state.budgetId) return html;
    html += renderBudgetCards(state);
    if (meta.pitfalls && meta.pitfalls.length) {
      html += '<details class="budget-pitfalls"><summary>Pitfalls to check first</summary><ul>';
      meta.pitfalls.forEach(function (item) {
        html += "<li><strong>" + esc(item.topic) + ".</strong> " + esc(item.detail) + "</li>";
      });
      html += "</ul></details>";
    }
    html += "</div>";
    return html;
  }

  function detailBudget(state) {
    var idea = budgetIdeaById(state.budgetId);
    if (!idea) {
      return '<div class="detail-pad"><p class="kicker">Plan</p><h2 id="detail-title">Budget ideas</h2>' +
        "<p>Open an idea for rooms, cost tiers, and sources. Amounts are rough. Nothing here is a quote or an order.</p></div>";
    }
    var html = '<div class="detail-pad"><div class="sheet-head"><a id="sheet-back" class="ctrl" href="#/plan/budget' + queryFrom({ edit: state.edit }) + '">All budget ideas</a></div>';
    html += '<p class="kicker">' + (idea.dramatic ? "More dramatic" : "Softer") + "</p>";
    html += '<h2 id="detail-title">' + esc(idea.name) + "</h2>";
    html += "<p>" + esc(idea.caption) + "</p>";
    html += '<p class="budget-cost-chip">' + esc(idea.chip) + "</p>";
    html += '<div class="budget-swatch-list">';
    (idea.swatches || []).forEach(function (swatch) {
      html += '<div class="budget-swatch">';
      html += '<span class="budget-chip large" style="background:' + esc(swatch.hex) + '"></span>';
      html += "<div><strong>" + esc(swatch.name) + "</strong>";
      html += '<p class="hex">' + esc(swatch.hex) + " · sample only</p>";
      html += "<p>" + esc(swatch.role || "") + "</p></div></div>";
    });
    html += "</div>";
    html += "<p>" + esc(idea.whatItChanges) + "</p>";
    if (idea.rooms && idea.rooms.length) {
      html += '<p class="note">Fits: ' + esc(idea.rooms.join(", ")) + ".</p>";
    }
    if (idea.whereTrending && idea.whereTrending.length) {
      html += "<h3>Where it’s trending</h3><ul>";
      idea.whereTrending.forEach(function (line) { html += "<li>" + esc(line) + "</li>"; });
      html += "</ul>";
    }
    html += "<h3>Rough costs</h3>";
    (idea.tiers || []).forEach(function (tier) {
      html += '<section class="budget-tier"><h4>' + esc(tier.name) + " · " + esc(moneyRange(tier.totalLow, tier.totalHigh)) + "</h4>";
      html += "<p>" + esc(tier.scope) + "</p>";
      html += "<ul>";
      (tier.lineItems || []).forEach(function (item) {
        var range = moneyRange(item.low, item.high);
        var kind = item.kind === "planning-estimate" ? "planning estimate" : (item.doNotSum ? "not added to the total" : "checked or extended from a dated price");
        html += "<li>" + esc(item.label);
        if (range) html += " — " + esc(range);
        html += " <span class=\"note\">(" + esc(kind) + ")</span></li>";
      });
      html += "</ul>";
      html += '<p class="note">Subtotal ' + esc(moneyRange(tier.subtotalLow, tier.subtotalHigh)) + ", plus a " + esc(tier.contingencyRate || "10-15%") + " contingency.</p>";
      if (tier.note) html += "<p>" + esc(tier.note) + "</p>";
      html += "</section>";
    });
    if (idea.pairsWithLooks && idea.pairsWithLooks.length) {
      html += "<h3>Pairs with</h3><ul>";
      idea.pairsWithLooks.forEach(function (look) {
        if (lookById(look.id)) {
          html += '<li><a href="' + esc(lookHref(lookById(look.id), null, "concept", false, state)) + '">' + esc(HOUSE.lookRegistry.name(look.id)) + "</a> — " + esc(look.why) + "</li>";
        } else {
          html += "<li>" + esc(look.name) + " — " + esc(look.why) + "</li>";
        }
      });
      html += "</ul>";
    }
    if (idea.sources && idea.sources.length) {
      html += "<h3>Sources</h3><ul>";
      idea.sources.forEach(function (src) {
        var label = src.title + (src.date ? " · " + src.date : "");
        html += "<li>" + budgetSourceAnchor(src.url, label) + "</li>";
      });
      html += "</ul>";
    }
    html += '<p class="caveat">Rough costs only, before tax. Local quotes will differ. Colors are samples, not manufacturer chips. This does not place an order.</p>';
    html += "</div>";
    return html;
  }

  function renderShortlist(state) {
    var html = '<div class="list-wrap plan-candidates"><p class="kicker">Plan</p><h2 class="section-label">Candidates</h2>' +
      '<p class="note">Public prices rechecked ' + esc(HOUSE.priceChecked) + ". Before tax, delivery, and installation. Local stock, fit, and quantities are unresolved. Nothing here is an order.</p>";
    HOUSE.products.forEach(function (product) {
      var current = product.id === state.productId ? ' aria-current="true"' : "";
      html += '<a class="candidate" data-product="' + esc(product.id) + '" href="#/plan/candidates/' + esc(product.id) + queryFrom({ edit: state.edit }) + '"' + current + ">" +
        '<span class="candidate-name">' + esc(product.name) + "</span>" +
        '<span class="candidate-row">' + esc(product.maker) + " · " + esc(product.row) + "</span>" +
        '<span class="candidate-price">' + esc(product.price) + "</span></a>";
    });
    html += "</div>";
    return html;
  }

  function planTiles() {
    return '<div class="plan-tiles">' +
      '<a class="plan-tile" href="#/plan/build"><img src="assets/rooms/living.jpg" alt=""><span class="plan-tile-text"><strong>Room builder</strong><span>Pick a look, choose pieces, and make a render.</span></span></a>' +
      '<a class="plan-tile" href="#/renders"><img src="renders/living-quiet-closest-v3.jpg" alt=""><span class="plan-tile-text"><strong>Renders</strong><span>See every finished room picture.</span></span></a>' +
      '<a class="plan-tile" href="#/shop"><span class="plan-tile-text"><strong>Shop</strong><span>Browse sofas, tables, rugs, and more from every store.</span></span></a>' +
      '<a class="plan-tile" href="#/plan/budget"><span class="plan-tile-swatches"><i style="background:#2b3328"></i><i style="background:#5e2f3c"></i><i style="background:#c9b99a"></i><i style="background:#f3ede0"></i></span><span class="plan-tile-text"><strong>Budget ideas</strong><span>Ten trending low-cost makeovers, priced for this house.</span></span></a>' +
      '</div>';
  }
  function renderPlanOverview() {
    var plan = HOUSE.planPage || HOUSE.more || { decided: [], open: [], photographs: "", activity: [] };
    var html = '<article class="prose plan-overview"><h1 id="view-title" tabindex="-1">Plan</h1>';
    html += planTiles();
    html += "<h2>Decided</h2><ul>";
    (plan.decided || []).forEach(function (line) { html += "<li>" + esc(line) + "</li>"; });
    html += "</ul><h2>Open</h2><ul>";
    (plan.open || []).forEach(function (line) { html += "<li>" + esc(line) + "</li>"; });
    html += "</ul><h2>Photographs</h2><p>" + esc(plan.photographs || "") + "</p>";
    if (plan.activity && plan.activity.length) {
      html += '<details class="activity"><summary>Activity</summary><ul>';
      plan.activity.forEach(function (item) {
        html += '<li><span class="activity-date">' + esc(item.date) + "</span>" + esc(item.text) + "</li>";
      });
      html += "</ul></details>";
    }
    html += "</article>";
    return html;
  }

  function renderPlanStage(state) {
    if (state.planPane === "candidates") {
      if (!desktop() && state.productId) return "";
      return renderShortlist(state);
    }
    if (state.planPane === "budget") {
      return renderBudgetStage(state);
    }
    /* === shop-builder hook === */
    if (state.planPane === "build") {
      return (typeof HOUSE.builderHtml === "function") ? HOUSE.builderHtml(state) : "<p>The room builder could not load.</p>";
    }
    var html = '<div class="plan-page">' + renderPlanOverview();
    if (!desktop()) {
      html += renderBudgetCards(state);
    }
    html += "</div>";
    return html;
  }

  function renderMoreStage() {
    return renderPlanOverview();
  }

  function sourceAnchor(url, label) {
    var allowed = /^(newsroom\.)?pinterest\.com$|^(www\.)?(houzz|apartmenttherapy|homesandgardens|housebeautiful|bhg|sherwin-williams|benjaminmoore|behr)\.com$|^corporate\.behr\.com$|^(www\.)?prnewswire\.com$|^(www\.)?brit\.co$/;
    var host = "";
    try { host = new URL(url).hostname; } catch (err) { return esc(label); }
    if (!/^https:$/.test((new URL(url)).protocol) || !allowed.test(host)) return esc(label);
    return '<a class="out" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
      esc(label) + '<span class="sr"> (opens a new tab)</span></a>';
  }

  function renderMiniPlan(roomId, selectedId, compact, currentFile) {
    var pins = mapPhotosForRoom(roomId);
    var unpinned = currentFile ? mapItemForFile(currentFile) : null;
    var currentIsUnpinned = unpinned && unpinned.method === "unpinned";
    if (!pins.length && !currentIsUnpinned) return "";
    var html = '<div class="mini-plan' + (compact ? " mini-plan-compact" : "") + '">';
    html += '<p class="section-label">On the plan</p>';
    if (pins.length && HOUSE.plan) {
      html += '<div class="map-board mini-board" aria-label="Floor plan spots for this room">';
      html += '<img src="assets/' + esc(HOUSE.plan.file) + '" alt="Main-house floor plan." width="' + HOUSE.plan.width + '" height="' + HOUSE.plan.height + '">';
      pins.forEach(function (item) {
        var current = selectedId === item.id ? ' aria-current="true"' : "";
        var setClass = item.set === "earlier" ? " pin-earlier" : " pin-vacant";
        html += '<a class="map-pin' + setClass + '" href="#/map/' + esc(item.id) + '" style="' + mapPinStyle(item) + '"' + current + ' aria-label="Photograph ' + item.number + ', ' + esc(item.room) + '. ' + esc(item.direction || item.taken || "") + '">';
        html += '<span class="map-arrow" aria-hidden="true"></span>';
        html += '<span class="map-num">' + item.number + "</span></a>";
      });
      html += "</div>";
    }
    if (currentIsUnpinned) {
      html += '<p class="map-unpinned-note">This photograph is not on the tour map. No camera spot or direction was inferred.</p>';
    }
    html += '<p class="map-size-note">' + esc(HOUSE.plan.sizeNote) + "</p></div>";
    return html;
  }

  function renderMapCard(item) {
    if (!item) {
      return '<div class="map-card map-card-empty"><h2 class="section-label">Choose a photograph</h2><p>Tap a number to see that photograph. Black marks are empty-room photos from November 9. Rust marks are earlier photos, with furniture still in the room. Room sizes are approximate, in feet.</p></div>';
    }
    var set = item.set === "earlier" ? "earlier" : "now";
    var roomHref = buildHash({ section: "rooms", roomId: item.roomId, set: set, photo: item.photoIndex || 1, frame: false });
    var frameHref = buildHash({ section: "map", mapId: item.id, frame: true });
    var when = item.set === "earlier" ? "Earlier furnished photograph." : "Now, a vacant photograph from November 9.";
    var html = '<div class="map-card">';
    html += '<button type="button" class="map-card-photo" data-action="open-frame" data-ctrl="frame" aria-label="Open the entire photograph. ' + esc(item.room) + ', photograph ' + item.number + '.">';
    html += '<img data-photo data-file="' + esc(item.file) + '" alt="' + esc(item.shows) + '" src="assets/' + esc(item.file) + '">';
    html += "</button>";
    html += '<div class="map-card-copy">';
    html += '<p class="kicker">' + esc(mapCardKicker(item)) + "</p>";
    html += '<h2 id="map-card-title">' + esc(item.room) + "</h2>";
    html += "<p>" + esc(item.taken || item.direction || item.reason || "") + "</p>";
    if (item.shows) html += "<p>" + esc(item.shows) + "</p>";
    html += '<p class="fileline">' + esc(when) + "</p>";
    html += '<div class="ctrl-row">';
    html += ctrlLink(frameHref, "Entire photograph", "frame", false);
    html += ctrlLink(roomHref, "Open room", "room", false);
    html += "</div></div></div>";
    return html;
  }

  function renderMapStage(state) {
    var plan = HOUSE.plan;
    var selected = mapPhotoById(state.mapId);
    var html = '<div class="map-stage">';
    html += '<div class="map-head"><p class="kicker">Main house</p>';
    html += '<h1 id="view-title" tabindex="-1">Photo map</h1>';
    html += "<p>" + esc(plan.sizeNote) + "</p></div>";
    html += '<div class="map-legend-slot">' + mapLegend() + "</div>";
    html += '<div class="map-board" aria-label="Main-house floor plan with photograph markers">';
    html += '<img src="assets/' + esc(plan.file) + '" alt="Main-house floor plan." width="' + plan.width + '" height="' + plan.height + '">';
    mapPhotos().forEach(function (item) {
      var current = selected && selected.id === item.id ? ' aria-current="true"' : "";
      var setClass = item.set === "earlier" ? " pin-earlier" : " pin-vacant";
      var label = "Photograph " + item.number + ", " + item.room + ". " + (item.taken || item.direction);
      html += '<a class="map-pin' + setClass + '" href="#/map/' + esc(item.id) + queryFrom({ edit: state.edit }) + '" style="' + mapPinStyle(item) + '"' + current + ' aria-label="' + esc(label) + '">';
      html += '<span class="map-arrow" aria-hidden="true"></span>';
      html += '<span class="map-num">' + item.number + "</span></a>";
    });
    html += "</div>";
    html += '<ul class="map-sizes">';
    plan.sizes.forEach(function (item) {
      html += "<li><span>" + esc(item.label) + "</span><span>" + esc(item.size) + "</span></li>";
    });
    html += "</ul>";
    html += '<p class="map-size-note">3rd bedroom, bath, and foyer were not sized in the tour frames used for this map. Exterior, garage, and guest-house photographs are not on this interior map.</p>';
    html += renderMapUnpinned();
    if (!desktop()) html += renderMapCard(selected);
    html += "</div>";
    return html;
  }

  function renderMapUnpinned() {
    var items = mapUnpinned();
    if (!items.length) return "";
    var html = '<section class="map-unpinned" aria-label="Photographs not on the tour map">';
    html += '<h2 class="section-label">Not on the tour map</h2>';
    html += "<p>These main-house photographs have no matching tour frame. They are listed with their room only. No camera spot or direction was inferred.</p>";
    html += "<ul>";
    items.forEach(function (item) {
      var set = item.set === "earlier" ? "earlier" : "now";
      var href = buildHash({ section: "rooms", roomId: item.roomId, set: set, photo: item.photoIndex || 1, frame: false });
      html += '<li><a class="map-unpinned-item" href="' + esc(href) + '">';
      html += '<img src="assets/' + esc(item.file) + '" alt="">';
      html += "<span><strong>" + esc(item.source) + " · " + esc(item.room) + "</strong>";
      html += "<span>" + esc(item.reason) + "</span></span></a></li>";
    });
    html += "</ul></section>";
    return html;
  }

  function detailMap(state) {
    var selected = mapPhotoById(state.mapId);
    var html = '<div class="detail-pad"><p class="kicker">Photo map</p><h2 id="detail-title">' + (selected ? esc(selected.room) : "Photo map") + "</h2>";
    if (!selected) {
      html += "<p>Photographs of the main house are placed on the plan. Exterior, garage, and guest-house photographs are not on this interior map.</p>";
      html += "<p>" + esc(HOUSE.plan.sizeNote) + "</p>";
      html += mapLegend();
      html += "</div>";
      return html;
    }
    html += renderMapCard(selected);
    html += "</div>";
    return html;
  }

  function renderStage(state) {
    var stage = document.getElementById("stage");
    if (state.section === "rooms") stage.innerHTML = renderRoomStage(state);
    else if (state.section === "map") stage.innerHTML = renderMapStage(state);
    else if (state.section === "looks") stage.innerHTML = renderLookStage(state);
    else if (state.section === "shop") stage.innerHTML = (typeof HOUSE.shopBrowseHtml === "function") ? HOUSE.shopBrowseHtml(state) : "<p>Shop could not load.</p>";
    else if (state.section === "renders") stage.innerHTML = (typeof HOUSE.rendersGalleryHtml === "function") ? HOUSE.rendersGalleryHtml(state) : "<p>Renders could not load.</p>";
    else stage.innerHTML = renderPlanStage(state);
  }

  function detailRecord() {
    var record = HOUSE.record;
    return '<div class="detail-pad"><p class="kicker">This view</p><h2 id="detail-title">' + esc(HOUSE.title) + "</h2>" +
      "<p>" + esc(record.status) + "</p><p>" + esc(record.authority) + "</p>" +
      externalAnchor(record.href, record.label) +
      '<p class="caveat">' + esc(HOUSE.ideaNote) + "</p></div>";
  }

  function detailRoom(state) {
    var room = roomById(state.roomId);
    var html = '<div class="detail-pad"><p class="kicker">' + (room.deferred ? "Later" : "Room") + '</p><h2 id="detail-title">' + esc(room.name) + "</h2>" +
      notesHtml(room.notes);
    var currentMap = null;
    var set = state.set === "earlier" && hasEarlier(room) ? "earlier" : "now";
    var list = photosOf(room, set);
    if (list.length) {
      var photo = list[(state.photo || 1) - 1] || list[0];
      mapPhotosForRoom(room.id).forEach(function (item) { if (item.file === photo.file) currentMap = item; });
    }
    var currentFile = list.length ? (photo ? photo.file : null) : null;
    html += renderMiniPlan(room.id, currentMap ? currentMap.id : null, false, currentFile);
    if (room.lookKey) {
      var looks = looksForRoom(room.lookKey, false);
      if (looks.length) {
        html += '<h2 class="section-label">Looks for this room</h2><ul class="plain-list">';
        looks.forEach(function (look) {
          html += '<li><a href="' + esc(lookHref(look, room.lookKey, "concept", false, state)) + '">' + esc(look.name) + "</a></li>";
        });
        html += "</ul>";
        html += comparePicker(looks, room.lookKey, state);
      }
    }
    html += "</div>";
    return html;
  }

  function trendNoteHtml(look) {
    var trends = look && look.trends;
    if (!trends) return "";
    var budget = trends.budget || trends.onABudget;
    if (!budget) return "";
    var html = '<section class="trend-note"><h2 class="section-label">What\'s trending (budget)</h2>';
    html += "<p>" + esc(budget) + "</p>";
    var sources = trends.sources || [];
    if (sources.length) {
      html += '<ul class="trend-sources">';
      sources.forEach(function (src) {
        var label = src.title + (src.date ? " (" + src.date + ")" : "");
        if (src.url) html += "<li>" + sourceAnchor(src.url, label) + "</li>";
        else html += "<li>" + esc(label) + "</li>";
      });
      html += "</ul>";
    }
    html += "</section>";
    return html;
  }

  function detailLook(state) {
    if (state.comparing) {
      var names = (state.compare || []).map(function (id) {
        var look = lookById(id);
        return look ? look.name : id;
      }).join(" and ");
      return '<div class="detail-pad"><p class="kicker">Compare</p><h2 id="detail-title">' + esc(names || "Compare looks") + "</h2>" +
        "<p>The same room, two concepts. Use Now to see the vacant photograph that each render starts from.</p>" +
        '<p class="caveat">' + esc(HOUSE.ideaNote) + " " + esc(HOUSE.screenNote) + "</p></div>";
    }
    if (!state.lookId) {
      var html = '<div class="detail-pad"><p class="kicker">Looks</p><h2 id="detail-title">Whole-house looks and room studies</h2>' +
        "<p>" + esc(HOUSE.ideaNote) + "</p><p>" + esc(HOUSE.screenNote) + "</p>";
      if (state.edit) {
        html += "<p>Hide a look to take it off All looks. Archive does the same, marked as archived. Both stay in this browser. Open Hidden to show one again.</p>";
      }
      html += "</div>";
      return html;
    }
    var look = lookById(state.lookId);
    var swatch = swatchById(look, state.swatchId);
    var back = lookHref(look, state.lookRoom, state.ba === "now" ? "now" : "concept", false, { filter: state.filter, edit: state.edit, compare: [] });
    var body = '<div class="detail-pad">';
    if (swatch) {
      body += '<div class="sheet-head"><a id="sheet-back" class="ctrl" href="' + esc(back) + '">Whole look</a></div>';
    }
    body += '<p class="kicker">Look</p><h2 id="detail-title">' + esc(swatch ? swatch.name : look.name) + "</h2>";
    body += "<p>" + esc(look.note) + "</p>";
    if (swatch) {
      body += '<p class="kicker" style="margin-top:18px">' + esc(swatch.column) + "</p>";
      body += '<span class="chip" data-hex="' + esc(swatch.hex) + '" style="background-color:' + esc(swatch.hex) + ';width:96px;height:120px" aria-hidden="true"></span>';
      body += '<p class="hex">' + esc(swatch.hex) + " · approximate</p>";
      body += "<p>" + esc(swatch.use) + "</p>";
    } else {
      body += swatchRows(look, state);
      body += lookActions(look, state);
      body += trendNoteHtml(look);
      body += floorDetailHtml(look);
    }
    body += '<p class="caveat">' + esc(HOUSE.ideaNote) + " " + esc(HOUSE.screenNote) + "</p>";
    body += "</div>";
    return body;
  }

  function detailProduct(state) {
    if (!state.productId) {
      return '<div class="detail-pad"><p class="kicker">Plan</p><h2 id="detail-title">Candidates</h2>' +
        "<p>Open a candidate for dimensions and cautions. Public prices rechecked " + esc(HOUSE.priceChecked) +
        ". Before tax, delivery, and installation. Nothing here is an order.</p></div>";
    }
    var product = productById(state.productId);
    var html = '<div class="detail-pad"><div class="sheet-head"><a id="sheet-back" class="ctrl" href="#/plan/candidates' + queryFrom({ edit: state.edit }) + '">All candidates</a></div>' +
      '<p class="kicker">' + esc(product.seller) + "</p>" +
      '<h2 id="detail-title">' + esc(product.name) + "</h2>" +
      '<p class="price-lg">' + esc(product.price) + "</p>";
    if (product.priceExtra) html += '<p class="price-extra">' + esc(product.priceExtra) + "</p>";
    html += '<div class="product-visual"><img data-photo data-optional="1" data-file="' + esc(product.image) + '" alt="' + esc(product.name) + ', product photograph" src="assets/' + esc(product.image) + '">' +
      '<p class="no-photo" hidden>No product photograph filed (assets/' + esc(product.image) + ").</p></div>";
    html += notesHtml(product.facts);
    html += '<p class="caveat">Public page rechecked ' + esc(HOUSE.priceChecked) + ". Before tax, delivery, and installation. Local stock, fit, and quantities are unresolved. This does not place an order.</p>";
    html += externalAnchor(product.href, product.linkLabel);
    html += "</div>";
    return html;
  }

  function renderDetail(state) {
    var detail = document.getElementById("detail");
    var html = "";
    if (state.section === "rooms") html = detailRoom(state);
    else if (state.section === "map") html = detailMap(state);
    else if (state.section === "shop") html = '<div class="detail-pad"><p class="kicker">Shop</p><h2 id="detail-title">Shop</h2><p>Browse real products and add them to any room they fit. Mix pieces from any look.</p></div>';
    else if (state.section === "renders") html = '<div class="detail-pad"><p class="kicker">Renders</p><h2 id="detail-title">Renders</h2><p>Finished pictures of rooms with the pieces you picked. New ones appear here when they are ready.</p></div>';
    else if (state.section === "looks") {
      /* === shop-builder hook === */
      if (state.shopItem && typeof HOUSE.detailShopItem === "function") html = HOUSE.detailShopItem(state);
      else html = detailLook(state);
    }
    else if (state.section === "plan") {
      if (state.planPane === "budget" || state.budgetId) {
        html = (!desktop() && !state.budgetId) ? "" : detailBudget(state);
      } else if (state.planPane === "candidates" || state.productId) html = detailProduct(state);
      else html = detailRecord();
    }
    else html = detailRecord();
    detail.innerHTML = html;

    var sheet = isSheet(state);
    if (sheet) {
      detail.setAttribute("role", "dialog");
      detail.setAttribute("aria-modal", "true");
    } else {
      detail.removeAttribute("role");
      detail.removeAttribute("aria-modal");
    }
  }

  function currentFrameFile(state) {
    if (state.section === "rooms") {
      var room = roomById(state.roomId);
      var set = state.set === "earlier" && hasEarlier(room) ? "earlier" : "now";
      var list = photosOf(room, set);
      var photo = list[(state.photo || 1) - 1] || list[0];
      if (!photo) return null;
      return { file: photo.file, alt: photo.alt, title: room.name, meta: set === "earlier" ? "Earlier photograph" : "Now · vacant photograph", count: list.length, index: list.indexOf(photo) + 1 };
    }
    if (state.section === "map" && state.mapId) {
      var mapped = mapPhotoById(state.mapId);
      if (mapped) {
        return { file: mapped.file, alt: mapped.shows, title: mapped.room, meta: mapped.taken || mapped.direction, count: mapPhotos().length, index: mapped.number };
      }
    }
    if (state.section === "looks") {
      var lookId = state.lookId;
      if (state.comparing && state.compare && state.compare.length) lookId = state.compare[0];
      if (lookId && state.lookRoom) {
        var look = lookById(lookId);
        var host = roomByLookKey(state.lookRoom);
        if (state.ba === "now" && host) {
          var vacant = nowPhotoForLook(look, state.lookRoom);
          return { file: vacant.file, alt: vacant.alt, title: host.name + " · now", meta: "Now · vacant photograph", count: 1, index: 1 };
        }
        var file = conceptFile(look, state.lookRoom);
        return {
          file: file,
          alt: (host ? host.name : state.lookRoom) + ", " + look.name + " concept",
          title: (host ? host.name : state.lookRoom) + " · " + look.name,
          meta: HOUSE.conceptBadge,
          count: 1,
          index: 1
        };
      }
    }
    return null;
  }

  function renderFrame(state) {
    var frame = document.getElementById("frame");
    if (!state.frame) {
      frame.hidden = true;
      frame.innerHTML = "";
      if (frameObserver) frameObserver.disconnect();
      return;
    }
    var info = currentFrameFile(state);
    if (!info) {
      frame.hidden = true;
      frame.innerHTML = "";
      return;
    }
    var canPage = (state.section === "rooms" || state.section === "map") && info.count > 1;
    var prev = "";
    var next = "";
    if (canPage && state.section === "rooms") {
      var frameSet = state.set === "earlier" ? "earlier" : "now";
      prev = buildHash({ section: "rooms", roomId: state.roomId, set: frameSet, photo: state.photo - 1, frame: true, edit: state.edit });
      next = buildHash({ section: "rooms", roomId: state.roomId, set: frameSet, photo: state.photo + 1, frame: true, edit: state.edit });
    } else if (canPage && state.section === "map") {
      var list = mapPhotos();
      var idx = 0;
      list.forEach(function (item, i) { if (item.id === state.mapId) idx = i; });
      if (idx > 0) prev = buildHash({ section: "map", mapId: list[idx - 1].id, frame: true });
      if (idx < list.length - 1) next = buildHash({ section: "map", mapId: list[idx + 1].id, frame: true });
    }
    frame.hidden = false;
    var atStart = info.index <= 1;
    var atEnd = info.index >= info.count;
    var nav = canPage
      ? '<div class="frame-nav">' +
        ctrlLink(prev, "Previous", "prev", atStart || !prev) +
        '<p class="frame-count">' + info.index + " of " + info.count + "</p>" +
        ctrlLink(next, "Next", "next", atEnd || !next) +
        "</div>"
      : "";
    var hintMove = state.section === "map" ? "Left and right arrows move through the photo map. " : "Left and right arrows move within this room. ";
    frame.innerHTML =
      '<div class="frame-top"><button type="button" class="ctrl" data-action="close-frame" data-ctrl="close-frame">Close</button>' +
      '<p class="frame-title" id="frame-title">' + esc(info.title) + '</p><span class="sr">Whole file</span></div>' +
      '<div class="frame-body">' +
      '<img data-photo data-file="' + esc(info.file) + '" alt="' + esc(info.alt) + '" src="assets/' + esc(info.file) + '">' +
      '<div class="missing" hidden><p class="missing-title">Photograph not in this folder</p>' +
      '<p class="missing-file">assets/' + esc(info.file) + "</p><p>No other picture is substituted.</p></div></div>" +
      '<div class="frame-bottom">' + nav +
      '<p class="frame-meta">' + esc(info.meta) + '</p><p class="frame-meta" data-pixels hidden></p>' +
      '<p class="frame-hint">' + (canPage ? hintMove : "") + "Escape closes. The whole file keeps its own shape.</p></div>";
    watchFrame();
  }

  var frameObserver = null;

  function fitFrameImage(img) {
    if (!img || !img.naturalWidth) return;
    var body = img.parentElement;
    if (!body) return;
    var style = window.getComputedStyle(body);
    var maxW = Math.floor(body.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
    var maxH = Math.floor(body.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom));
    if (!(maxW > 0) || !(maxH > 0)) return;
    var scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
    var width = Math.max(1, Math.floor(img.naturalWidth * scale));
    var height = Math.max(1, Math.floor(img.naturalHeight * scale));
    if (img.style.width === width + "px" && img.style.height === height + "px") return;
    img.style.width = width + "px";
    img.style.height = height + "px";
  }

  function watchFrame() {
    if (!window.ResizeObserver) return;
    if (!frameObserver) {
      frameObserver = new ResizeObserver(function () {
        var img = document.querySelector("#frame img");
        if (img && img.naturalWidth) fitFrameImage(img);
      });
    }
    frameObserver.disconnect();
    var body = document.querySelector("#frame .frame-body");
    if (body) frameObserver.observe(body);
  }

  function bindImages(root) {
    root.querySelectorAll("img[data-photo]").forEach(function (img) {
      function ok() {
        img.classList.add("is-in");
        if (img.closest("#frame")) {
          fitFrameImage(img);
          var pixels = document.querySelector("[data-pixels]");
          if (pixels && img.naturalWidth) {
            pixels.hidden = false;
            pixels.textContent = img.naturalWidth + " × " + img.naturalHeight + " pixels in this file. Not a room measurement.";
          }
        }
      }
      function bad() {
        img.hidden = true;
        if (img.getAttribute("data-optional") === "1") {
          var note = img.parentElement.querySelector(".no-photo");
          if (note) note.hidden = false;
          return;
        }
        var hit = img.closest("button");
        if (hit && hit.classList.contains("hero-hit")) hit.hidden = true;
        var host = img.closest(".hero, .thumb, .frame-body, .look-card-media, .hero-ba, .ba");
        if (!host) return;
        var miss = host.querySelector(".missing");
        if (miss) miss.hidden = false;
      }
      if (img.complete && img.naturalWidth > 0) ok();
      else if (img.complete) bad();
      else {
        img.addEventListener("load", ok);
        img.addEventListener("error", bad);
      }
    });
  }

  function tryFocus(el) {
    if (!el || el.hasAttribute("aria-disabled") || el.closest("[hidden]")) return false;
    el.focus();
    return document.activeElement === el;
  }

  function focusByCtrl(name) {
    var nodes = document.querySelectorAll("[data-ctrl]");
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].getAttribute("data-ctrl") === name && tryFocus(nodes[i])) return true;
    }
    return false;
  }

  function focusByHref(href) {
    var nodes = document.querySelectorAll("a[href]");
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].getAttribute("href") === href && tryFocus(nodes[i])) return true;
    }
    return false;
  }

  function majorKey(state) {
    return [state.section, state.roomId, state.set || "", state.lookId || "", state.lookRoom || "", state.filter, state.comparing ? (state.compare || []).join(",") : "", state.productId || "", state.budgetId || "", state.planPane || "", state.mapId || "", state.frame ? "1" : "0", state.guestOpen ? "1" : "0"].join("|");
  }

  function afterRender(state) {
    bindImages(document);
    bindComparePickers();
    var sheet = isSheet(state);
    var prevMajor = prevState ? majorKey(prevState) : "";
    var changed = majorKey(state) !== prevMajor;
    if (!booted) {
      booted = true;
      prevState = state;
      focusCtrlName = null;
      focusHref = null;
      return;
    }
    if (state.frame) {
      if (!(focusCtrlName && focusByCtrl(focusCtrlName))) focusByCtrl("close-frame");
    } else if (sheet) {
      var back = document.getElementById("sheet-back");
      if (back) back.focus();
    } else if (focusCtrlName && focusByCtrl(focusCtrlName)) {
      /* keep the control in hand */
    } else if (focusHref && focusByHref(focusHref)) {
      /* restored */
    } else if (changed) {
      var title = document.getElementById("view-title");
      if (title) title.focus({ preventScroll: true });
    }
    var live = document.getElementById("live");
    if (state.frame && prevState && state.section === "rooms" && (state.photo !== prevState.photo || state.roomId !== prevState.roomId || state.set !== prevState.set || !prevState.frame)) {
      var room = roomById(state.roomId);
      var set = state.set === "earlier" && hasEarlier(room) ? "earlier" : "now";
      var list = photosOf(room, set);
      if (room && list.length) live.textContent = room.name + ", photograph " + state.photo + " of " + list.length + ", entire file.";
    }
    if (state.section === "looks" && state.lookRoom) {
      var block = document.getElementById("look-room-" + state.lookRoom);
      if (block && (changed || (prevState && prevState.ba !== state.ba))) {
        if (changed) block.scrollIntoView({ block: "start", behavior: "instant" });
      }
    }
    prevState = state;
    focusCtrlName = null;
    focusHref = null;
    if (changed) {
      var scroller = document.getElementById("stage");
      var pinLookRoom = state.section === "looks" && state.lookRoom && (state.lookId || state.comparing);
      if (scroller && !pinLookRoom) scroller.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }

  function applyInert(state) {
    var sheet = isSheet(state);
    var lockFrame = state.frame;
    var skip = document.querySelector(".skip");
    if (skip) skip.inert = lockFrame || sheet;
    ["topbar", "rail", "stage", "tabbar"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.inert = lockFrame || sheet;
    });
    document.getElementById("detail").inert = lockFrame;
    if (sheet) document.getElementById("detail").setAttribute("aria-labelledby", "detail-title");
    else document.getElementById("detail").removeAttribute("aria-labelledby");
    document.getElementById("scrim").hidden = !sheet;
    document.body.dataset.frame = lockFrame ? "1" : "0";
    document.body.dataset.sheet = sheet ? "1" : "0";
    document.getElementById("shell").dataset.section = state.section;
    document.getElementById("shell").dataset.sheet = sheet ? "1" : "0";
    document.getElementById("shell").dataset.edit = state.edit ? "1" : "0";
  }

  function titleFor(state) {
    var suffix = " · " + HOUSE.title;
    if (state.frame) {
      if (state.section === "looks" && (state.lookId || state.comparing)) return "Entire image · " + (state.comparing ? "Compare" : lookById(state.lookId).name) + suffix;
      if (state.section === "map" && state.mapId) return "Entire photograph · " + mapPhotoById(state.mapId).room + suffix;
      if (state.section === "rooms") return "Entire photograph · " + roomById(state.roomId).name + suffix;
    }
    if (state.section === "map") {
      return (state.mapId ? mapPhotoById(state.mapId).room + " · Photo map" : "Photo map") + suffix;
    }
    if (state.section === "rooms") return roomById(state.roomId).name + suffix;
    if (state.section === "looks") {
      if (state.comparing) return "Compare looks" + suffix;
      if (state.shopItem && typeof HOUSE.shopProductById === "function" && HOUSE.shopProductById(state.shopItem)) {
        return HOUSE.shopProductById(state.shopItem).name + suffix;
      }
      if (state.lookId) return lookById(state.lookId).name + suffix;
      return (state.edit && state.filter === "hidden" ? "Hidden looks" : "Looks") + suffix;
    }
    if (state.section === "shop") {
      if (state.shopItemId && typeof HOUSE.shopProductById === "function" && HOUSE.shopProductById(state.shopItemId)) {
        return HOUSE.shopProductById(state.shopItemId).name + suffix;
      }
      return "Shop" + suffix;
    }
    if (state.section === "renders") return "Renders" + suffix;
    if (state.section === "plan") {
      if (state.budgetId && budgetIdeaById(state.budgetId)) return budgetIdeaById(state.budgetId).name + suffix;
      if (state.planPane === "budget") return "Budget ideas" + suffix;
      /* === shop-builder hook === */
      if (state.planPane === "build") return "Room builder" + suffix;
      return "Plan" + suffix;
    }
    return HOUSE.title;
  }

  function render(state) {
    document.title = titleFor(state);
    applyInert(state);
    renderNav(state);
    renderStage(state);
    renderDetail(state);
    renderFrame(state);
    afterRender(state);
    if (state.section === "renders") {
      if (typeof HOUSE.startRendersGalleryPoll === "function") HOUSE.startRendersGalleryPoll();
    } else if (typeof HOUSE.stopRendersGalleryPoll === "function") {
      HOUSE.stopRendersGalleryPoll();
    }
  }

  function syncFromHash() {
    var state = parse(location.hash);
    var canon = buildHash(state);
    if ((location.hash || "") !== canon) history.replaceState(null, "", canon);
    remember(state);
    render(state);
  }

  function openFrame() {
    var state = parse(location.hash);
    if (state.section === "map") {
      if (!state.mapId) return;
      state.frame = true;
      location.hash = buildHash(state);
      return;
    }
    if (state.section !== "rooms" || !photoCount(roomById(state.roomId))) return;
    state.frame = true;
    location.hash = buildHash(state);
  }

  function openLookFrame(lookId, roomKey) {
    var state = parse(location.hash);
    state.section = "looks";
    state.lookId = lookId;
    state.lookRoom = roomKey;
    state.frame = true;
    location.hash = buildHash(state);
  }

  function closeFrame() {
    var state = parse(location.hash);
    if (!state.frame) return;
    state.frame = false;
    focusCtrlName = state.lookRoom ? "frame-" + state.lookRoom : "frame";
    history.replaceState(null, "", buildHash(state));
    syncFromHash();
  }

  function closeSheet() {
    var state = parse(location.hash);
    if (state.productId) focusHref = "#/plan/candidates/" + state.productId + queryFrom({ edit: state.edit });
    if (state.budgetId) focusHref = "#/plan/budget/" + state.budgetId + queryFrom({ edit: state.edit });
    if (state.swatchId) {
      focusHref = buildHash({
        section: "looks",
        lookId: state.lookId,
        lookRoom: null,
        swatchId: state.swatchId,
        filter: state.filter,
        ba: "concept",
        frame: false,
        edit: state.edit
      });
    }
    /* === shop-builder hook === */
    if (state.shopItem && state.lookId) {
      focusHref = "#/looks/" + state.lookId + queryFrom({ edit: state.edit, filter: state.filter });
    }
    if (state.section === "plan") {
      if (state.planPane === "budget" || state.budgetId) {
        state.budgetId = null;
        state.planPane = "budget";
      } else {
        state.productId = null;
        state.planPane = "overview";
      }
    }
    if (state.section === "shop") { state.shopItemId = ""; }
    if (state.section === "looks") { state.swatchId = null; state.shopItem = null; }
    history.replaceState(null, "", buildHash(state));
    syncFromHash();
  }

  function moveFrame(step) {
    var state = parse(location.hash);
    if (!state.frame) return;
    if (state.section === "map") {
      var list = mapPhotos();
      var idx = -1;
      list.forEach(function (item, i) { if (item.id === state.mapId) idx = i; });
      var nextMap = idx + step;
      if (idx < 0 || nextMap < 0 || nextMap >= list.length) return;
      state.mapId = list[nextMap].id;
      state.frame = true;
      history.replaceState(null, "", buildHash(state));
      syncFromHash();
      return;
    }
    if (state.section !== "rooms") return;
    var room = roomById(state.roomId);
    var set = state.set === "earlier" && hasEarlier(room) ? "earlier" : "now";
    var photos = photosOf(room, set);
    var next = state.photo + step;
    if (next < 1 || next > photos.length) return;
    state.set = set;
    state.photo = next;
    state.frame = true;
    history.replaceState(null, "", buildHash(state));
    syncFromHash();
  }

  function changeLookStatus(id, status, ctrl) {
    setLookStateAndRefresh(id, status, ctrl);
  }

  function setLookStateAndRefresh(id, status, ctrl) {
    setLookStatus(id, status);
    focusCtrlName = ctrl;
    var state = parse(location.hash);
    if (state.section === "looks" && state.filter !== "hidden" && status !== "visible" && state.lookId === id) {
      state.lookId = null;
      state.lookRoom = null;
      state.swatchId = null;
      state.frame = false;
    }
    history.replaceState(null, "", buildHash(state));
    syncFromHash();
    var live = document.getElementById("live");
    var look = lookById(id);
    if (status === "visible") live.textContent = look.name + " is shown again.";
    else if (status === "archived") live.textContent = look.name + " is archived. Open Hidden to show it again.";
    else live.textContent = look.name + " is hidden. Open Hidden to show it again.";
  }

  document.addEventListener("click", function (event) {
    var actionEl = event.target.closest("[data-action]");
    if (actionEl) {
      var action = actionEl.getAttribute("data-action");
      var lookId = actionEl.getAttribute("data-look");
      if (action === "open-frame") { openFrame(); return; }
      if (action === "open-look-frame") {
        openLookFrame(lookId, actionEl.getAttribute("data-room-key"));
        return;
      }
      if (action === "close-frame") { closeFrame(); return; }
      if (action === "close-sheet") { closeSheet(); return; }
      if (action === "hide-look") { changeLookStatus(lookId, "hidden", "hide-" + lookId); return; }
      if (action === "archive-look") { changeLookStatus(lookId, "archived", "archive-" + lookId); return; }
      if (action === "restore-look") { changeLookStatus(lookId, "visible", "restore-" + lookId); return; }
      if (action === "set-floor") {
        event.preventDefault();
        HOUSE.setSelectedFloorId(lookId, actionEl.getAttribute("data-floor"));
        applyFloorSelection(lookId);
        return;
      }
    }
    var ctrl = event.target.closest("[data-ctrl]");
    if (ctrl) focusCtrlName = ctrl.getAttribute("data-ctrl");
    var link = event.target.closest("a[href^='#']");
    if (link) focusHref = link.getAttribute("href");
  });

  document.getElementById("scrim").addEventListener("click", closeSheet);

  function tabbables(root) {
    var nodes = root.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])");
    var list = [];
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.hasAttribute("aria-disabled") || el.closest("[hidden]")) continue;
      list.push(el);
    }
    return list;
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      var current = parse(location.hash);
      var root = current.frame ? document.getElementById("frame") : (isSheet(current) ? document.getElementById("detail") : null);
      if (root) {
        var list = tabbables(root);
        if (list.length) {
          var first = list[0];
          var last = list[list.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    }
    var state = parse(location.hash);
    if (event.key === "Escape") {
      if (state.frame) { event.preventDefault(); closeFrame(); return; }
      if (!desktop() && (state.productId || state.swatchId || state.shopItem)) { event.preventDefault(); closeSheet(); }
      return;
    }
    if (!state.frame) return;
    if (event.key === "ArrowRight") { event.preventDefault(); moveFrame(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); moveFrame(-1); }
  });

  window.addEventListener("hashchange", syncFromHash);
  window.addEventListener("resize", function () {
    var img = document.querySelector("#frame img");
    if (img && img.naturalWidth) fitFrameImage(img);
  });
  if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", syncFromHash);

  syncFromHash();

  window.addEventListener("howell:renders-updated", function () {
    var state = parse(location.hash);
    if (state.section === "renders") render(state);
  });

})();
