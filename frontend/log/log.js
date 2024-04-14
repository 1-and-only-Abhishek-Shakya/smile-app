// const { load } = require("mime");

// const root = document.getElementById("root");
// const URL = "https://smile-service.onrender.com/";
const URL = "http://localhost:8082/";
// const URL = "https://lazy-gabardine-lion.cyclic.app/";

// document.addEventListener('DOMContentLoaded', async function () {
//     addRowToTable()
//   });

let tableData;
async function pageStart() {
  tableData = await fetchDataForTable();
  if (tableData == 0) {
    console.log("No Data available");
  }
  await loadTable(tableData);
  // await filterByDate();
}

// Function to add a new row to the table
async function fetchDataForTable() {
  try {
    const data = await fetch(URL + "getScheduleData/");
    const result = await data.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log("Error fetching data", error);
    return 0;
  }
}

function loadTable(data) {
  const entriesTableBody = document.getElementById("entriesTableBody");
  entriesTableBody.innerHTML = "";
  data.forEach((row, index) => {
    let engineer = "";
    if (row.engr == 1) {
      engineer = "Rajendra";
    } else if (row.engr == 2) {
      engineer = "Deepak";
    } else {
      engineer = "Anil";
    }
    // const newRow = document.createElement('tr');
    const rowHTML = `
      <tr>
      <td>${index + 1}</td>
      <td>${row.date}</td>
      <td>${row.company}</td>
      <td>${engineer}</td>
      <td colspan="2">${row.rmrk}</td>
      </tr>
    `;
    entriesTableBody.innerHTML += rowHTML;
  });
}

function makeEntries(event) {
  // const entryForm = document.getElementById('entryForm');
  // const entriesTableBody = document.getElementById('entriesTableBody');

  // entryForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Get form data
  const companyName = document.getElementById("companyName").value;
  const entryType = document.getElementById("entryType").value;
  const remarks = document.getElementById("remarks").value;

  // Create an object with form data
  const formData = {
    companyName,
    entryType,
    remarks,
  };

  // Send data to the backend
  fetch(`${URL}submit-entry/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert(data.message);
      location.reload();
      // Add a new row to the table with the submitted data
      //   addRowToTable(formData);

      // Close the modal after successful submission
      const entryModal = new bootstrap.Modal(
        document.getElementById("entryModal")
      );
      entryModal.hide();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  // });
}

let dateWiseData; 
async function filterByDate(date = selectedDate || getCurrentDate()){
  dateWiseData = tableData.filter((data) => data.date === date); 
  // await loadTable(dateWiseData);
}

async function tableFilter(engr) {
  const filteredData = dateWiseData.filter(
    (data) => data.engr === engr
  );
  await loadTable(filteredData);
}

//  console.log(date);

// Function to get the current date in 'YYYY-MM-DD' format
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


let selectedDate; 
document.getElementById("dateSelect").addEventListener("change", (e)=> {
  selectedDate = e.target.value;
  filterByDate(selectedDate);
  // console.log(selectedDate);
});

document
.getElementById("Rajendra")
.addEventListener("click", () => tableFilter(1));
document
.getElementById("Deepak")
.addEventListener("click", () => tableFilter(2));
document
.getElementById("Anil")
.addEventListener("click", () => tableFilter(3));
document
.getElementById("Accounts")
.addEventListener("click", () => tableFilter(4));

//Loading the page
pageStart();
