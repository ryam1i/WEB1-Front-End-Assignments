document.querySelectorAll(".pc-faq-question").forEach(function (button) {
  const answerId = button.getAttribute("aria-controls");
  const answer = document.getElementById(answerId);

  button.setAttribute("aria-expanded", "false");
  answer.classList.remove("is-open");
  answer.setAttribute("aria-hidden", "true");

  button.addEventListener("click", function () {
    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    answer.setAttribute("aria-hidden", String(isOpen));
    answer.classList.toggle("is-open", !isOpen);
  });
});