// Fonction requête get récuperation des données des articles sur l'api

async function requestApi() {
  let res = await fetch("http://localhost:3000/api/products");
  return res.json();
}

const cart = [];
const api = [];

treatmentDataLocalStorage();

cart.forEach((item) => treatmentDataCart(item));
api.forEach((product) => treatmentDataCart(product));

// Fonction récupération des données des produits du localstorage

function treatmentDataLocalStorage() {
  const item = JSON.parse(localStorage.getItem("cart"));

  cart.push(item);
}

// Fonction traitement des données des produits du localstorage et de l"api

async function treatmentDataCart(item) {
  let resultApi = await requestApi().then((product) => {
    for (i = 0; i < product.length; i++) {
      api.push(product);
    }
    for (i = 0; i < item.length; i++) {
      const idLS = item[i].id;

      if (product) {
        let kanap = product.filter((el) => el._id === idLS);

        const cartItem = treatmentCartItem(item);

        const cartDivImg = treatmentCartImg(item, kanap);
        cartItem.appendChild(cartDivImg);

        const cartItemContent = treatmentCartContentDescription(item, kanap);
        cartItem.appendChild(cartItemContent);

        const cartItemContentSettings = treatmentCartContentSettings(item);
        cartItem.appendChild(cartItemContentSettings);

        cartArticle(cartItem);

        cartTotalQuantity();

        cartTotalPrice();
      }
    }
  });
}

// Fonction insertion de l'id et de la couleur des produits

function treatmentCartItem(item) {
  const cartItem = document.createElement("article");
  cartItem.classList.add("cart__item");
  cartItem.dataset.id = item[i].id;
  cartItem.dataset.color = item[i].color;
  return cartItem;
}

// Fonction récupération de l'id cart__items pour insertion

function cartArticle(cartItem) {
  document.querySelector("#cart__items").appendChild(cartItem);
}

// Fonction insertion des images et des alttxt

function treatmentCartImg(item, kanap) {
  for (let i = 0; i < kanap.length; i++) {
    const cartDivImg = document.createElement("div");
    cartDivImg.className = "cart__item__img";

    const cartImg = document.createElement("img");
    cartDivImg.appendChild(cartImg);
    cartImg.src = kanap[i].imageUrl;

    cartImg.alt = kanap[i].altTxt;
    cartDivImg.appendChild(cartImg);

    return cartDivImg;
  }
}

// Fonction création div

function treatmentCartContent(item, kanap) {
  const cartItemContent = document.createElement("div");
  cartItemContent.className = "cart__item__content";

  const cartItemContentDescription = treatmentCartContentDescription(
    item,
    kanap
  );

  const cartItemContentSettings = treatmentCartContentSettings(item);

  cartItemContent.appendChild(cartItemContentDescription);
  cartItemContent.appendChild(cartItemContentSettings);

  return cartItemContent;
}

// Fonction insertion des descriptions des produits

function treatmentCartContentDescription(item, kanap) {
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
  cartColor.appendChild(cartPrice);
  for (let i = 0; i < kanap.length; i++) {
    cartPrice.innerHTML = kanap[i].price + " € ";
    cartPrice.classList.add("value");
    cartPrice.value = kanap[i].price;
    return cartItemContentDescription;
  }
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

  input.addEventListener("change", (e) => changeQuantity(e, input, item));

  cartContentSettingsQuantity.appendChild(input);
}

// Fonction évènement choix quantité enregistré dans le localstorage

function changeQuantity(e, input, item) {
  e.preventDefault();

  const quantity = Number(input.value);
  const idQuantity = input.dataset.id;
  const colorQuantity = input.dataset.color;
  const resultFind = item.find(
    (remove) => remove.id === idQuantity && remove.color === colorQuantity
  );
  resultFind.quantity = quantity;
  localStorage.setItem("cart", JSON.stringify(item));

  cartTotalQuantity();
  cartTotalPrice();
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

  const id = cartContentSettingsDelete.dataset.id;
  const color = cartContentSettingsDelete.dataset.color;

  let totalAddProductRemove = item.length;
  if (totalAddProductRemove == 1) {
    localStorage.removeItem("cart");
  } else {
    removeLocalStorage = item.findIndex(
      (product) => product.id === id && product.color === color
    );
    item.splice(removeLocalStorage, 1);
    localStorage.setItem("cart", JSON.stringify(item));
  }
  const articleToDelete = document.querySelector(
    `article[data-id="${id}"][data-color="${color}"]`
  );
  articleToDelete.remove();

  cartTotalQuantity();
  cartTotalPrice();
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

function cartTotalPrice() {
  const price = document.getElementsByClassName("value");

  total = 0;
  const totalQuantity = document.getElementsByClassName("itemQuantity");

  let totalCartQuantity = totalQuantity.length;

  for (let i = 0; i < totalCartQuantity; ++i) {
    total += totalQuantity[i].valueAsNumber * price[i].value;
  }
  const totalProductCartQuantity = document.querySelector("#totalPrice");
  totalProductCartQuantity.innerHTML = total;
}

// Fonction validation prénom avec regex

function firstNameInvalid() {
  const firstName = document.querySelector("#firstName");
  const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
  const firstNameRegex = new RegExp("([A-Z][a-z]*)([\\s\\'-][A-Z][a-z]*)*");
  if (firstNameRegex.test(firstName.value)) {
    firstNameErrorMsg.innerHTML = "";
    return false;
  } else {
    firstNameErrorMsg.innerHTML =
      "Le prénom n'est pas valide,<br/>Veuillez renseigner ce champs";
    return true;
  }
}

// Fonction validation nom avec regex

function lastNameInvalid() {
  const lastName = document.querySelector("#lastName");
  const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
  const lastNameRegex = new RegExp("([A-Z][a-z]*)([\\s\\'-][A-Z][a-z]*)*");
  if (lastNameRegex.test(lastName.value)) {
    lastNameErrorMsg.innerHTML = "";
    return false;
  } else {
    lastNameErrorMsg.innerHTML =
      "Le nom n'est pas valide,<br/>Veuillez renseigner ce champs";
    return true;
  }
}

// Fonction validation adresse avec regex

function addressInvalid() {
  const address = document.querySelector("#address");
  const addressErrorMsg = document.querySelector("#addressErrorMsg");
  const addressRegex = new RegExp(
    "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
  );
  if (addressRegex.test(address.value)) {
    addressErrorMsg.innerHTML = "";
    return false;
  } else {
    addressErrorMsg.innerHTML =
      "L'adresse n'est pas valide,<br/>Veuillez renseigner ce champs";
    return true;
  }
}

// Fonction validation ville avec regex

function cityInvalid() {
  const city = document.querySelector("#city");
  const cityErrorMsg = document.querySelector("#cityErrorMsg");
  const cityRegex = new RegExp("^[a-zA-Zs]+$");
  if (cityRegex.test(city.value)) {
    cityErrorMsg.innerHTML = "";
    return false;
  } else {
    cityErrorMsg.innerHTML =
      "La ville n'est pas valide,<br/>Veuillez renseigner ce champs";
    return true;
  }
}

// Fonction validation email avec regex

function emailInvalid() {
  const email = document.querySelector("#email");
  const emailErrorMsg = document.querySelector("#emailErrorMsg");
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );
  if (emailRegex.test(email.value)) {
    emailErrorMsg.innerHTML = "";
    return false;
  } else {
    emailErrorMsg.innerHTML =
      "L'email n'est pas valide,<br/>Veuillez renseigner ce champs";
    return true;
  }
}

// Fonction rembourrage gauche des éléments du formulaire

function paddingForm() {
  const formInput = document.querySelector(".cart__order__form");
  const inputs = formInput.querySelectorAll("input");
  inputs.forEach((input) => {
    input.style.paddingLeft = "10px";
  });
}
paddingForm();

// Fonction alerte message si quantité non défini entre un et cent article(s)

function cartConfirmation(itemCart) {
  for (let i = 0; i < itemCart.length; i++) {
    if (
      itemCart[i].quantity == null ||
      itemCart[i].quantity == 0 ||
      itemCart[i].quantity > 100
    ) {
      alert("Veuillez sélectionner la quantité entre un et cent article(s)");
      return true;
    }
  }
}

// Ecoute de l'évènement au click bouton commander

const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => formValidation(e));

/* Fonction évènement requête POST envoi demande de formulaire,
   id produits et lien vers page confirmation avec l'orderId */

async function formValidation(e) {
  e.preventDefault();

  const itemCart = JSON.parse(localStorage.getItem("cart"));

  if (cartConfirmation(itemCart)) return;
  if (firstNameInvalid()) return;
  if (lastNameInvalid()) return;
  if (addressInvalid()) return;
  if (cityInvalid()) return;
  if (emailInvalid()) return;

  const array = requestArray();

  let resultPost = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(array),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId;
      window.location.href = "./confirmation.html" + "?orderId=" + orderId;
    })
    .catch((err) => console.error(err));
}

// Fonction array demande de formulaire + id produits

function requestArray() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;

  const array = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdLocalStorage(),
  };
  return array;
}

// Fonction récupération du localstorage des id produits

function getIdLocalStorage() {
  const idLocalStorage = JSON.parse(localStorage.getItem("cart"));
  cart.push(idLocalStorage);
  let idProducts = [];
  for (let i = 0; i < idLocalStorage.length; i++) {
    idProducts.push(idLocalStorage[i].id);
  }
  return idProducts;
}
