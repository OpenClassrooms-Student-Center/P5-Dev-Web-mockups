const cart = [];

treatmentDataLocalStorage();

cart.forEach((item) => treatmentDataCart(item));

// Fonction récupération des données des produits du localstorage

function treatmentDataLocalStorage() {
  const item = JSON.parse(localStorage.getItem("cart"));
  cart.push(item);
}

// Fonction traitement des données des produits du localstorage

function treatmentDataCart(item) {
  if (!item) {
    const titleCart = document.querySelector("h1");
    const sectionCart = document.querySelector(".cart");
    titleCart.innerHTML = "Votre panier est vide !";
    sectionCart.style.display = "none";
  } else {
    for (i = 0; i < item.length; i++) {
      const cartItem = treatmentCartItem(item);

      const cartDivImg = treatmentCartImg(item);
      cartItem.appendChild(cartDivImg);

      const cartItemContent = treatmentCartContentDescription(item);
      cartItem.appendChild(cartItemContent);

      const cartItemContentSettings = treatmentCartContentSettings(item);
      cartItem.appendChild(cartItemContentSettings);
      cartArticle(cartItem);

      cartTotalQuantity();
      cartTotalPrice(item);
    }
  }
}

// Fonction insertion de l'id et de la couleur des produits

function treatmentCartItem(item) {
  const cartItem = document.createElement("article");
  cartItem.classList.add("cart__item");

  cartItem.dataset.id = item[i].id;
  cartItem.dataset.color = item[i].color;
  console.log(cartItem);
  return cartItem;
}

// Fonction récupération de l'id cart__items pour insertion

function cartArticle(cartItem) {
  document.querySelector("#cart__items").appendChild(cartItem);
}

// Fonction insertion des images et des alttxt

function treatmentCartImg(item) {
  const cartDivImg = document.createElement("div");
  cartDivImg.className = "cart__item__img";

  const cartImg = document.createElement("img");
  cartDivImg.appendChild(cartImg);
  cartImg.src = item[i].img;
  cartImg.alt = item[i].alt;
  cartDivImg.appendChild(cartImg);
  return cartDivImg;
}

// Fonction création div

function treatmentCartContent(item) {
  const cartItemContent = document.createElement("div");
  cartItemContent.className = "cart__item__content";

  const cartItemContentDescription = treatmentCartContentDescription(item);
  const cartItemContentSettings = treatmentCartContentSettings(item);

  cartItemContent.appendChild(cartItemContentDescription);
  cartItemContent.appendChild(cartItemContentSettings);

  return cartItemContent;
}

// Fonction insertion des descriptions des produits

function treatmentCartContentDescription(item) {
  const cartItemContentDescription = document.createElement("div");
  cartItemContentDescription.className = "cart__item__content__description";

  // Insertion des noms

  const cartTitle = document.createElement("h2");
  cartItemContentDescription.appendChild(cartTitle);
  cartTitle.innerHTML = item[i].name;

  // Insertion des couleurs

  const cartColor = document.createElement("p");
  cartTitle.appendChild(cartColor);
  cartColor.innerHTML = item[i].color;
  cartColor.style.fontSize = "20px";

  // Insertion des prix

  const cartPrice = document.createElement("p");
  cartItemContentDescription.appendChild(cartPrice);
  cartPrice.innerHTML = item[i].price + " € ";
  return cartItemContentDescription;
}

// Fonction création div

function treatmentCartContentSettings(item) {
  const cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.className = "cart__item__content__settings";
  quantityContentSettings(cartItemContentSettings, item);
  cartSettingsDelete(cartItemContentSettings, item);
  return cartItemContentSettings;
}

// Fonction insertion quantité

function quantityContentSettings(cartItemContentSettings, item) {
  const cartContentSettingsQuantity = document.createElement("div");
  cartItemContentSettings.appendChild(cartContentSettingsQuantity);
  cartContentSettingsQuantity.className =
    "cart__item__content__settings__quantity";

  const cartQuantity = document.createElement("p");
  cartContentSettingsQuantity.appendChild(cartQuantity);
  cartQuantity.innerHTML = "Qté : ";

  // Insertion bouton quantité: min 1, max 100

  const input = document.createElement("input");

  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item[i].quantity;
  input.dataset.id = item[i].id;
  input.dataset.color = item[i].color;
  // Ecoute de l'évènement input choix quantité

  input.addEventListener("input", (e) => changeQuantity(e, input, item));

  cartContentSettingsQuantity.appendChild(input);
}

// Fonction évènement choix quantité enregistré dans le localstorage

function changeQuantity(e, input, item) {
  e.preventDefault();

  const quantity = input.value;
  const idQuantity = input.dataset.id;
  const colorQuantity = input.dataset.color;

  const resultFind = item.find(
    (remove) => remove.id === idQuantity && remove.color === colorQuantity
  );
  resultFind.quantity = quantity;

  cartTotalQuantity();
  cartTotalPrice(item);

  localStorage.setItem("cart", JSON.stringify(item));
}

/* Fonction création de l'élément "div", "p",
   insertion supprimer */

function cartSettingsDelete(cartItemContentSettings, item) {
  const cartContentSettingsDelete = document.createElement("div");
  cartItemContentSettings.appendChild(cartContentSettingsDelete);
  cartContentSettingsDelete.classList.add(
    "cart__item__content__settings__delete"
  );

  cartContentSettingsDelete.dataset.id = item[i].id;
  cartContentSettingsDelete.dataset.color = item[i].color;

  const cartDelete = document.createElement("p");
  cartContentSettingsDelete.appendChild(cartDelete);
  cartDelete.querySelectorAll(".deleteItem");
  cartDelete.innerHTML = "Supprimer";

  // Ecoute de l'évènement au click supprimer les produits sélectionnés

  cartContentSettingsDelete.addEventListener("click", (e) =>
    removeProductFromCart(e, cartContentSettingsDelete, item)
  );
}

// Fonction évènement supprimer les produits sélectionnés du localstorage

function removeProductFromCart(e, cartContentSettingsDelete, item) {
  e.preventDefault();
  let totalAddProductRemove = item.length;
  if (totalAddProductRemove == 1) {
    localStorage.removeItem("cart");
    location.reload();
  } else {
    const id = cartContentSettingsDelete.dataset.id;
    const color = cartContentSettingsDelete.dataset.color;
    removeLocalStorage = item.findIndex(
      (product) => product.id === id && product.color === color
    );
    item.splice(removeLocalStorage, 1);
    localStorage.setItem("cart", JSON.stringify(item));
    location.reload();
  }
}

// Fonction total quantité

function cartTotalQuantity() {
  total = 0;
  const totalQuantity = document.getElementsByClassName("itemQuantity");
  let totalCartQuantity = totalQuantity.length;
  for (let i = 0; i < totalCartQuantity; ++i) {
    total += totalQuantity[i].valueAsNumber;
  }
  const totalProductCartQuantity = document.querySelector("#totalQuantity");
  totalProductCartQuantity.innerHTML = total;
}

// Fonction total prix

function cartTotalPrice(item) {
  totalPrice = 0;
  const totalQuantity = document.getElementsByClassName("itemQuantity");
  let totalCartQuantity = totalQuantity.length;
  for (let i = 0; i < totalCartQuantity; ++i) {
    totalPrice += totalQuantity[i].valueAsNumber * item[i].price;
  }
  const totalCartPrice = document.querySelector("#totalPrice");
  totalCartPrice.innerHTML = totalPrice;
}
