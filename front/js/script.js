// Fonction requête GET pour récupérer les données des produits de l'API

async function requestApi() {
  let resultApi = await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => treatmentProducts(data));
}
requestApi();

// Fonction traitement des données des produits de l'API

function treatmentProducts(product) {
  for (i = 0; i < product.length; i++) {
    const _id = product[i]._id;
    const imageUrl = product[i].imageUrl;
    const altTxt = product[i].altTxt;
    const name = product[i].name;
    const description = product[i].description;

    const productImg = treatmentImg(imageUrl, altTxt);
    const productBeacon = treatmentBeacon(_id);
    const productArticle = document.createElement("article");
    const productName = treatmentName(name);
    const productDescription = treatmentDescription(description);

    productArticle.appendChild(productImg);
    productArticle.appendChild(productName);
    productArticle.appendChild(productDescription);
    treatmentSelectorChildren(productBeacon, productArticle);
  }
}

// Fonction insertion de l'élément "a", lien vers page product avec id produit

function treatmentBeacon(_id) {
  const productBeacon = document.createElement("a");
  productBeacon.href = "./product.html?id=" + _id;
  return productBeacon;
}

// Fonction récupération de l'id items

function treatmentSelectorChildren(productBeacon, productArticle) {
  const items = document.querySelector("#items").appendChild(productBeacon);
  items.appendChild(productArticle);
}

// Fonction insertion de l'élément "img" et des images et des altTxt

function treatmentImg(imageUrl, altTxt) {
  const productImg = document.createElement("img");
  productImg.src = imageUrl;
  productImg.alt = altTxt;
  return productImg;
}

// Fonction insertion de l'élément "h3" et des noms

function treatmentName(name) {
  const productName = document.createElement("h3");
  productName.classList.add("productName");
  productName.innerHTML = name;
  return productName;
}

// Fonction insertion de l'élément "p" et des descriptions

function treatmentDescription(description) {
  const productDescription = document.createElement("p");
  productDescription.classList.add("productDescription");
  productDescription.innerHTML = description;
  return productDescription;
}
