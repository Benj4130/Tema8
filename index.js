const endpoint = "https://kea-alt-del.dk/t7/api/categories";
const list = document.querySelector("#categoryList");

fetch(endpoint)
  .then((res) => res.json())
  .then(showCategories)
  .catch((err) => {
    console.error(err);
    list.innerHTML = `<p class="small">Kunne ikke hente kategorier lige nu.</p>`;
  });

function showCategories(categories) {
  list.innerHTML = "";

  categories.forEach((cat) => {
    const a = document.createElement("a");
    a.classList.add("card", "category-card");
    a.href = `productlist.html?category=${encodeURIComponent(cat.category)}`;

    a.innerHTML = `
      <div>
        <h3>${cat.category}</h3>
        <p>Se produkter i denne kategori</p>
      </div>
      <span class="btn btn--primary">Se produkter →</span>
    `;

    list.appendChild(a);
  });
}
