//Notes: add card number in db, work on updating the status from pending to completed.

//'cardData' stores all the data coming from fetchData function

// const { setTimeout } = require("timers/promises");
let apiData = [];
let complaintsData, clientData;
async function pageStart() {
  await fetchData();
  complaintsData = apiData[0];
  clientData = apiData[1];
  // console.log('Client Data: ',clientData);
  // console.log("Api Data:",apiData);
  await renderCards(complaintsData);
  // count();
}

// Function to fetch data from the API
// const URL = "https://lazy-gabardine-lion.cyclic.app/";
const URL = "https://smile-service.onrender.com/";
// let URL = "https://smile-service.onrender.com/";
//  let cardData;
async function fetchData() {
  try {
    const response = await fetch(URL + "complaints/complaint");
    const data = await response.json();

    const response1 = await fetch(URL + "complaints/client");
    const clientList = await response1.json();
    // console.log('Complaints:',data);
    // console.log('Client list:', clientList);
    apiData.push(data, clientList);
  } catch (error) {
    console.error("Error fetching data:", error);
    //can provide additional alert that no data is received if cardData = 0
    return 0;
  }
}

async function statusUpdate(data) {
  try {
    // const payload =
    const response = await fetch(URL + `status-update/`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    alert(res.message);
    location.reload();
  } catch (error) {
    // console.log("Error updating data: ",error);
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
  console.log(data);
  const cardList = document.getElementById("cardList");
  cardList.innerHTML = "";
  if (data == 0) {
    console.log("No Data found");
  }
  data.forEach((card) => {
    // added to match backend card status, in backend pending = 0 and completed = 1
    let status, buttonRender;
    if (card.status == 0) {
      // console.log(0);
      status = "status-pending";
      buttonRender = "";
    } else {
      // console.log(1);
      status = "status-completed";
      buttonRender = "disabled";
    }
    let engName;
    if (card.issueType == 1) {
      engName = "Engineer 1";
    } else if (card.issueType == 2) {
      engName = "Engineer 2";
    } else if (card.issueType == 3) {
      engName = "Engineer 3";
    } else {
      engName = "New Requirement";
    }
    const cardHtml = `
              <div class="col-md-3 col-sm-6 mb-3">
              <div class="card border-primary mb-3">
              <div class="card-header companyName ${status}"><div>${card.company}</div><div>ID: ${card.RecordID}</div></div>
              <div class="card-body text-primary">
                <h5 class="card-title">Problem: ${card.problem}</h5>
                <p class="card-text mb-1">Remarks: ${card.remarks}</p>
                <div class="mb-2">
                  <small>User: ${card.ussr}</small> <br>
                  <small>On task: ${engName}</small>
                  </div>
      
                <div class="forFlex button text-end">
                  <span
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-clock"
                      viewBox="0 0 16 16">
                      <path
                        d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"
                      />
                      <path
                        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"
                      /></svg
                    ><small class="dates"> ${card.date}</small></span>
      
                  <span>
                    <button type="button" onclick="submitRemarks()" class="btn btn-primary btn-sm" id="markButton" data-bs-toggle="modal"
                    data-bs-target="#myModal-${card.RecordID}" ${buttonRender}>
                      Issue Resolved
                    </button></span
                  >
                </div>
              </div>
            </div>
      
              </div>
            
              <div class="modal fade" id="myModal-${card.RecordID}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">Problem Solved?</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div class="mb-3">
                        <label for="remarks" class="form-label">Please enter remarks: </label>
                        <textarea class="form-control" id="remarks-${card.RecordID}" rows="4"></textarea>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" class="btn btn-primary" onclick="submitRemarks(${card.RecordID}, '${card.company}', '${card.email}', '${card.ussr}')">Submit</button>
                    </div>
                  </div>
                </div>
              </div>`;
    cardList.innerHTML += cardHtml;
  });
  // sendNotification(`New complaint generated, Please check App`);
}

// Function to filter cards based on status
async function filterCards(status) {
  const filteredData = complaintsData.filter(
    (card) => card.status === status || status === "All"
  );
  await renderCards(filteredData);
}

// Function to send a browser notification
function sendNotification(message) {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support system notifications");
    return;
  }

  // Check if the user has granted permission to show notifications
  if (Notification.permission === "granted") {
    // If permission is granted, create and show the notification
    new Notification("New Card Generated", { body: message });
  } else if (Notification.permission !== "denied") {
    // If permission is not denied, request permission from the user
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("New Card Generated", { body: message });
      }
    });
  }
}

// Function to handle remarks modal
async function submitRemarks(ID, company, email, user) {
  const modal = document.getElementById("myModal-" + ID);
  const myModal = new bootstrap.Modal(modal);
  // Retrieve the text from the textarea
  const remarks = document.getElementById("remarks-" + ID).value;
  const data = {
    remarks: remarks,
    ID: ID,
    company: company,
    email: email,
    user: user,
  };
  console.log(data);
  await statusUpdate(data);

  // You can now use 'remarks' to perform any action, e.g., send it to your server
  myModal.hide();
  // Close the modal
}

// Function to update card status (for demonstration purposes)
async function updateStatus(cardNumber) {
  const card = apiData.find((card) => card.RecordID === RecordID);
  if (card) {
    card.status = "Completed";
    await renderCards(apiData);
  }
}

async function renderClientList(data) {
  const clientList = document.getElementById("clientTableBody");
  clientList.innerHTML = "";
  data.forEach((list) => {
    const clientHTML = `
    <tr>
    <td>${list.ClientID}</td>
    <td>${list.company}</td>
    <td>${list.clientName}</td>
    <td>${list.email}</td>
    <td>${list.contact}</td>
    <td>${list.address}</td>
    </tr>`;
    clientList.innerHTML += clientHTML;
  });
}

// Event listeners
document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const filteredData = complaintsData.filter(
    (card) =>
      card.company.toLowerCase().includes(searchTerm) ||
      card.ussr.toLowerCase().includes(searchTerm) ||
      card.date.includes(searchTerm)
  );
  renderCards(filteredData);
});

document
  .getElementById("filterAll")
  .addEventListener("click", () => filterCards("All"));
document
  .getElementById("filterPending")
  .addEventListener("click", () => filterCards(0));
document
  .getElementById("filterCompleted")
  .addEventListener("click", () => filterCards(1));

// Initial card rendering
pageStart();
