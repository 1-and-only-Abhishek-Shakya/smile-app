//Notes: add card number in db, work on updating the status from pending to completed.
// SMile red : #F35156
//'cardData' stores all the data coming from fetchData function

// const { setTimeout } = require("timers/promises");
let apiData; 
async function pageStart() {
    apiData = await fetchData();
    console.log("Api Data:",apiData);
    await renderCards(apiData);
    count();    
}

// Function to fetch data from the API

let URL = "http://localhost:8082/";
//  let cardData;
async function fetchData() {
  try {
    const response = await fetch(URL+"complaints");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    //can provide additional alert that no data is received if cardData = 0
    return 0;
  }
}

async function statusUpdate(ID) {
  try {
    const response = await fetch(URL+`status-update/${ID}`, {
      method: "PATCH", 
    })
    const data = await response.json(); 
    alert(data.message);
  } catch (error) {
    console.log("Error updating data: ",error);
  }
}

//function for counting number of records
// function count() {
//   const records = document.getElementById("count");  
//   // const cardCounts = data.length(); 
//   records.innerHTML += `<div>Total Records:</div>`;
  
// }

// PATCH function for updating card status to completed 
// Function to render cards based on the provided data
async function renderCards(data) {
  const cardList = document.getElementById("cardList");
  cardList.innerHTML = "";
    if(data == 0){
        console.log("No Data found");
    } 
  data.forEach((card) => {
    // added to match backend card status
    let status;
    if (card.status == 0) {
      console.log(0);
      status = "status-pending";
    } else {
      console.log(1);
      status = "status-completed";
    }
    const cardHtml = `
              <div class="col-md-3 col-sm-6 mb-3">
              <div class="card border-primary mb-3">
              <div class="card-header companyName ${status}">${card.company}</div>
              <div class="card-body text-primary">
                <h5 class="card-title">${card.problem}</h5>
                <p class="card-text mb-1">
                ${card.remarks}  
                </p>
      
                <div class="mb-2">
                  <small>Registered by ${card.ussr}</small>
                </div>
      
                <div class="forFlex button text-end">
                  <span
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-clock"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"
                      />
                      <path
                        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"
                      /></svg
                    ><small class="dates"> ${card.date}</small></span
                  >
      
                  <span>
                    <button type="button" onclick="statusUpdate(${card.RecordID})" class="btn btn-primary btn-sm" id="markButton">
                      Issue Resolved
                    </button></span
                  >
                </div>
              </div>
            </div>
      
              </div>
          `;
    cardList.innerHTML += cardHtml;
  });
}

// Function to filter cards based on status
async function filterCards(status) {
  const filteredData = apiData.filter(
    (card) => card.status === status || status === "All"
  );
  await renderCards(filteredData);
}

// Function to update card status (for demonstration purposes)
async function updateStatus(cardNumber) {
  const card = apiData.find((card) => card.RecordID === RecordID);
  if (card) {
    card.status = "Completed";
    await renderCards(apiData);
  }
}

// Event listeners
document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const filteredData = apiData.filter(
    (card) =>
      card.company.toLowerCase().includes(searchTerm) ||
      card.ussr.toLowerCase().includes(searchTerm) ||
      card.date.includes(searchTerm)
  );
  renderCards(filteredData);
});

document
  .getElementById("filterAll")
  .addEventListener("click", () => filterCards(0 && 1));
document
  .getElementById("filterPending")
  .addEventListener("click", () => filterCards(0));
document
  .getElementById("filterCompleted")
  .addEventListener("click", () => filterCards(1));


// Initial card rendering
pageStart();
console.log(apiData);

