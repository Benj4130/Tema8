const params = new URLSearchParams(location.search);
const id = params.get("id");

const container = document.querySelector("#productDetail");
const crumbs = document.querySelector("#crumbs");

if (!id) {
  container.innerHTML = `<p class="small">Mangler <code>?id=</code> i URL’en. Gå tilbage og vælg et produkt.</p>`;
} else {
  fetch(`https://kea-alt-del.dk/t7/api/products/${id}`)
    .then((res) => res.json())
    .then(showProduct)
    .catch((err) => {
      console.error(err);
      container.innerHTML = `<p class="small">Kunne ikke hente produktet lige nu.</p>`;
    });
}

function showProduct(product) {
  const img = `https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp`;

  const soldout = Boolean(product.soldout);
  const discount = Number(product.discount) || 0;

  const price = Number(product.price);
  const newPrice = discount ? Math.round(price - (price * discount) / 100) : null;

  crumbs.innerHTML = `
    <a href="index.html">Forside</a> →
    <a href="productlist.html?category=${encodeURIComponent(product.category)}">${product.category}</a> →
    <strong>${product.productdisplayname}</strong>
  `;

  const priceHtml = discount ? `<span class="price-old">${formatPrice(price)} kr.</span> <strong class="price-off">${formatPrice(newPrice)} kr.</strong>` : `<strong class="price">${formatPrice(price)} kr.</strong>`;

  container.innerHTML = `
    <section class="product-detail">
      <div class="card detail-media">
        <img src="${img}" alt="${product.productdisplayname}">
      </div>

      <div class="card detail-info ${soldout ? "udsolgt" : ""} ${discount ? "nedsat" : ""}">
        <h1>${product.productdisplayname}</h1>
        <p class="small">Brand: ${product.brandname}</p>

        <div class="detail-row"><span>Kategori</span><span>${product.category}</span></div>
        <div class="detail-row"><span>Status</span><span>${soldout ? "Udsolgt" : "På lager"}</span></div>
        <div class="detail-row"><span>Pris</span><span>${priceHtml}</span></div>

        <div class="buy-box">
          <label class="small" for="size">Vælg størrelse</label>
          <select id="size" ${soldout ? "disabled" : ""}>
            <option value="">Vælg…</option>
            <option>S</option><option>M</option><option>L</option><option>XL</option>
          </select>

          <a class="btn btn--primary" href="#" style="${soldout ? "pointer-events:none;opacity:.6;" : ""}">
            Læg i kurv
          </a>

          <a class="btn" href="javascript:history.back()">← Tilbage</a>
        </div>
      </div>
    </section>
  `;
}

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("da-DK").format(n);
}
