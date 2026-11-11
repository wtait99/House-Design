/* Shop this look + room builder UI.
 * Local only. Store links open in a new tab when the user taps them.
 * Marked as a separate module so look/flooring work can leave it alone.
 */
(function () {
  if (typeof HOUSE === "undefined") return;

  var STORAGE = "howell-builder-v1";

  function data() { return HOUSE.shopData || {}; }
  function products() { return (data().products || []); }
  function productById(id) {
    var list = products();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function shopLook(id) { return (data().looks || {})[id] || null; }
  /* Look lists come only from HOUSE.lookRegistry (js/looks-registry.js). */
  function registry() { return HOUSE.lookRegistry; }
  function lookDisplayName(lookId) {
    if (!lookId) return "";
    return registry() ? registry().name(lookId) : String(lookId);
  }
  function lookOptionFrom(e) {
    return { id: e.id, name: e.name, group: e.group, hasProducts: e.hasProducts, productSetId: e.productSetId, note: e.productSetNote };
  }
  function allLookOptions() {
    return registry() ? registry().active().map(lookOptionFrom) : [];
  }
  function catalogLookOptions() {
    /* Every active look, in registry order. Looks without a product set are included and
       marked (hasProducts false); starting from one gives empty picks plus a note. */
    return allLookOptions();
  }
  function productSetLookOptions() {
    return allLookOptions().filter(function (look) { return look.hasProducts; });
  }
  function productInLook(p, lookId) {
    if (!lookId || !p) return true;
    var rec = shopLook(lookId);
    if (rec && rec.itemIds && rec.itemIds.indexOf(p.id) !== -1) return true;
    return (p.looks || []).indexOf(lookId) !== -1;
  }
  function outsideLookNote(p, lookId) {
    if (!lookId || !p || productInLook(p, lookId)) return "";
    return "From outside the " + lookDisplayName(lookId) + " look";
  }
  function rememberBuilderLook(lookId) {
    try { if (lookId) localStorage.setItem("howell-builder-look", lookId); } catch (err) { /* ignore */ }
  }
  function rememberedBuilderLook() {
    try { return localStorage.getItem("howell-builder-look") || ""; } catch (err) { return ""; }
  }
  HOUSE.lookDisplayName = lookDisplayName;
  HOUSE.allLookOptions = allLookOptions;
  HOUSE.catalogLookOptions = catalogLookOptions;
  HOUSE.productSetLookOptions = productSetLookOptions;
  HOUSE.productInLook = productInLook;
  HOUSE.outsideLookNote = outsideLookNote;
  HOUSE.rememberBuilderLook = rememberBuilderLook;
  HOUSE.rememberedBuilderLook = rememberedBuilderLook;
  function builderRooms() { return data().builderRooms || []; }
  function builderRoom(id) {
    var list = builderRooms();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0] || null;
  }
  function slotLabel(id) { return (data().slotLabels || {})[id] || id; }
  function money(cents) {
    if (cents == null || isNaN(cents)) return "";
    var n = Math.round(cents);
    var sign = n < 0 ? "-" : "";
    n = Math.abs(n);
    var d = n % 100;
    var w = Math.floor(n / 100);
    var s = String(w);
    var out = "";
    while (s.length > 3) { out = "," + s.slice(-3) + out; s = s.slice(0, -3); }
    out = s + out;
    if (d === 0) return sign + "$" + out;
    return sign + "$" + out + "." + (d < 10 ? "0" : "") + d;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function queryEdit(state) { return state && state.edit ? "?edit=1" : ""; }

  function lineCents(p) { return (p.priceCents || 0) * (p.qty || 1); }
  function linePrice(p) {
    if ((p.qty || 1) > 1) return money(lineCents(p)) + " <span class=\"note\">(" + esc(p.price) + " × " + p.qty + ")</span>";
    return esc(p.price);
  }

  function productImage(p) {
    if (p && p.image && !p.imageMissing) {
      return '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" width="480" height="480">';
    }
    return '<div class="shop-fallback" aria-hidden="true"><span>' + esc((p && p.store) || "Shop") + "</span></div>";
  }

  var STORE_FILTERS = ["IKEA", "Costco", "Target", "Walmart", "Wayfair", "Amazon", "Other"];
  function storeGroup(store) {
    if (store === "IKEA" || store === "Costco" || store === "Target" || store === "Walmart" || store === "Wayfair" || store === "Amazon") return store;
    return "Other";
  }
  function storeBadgeClass(store) {
    var g = storeGroup(store);
    return "store-badge store-badge-" + g.toLowerCase();
  }
  function storeBadge(p) {
    var store = (p && p.store) || "Shop";
    return '<p class="shop-card-store"><span class="' + storeBadgeClass(store) + '">' + esc(store) + "</span></p>";
  }

  /* ---------- Shop this look ---------- */
  function shopCard(p, lookId, state) {
    var href = "#/looks/" + encodeURIComponent(lookId) + "/shop/" + encodeURIComponent(p.id) + queryEdit(state);
    return '<a class="shop-card" href="' + href + '">' +
      '<div class="shop-card-img">' + productImage(p) + "</div>" +
      "<h3>" + esc(p.name) + "</h3>" +
      storeBadge(p) +
      '<p class="shop-card-price">' + linePrice(p) + "</p></a>";
  }

  function lookTotalsHtml(totals) {
    var html = '<div class="shop-totals">';
    html += '<p class="shop-chip">' + esc(money(totals.merchandiseCents)) + " merchandise</p>";
    html += "<ul>";
    html += "<li>Estimated Michigan 6% tax on merchandise — " + esc(money(totals.taxCentsEstimate)) + ' <span class="note">(estimate, not a checkout tax)</span></li>';
    html += "<li>" + esc(totals.deliveryNote) + "</li>";
    html += "<li>" + esc(totals.laborNote) + "</li>";
    html += "</ul></div>";
    return html;
  }

  HOUSE.shopLookHtml = function (look, state) {
    var rec = look && shopLook(look.id);
    if (!rec) return "";
    var html = '<section class="shop-look" id="shop-this-look">';
    html += '<h2 class="section-label">Shop this look</h2>';
    html += '<p class="note">Real products checked November 10, 2026. The chip is merchandise only. Tax, delivery, and installation are listed separately and are estimates. This is not an order.</p>';
    html += '<p class="shop-chip">' + esc(rec.chip) + "</p>";
    html += '<div class="shop-row">';
    rec.itemIds.forEach(function (id) {
      var p = productById(id);
      if (p) html += shopCard(p, look.id, state);
    });
    html += "</div>";
    var alts = products().filter(function (p) {
      return (p.looks || []).indexOf(look.id) !== -1 && rec.itemIds.indexOf(p.id) === -1;
    });
    if (alts.length) {
      html += '<h3 class="shop-alts-label">Also from other stores</h3>';
      html += '<p class="note">Budget options from Target, Walmart, Wayfair, and Amazon that fit this look. They are not in the merchandise chip below.</p>';
      html += '<div class="shop-row">';
      alts.forEach(function (p) { html += shopCard(p, look.id, state); });
      html += "</div>";
    }
    html += lookTotalsHtml(rec.totals);
    html += '<p class="note">' + esc((data().meta || {}).sharedNote || "") + "</p>";
    html += "</section>";
    return html;
  };

  HOUSE.shopItemHref = function (lookId, itemId, state) {
    return "#/looks/" + encodeURIComponent(lookId) + "/shop/" + encodeURIComponent(itemId) + queryEdit(state);
  };

  HOUSE.detailShopItem = function (state) {
    var p = productById(state.shopItem);
    var lookId = state.lookId;
    var back = lookId ? "#/looks/" + encodeURIComponent(lookId) + queryEdit(state) : "#/looks" + queryEdit(state);
    if (!p) {
      return '<div class="detail-pad"><div class="sheet-head"><a id="sheet-back" class="ctrl" href="' + esc(back) + '">Back</a></div><p>That product is not in the catalog.</p></div>';
    }
    var html = '<div class="detail-pad"><div class="sheet-head"><a id="sheet-back" class="ctrl" href="' + esc(back) + '">Back to the look</a></div>';
    html += '<p class="kicker">' + storeBadge(p) + "</p>";
    html += '<h2 id="detail-title">' + esc(p.name) + "</h2>";
    html += '<div class="shop-detail-img">' + productImage(p) + "</div>";
    html += '<p class="shop-card-price">' + linePrice(p) + "</p>";
    if (p.finish) html += "<p>" + esc(p.finish) + "</p>";
    if (p.dimText) html += "<p><strong>Dimensions.</strong> " + esc(p.dimText) + "</p>";
    if (p.fit) html += "<p><strong>Fit.</strong> " + esc(p.fit) + "</p>";
    if (p.availability) html += '<p class="note">' + esc(p.availability) + "</p>";
    if (p.unverified) html += '<p class="note">Not fully verified: ' + esc(p.unverified) + "</p>";
    if (p.fanRatedBox) html += '<p class="fit-warn">This fan needs a fan-rated box, checked on site. Ceiling height is assumed 8 ft until measured. A licensed electrician should install it.</p>';
    else if (p.hardwired) html += '<p class="fit-warn">Hardwired. Use an existing electrical box only. A licensed electrician should install it. Ceiling height is assumed 8 ft until measured.</p>';
    html += '<p><a class="ctrl shop-ext" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">Open the ' + esc(p.store) + " page</a></p>";
    html += '<p class="caveat">Prices were checked November 10, 2026. This does not place an order.</p>';
    html += "</div>";
    return html;
  };

  /* ---------- Builder state ---------- */
  function emptyPicks() { return {}; }
  function readStore() {
    try {
      var raw = localStorage.getItem(STORAGE);
      if (!raw) return emptyPicks();
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : emptyPicks();
    } catch (err) { return emptyPicks(); }
  }
  function writeStore(picks) {
    try { localStorage.setItem(STORAGE, JSON.stringify(picks)); } catch (err) { /* ignore */ }
  }
  function encodePicks(picks) {
    var parts = [];
    Object.keys(picks || {}).forEach(function (room) {
      var slots = picks[room] || {};
      Object.keys(slots).forEach(function (slot) {
        if (slots[slot]) parts.push(room + ":" + slot + "=" + slots[slot]);
      });
    });
    return parts.join("|");
  }
  function decodePicks(str) {
    var picks = {};
    if (!str) return picks;
    String(str).split("|").forEach(function (bit) {
      var parts = bit.split(":");
      if (parts.length < 2) return;
      var room = parts[0];
      var rest = parts.slice(1).join(":");
      var eq = rest.indexOf("=");
      if (eq < 1) return;
      var slot = rest.slice(0, eq);
      var id = rest.slice(eq + 1);
      if (!productById(id)) return;
      picks[room] = picks[room] || {};
      picks[room][slot] = id;
    });
    return picks;
  }
  function mergePicks(state) {
    var stored = readStore();
    var fromHash = decodePicks(state && state.buildPicks);
    if (state && state.buildPicks) {
      writeStore(fromHash);
      return fromHash;
    }
    return stored;
  }

  HOUSE.encodeBuilderPicks = encodePicks;
  HOUSE.decodeBuilderPicks = decodePicks;

  /* Canonical render key: room|look|slot=id,slot=id
   * Slots are sorted alphabetically. Empty slots are omitted.
   * Example: master|moody-lodge|bed=slattum,curtains=ginstmott,fan=hunter-cavera,lamp=rodflik-floor,mirror=lindbyn-black,nightstand=vihals-ns
   */
  function renderKey(roomId, lookId, roomPicks) {
    var slots = [];
    Object.keys(roomPicks || {}).forEach(function (slot) {
      var id = roomPicks[slot];
      if (id) slots.push(slot + "=" + id);
    });
    slots.sort();
    return String(roomId || "") + "|" + String(lookId || "") + "|" + slots.join(",");
  }
  HOUSE.renderKey = renderKey;

  var PASS_STORE = "howell-render-passcode";
  var PENDING_STORE = "howell-render-pending";
  HOUSE.rendersFallback = {
    renders: {
      "master|moody-lodge|bed=slattum,curtains=ginstmott,fan=hunter-cavera,lamp=rodflik-floor,mirror=lindbyn-black,nightstand=vihals-ns": {
        room: "master",
        look: "moody-lodge",
        picks: {
          bed: "slattum",
          nightstand: "vihals-ns",
          fan: "hunter-cavera",
          lamp: "rodflik-floor",
          mirror: "lindbyn-black",
          curtains: "ginstmott"
        },
        image: "renders/master-moody-lodge-s5-v3.jpg",
        original: "assets/rooms/master.jpg",
        createdAt: "2026-11-10T14:30:00-05:00",
        caveats: "Concept only. Products look similar but not exact. The small square ceiling detector was left off and stays in real life."
      }
    }
  };
  if (!HOUSE.rendersIndex) HOUSE.rendersIndex = HOUSE.rendersFallback;

  function stagedFor(key) {
    var index = (HOUSE.rendersIndex && HOUSE.rendersIndex.renders) || {};
    return index[key] || null;
  }

  var POLL_MS = 20000;
  var PENDING_MAX_MS = 45 * 60 * 1000;
  var POLL_FETCH_MS = 15000;
  var LOOSE_SKEW_MS = 60 * 1000;
  var pollTimer = null;
  var pollInFlight = false;
  var pollGen = 0;

  function normalizePending(list) {
    var now = Date.now();
    var out = [];
    var seen = {};
    (list || []).forEach(function (item) {
      var key = typeof item === "string" ? item : (item && item.key);
      var since = typeof item === "object" && item && item.since ? item.since : now;
      if (!key || seen[key]) return;
      seen[key] = true;
      out.push({ key: key, since: since });
    });
    return out;
  }
  function readPending() {
    try {
      var raw = localStorage.getItem(PENDING_STORE);
      var parsed = raw ? JSON.parse(raw) : [];
      return normalizePending(Array.isArray(parsed) ? parsed : []);
    } catch (err) { return []; }
  }
  function writePending(list) {
    try { localStorage.setItem(PENDING_STORE, JSON.stringify(normalizePending(list || []))); } catch (err) { /* ignore */ }
  }
  function isPending(key) {
    return readPending().some(function (item) { return item.key === key; });
  }
  function markPending(key) {
    var list = readPending();
    if (!list.some(function (item) { return item.key === key; })) {
      list.push({ key: key, since: Date.now() });
      writePending(list);
    }
    startRenderPoll();
  }
  function clearPendingKey(key) {
    writePending(readPending().filter(function (item) { return item.key !== key; }));
  }
  function expireOldPending() {
    var now = Date.now();
    var kept = readPending().filter(function (item) { return (now - item.since) < PENDING_MAX_MS; });
    writePending(kept);
    return kept;
  }

  function viewHashForRender(rec) {
    var stored = {};
    try { stored = readStore(); } catch (err) { stored = {}; }
    var picks = Object.assign({}, stored);
    if (rec && rec.room) picks[rec.room] = rec.picks || {};
    return builderHash(rec.room, { builderLook: rec.look || "" }, picks, "staged", "", null);
  }

  function showRenderToast(rec) {
    var existing = document.getElementById("builder-render-toast");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.id = "builder-render-toast";
    el.className = "builder-render-toast" + (rec && rec.status === "closest" ? " is-closest" : "");
    el.setAttribute("role", "status");
    if (rec && rec.status === "closest") {
      var toastText = "Closest match, not exact.";
      if (rec.disclaimer) toastText += " " + rec.disclaimer;
      el.innerHTML = "<p>" + esc(toastText) + "</p><a href=\"" + esc(viewHashForRender(rec)) + "\">View</a>";
    } else {
      el.innerHTML = "<p>Your staged render is ready</p><a href=\"" + esc(viewHashForRender(rec)) + "\">View</a>";
    }
    document.body.appendChild(el);
  }

  function currentOpenRenderKey() {
    var st = currentBuilderState();
    var picks = mergePicks({ buildPicks: st.buildPicks });
    var roomId = st.buildRoom || "living";
    return renderKey(roomId, st.builderLook || "", picks[roomId] || {});
  }

  function parseRenderKey(key) {
    var parts = String(key || "").split("|");
    return { room: parts[0] || "", look: parts[1] || "", slots: parts.slice(2).join("|") };
  }

  function createdAtMs(rec) {
    if (!rec || !rec.createdAt) return 0;
    var t = Date.parse(rec.createdAt);
    return isNaN(t) ? 0 : t;
  }

  function findReadyRender(index, item) {
    if (!index || !item || !item.key) return null;
    if (index[item.key]) return { key: item.key, rec: index[item.key] };
    var pending = parseRenderKey(item.key);
    var since = item.since || 0;
    var best = null;
    var bestAt = -1;
    Object.keys(index).forEach(function (key) {
      var rec = index[key];
      if (!rec) return;
      var parsed = parseRenderKey(key);
      var room = rec.room || parsed.room;
      var look = rec.look || parsed.look;
      if (pending.room && room !== pending.room) return;
      if (pending.look && look !== pending.look) return;
      var at = createdAtMs(rec);
      if (since && at && at < (since - LOOSE_SKEW_MS)) return;
      if (since && !at) return;
      if (at >= bestAt) {
        bestAt = at;
        best = { key: key, rec: rec };
      }
    });
    return best;
  }

  function onBuilderPage() {
    return !!(document.querySelector(".builder-page"));
  }

  function isCurrentBuilderSetup(pendingKey, publishedKey) {
    if (!onBuilderPage()) return false;
    var currentKey = currentOpenRenderKey();
    if (!currentKey) return false;
    return currentKey === pendingKey || currentKey === publishedKey;
  }

  function applyReadyRenders(data, opts) {
    opts = opts || {};
    if (data && data.renders) {
      HOUSE.rendersIndex = data;
      try { window.dispatchEvent(new Event("howell:renders-updated")); } catch (err) { /* ignore */ }
    }
    var index = (data && data.renders) || (HOUSE.rendersIndex && HOUSE.rendersIndex.renders) || {};
    var pending = expireOldPending();
    var ready = [];
    pending.forEach(function (item) {
      var found = findReadyRender(index, item);
      if (found) ready.push({ key: item.key, publishedKey: found.key, rec: found.rec });
    });
    ready.forEach(function (item) { clearPendingKey(item.key); });
    var flipped = false;
    ready.forEach(function (item) {
      if (isCurrentBuilderSetup(item.key, item.publishedKey)) {
        var st = currentBuilderState();
        goBuilder(st.buildRoom, mergePicks({ buildPicks: st.buildPicks }), { bg: "staged", slot: "" });
        flipped = true;
      } else {
        showRenderToast(item.rec);
      }
    });
    if (!flipped && opts.refresh && onBuilderPage()) {
      window.dispatchEvent(new Event("hashchange"));
    }
    if (!expireOldPending().length) stopRenderPoll();
    return ready.length;
  }

  function pollRendersIndex() {
    if (pollInFlight) return;
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
    var pending = expireOldPending();
    if (!pending.length) { stopRenderPoll(); return; }
    if (typeof location !== "undefined" && location.protocol === "file:") return;
    pollInFlight = true;
    var gen = pollGen;
    var url = "renders/renders.json?t=" + Date.now();
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var abortTimer = setTimeout(function () {
      try { if (ctrl) ctrl.abort(); } catch (err) { /* ignore */ }
    }, POLL_FETCH_MS);
    var finished = function () {
      clearTimeout(abortTimer);
      if (pollGen === gen) pollInFlight = false;
    };
    var opts = { cache: "no-store" };
    if (ctrl) opts.signal = ctrl.signal;
    fetch(url, opts).then(function (res) {
      if (!res.ok) throw new Error("missing");
      return res.json();
    }).then(function (data) {
      finished();
      if (pollGen !== gen) return;
      applyReadyRenders(data, { refresh: false });
      if (expireOldPending().length) startRenderPoll(true);
    }).catch(function () {
      finished();
    });
  }

  function stopRenderPoll() {
    pollGen += 1;
    pollInFlight = false;
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  function startRenderPoll(intervalOnly) {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      stopRenderPoll();
      return;
    }
    if (!expireOldPending().length) {
      stopRenderPoll();
      return;
    }
    if (typeof location !== "undefined" && location.protocol === "file:") return;
    if (!pollTimer) pollTimer = setInterval(pollRendersIndex, POLL_MS);
    if (!intervalOnly) pollRendersIndex();
  }

  function resumeRenderPoll() {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
    startRenderPoll();
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") stopRenderPoll();
    else resumeRenderPoll();
  });
  window.addEventListener("focus", resumeRenderPoll);
  window.addEventListener("pageshow", resumeRenderPoll);
  window.addEventListener("hashchange", function () {
    if (readPending().length) resumeRenderPoll();
  });

  HOUSE.startRenderPoll = startRenderPoll;
  HOUSE.pollRendersIndex = pollRendersIndex;
  HOUSE.resumeRenderPoll = resumeRenderPoll;
  function readPasscode() {
    try { return localStorage.getItem(PASS_STORE) || ""; } catch (err) { return ""; }
  }
  function writePasscode(value) {
    try { localStorage.setItem(PASS_STORE, value); } catch (err) { /* ignore */ }
  }
  function clearPasscode() {
    try { localStorage.removeItem(PASS_STORE); } catch (err) { /* ignore */ }
  }

  function loadRendersIndex() {
    if (HOUSE._rendersLoad) return HOUSE._rendersLoad;
    var done = function (data) {
      applyReadyRenders(data, { refresh: true });
      startRenderPoll();
    };
    try {
      if (typeof location !== "undefined" && location.protocol === "file:") {
        HOUSE._rendersLoad = Promise.resolve(HOUSE.rendersFallback);
        done(HOUSE.rendersFallback);
        return HOUSE._rendersLoad;
      }
      HOUSE._rendersLoad = fetch("renders/renders.json?t=" + Date.now(), { cache: "no-store" }).then(function (res) {
        if (!res.ok) throw new Error("missing");
        return res.json();
      }).then(function (data) {
        done(data);
      }).catch(function () {
        done(HOUSE.rendersFallback);
      });
    } catch (err) {
      HOUSE._rendersLoad = Promise.resolve(HOUSE.rendersFallback);
      done(HOUSE.rendersFallback);
    }
    return HOUSE._rendersLoad;
  }
  loadRendersIndex();


  function itemsForSlot(slot, lookFilter, storeFilter, preferLook) {
    var list = products().filter(function (p) {
      if ((p.slots || []).indexOf(slot) === -1) return false;
      if (storeFilter && storeGroup(p.store) !== storeFilter) return false;
      if (!lookFilter) return true;
      return productInLook(p, lookFilter);
    });
    if (preferLook) {
      list = list.slice().sort(function (a, b) {
        var ia = productInLook(a, preferLook) ? 0 : 1;
        var ib = productInLook(b, preferLook) ? 0 : 1;
        return ia - ib;
      });
    }
    return list;
  }

  function fitWarnings(room, slot, p) {
    var warns = [];
    if (!p || !room) return warns;
    var dims = p.dims || {};
    if (slot === "rug" && room.w && room.d && (dims.w || dims.l)) {
      var short = Math.min(room.w, room.d);
      var long = Math.max(room.w, room.d);
      var rw = Math.min(dims.w || 0, dims.l || 0);
      var rl = Math.max(dims.w || 0, dims.l || 0);
      if (rw && rw + 12 > short) warns.push("This rug is tight on the " + room.sizeText + " short side (less than about 6 in of floor showing on each edge if centered).");
      if (rl && rl > long) warns.push("This rug is longer than the room.");
    }
    if ((slot === "dining-table" || slot === "dining-set") && room.w && room.d) {
      var tw = dims.wOpen || dims.w;
      var td = dims.d;
      if (tw && td) {
        var end = (Math.max(room.w, room.d) - tw) / 2;
        var side = (Math.min(room.w, room.d) - td) / 2;
        if (end < 36 || side < 36) {
          warns.push("Clearance around this table is about " + Math.round(end) + " in on the ends and " + Math.round(side) + " in on the sides, under the 36 in target" + (dims.wOpen ? " when extended" : "") + ".");
        }
      }
    }
    if (slot === "bed" && room.w && dims.w) {
      if (dims.w + 30 > room.w) warns.push("A bed this wide plus nightstands will be tight on the " + room.sizeText + " wall.");
      if (dims.l && dims.l + 36 > room.d) warns.push("Length is tight at the foot of the bed in a " + room.sizeText + " room.");
    }
    if (slot === "desk" && room.w && dims.w && dims.w + 24 > Math.min(room.w, room.d)) {
      warns.push("This desk is wide for the shorter office wall. Use the 12 ft wall if you can.");
    }
    if (p.fanRatedBox) warns.push("Needs a fan-rated box, checked on site. Ceiling height is assumed 8 ft until measured.");
    else if (p.hardwired) warns.push("Hardwired at an existing box only. Licensed electrician. Ceiling height assumed 8 ft until measured.");
    return warns;
  }

  function pickedIds(picks) {
    var used = {};
    builderRooms().forEach(function (room) {
      var slots = (picks[room.id] || {});
      var hasSet = !!slots["dining-set"];
      Object.keys(slots).forEach(function (slot) {
        if (hasSet && (slot === "dining-table" || slot === "chairs")) return;
        var id = slots[slot];
        if (id) used[id] = true;
      });
    });
    return Object.keys(used);
  }

  function builderTotals(picks) {
    var byRoom = {};
    var merchandise = 0;
    var hardwired = 0;
    var fans = 0;
    builderRooms().forEach(function (room) {
      var slots = picks[room.id] || {};
      var sub = 0;
      var hasSet = !!slots["dining-set"];
      Object.keys(slots).forEach(function (slot) {
        if (hasSet && (slot === "dining-table" || slot === "chairs")) return;
        var p = productById(slots[slot]);
        if (!p) return;
        sub += lineCents(p);
        if (p.hardwired) hardwired += 1;
        if (p.fanRatedBox) fans += 1;
      });
      byRoom[room.id] = sub;
      merchandise += sub;
    });
    return {
      merchandiseCents: merchandise,
      taxCentsEstimate: Math.round(merchandise * 0.06),
      byRoom: byRoom,
      hardwiredCount: hardwired,
      fanCount: fans,
      laborFanLow: fans * 15000,
      laborFanHigh: fans * 30000,
      laborFixLow: Math.max(0, hardwired - fans) * 10000,
      laborFixHigh: Math.max(0, hardwired - fans) * 25000
    };
  }

  function lookFileFor(room, lookId) {
    if (!lookId || !room || !room.lookKey || !registry()) return null;
    return registry().renderFor(lookId, room.lookKey);
  }

  function fillFromLook(lookId) {
    var map = (data().lookSlots || {})[lookId] || {};
    var picks = {};
    Object.keys(map).forEach(function (room) {
      picks[room] = {};
      Object.keys(map[room]).forEach(function (slot) { picks[room][slot] = map[room][slot]; });
    });
    writeStore(picks);
    return picks;
  }

  function builderHash(roomId, state, picks, backdrop, lookFilter, itemId) {
    var hash = "#/plan/build";
    if (roomId) hash += "/" + roomId;
    var bits = [];
    if (state && state.edit) bits.push("edit=1");
    var encoded = encodePicks(picks || {});
    if (encoded) bits.push("p=" + encodeURIComponent(encoded));
    if (backdrop === "look") bits.push("bg=look");
    if (backdrop === "staged") bits.push("bg=staged");
    if (lookFilter) bits.push("from=" + encodeURIComponent(lookFilter));
    if (itemId) bits.push("item=" + encodeURIComponent(itemId));
    if (state && state.builderLook) bits.push("look=" + encodeURIComponent(state.builderLook));
    if (state && state.builderStore) bits.push("store=" + encodeURIComponent(state.builderStore));
    var slot = state && state.builderSlot;
    if (slot) bits.push("slot=" + encodeURIComponent(slot));
    return hash + (bits.length ? "?" + bits.join("&") : "");
  }

  HOUSE.setBuilderPick = function (roomId, slot, productId) {
    var picks = readStore();
    if (!roomId || !slot || !productId) return picks;
    picks[roomId] = picks[roomId] || {};
    picks[roomId][slot] = productId;
    writeStore(picks);
    return picks;
  };
  HOUSE.builderHrefWithPick = function (roomId, slot, productId, extra) {
    extra = extra || {};
    var picks = HOUSE.setBuilderPick(roomId, slot, productId);
    var look = extra.look || rememberedBuilderLook() || "";
    return builderHash(roomId, { builderLook: look, edit: extra.edit }, picks, "now", "", null);
  };
  HOUSE.builderHrefForRecord = function (rec, extra) {
    extra = extra || {};
    if (!rec) return "#/plan/build";
    var stored = readStore();
    var picks = Object.assign({}, stored);
    if (rec.room) picks[rec.room] = rec.picks || {};
    writeStore(picks);
    return builderHash(rec.room, { builderLook: rec.look || "", edit: extra.edit }, picks, "staged", "", null);
  };
  HOUSE.builderHash = function (state) {
    var slot = (state && state.builderSlot) || currentBuilderState().builderSlot || "";
    var merged = Object.assign({}, state, { builderSlot: slot });
    return builderHash(merged.buildRoom, merged, mergePicks(merged), merged.builderBg, merged.builderFrom, merged.shopItem);
  };

  function addLabel(slot) {
    var labels = {
      seating: "+ Add sofa",
      rug: "+ Add rug",
      coffee: "+ Add table",
      "dining-set": "+ Add dining set",
      "dining-table": "+ Add table",
      chairs: "+ Add chairs",
      bed: "+ Add bed",
      nightstand: "+ Add nightstand",
      desk: "+ Add desk",
      fan: "+ Add fan",
      pendant: "+ Add pendant",
      vanity: "+ Add light",
      pulls: "+ Add pulls",
      faucet: "+ Add faucet",
      curtains: "+ Add curtains",
      mirror: "+ Add mirror",
      lamp: "+ Add lamp",
      accents: "+ Add accent"
    };
    return labels[slot] || ("+ Add " + slotLabel(slot).toLowerCase());
  }

  function fitChip(room, slot, p) {
    var warns = fitWarnings(room, slot, p);
    if (!warns.length) return { label: "", title: "", warns: warns };
    var label = "Check fit";
    var joined = warns.join(" ");
    if (/tight|Clearance|longer|wide/i.test(joined)) label = "Tight fit";
    if (p.fanRatedBox) label = "Check fan box";
    else if (p.hardwired && !/tight|Clearance|longer|wide/i.test(joined)) label = "Needs electrician";
    return { label: label, title: warns.join(" "), warns: warns };
  }

  function lookOptionsHtml() {
    var html = "";
    catalogLookOptions().forEach(function (look) {
      html += '<button type="button" data-builder-start="' + esc(look.id) + '" data-look-id="' + esc(look.id) + '"' + (look.hasProducts ? "" : ' class="no-set" title="' + esc(look.note) + '"') + ">" + esc(look.name) + (look.hasProducts ? "" : ' <span class="note">· no product set yet</span>') + "</button>";
    });
    return html;
  }

  function totalsBox(tots, room) {
    var roomCents = (tots.byRoom && room) ? (tots.byRoom[room.id] || 0) : 0;
    var html = '<details class="builder-totals" data-builder-totals>';
    html += "<summary>Room " + money(roomCents) + " · House " + money(tots.merchandiseCents) + "</summary>";
    html += '<div class="builder-totals-panel">';
    html += "<ul>";
    builderRooms().forEach(function (item) {
      var sub = tots.byRoom[item.id] || 0;
      if (!sub) return;
      html += "<li>" + esc(item.name) + " — " + money(sub) + "</li>";
    });
    html += "<li>Estimated Michigan 6% tax — " + money(tots.taxCentsEstimate) + ' <span class="note">(estimate)</span></li>';
    html += "<li>Delivery — not included. Confirm at checkout; IKEA shipping was often listed in the $10–$159 range, and some Home Depot offers showed free shipping.</li>";
    if (tots.fanCount) {
      html += "<li>Fan installation (estimate) — " + money(tots.laborFanLow) + "–" + money(tots.laborFanHigh) + "</li>";
    }
    if (tots.hardwiredCount - tots.fanCount > 0) {
      html += "<li>Other hardwired fixtures (estimate) — " + money(tots.laborFixLow) + "–" + money(tots.laborFixHigh) + "</li>";
    }
    html += "</ul></div></details>";
    return html;
  }

  function shareIcon() {
    return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M10 13a5 5 0 0 0 7.07.07l1.86-1.86a5 5 0 1 0-7.07-7.07L10.5 5.5"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M14 11a5 5 0 0 0-7.07-.07L5.07 12.8a5 5 0 0 0 7.07 7.07L13.5 18.5"/></svg>';
  }

  function slotSheetHtml(room, slot, currentId, lookFilter, state) {
    var current = productById(currentId);
    var storeFilter = (state && state.builderStore) || "";
    var preferLook = (state && state.builderLook) || "";
    var options = itemsForSlot(slot, lookFilter, storeFilter, preferLook);
    var html = '<div class="builder-sheet" data-builder-sheet role="dialog" aria-modal="true" aria-labelledby="builder-sheet-title">';
    html += '<button type="button" class="builder-sheet-dim" data-builder-close-sheet aria-label="Close options"></button>';
    html += '<div class="builder-sheet-panel">';
    html += '<div class="builder-sheet-head">';
    html += '<div><p class="kicker">' + esc(room.name) + "</p>";
    html += '<h2 id="builder-sheet-title">' + esc(slotLabel(slot)) + "</h2></div>";
    html += '<button type="button" class="builder-icon-btn" data-builder-close-sheet aria-label="Close">×</button>';
    html += "</div>";
    html += '<div class="builder-sheet-filters">';
    html += '<p class="builder-filter-label">Look</p>';
    html += '<div class="builder-sheet-filter" aria-label="Filter by look">';
    html += '<button type="button" data-builder-filter=""' + (!lookFilter ? ' aria-current="true"' : "") + ">All looks</button>";
    catalogLookOptions().forEach(function (look) {
      html += '<button type="button" data-builder-filter="' + esc(look.id) + '"' + (look.id === lookFilter ? ' aria-current="true"' : "") + ">" + esc(look.name) + "</button>";
    });
    html += "</div>";
    html += '<p class="builder-filter-label">Store</p>';
    html += '<div class="builder-sheet-filter" aria-label="Filter by store">';
    html += '<button type="button" data-builder-store=""' + (!storeFilter ? ' aria-current="true"' : "") + ">All stores</button>";
    STORE_FILTERS.forEach(function (name) {
      html += '<button type="button" data-builder-store="' + esc(name) + '"' + (storeFilter === name ? ' aria-current="true"' : "") + ">" + esc(name) + "</button>";
    });
    html += "</div></div>";
    html += '<div class="builder-sheet-options">';
    if (!options.length) html += '<p class="note">No options match this look and store filter. Choose All looks or All stores to see more products for this slot.</p>';
    options.forEach(function (p) {
      var selected = current && current.id === p.id ? " is-selected" : "";
      html += '<button type="button" class="shop-card shop-option' + selected + '" data-builder-pick="' + esc(p.id) + '" data-slot="' + esc(slot) + '">';
      html += '<div class="shop-card-img">' + productImage(p) + "</div>";
      html += "<h3>" + esc(p.name) + "</h3>";
      html += storeBadge(p);
      html += '<p class="shop-card-price">' + linePrice(p) + "</p>";
      var outside = outsideLookNote(p, preferLook);
      if (outside) html += '<p class="outside-look-note">' + esc(outside) + "</p>";
      html += "</button>";
    });
    html += "</div>";
    if (current) {
      var chip = fitChip(room, slot, current);
      chip.warns.forEach(function (w) { html += '<p class="builder-sheet-warn">' + esc(w) + "</p>"; });
      html += '<button type="button" class="builder-clear" data-builder-clear="' + esc(slot) + '">Clear this slot</button>';
    }
    html += "</div></div>";
    return html;
  }

  HOUSE.builderHtml = function (state) {
    var room = builderRoom(state.buildRoom || "living");
    var picks = mergePicks(state);
    var tots = builderTotals(picks);
    var lookFilter = state.builderFrom || "";
    var lookId = state.builderLook || "";
    if (lookId) rememberBuilderLook(lookId);
    var roomPicks = picks[room.id] || {};
    var key = renderKey(room.id, lookId, roomPicks);
    var stagedRec = lookId ? stagedFor(key) : null;
    var useStaged = state.builderBg === "staged" && stagedRec;
    var useLook = !useStaged && (state.builderBg === "look" || (state.builderBg === "staged" && !stagedRec && !!lookId));
    var defaultLook = (productSetLookOptions()[0] || catalogLookOptions()[0] || {}).id || "";
    var lookPhoto = useLook ? lookFileFor(room, lookId || defaultLook) : null;
    var bg = (useStaged && stagedRec ? stagedRec.image : null) || lookPhoto || room.vacantFile || "";
    var pickCount = Object.keys(roomPicks).filter(function (slot) { return !!roomPicks[slot]; }).length;
    var canRequest = !!lookId && pickCount > 0;
    var pending = !stagedRec && isPending(key);
    var openSlot = (state.builderSlot || currentBuilderState().builderSlot || "");
    if (openSlot && (room.slots || []).indexOf(openSlot) === -1) openSlot = "";
    var houseEmpty = !pickedIds(picks).length;
    var html = '<div class="builder-page">';
    html += '<header class="builder-head">';
    html += '<div class="builder-head-row">';
    html += "<div><p class=\"kicker\">Room builder</p>";
    html += '<h1 id="view-title" tabindex="-1">' + esc(room.name) + "</h1>";
    html += '<p class="builder-size">' + esc(room.sizeText) + "</p>";
    html += '<p class="builder-intro">Pick a look, choose pieces, tap Make a render. You can mix pieces from any look.</p>';
    if (room.note) html += '<p class="builder-room-note">' + esc(room.note) + "</p>";
    html += "</div>";
    html += '<button type="button" class="builder-icon-btn" data-builder-share aria-label="Copy share link" title="Copy share link">' + shareIcon() + "</button>";
    html += "</div></header>";
    html += '<nav class="builder-rooms" aria-label="Rooms to build">';
    builderRooms().forEach(function (item) {
      var href = builderHash(item.id, state, picks, state.builderBg, lookFilter, null);
      var cur = item.id === room.id ? ' aria-current="true"' : "";
      html += '<a href="' + esc(href) + '"' + cur + ">" + esc(item.name) + "</a>";
    });
    html += "</nav>";
    html += '<div class="builder-toolbar">';
    html += '<details class="builder-start">';
    html += "<summary>Start from a look</summary>";
    html += '<div class="builder-start-menu">' + lookOptionsHtml() + "</div>";
    html += "</details></div>";
    var lookEntry = lookId && registry() ? registry().byId(lookId) : null;
    if (lookEntry && !lookEntry.hasProducts) html += '<p class="builder-room-note" data-builder-no-set>' + esc(lookEntry.name + ": " + lookEntry.productSetNote) + "</p>";
    if (useLook && !lookPhoto && lookEntry) html += '<p class="builder-room-note">' + esc(lookEntry.name) + " has no render for this room yet, so the original photograph is shown.</p>";
    html += '<div class="builder-totals-stick">' + totalsBox(tots, room) + "</div>";
    html += '<div class="builder-stage">';
    html += '<figure class="builder-backdrop">';
    var altKind = useStaged ? ", staged concept render" : (useLook ? ", concept render" : ", original photograph");
    html += '<img src="' + esc(bg) + '" alt="' + esc(room.name) + altKind + '">';
    var nowHash = builderHash(room.id, Object.assign({}, state, { builderBg: "now" }), picks, "now", lookFilter, null);
    var lookHash = builderHash(room.id, Object.assign({}, state, { builderBg: "look" }), picks, "look", lookFilter, null);
    var stagedHash = builderHash(room.id, Object.assign({}, state, { builderBg: "staged" }), picks, "staged", lookFilter, null);
    html += '<div class="builder-bg-toggle">';
    html += '<a href="' + esc(nowHash) + '"' + (useStaged || useLook ? "" : ' aria-current="true"') + ">Original</a>";
    html += '<a href="' + esc(lookHash) + '"' + (useLook ? ' aria-current="true"' : "") + ">Look</a>";
    if (stagedRec) {
      html += '<a href="' + esc(stagedHash) + '"' + (useStaged ? ' aria-current="true"' : "") + ">Staged</a>";
    }
    html += "</div>";
    if (useLook) {
      html += '<label class="builder-look-pick"><span class="sr">Look render</span><select class="builder-look-select" data-builder-look>';
      catalogLookOptions().forEach(function (look) {
        html += '<option value="' + esc(look.id) + '"' + (look.id === lookId ? " selected" : "") + ">" + esc(look.name) + (look.hasProducts ? "" : " (no product set yet)") + "</option>";
      });
      html += "</select></label>";
    }
    if (useStaged && stagedRec && stagedRec.status === "closest") {
      html += '<div class="builder-closest-overlay">Closest match, not exact.</div>';
    }
    html += "</figure>";
    if (useStaged && stagedRec && stagedRec.status === "closest") {
      html += '<p class="builder-closest-banner" data-builder-closest-banner><strong>Closest match, not exact.</strong> ' + esc(stagedRec.disclaimer || "") + "</p>";
    } else if (useStaged && stagedRec && stagedRec.caveats) {
      html += '<p class="builder-staged-note">' + esc(stagedRec.caveats) + "</p>";
    }
    html += '<div class="builder-render">';
    if (stagedRec) {
      var viewLabel = stagedRec.status === "closest" ? "View closest render" : "View staged render";
      html += '<button type="button" class="builder-render-btn" data-builder-view-staged>' + viewLabel + "</button>";
    } else if (pending) {
      html += '<button type="button" class="builder-render-btn is-pending" data-builder-render-pending disabled>Making your render… this page will update on its own</button>';
    } else {
      var renderEndpoint = (window.HOUSE_CONFIG && window.HOUSE_CONFIG.RENDER_ENDPOINT) || "";
      if (!renderEndpoint) {
        html += '<button type="button" class="builder-render-btn" data-builder-request-render disabled>Make a render</button>';
        html += '<p class="builder-render-hint">Render requests are being moved — coming back shortly</p>';
      } else {
        html += '<button type="button" class="builder-render-btn" data-builder-request-render' + (canRequest ? "" : " disabled") + ">Make a render</button>";
        if (!canRequest) html += '<p class="builder-render-hint">Pick a look and at least one piece first.</p>';
      }
    }
    html += '<div class="builder-render-panel" data-builder-render-panel hidden>';
    html += '<p class="builder-render-hint">Renders use a passcode from Bill. If he sent you this link and a passcode, enter it here to request a picture of this room.</p>';
    html += '<label>Passcode <input type="password" name="render-passcode" autocomplete="off" data-builder-render-pass></label>';
    html += '<button type="button" class="builder-render-btn builder-render-send" data-builder-send-render>Send request</button>';
    html += '<p class="builder-render-status" data-builder-render-status hidden></p>';
    html += "</div></div>";
    html += '<div class="builder-collage" aria-label="Selected products">';
    var hasTiles = false;
    (room.slots || []).forEach(function (slot) {
      var p = productById(roomPicks[slot]);
      if (!p) return;
      hasTiles = true;
      html += '<figure class="builder-tile" data-builder-tile="' + esc(slot) + '">';
      html += productImage(p);
      html += "<figcaption>" + esc(slotLabel(slot)) + " · " + esc(p.name);
      var tileNote = outsideLookNote(p, lookId);
      if (tileNote) html += '<span class="outside-look-note">' + esc(tileNote) + "</span>";
      html += "</figcaption>";
      html += "</figure>";
    });
    if (!hasTiles) {
      html += '<div class="builder-empty">';
      html += "<p>Start from a look or tap a slot.</p>";
      if (houseEmpty) {
        var starters = catalogLookOptions();
        var starter = null;
        starters.forEach(function (look) { if (!starter && look.hasProducts) starter = look; });
        if (!starter) starter = starters[0] || null;
        if (starter) html += '<button type="button" class="builder-try" data-builder-start="' + esc(starter.id) + '">Try ' + esc(starter.name) + "</button>";
      }
      html += "</div>";
    }
    html += '<p class="builder-mood-cap">Moodboard of your picks, not a rendered photo</p>';
    html += "</div></div>";
    html += '<div class="builder-slots" aria-label="Room slots">';
    (room.slots || []).forEach(function (slot) {
      var current = productById(roomPicks[slot]);
      var chip = current ? fitChip(room, slot, current) : null;
      html += '<button type="button" class="builder-slot-card" data-builder-open-slot="' + esc(slot) + '"' + (openSlot === slot ? ' aria-expanded="true"' : ' aria-expanded="false"') + ">";
      html += '<div class="builder-slot-thumb">';
      if (current) html += productImage(current);
      else html += '<span class="builder-slot-plus" aria-hidden="true">+</span>';
      html += "</div>";
      html += "<strong>" + esc(slotLabel(slot)) + "</strong>";
      if (current) {
        html += '<span class="builder-slot-item">' + esc(current.name) + "</span>";
        var slotNote = outsideLookNote(current, lookId);
        if (slotNote) html += '<span class="outside-look-note">' + esc(slotNote) + "</span>";
      }
      else html += '<span class="builder-slot-add">' + esc(addLabel(slot)) + "</span>";
      if (chip && chip.label) html += '<span class="builder-fit-chip" title="' + esc(chip.title) + '">' + esc(chip.label) + "</span>";
      html += "</button>";
    });
    html += "</div>";
    html += '<p class="builder-foot-note">A render is a picture of this exact room, look, and pieces. The same setup is never requested twice.</p>';
    if (openSlot) html += slotSheetHtml(room, openSlot, roomPicks[openSlot], lookFilter, state);
    html += "</div>";
    return html;
  };

  function currentBuilderState() {
    var raw = (location.hash || "").replace(/^#/, "");
    var q = raw.indexOf("?");
    var params = new URLSearchParams(q >= 0 ? raw.slice(q + 1) : "");
    return {
      edit: params.get("edit") === "1",
      builderBg: params.get("bg") === "staged" ? "staged" : (params.get("bg") === "look" ? "look" : "now"),
      builderFrom: params.get("from") || "",
      builderLook: params.get("look") || "",
      builderStore: params.get("store") || "",
      builderSlot: params.get("slot") || "",
      buildPicks: params.get("p") ? decodeURIComponent(params.get("p")) : "",
      buildRoom: (function () {
        var path = (q >= 0 ? raw.slice(0, q) : raw).split("/").filter(Boolean);
        if (path[0] === "plan" && path[1] === "build") return path[2] || "living";
        if (path[0] === "rooms" && path[2] === "build") return path[1];
        return "living";
      })()
    };
  }

  function goBuilder(roomId, picks, extra) {
    extra = extra || {};
    var state = currentBuilderState();
    if (roomId) state.buildRoom = roomId;
    if (extra.bg) state.builderBg = extra.bg;
    if (extra.from != null) state.builderFrom = extra.from;
    if (extra.look) state.builderLook = extra.look;
    if (extra.store != null) state.builderStore = extra.store;
    if (extra.slot != null) state.builderSlot = extra.slot;
    location.hash = builderHash(state.buildRoom, state, picks, state.builderBg, state.builderFrom, null);
  }

  function markShareCopied(share) {
    share.classList.add("is-copied");
    share.setAttribute("aria-label", "Link copied");
    share.setAttribute("title", "Link copied");
    setTimeout(function () {
      share.classList.remove("is-copied");
      share.setAttribute("aria-label", "Copy share link");
      share.setAttribute("title", "Copy share link");
    }, 1600);
  }

  function setRenderStatus(panel, text, kind) {
    if (!panel) return;
    var status = panel.querySelector("[data-builder-render-status]");
    if (!status) return;
    status.hidden = !text;
    status.textContent = text || "";
    status.setAttribute("data-kind", kind || "");
  }

  function postRenderRequest(roomId, lookId, roomPicks, key, passcode, panel) {
    setRenderStatus(panel, "Sending…", "pending");
    var renderEndpoint = (window.HOUSE_CONFIG && window.HOUSE_CONFIG.RENDER_ENDPOINT) || "";
    if (!renderEndpoint) {
      setRenderStatus(panel, "Render requests are being moved — coming back shortly", "error");
      return;
    }
    fetch(renderEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "render",
        room: roomId,
        look: lookId,
        picks: roomPicks,
        key: key,
        passcode: passcode
      })
    }).then(function (res) {
      if (res.status === 200) {
        writePasscode(passcode);
        markPending(key);
        if (panel) panel.hidden = true;
        window.dispatchEvent(new Event("hashchange"));
        var live = document.getElementById("live");
        if (live) live.textContent = "Requested. Home Design will message you when it's ready (a few minutes).";
        return;
      }
      if (res.status === 401) {
        clearPasscode();
        setRenderStatus(panel, "Wrong passcode.", "error");
        if (panel) {
          panel.hidden = false;
          var input = panel.querySelector("[data-builder-render-pass]");
          if (input) { input.value = ""; input.focus(); }
        }
        return;
      }
      if (res.status === 503) {
        setRenderStatus(panel, "Render requests are not set up yet.", "error");
        return;
      }
      setRenderStatus(panel, "Could not send the request. Try again in a moment.", "error");
    }).catch(function () {
      setRenderStatus(panel, "Could not reach the site. Check your connection and try again.", "error");
    });
  }

  document.addEventListener("click", function (event) {
    var viewStaged = event.target.closest && event.target.closest("[data-builder-view-staged]");
    if (viewStaged) {
      event.preventDefault();
      var stV = currentBuilderState();
      goBuilder(stV.buildRoom, mergePicks({ buildPicks: stV.buildPicks }), { bg: "staged", slot: "" });
      return;
    }
    var requestBtn = event.target.closest && event.target.closest("[data-builder-request-render]");
    if (requestBtn && !requestBtn.disabled) {
      event.preventDefault();
      var stR = currentBuilderState();
      var picksR = mergePicks({ buildPicks: stR.buildPicks });
      var roomR = stR.buildRoom || "living";
      var lookR = stR.builderLook || "";
      var roomPicksR = picksR[roomR] || {};
      var keyR = renderKey(roomR, lookR, roomPicksR);
      var panelR = document.querySelector("[data-builder-render-panel]");
      var stored = readPasscode();
      if (stored) {
        postRenderRequest(roomR, lookR, roomPicksR, keyR, stored, panelR);
        return;
      }
      if (panelR) {
        panelR.hidden = false;
        var inputR = panelR.querySelector("[data-builder-render-pass]");
        if (inputR) inputR.focus();
      }
      return;
    }
    var sendBtn = event.target.closest && event.target.closest("[data-builder-send-render]");
    if (sendBtn) {
      event.preventDefault();
      var stS = currentBuilderState();
      var picksS = mergePicks({ buildPicks: stS.buildPicks });
      var roomS = stS.buildRoom || "living";
      var lookS = stS.builderLook || "";
      var roomPicksS = picksS[roomS] || {};
      var keyS = renderKey(roomS, lookS, roomPicksS);
      var panelS = document.querySelector("[data-builder-render-panel]");
      var inputS = panelS && panelS.querySelector("[data-builder-render-pass]");
      var pass = inputS ? String(inputS.value || "") : "";
      if (!pass) {
        setRenderStatus(panelS, "Enter the passcode first.", "error");
        return;
      }
      postRenderRequest(roomS, lookS, roomPicksS, keyS, pass, panelS);
      return;
    }
    var share = event.target.closest && event.target.closest("[data-builder-share]");
    if (share) {
      event.preventDefault();
      var st = currentBuilderState();
      var picksNow = mergePicks({ buildPicks: st.buildPicks });
      var shareState = Object.assign({}, st, { builderSlot: "" });
      var shareHash = builderHash(st.buildRoom, shareState, picksNow, st.builderBg, st.builderFrom, null);
      var url = location.href.split("#")[0] + shareHash;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { markShareCopied(share); }).catch(function () {
          window.prompt("Copy this share link", url);
        });
      } else {
        window.prompt("Copy this share link", url);
      }
      return;
    }
    var close = event.target.closest && event.target.closest("[data-builder-close-sheet]");
    if (close) {
      event.preventDefault();
      var stClose = currentBuilderState();
      goBuilder(stClose.buildRoom, mergePicks({ buildPicks: stClose.buildPicks }), { slot: "" });
      return;
    }
    var open = event.target.closest && event.target.closest("[data-builder-open-slot]");
    if (open) {
      event.preventDefault();
      var stOpen = currentBuilderState();
      goBuilder(stOpen.buildRoom, mergePicks({ buildPicks: stOpen.buildPicks }), { slot: open.getAttribute("data-builder-open-slot") });
      return;
    }
    var startBtn = event.target.closest && event.target.closest("[data-builder-start]");
    if (startBtn) {
      event.preventDefault();
      var lookId = startBtn.getAttribute("data-builder-start");
      if (!lookId) return;
      var filled = fillFromLook(lookId);
      rememberBuilderLook(lookId);
      goBuilder(currentBuilderState().buildRoom, filled, { from: "", slot: "", bg: "look", look: lookId });
      return;
    }
    var storeBtn = event.target.closest && event.target.closest("[data-builder-store]");
    if (storeBtn && storeBtn.tagName === "BUTTON") {
      event.preventDefault();
      var stS = currentBuilderState();
      goBuilder(stS.buildRoom, mergePicks({ buildPicks: stS.buildPicks }), { store: storeBtn.getAttribute("data-builder-store") || "", slot: stS.builderSlot || "" });
      return;
    }
    var filterBtn = event.target.closest && event.target.closest("[data-builder-filter]");
    if (filterBtn && filterBtn.tagName === "BUTTON") {
      event.preventDefault();
      var stF = currentBuilderState();
      goBuilder(stF.buildRoom, mergePicks({ buildPicks: stF.buildPicks }), { from: filterBtn.getAttribute("data-builder-filter") || "", slot: stF.builderSlot || "" });
      return;
    }
    var clear = event.target.closest && event.target.closest("[data-builder-clear]");
    if (clear) {
      event.preventDefault();
      var state = currentBuilderState();
      var picks = mergePicks({ buildPicks: state.buildPicks });
      var room = state.buildRoom || "living";
      if (picks[room]) delete picks[room][clear.getAttribute("data-builder-clear")];
      writeStore(picks);
      goBuilder(room, picks, { slot: "" });
      return;
    }
    var pick = event.target.closest && event.target.closest("[data-builder-pick]");
    if (pick) {
      event.preventDefault();
      var state2 = currentBuilderState();
      var picks2 = mergePicks({ buildPicks: state2.buildPicks });
      var room2 = state2.buildRoom || "living";
      picks2[room2] = picks2[room2] || {};
      picks2[room2][pick.getAttribute("data-slot")] = pick.getAttribute("data-builder-pick");
      writeStore(picks2);
      goBuilder(room2, picks2, { slot: "" });
    }
  });

  document.addEventListener("change", function (event) {
    var lookSel = event.target.closest && event.target.closest("[data-builder-look]");
    if (lookSel) {
      var state2 = currentBuilderState();
      goBuilder(state2.buildRoom, mergePicks({ buildPicks: state2.buildPicks }), { bg: "look", look: lookSel.value, slot: state2.builderSlot || "" });
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var st = currentBuilderState();
    if (!st.builderSlot) return;
    event.preventDefault();
    goBuilder(st.buildRoom, mergePicks({ buildPicks: st.buildPicks }), { slot: "" });
  });

  HOUSE.shopProductById = productById;
  HOUSE.builderRoomById = builderRoom;
})();
