const popup = document.getElementById("subscribe-dialog");
const openButton = document.getElementById("open-subscribe");
const closeButton = document.getElementById("close-subscribe");
const subscribeForm = document.getElementById("subscribe-form");
const subscribeMessage = document.getElementById("subscribe-message");

openButton.addEventListener("click", function () {
  subscribeMessage.textContent = "";
  popup.showModal();
  document.body.classList.add("pc-popup-open");
});

closeButton.addEventListener("click", function () {
  popup.close();
});

popup.addEventListener("click", function (event) {
  const bounds = popup.getBoundingClientRect();

  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (event.target === popup && clickedOutside) {
    popup.close();
  }
});

popup.addEventListener("close", function () {
  document.body.classList.remove("pc-popup-open");
  openButton.focus();
});

subscribeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  subscribeMessage.textContent =
    "Thank you! This is a demo form; no subscription was sent.";

  subscribeForm.reset();
});