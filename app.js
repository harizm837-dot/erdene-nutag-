/* =====================================================
   ERDENE NUTAG – MAIN APP LOGIC (LEVEL UP)
===================================================== */

const app = document.getElementById("app");

/* ===============================
   GLOBAL STATE
================================ */
let state = {
  page: "home",
  user: load("user", {
    name: "Зочин",
    aimag: "Улаанбаатар",
    sum: "Баянзүрх"
  }),
  posts: load("posts", []),
  market: load("market", []),
  favorites: load("favorites", []),
  myPosts: load("myPosts", [])
};

/* ===============================
   NAVIGATION
================================ */
function go(page) {
  state.page = page;
  render();
}

/* ===============================
   RENDER ROOT
================================ */
function render() {
  app.innerHTML = "";
  if (state.page === "home") renderHome();
  if (state.page === "community") renderCommunity();
  if (state.page === "market") renderMarket();
  if (state.page === "profile") renderProfile();
}

/* ===============================
   HOME
================================ */
function renderHome() {
  app.innerHTML = `
    <div class="card">
      <h2>🌍 Эрдэнэ Нутаг</h2>
      <p class="small">
        Нутгийн мэдээ · Зар · Үйл явдал · Community
      </p>
    </div>

    <div class="card">
      <h3>🔥 Сүүлийн нийтлэлүүд</h3>
      ${state.posts.slice(0,3).map(p => `
        <div class="small">• ${p.text}</div>
      `).join("") || "<div class='small'>Одоогоор алга</div>"}
    </div>

    <div class="card">
      <h3>🛒 Шинэ зарууд</h3>
      ${state.market.slice(0,3).map(m => `
        <div class="small">• ${m.title} – ${m.price}</div>
      `).join("") || "<div class='small'>Зар алга</div>"}
    </div>
  `;
}

/* ===============================
   COMMUNITY
================================ */
function renderCommunity() {
  app.innerHTML = `
    <div class="card">
      <h3>👥 Нутгийнхан</h3>
      <textarea id="postText" placeholder="Нутгийн мэдээ, санал, асуулт..."></textarea>
      <button id="postBtn">✍️ Нийтлэх</button>
    </div>

    ${state.posts.map((p, i) => `
      <div class="card">
        <div>${p.text}</div>
        <div class="small">📍 ${p.aimag} / ${p.sum}</div>
        <div class="actions">
          <button onclick="likePost(${i})">❤️ ${p.likes}</button>
          <button onclick="saveFavorite(${i})">⭐ Дуртай</button>
        </div>
      </div>
    `).join("")}
  `;

  document.getElementById("postBtn").onclick = addPost;
  bindAIById("postText", "content");
}

/* ===============================
   ADD POST
================================ */
function addPost() {
  const txt = document.getElementById("postText");
  if (!txt.value.trim()) return;

  const post = {
    text: aiEnhanceContent(txt.value),
    aimag: state.user.aimag,
    sum: state.user.sum,
    likes: 0,
    time: Date.now()
  };

  state.posts.unshift(post);
  state.myPosts.unshift(post);

  save("posts", state.posts);
  save("myPosts", state.myPosts);

  txt.value = "";
  render();
}

/* ===============================
   LIKE / FAVORITE
================================ */
function likePost(i) {
  state.posts[i].likes++;
  save("posts", state.posts);
  render();
}

function saveFavorite(i) {
  const post = state.posts[i];
  if (!state.favorites.find(f => f.time === post.time)) {
    state.favorites.push(post);
    save("favorites", state.favorites);
    alert("⭐ Дуртайд нэмлээ");
  }
}

/* ===============================
   MARKETPLACE
================================ */
function renderMarket() {
  app.innerHTML = `
    <div class="card">
      <h3>🛒 Нутгийн Зах</h3>

      <input id="mTitle" placeholder="Бараа / Үйлчилгээ">
      <input id="mPrice" placeholder="Үнэ">
      
      <select id="mAimag"></select>
      <select id="mSum"></select>

      <button id="addMarket">➕ Зар нэмэх</button>
    </div>

    <div class="card">
      <h4>🔍 Шүүх</h4>
      <select id="filterAimag"></select>
      <select id="filterSum"></select>
      <button onclick="filterMarket()">Шүүх</button>
    </div>

    <div id="marketList">
      ${state.market.map((m, i) => marketItemHTML(m, i)).join("")}
    </div>
  `;

  fillAimagSum("mAimag", "mSum");
  fillAimagSum("filterAimag", "filterSum");

  document.getElementById("addMarket").onclick = addMarketItem;
  bindAIById("mTitle", "title");
}

/* ===============================
   MARKET ITEM HTML
================================ */
function marketItemHTML(m, i) {
  return `
    <div class="card">
      <div><strong>${m.title}</strong></div>
      <div class="small">💰 ${m.price}</div>
      <div class="small">📍 ${m.aimag} / ${m.sum}</div>
      <button onclick="saveMarketFavorite(${i})">⭐ Дуртай</button>
    </div>
  `;
}

/* ===============================
   ADD MARKET ITEM
================================ */
function addMarketItem() {
  const title = document.getElementById("mTitle").value;
  const price = document.getElementById("mPrice").value;
  const aimag = document.getElementById("mAimag").value;
  const sum = document.getElementById("mSum").value;

  if (!title || !price) return;

  const item = {
    title: aiGenerateTitle(title),
    price,
    aimag,
    sum,
    time: Date.now()
  };

  state.market.unshift(item);
  save("market", state.market);
  render();
}

/* ===============================
   FILTER MARKET
================================ */
function filterMarket() {
  const a = document.getElementById("filterAimag").value;
  const s = document.getElementById("filterSum").value;

  const filtered = state.market.filter(m =>
    (!a || m.aimag === a) &&
    (!s || m.sum === s)
  );

  document.getElementById("marketList").innerHTML =
    filtered.map((m, i) => marketItemHTML(m, i)).join("");
}

/* ===============================
   PROFILE
================================ */
function renderProfile() {
  app.innerHTML = `
    <div class="card">
      <h3>👤 Миний булан</h3>
      <p><strong>${state.user.name}</strong></p>
      <p class="small">📍 ${state.user.aimag} / ${state.user.sum}</p>
    </div>

    <div class="card">
      <h4>❤️ Таалагдсан</h4>
      <div>${state.favorites.length}</div>
    </div>

    <div class="card">
      <h4>✍️ Миний нийтлэлүүд</h4>
      ${state.myPosts.map(p => `<div class="small">• ${p.text}</div>`).join("")}
    </div>
  `;
}

/* ===============================
   AIMAG / SUM SELECT FILLER
================================ */
function fillAimagSum(aId, sId) {
  const a = document.getElementById(aId);
  const s = document.getElementById(sId);
  if (!a || !s) return;

  a.innerHTML = `<option value="">Аймаг</option>`;
  Object.keys(AIMAG_SUM).forEach(k => {
    a.innerHTML += `<option value="${k}">${k}</option>`;
  });

  a.onchange = () => {
    s.innerHTML = `<option value="">Сум</option>`;
    (AIMAG_SUM[a.value] || []).forEach(sm => {
      s.innerHTML += `<option value="${sm}">${sm}</option>`;
    });
  };
}

/* ===============================
   INIT
================================ */
render();
