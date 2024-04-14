// document.addEventListener("DOMContentLoaded", function() {
//     const cards = document.querySelectorAll(".row");
//     cards.forEach((card,index) => {
//         card.addEventListener('click', function(){
//             const category = this.querySelector(".category").textContent;
//             localStorage.setItem(category, index);
//             // window.location.href = './form/'
//         })
//     })
// })

function sendCardData(cardId) {
  // const category = document.getElementById(cardId).textContent;
  localStorage.setItem("selectedCard", cardId);
}


  // Get the button element
  const openModalButton = document.getElementById("openModalButton");
  // Get the modal element
  const myModal = document.getElementById("myModal");
  // When the button is clicked, show the modal
  openModalButton.addEventListener("click", function () {
    const modal = new bootstrap.Modal(myModal);
    modal.show();
  });
