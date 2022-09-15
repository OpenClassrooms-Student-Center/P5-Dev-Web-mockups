// Récupération des données de l'article avec l'id

const url = window.location.search;
const urlParams = new URLSearchParams(url);
const idItem = urlParams.get("id");

// Fonction requête GET récupération des données de l'article

async function requestItem() {
  let res = await fetch("http://localhost:3000/api/products/" + idItem);
  return res.json();
}

const elementImg = document.createElement("img");
const itemTitle = document.querySelector("#title");
const itemPrice = document.querySelector("#price");
const itemDescription = document.querySelector("#description");

// Fonction insertion de l'élément "img" et de l'image

async function treatmentItemImg() {
  let resultItemImg = await requestItem().then((product) => {
    const itemImg = document.querySelector(".item__img");
    elementImg.src = product.imageUrl;
    elementImg.alt = product.altTxt;
    itemImg.appendChild(elementImg);
  });
}
treatmentItemImg();

// Fonction insertion des éléments: nom, prix, description

async function treatmentItemData() {
  let resultItemData = await requestItem().then((product) => {
    itemTitle.innerHTML = product.name;
    itemPrice.innerHTML = product.price;
    itemDescription.innerHTML = product.description;
  });
}
treatmentItemData();

// Fonction traitement des couleurs

const treatmentItemColors = async () => {
  let resultColor = await requestItem().then((product) => {
    for (let i = 0; i < product.colors.length; i++) {
      const itemColors = document.querySelector("#colors");
      const choiceColors = document.createElement("option");
      choiceColors.setAttribute("value", product.colors[i]);
      choiceColors.innerHTML = product.colors[i];
      itemColors.appendChild(choiceColors);
    }
  });
};

treatmentItemColors();

// Ecoute de l'évènement click bouton ajouter au panier

const buttonAddToCart = document.querySelector("#addToCart");
if (buttonAddToCart != null) {
  buttonAddToCart.addEventListener("click", eventClick);
}

// Fonction évènement click bouton ajouter au panier

async function eventClick(e) {
  e.preventDefault();

  const itemColors = await document.querySelector("#colors").value;
  const itemQuantity = await document.querySelector("#quantity").value;

  if (cartInvalid(itemColors, itemQuantity)) return;
  localStorageCart(itemColors, itemQuantity);
  linkCart();
}

/* Fonction invalidation alerte message si choix couleurs
   non définis ou si quantité nul ou plus de cent articles */

function cartInvalid(itemColors, itemQuantity) {
  if (
    itemColors == null ||
    itemColors === "" ||
    itemQuantity == null ||
    itemQuantity == 0
  ) {
    alert("Veuillez sélectionner la couleur et la quantité");
    return true;
  }
  if (itemQuantity > 100) {
    alert("Vous ne pouvez pas commander plus de cent articles");
    return true;
  }
}

let recordCartLocalStorage = JSON.parse(localStorage.getItem("cart"));

/* fonction enregistrement des données des produits,
   choix quantité et additionnement quantité si même id
   et couleur dans le localstorage */

function localStorageCart(itemColors, itemQuantity) {
  const data = {
    id: idItem,
    color: itemColors,
    quantity: Number(itemQuantity),
    price: Number(itemPrice.textContent),
    name: itemTitle.textContent,
    description: itemDescription.textContent,
    alt: elementImg.alt,
    img: elementImg.src,
  };

  if (recordCartLocalStorage) {
    let color = itemColors;
    let quantity = itemQuantity;
    const resultFind = recordCartLocalStorage.find(
      (el) => el.id === idItem && el.color === color
    );
    if (resultFind) {
      let newQuantity = parseInt(quantity) + parseInt(resultFind.quantity);
      resultFind.quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(recordCartLocalStorage));
    } else {
      recordCartLocalStorage.push(data);
      localStorage.setItem("cart", JSON.stringify(recordCartLocalStorage));
    }
  } else {
    recordCartLocalStorage = [];
    recordCartLocalStorage.push(data);
    localStorage.setItem("cart", JSON.stringify(recordCartLocalStorage));
  }
}

// Fonction lien page cart

function linkCart() {
  window.location.href = "cart.html";
}
