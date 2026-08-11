const FABRICS = [
  { name: "Rose Velvet", css: "radial-gradient(circle at 30% 20%, #ff9fb3 0%, #E1435C 55%, #7a1f33 100%)" },
  { name: "Sage Linen", css: "linear-gradient(160deg, #c3d0ab 0%, #7E8F6E 75%)" },
  { name: "Ivory Lace", css: "repeating-linear-gradient(45deg, #FBF3EA 0px, #FBF3EA 7px, #ecdfc9 7px, #ecdfc9 14px)" },
  { name: "Plum Satin", css: "linear-gradient(135deg, #6b4470 0%, #241726 85%)" },
  { name: "Gold Dot", css: "radial-gradient(#C79A3C 2.5px, transparent 3px) 0 0/16px 16px, #f2d9a1" },
  { name: "Lilac Floral", css: "radial-gradient(circle at 22% 30%, #d8c7e0 9px, transparent 10px), radial-gradient(circle at 62% 68%, #b8a9c9 11px, transparent 12px), #f3ecf7" },
  { name: "Coral Stripe", css: "repeating-linear-gradient(100deg, #E1435C 0px, #E1435C 12px, #ffd9e0 12px, #ffd9e0 24px)" },
  { name: "Chambray Denim", css: "linear-gradient(160deg, #7fa0bf 0%, #3f5872 75%)" },
];

const SEED_LISTINGS = [
  { id: 1, title: "Silk Wrap Midi", brand: "Réalisation Par", price: 68, size: "S", condition: "Like New", category: "Midi", fabric: 0, seller: "Priya K.", rating: 4.9, desc: "Bias-cut wrap dress in mulberry silk. Worn once to a garden wedding." },
  { id: 2, title: "Linen Maxi Slip", brand: "Everlane", price: 42, size: "M", condition: "Good", category: "Maxi", fabric: 1, seller: "You", rating: 4.7, desc: "Breezy sage linen maxi, adjustable straps. Slightly sun-faded at the hem." },
  { id: 3, title: "Ivory Lace Slip", brand: "Reformation", price: 55, size: "XS", condition: "New with tags", category: "Wedding Guest", fabric: 2, seller: "Meera S.", rating: 5.0, desc: "Never worn, tags still attached." },
  { id: 4, title: "Plum Satin Slip", brand: "Cult Gaia", price: 89, size: "L", condition: "Like New", category: "Formal", fabric: 3, seller: "Anaya R.", rating: 4.8, desc: "Deep plum satin, cowl neck. Dry cleaned and ready to wear." },
  { id: 5, title: "Gold Dot Tea Dress", brand: "Ganni", price: 51, size: "M", condition: "Good", category: "Vintage", fabric: 4, seller: "You", rating: 4.7, desc: "Puff-sleeve tea dress with a gold polka print." },
  { id: 6, title: "Lilac Floral Mini", brand: "Free People", price: 34, size: "S", condition: "Fair", category: "Mini", fabric: 5, seller: "Kavya T.", rating: 4.5, desc: "Smocked bodice mini, tie straps." },
  { id: 7, title: "Coral Stripe Sundress", brand: "Sézane", price: 46, size: "M", condition: "Like New", category: "Mini", fabric: 6, seller: "Diya P.", rating: 4.9, desc: "Cotton poplin sundress with a sweetheart neckline." },
  { id: 8, title: "Chambray Shirt Dress", brand: "Madewell", price: 38, size: "L", condition: "Good", category: "Midi", fabric: 7, seller: "Neha V.", rating: 4.6, desc: "Classic denim shirt dress, belted waist." },
];

const CATEGORIES = ["All", "Mini", "Midi", "Maxi", "Wedding Guest", "Vintage", "Formal"];
const SIZES = ["XS", "S", "M", "L", "XL"];
const CONDITIONS = ["New with tags", "Like New", "Good", "Fair"];
const ORDERS_PIN = "1234"; // change this to your own PIN

const state = {
  listings: SEED_LISTINGS.slice(),
  screen: "browse",
  selectedId: null,
  bag: [],
  user: null,
  pendingScreen: null,
  processing: false,
  paidTotal: 0,
  filterCat: "All",
  sellFabricIdx: 0,
  sellPhoto: null,
  orders: [],
  ordersUnlocked: false,
  toast: "",
};

const LOGO = `<svg viewBox="0 0 32 26" width="24" height="19" fill="none">
  <path d="M6 9C4 6 5 3 9 2" stroke="#E1435C" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="2 2.4"/>
  <path d="M4 13 L11 4 H26 C27.1 4 28 4.9 28 6 V20 C28 21.1 27.1 22 26 22 H11 Z" stroke="#241726" stroke-width="1.6" stroke-linejoin="round" fill="#fff"/>
  <circle cx="9" cy="13" r="1.7" stroke="#241726" stroke-width="1.4" fill="none"/>
  <text x="20" y="17" text-anchor="middle" font-family="Fraunces, serif" font-size="10" font-weight="600" fill="#E1435C">DH</text>
</svg>`;

function findListing(id) { return state.listings.find(l => l.id === id); }
function fabric(idx) { return FABRICS[idx]; }
function flash(msg) { state.toast = msg; render(); setTimeout(() => { state.toast = ""; renderToastOnly(); }, 1600); }
function renderToastOnly() { const el = document.getElementById("toast"); if (el) el.remove(); }

function starRow(rating) {
  return `<span class="stars">★ ${rating.toFixed(1)}</span>`;
}

function swatchInner(l) {
  return l.photo
    ? `<img class="swatch-img" src="${l.photo}" alt="${l.title}" />`
    : "";
}

function listingCard(l) {
  return `
  <div class="card" data-action="open" data-id="${l.id}">
    <div class="card-thumb">
      <div class="swatch" style="${l.photo ? "" : `background:${fabric(l.fabric).css}`}">${swatchInner(l)}</div>
      <div class="tag-wrap"><span class="tag">$${l.price}</span></div>
      <div class="heart">♥</div>
    </div>
    <div class="card-body">
      <p class="card-title">${l.title}</p>
      <p class="card-sub">${l.brand}</p>
      <div class="card-foot">
        <span class="size-pill">${l.size}</span>
        ${starRow(l.rating)}
      </div>
    </div>
  </div>`;
}

function chip(label, active, action, dataAttr) {
  return `<button class="chip ${active ? "active" : ""}" data-action="${action}" ${dataAttr}>${label}</button>`;
}

function screenBrowse() {
  const filtered = state.filterCat === "All" ? state.listings : state.listings.filter(l => l.category === state.filterCat);
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
      <div style="display:flex;align-items:center;gap:7px;">${LOGO}<h1 class="brand">Dress Hub</h1></div>
      <span style="font-family:var(--mono);font-size:10px;color:var(--muted);letter-spacing:0.06em;">MARKET</span>
    </div>
    <p class="sub">Pre-loved dresses, one careful owner at a time.</p>
    <div class="chip-row">
      ${CATEGORIES.map(c => chip(c, c === state.filterCat, "filter", `data-cat="${c}"`)).join("")}
    </div>
    <div class="grid">${filtered.map(listingCard).join("") || `<p class="center-empty" style="grid-column:1/3;">Nothing in this category yet.</p>`}</div>
  `;
}

function screenDetail() {
  const l = findListing(state.selectedId);
  if (!l) return screenBrowse();
  return `
    <div class="header-row"><button class="back" data-action="nav" data-screen="browse">←</button></div>
    <div class="swatch swatch-detail" style="${l.photo ? "" : `background:${fabric(l.fabric).css}`}">${swatchInner(l)}</div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:16px;">
      <div><p class="card-title" style="font-size:22px;">${l.title}</p><p class="card-sub" style="font-size:13px;">${l.brand}</p></div>
      <span class="tag">$${l.price}</span>
    </div>
    <div class="pill-row">
      <span class="pill size">Size ${l.size}</span>
      <span class="pill cond">${l.condition}</span>
      <span class="pill cat">${l.category}</span>
    </div>
    <p class="desc">${l.desc}</p>
    <div class="seller-row">
      <div class="avatar">${l.seller.split(" ").map(w => w[0]).join("")}</div>
      <div><p style="margin:0;font-size:13px;color:var(--ink);">${l.seller}</p>${starRow(l.rating)}</div>
    </div>
    <div class="sticky-bar">
      <button class="btn btn-outline" data-action="offer" data-id="${l.id}">Make an offer</button>
      <button class="btn btn-primary" data-action="addBag" data-id="${l.id}">Add to bag</button>
    </div>
  `;
}

function screenSell() {
  const f = fabric(state.sellFabricIdx);
  const photo = state.sellPhoto;
  return `
    <div class="header-row"><h2 class="title">Sell a dress</h2></div>
    <div class="upload-tile">
      <div class="swatch" style="height:170px;${photo ? "" : `background:${f.css}`}">
        ${photo ? `<img class="swatch-img" src="${photo}" alt="preview" />` : `<div class="upload-cap" style="height:100%;">No photo yet — using sample swatch</div>`}
      </div>
    </div>
    <div class="photo-actions">
      <label class="btn btn-outline" style="flex:1;cursor:pointer;">
        📷 Choose photo
        <input type="file" id="s-photo-input" accept="image/*" style="display:none" />
      </label>
      <button class="btn btn-outline" style="flex:1;" data-action="cycleFabric">Use sample swatch</button>
    </div>
    <p class="upload-hint">Photo stays only in this browser tab — nothing is uploaded anywhere.</p>
    <div class="field"><label>Title</label><input id="s-title" placeholder="Floral cotton midi dress" /></div>
    <div class="field"><label>Brand</label><input id="s-brand" placeholder="Reformation" /></div>
    <div class="row-2">
      <div class="field"><label>Category</label>
        <select id="s-category">${CATEGORIES.filter(c => c !== "All").map(c => `<option>${c}</option>`).join("")}</select>
      </div>
      <div class="field" style="max-width:84px;"><label>Size</label>
        <select id="s-size">${SIZES.map(s => `<option ${s === "S" ? "selected" : ""}>${s}</option>`).join("")}</select>
      </div>
    </div>
    <div class="row-2">
      <div class="field"><label>Condition</label>
        <select id="s-condition">${CONDITIONS.map(c => `<option>${c}</option>`).join("")}</select>
      </div>
      <div class="field w90"><label>Price (USD)</label><input id="s-price" placeholder="45" inputmode="numeric" /></div>
    </div>
    <div class="field"><label>Description</label><textarea id="s-desc" placeholder="Fit, fabric, any wear to note"></textarea></div>
    <button class="btn btn-full btn-primary" data-action="listSubmit">List it</button>
  `;
}

function screenBag() {
  const subtotal = state.bag.reduce((s, l) => s + l.price, 0);
  if (state.bag.length === 0) {
    return `<div class="header-row"><h2 class="title">Your bag</h2></div>
      <div class="center-empty"><p style="font-size:13px;">Your bag is empty. Go find something lovely.</p></div>`;
  }
  return `
    <div class="header-row"><h2 class="title">Your bag</h2></div>
    ${state.bag.map(item => `
      <div class="bag-row">
        <div class="bag-thumb" style="background:${fabric(item.fabric).css}"></div>
        <div style="flex:1;"><p style="margin:0;font-size:13.5px;color:var(--ink);">${item.title}</p>
          <p style="margin:2px 0 0;font-size:11.5px;color:var(--muted);">Size ${item.size} · ${item.condition}</p></div>
        <span style="font-family:var(--mono);font-size:13px;color:var(--ink);">$${item.price}</span>
        <button data-action="removeBag" data-bagid="${item.bagId}" style="background:none;border:none;cursor:pointer;">✕</button>
      </div>`).join("")}
    <div class="bag-total"><span style="color:var(--muted);">Subtotal</span><span style="font-family:var(--mono);">$${subtotal}</span></div>
    <p class="bag-sub">Shipping calculated at checkout.</p>
    <button class="btn btn-full btn-dark" data-action="checkout">Checkout</button>
  `;
}

function screenLogin(mode) {
  mode = mode || "login";
  return `
    <div class="header-row"><button class="back" data-action="nav" data-screen="${state.pendingScreen || "bag"}">←</button><h2 class="title">${mode === "login" ? "Log in" : "Create account"}</h2></div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;margin:6px 0 20px;">
      <div style="width:50px;height:50px;border-radius:50%;background:#fff;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;">${LOGO}</div>
      <span class="card-title" style="font-size:16px;">Dress Hub</span>
    </div>
    <div class="notice">You need an account to check out — this keeps orders and offers tied to you.</div>
    ${mode === "signup" ? `<div class="field"><label>Full name</label><input id="l-name" placeholder="Jordan Lee" /></div>` : ""}
    <div class="field"><label>Email</label><input id="l-email" placeholder="you@example.com" inputmode="email" /></div>
    <div class="field"><label>Password</label><input id="l-password" type="password" placeholder="At least 4 characters" /></div>
    <button class="btn btn-full btn-dark" data-action="loginSubmit" data-mode="${mode}">${mode === "login" ? "Log in" : "Sign up"}</button>
    <p style="text-align:center;font-size:12.5px;color:var(--muted);margin-top:14px;">
      ${mode === "login" ? "New to Dress Hub?" : "Already have an account?"}
      <span style="color:var(--rose);cursor:pointer;" data-action="toggleMode" data-mode="${mode === "login" ? "signup" : "login"}">${mode === "login" ? "Create an account" : "Log in"}</span>
    </p>
  `;
}

function fmtCard(v) { return v.replace(/[^0-9]/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); }
function fmtExpiry(v) { const d = v.replace(/[^0-9]/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; }

function screenCheckout() {
  const subtotal = state.bag.reduce((s, l) => s + l.price, 0);
  const shipping = state.bag.length ? 6 : 0;
  const total = subtotal + shipping;
  return `
    <div class="header-row"><button class="back" data-action="nav" data-screen="bag">←</button><h2 class="title">Checkout</h2></div>
    <div class="notice">Test mode — no real card is charged. This isn't connected to a payment processor.</div>
    <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:16px;">
      ${state.bag.map(item => `<div style="display:flex;justify-content:space-between;font-size:12.5px;padding:4px 0;color:var(--ink);"><span>${item.title}</span><span style="font-family:var(--mono);">$${item.price}</span></div>`).join("")}
      <div style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px;">
        <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--muted);"><span>Shipping</span><span style="font-family:var(--mono);">$${shipping}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:14.5px;margin-top:4px;color:var(--ink);"><span>Total</span><span style="font-family:var(--mono);">$${total}</span></div>
      </div>
    </div>
    <div class="field"><label>Name on card</label><input id="c-name" placeholder="Jordan Lee" /></div>
    <div class="field"><label>Card number</label><input id="c-number" placeholder="4242 4242 4242 4242" inputmode="numeric" /></div>
    <div class="row-2">
      <div class="field"><label>Expiry</label><input id="c-expiry" placeholder="MM/YY" inputmode="numeric" /></div>
      <div class="field w90"><label>CVC</label><input id="c-cvc" placeholder="123" inputmode="numeric" /></div>
      <div class="field w90"><label>ZIP</label><input id="c-zip" placeholder="94110" inputmode="numeric" /></div>
    </div>
    <button class="btn btn-full btn-dark" data-action="pay" ${state.processing ? "disabled" : ""}>${state.processing ? "Processing…" : "Pay $" + total}</button>
    <p style="font-size:10.5px;color:var(--muted);text-align:center;margin-top:8px;">Demo form — do not enter a real card number.</p>
  `;
}

function screenSuccess() {
  return `
    <div style="padding-top:60px;text-align:center;">
      <div style="width:56px;height:56px;border-radius:50%;background:var(--sage);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:#fff;font-size:22px;">✓</div>
      <p class="card-title" style="font-size:20px;">Order placed</p>
      <p style="font-size:13px;color:var(--muted);margin:6px 0 20px;">Simulated payment of $${state.paidTotal} — no real charge occurred.</p>
      <button class="btn btn-outline" style="display:inline-block;padding:11px 22px;" data-action="nav" data-screen="browse">Back to browsing</button>
    </div>
  `;
}

function screenProfile() {
  if (!state.user) {
    return `<div class="header-row"><h2 class="title">Profile</h2></div>
      <div class="center-empty">
        <p style="font-size:13px;margin-bottom:14px;">Log in to see your listings and orders.</p>
        <button class="btn btn-outline" style="display:inline-block;padding:10px 20px;" data-action="requireLogin" data-target="profile">Log in</button>
      </div>`;
  }
  const mine = state.listings.filter(l => l.seller === "You");
  return `
    <div class="header-row"><h2 class="title">Profile</h2></div>
    <div style="display:flex;align-items:center;gap:13px;margin-bottom:18px;">
      <div class="avatar" style="width:54px;height:54px;background:var(--rose);font-size:19px;">${state.user.name[0].toUpperCase()}</div>
      <div style="flex:1;"><p class="card-title" style="text-transform:capitalize;">${state.user.name}</p><p class="card-sub">${state.user.email}</p></div>
      <button data-action="logout" style="background:none;border:1px solid #E4D9CC;border-radius:8px;padding:6px 10px;font-size:11.5px;color:var(--muted);cursor:pointer;">Log out</button>
    </div>
    <div class="stat-row">
      <div class="stat-card"><p class="stat-num">${mine.length}</p><p class="stat-label">Listings</p></div>
      <div class="stat-card"><p class="stat-num">6</p><p class="stat-label">Sold</p></div>
      <div class="stat-card"><p class="stat-num">14</p><p class="stat-label">Following</p></div>
    </div>
    <p class="card-title" style="font-size:15px;margin-bottom:10px;">My listings</p>
    ${mine.length === 0 ? `<p style="font-size:12.5px;color:var(--muted);">Nothing listed yet — tap Sell to add your first dress.</p>` : `
    <div class="grid">
      ${mine.map(l => `<div class="card"><div class="swatch" style="height:90px;${l.photo ? "" : `background:${fabric(l.fabric).css}`}">${l.photo ? `<img class="swatch-img" src="${l.photo}" alt="${l.title}" />` : ""}</div><div class="card-body" style="padding:7px 9px;"><p style="margin:0;font-size:12px;color:var(--ink);">${l.title}</p><p style="margin:2px 0 0;font-family:var(--mono);font-size:11px;color:var(--rose);">$${l.price}</p></div></div>`).join("")}
    </div>`}
  `;
}

function screenOrders() {
  if (!state.user) {
    return `<div class="header-row"><h2 class="title">Orders</h2></div>
      <div class="center-empty">
        <p style="font-size:13px;margin-bottom:14px;">Log in to see orders placed on your listings.</p>
        <button class="btn btn-outline" style="display:inline-block;padding:10px 20px;" data-action="requireLogin" data-target="orders">Log in</button>
      </div>`;
  }
  if (!state.ordersUnlocked) {
    return `
      <div class="header-row"><h2 class="title">Orders</h2></div>
      <div class="notice">🔒 This is private — enter your PIN to view orders.</div>
      <div class="field"><label>PIN</label><input id="o-pin" type="password" inputmode="numeric" placeholder="••••" /></div>
      <button class="btn btn-full btn-dark" data-action="unlockOrders">Unlock</button>
      <p style="font-size:10.5px;color:var(--muted);text-align:center;margin-top:10px;">Basic protection only — this runs in your browser, not on a server.</p>
    `;
  }
  if (state.orders.length === 0) {
    return `<div class="header-row"><h2 class="title">Orders</h2></div>
      <div class="center-empty"><p style="font-size:13px;">No orders yet — they'll show up here once someone checks out.</p></div>`;
  }
  const statusColor = { "New": "var(--rose)", "Shipped": "var(--gold)", "Delivered": "var(--sage)" };
  const nextStatus = { "New": "Shipped", "Shipped": "Delivered", "Delivered": "Delivered" };
  return `
    <div class="header-row"><h2 class="title">Orders</h2></div>
    ${state.orders.slice().reverse().map(o => `
      <div style="background:#fff;border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-family:var(--mono);font-size:11px;color:var(--muted);">${o.date}</span>
          <span style="font-size:11px;font-weight:600;color:${statusColor[o.status]};">${o.status}</span>
        </div>
        ${o.items.map(it => `<div style="display:flex;justify-content:space-between;font-size:12.5px;padding:2px 0;color:var(--ink);"><span>${it.title}</span><span style="font-family:var(--mono);">$${it.price}</span></div>`).join("")}
        <div style="display:flex;justify-content:space-between;border-top:1px solid var(--border);margin-top:8px;padding-top:8px;font-size:13px;">
          <span style="color:var(--muted);">Buyer: ${o.buyer}</span>
          <span style="font-family:var(--mono);color:var(--ink);">$${o.total}</span>
        </div>
        ${o.status !== "Delivered" ? `<button class="btn btn-outline btn-full" style="margin-top:10px;padding:8px 0;font-size:12px;" data-action="advanceStatus" data-orderid="${o.id}">Mark as ${nextStatus[o.status]}</button>` : ""}
      </div>
    `).join("")}
  `;
}

function renderNav() {
  const items = [
    { key: "browse", icon: "⌂", label: "Browse" },
    { key: "orders", icon: "🧾", label: "Orders" },
    { key: "sell", icon: "＋", label: "Sell" },
    { key: "bag", icon: "🛍", label: "Bag" },
    { key: "profile", icon: "☺", label: "Profile" },
  ];
  return items.map(({ key, icon, label }) => `
    <button class="navbtn ${state.screen === key ? "active" : ""}" data-action="nav" data-screen="${key}">
      <span style="font-size:18px;">${icon}${key === "bag" && state.bag.length ? `<span class="badge">${state.bag.length}</span>` : ""}</span>
      <span class="label">${label}</span>
    </button>`).join("");
}

function render() {
  const screenEl = document.getElementById("screen");
  let html;
  switch (state.screen) {
    case "browse": case "search": html = screenBrowse(); break;
    case "detail": html = screenDetail(); break;
    case "sell": html = screenSell(); break;
    case "bag": html = screenBag(); break;
    case "login": html = screenLogin("login"); break;
    case "signup": html = screenLogin("signup"); break;
    case "checkout": html = screenCheckout(); break;
    case "success": html = screenSuccess(); break;
    case "orders": html = screenOrders(); break;
    case "profile": html = screenProfile(); break;
    default: html = screenBrowse();
  }
  screenEl.innerHTML = html + (state.toast ? `<div class="toast" id="toast">✓ ${state.toast}</div>` : "");
  document.getElementById("nav").innerHTML = renderNav();
}

function handleAction(action, el) {
  switch (action) {
    case "nav": state.screen = el.dataset.screen; break;
    case "filter": state.filterCat = el.dataset.cat; break;
    case "open": state.selectedId = Number(el.dataset.id); state.screen = "detail"; break;
    case "offer": {
      const l = findListing(Number(el.dataset.id));
      flash(`Offer sent to ${l.seller}`);
      return;
    }
    case "addBag": {
      const l = findListing(Number(el.dataset.id));
      state.bag.push({ ...l, bagId: Date.now() });
      state.screen = "browse";
      flash("Added to bag");
      return;
    }
    case "removeBag":
      state.bag = state.bag.filter(i => i.bagId !== Number(el.dataset.bagid));
      break;
    case "cycleFabric":
      state.sellPhoto = null;
      state.sellFabricIdx = (state.sellFabricIdx + 1) % FABRICS.length;
      break;
    case "listSubmit": {
      const title = document.getElementById("s-title").value.trim();
      const price = document.getElementById("s-price").value;
      if (!title || !price) { flash("Add a title and price"); return; }
      state.listings.unshift({
        id: Date.now(), title, brand: document.getElementById("s-brand").value.trim() || "Unbranded",
        price: Number(price) || 0, size: document.getElementById("s-size").value,
        condition: document.getElementById("s-condition").value, category: document.getElementById("s-category").value,
        fabric: state.sellFabricIdx, seller: "You", rating: 5.0,
        desc: document.getElementById("s-desc").value.trim() || "No description provided.",
        photo: state.sellPhoto,
      });
      state.sellPhoto = null;
      state.screen = "browse";
      flash("Listed!");
      return;
    }
    case "checkout":
      if (!state.user) { state.pendingScreen = "checkout"; state.screen = "login"; return render(); }
      state.screen = "checkout";
      break;
    case "requireLogin": state.pendingScreen = el.dataset.target; state.screen = "login"; break;
    case "toggleMode": state.screen = el.dataset.mode; break;
    case "loginSubmit": {
      const mode = el.dataset.mode;
      const email = document.getElementById("l-email").value.trim();
      const password = document.getElementById("l-password").value;
      const nameEl = document.getElementById("l-name");
      if (!email.includes("@") || password.length < 4 || (mode === "signup" && !nameEl.value.trim())) {
        flash("Check your details"); return;
      }
      state.user = { name: mode === "signup" ? nameEl.value.trim() : email.split("@")[0], email };
      state.screen = state.pendingScreen || "browse";
      state.pendingScreen = null;
      flash(`Welcome, ${state.user.name}`);
      return;
    }
    case "unlockOrders": {
      const pin = document.getElementById("o-pin").value;
      if (pin === ORDERS_PIN) {
        state.ordersUnlocked = true;
      } else {
        flash("Wrong PIN");
        return;
      }
      break;
    }
    case "logout": state.user = null; state.ordersUnlocked = false; state.screen = "browse"; flash("Logged out"); break;
    case "pay": {
      const name = document.getElementById("c-name").value.trim();
      const number = document.getElementById("c-number").value.replace(/\s/g, "");
      const expiry = document.getElementById("c-expiry").value;
      const cvc = document.getElementById("c-cvc").value;
      const zip = document.getElementById("c-zip").value;
      if (!name || number.length !== 16 || expiry.length !== 5 || cvc.length < 3 || zip.length < 4) {
        flash("Check your card details"); return;
      }
      const subtotal = state.bag.reduce((s, l) => s + l.price, 0);
      const total = subtotal + (state.bag.length ? 6 : 0);
      state.processing = true;
      render();
      setTimeout(() => {
        state.processing = false;
        state.paidTotal = total;
        state.orders.push({
          id: Date.now(),
          items: state.bag.slice(),
          total,
          buyer: state.user.name,
          date: new Date().toLocaleString(),
          status: "New",
        });
        state.bag = [];
        state.screen = "success";
        render();
      }, 1400);
      return;
    }
    case "advanceStatus": {
      const order = state.orders.find(o => o.id === Number(el.dataset.orderid));
      if (order) {
        if (order.status === "New") order.status = "Shipped";
        else if (order.status === "Shipped") order.status = "Delivered";
      }
      break;
    }
  }
  render();
}

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (el) handleAction(el.dataset.action, el);
});

document.addEventListener("change", (e) => {
  if (e.target.id === "s-photo-input" && e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      state.sellPhoto = reader.result;
      render();
    };
    reader.readAsDataURL(file);
  }
});

// live input formatting for checkout & sell price fields, delegated
document.addEventListener("input", (e) => {
  if (e.target.id === "c-number") e.target.value = fmtCard(e.target.value);
  if (e.target.id === "c-expiry") e.target.value = fmtExpiry(e.target.value);
  if (e.target.id === "s-price") e.target.value = e.target.value.replace(/[^0-9]/g, "");
});

render();
