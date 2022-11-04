const orderId = getOrderId();
confirmationGetOrderId(orderId);
removeLocalStorage();

// Fonction récupération de l'orderId

function getOrderId() {
  const url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const orderId = urlParams.get("orderId");
  return orderId;
}

// Fonction insertion de l'orderID

function confirmationGetOrderId(orderId) {
  const commandOrderId = document.getElementById("orderId");
  commandOrderId.textContent = orderId;
}

// Fonction localstorage vider

function removeLocalStorage() {
  const remove = window.localStorage;
  remove.clear();
}
