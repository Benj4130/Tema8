const params = new URLSearchParams(location.search);
const category = params.get("category");

const title = document.querySelector("#categoryTitle");
const subtitle = document.querySelector("#subtitle");
const crumb = document.querySelector("#crumb");
const list = document.querySelector("#productList");

if (!category) {
  title.textContent = "Ingen kategori valgt";
  crumb.textContent = "Produktliste";
  subtitle.textContent = "Gå tilbage og vælg en kategori på forsiden.";
  list.innerHTML = `<p class="small">Mangler <code>?category=</code> i URL’en.</p>`;
} else {
  title.textContent = category;
  crumb.textContent = category;
  subtitle.textContent = `Viser produkter i kategorien: ${category}`;

  fetch(`https://kea-alt-del.dk/t7/api/products?category=${encodeURIComponent(category)}`)
    .then((res) => res.json())
    .then(showProducts)
    .catch((err) => {
      console.error(err);
      list.innerHTML = `<p class="small">Kunne ikke hente produkter lige nu.</p>`;
    });
}

function showProducts(products) {
  list.innerHTML = "";

  if (!products.length) {
    list.innerHTML = `<p class="small">Ingen produkter i denne kategori.</p>`;
    return;
  }
  products.forEach((product) => {
    const a = document.createElement("a");
    a.classList.add("card", "product-card");
    a.href = `product.html?id=${product.id}`;

    if (product.soldout) a.classList.add("udsolgt");
    if (product.discount) a.classList.add("nedsat");

    const img = `https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp`;

    const badges = [];
    if (product.discount) badges.push(`<span class="badge badge--sale">-${product.discount}%</span>`);
    if (product.soldout) badges.push(`<span class="badge badge--soldout">Udsolgt</span>`);

    a.innerHTML = `
      <div class="product-media">
        <img src="${img}" alt="${product.productdisplayname}" loading="lazy">
        <div class="badges">${badges.join("")}</div>
      </div>

      <div class="product-body">
        <h2 class="product-title">${product.productdisplayname}</h2>
        <div class="product-meta">
          <span>Brand: ${product.brandname}</span>
          <span class="price">${formatPrice(product.price)} kr.</span>
        </div>
        <div><span class="btn btn--primary">Læs mere</span></div>
      </div>
    `;

    list.appendChild(a);
  });
}

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("da-DK").format(n);
}
