const fileUpload = document.getElementById("file");
const fileName = document.querySelector(".file-name");
// const URL = "https://smile-service.onrender.com/submit-complaint"
const URL = "http://localhost:8082/submit-complaint";
// const URL = "https://lazy-gabardine-lion.cyclic.app/submit-complaint";
const form = document.getElementById("complaint-form");
const confirmation = document.getElementById("confirmation");
const clientname = document.getElementById("clientname");
const username = document.getElementById("name");
const email = document.getElementById("email");
const problem = document.getElementById("problem");
const issue = document.getElementById("issue");
const issueName = document.getElementById('issueName');
const dropdown = document.getElementById("issueDropdown");

function updateIssueType() {
  const selectedCategory = localStorage.getItem('selectedCard');
  console.log('Localstorage:',selectedCategory)
  if (selectedCategory) {
    dropdown.disabled = false; 
    dropdown.value = selectedCategory;
    dropdown.disabled = true;
      localStorage.removeItem('selectedCard'); // Remove it from localStorage once used
  } 
}

//To take the issue from previous screen during page load.
updateIssueType();

//Alert function 
const successAlert = () => {
  swal({
      title: "Request submitted!",
      text: "Engineer will be assigned shortly.",
      icon: "success",
      buttons: {
        confirm: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn-primary",
          closeModal: true
        }
      },
    })
    .then((value) => {
      // Call myFunction when OK button is pressed
      if (value) {
        // myFunction();
        // Redirect to homepage
        window.location.href = "/frontend/"; // Change "/" to your homepage URL
      }
    });
}


//No longer using sendData function
const sendData = async (data) => {
  const urlEncoded = new URLSearchParams(data).toString();
  console.log(urlEncoded);
  try {
    const res = await fetch(URL+'/1', {
      method: "POST",
      body: urlEncoded,
      headers: { "Content-type": "application/x-www-form-urlencoded" },
    });
    
    if (res.ok) {
      // showToast("Your complaint is registered successfully") --old toast option 
      // new option to show submit confirmation using SweetAlert
      swal("Request submitted!", "Engineer will be assigned shortly.", "success")
    } else {
      console.log(res);
      // alert("Submission failed");
      swal("Error", "Try Again", "error")
    }
  } catch (error) {
    console.log(error);
    // alert("Error while submitting request", error);
    swal("Error", "Request not submitted \n Contact Smile Computers", "error")
  }
}


async function newSendData(data){
  try {
   
  const res = await fetch(URL+'/1', {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)

  });
  if (res.ok) {
    // showToast("Your complaint is registered successfully") --old toast option 
    // new option to show submit confirmation using SweetAlert
    swal("Request submitted!", "Engineer will be assigned shortly.", "success")
    // successAlert();
  } else {
    // alert("Submission failed");
    swal("Error", "Try Again", "error")
  } 
  } catch (error) {
    console.log(error);
    // alert("Error while submitting request", error);
    swal("Error", "Request not submitted \n Contact Smile Computers", "error")
  }
   
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const jsonObj = {}; 
  formData.forEach((value,key) => {
    jsonObj[key] = value;
  })

  // Add the selected value of the dropdown to the JSON object
  jsonObj['issueDropdown'] = dropdown.value;
  console.log('JSONobj = ',jsonObj);
  newSendData(jsonObj);
  form.reset();
});

// const resetBtn = document.querySelector(".reset-btn");
// resetBtn.addEventListener("click", () => {
//   fileName.textContent = "No file selected";
// });


// Function for showing confirmation 
function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  
  // Create a new toast element
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.innerHTML = `
    <div class="toast-header customToastBody">
      <strong class="me-auto">Confirmation</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body ">
      ${message}
    </div>
  `;
  
  // Append the toast to the container
  toastContainer.appendChild(toast);
  
    // Initialize the toast with autohide and show it
    const bootstrapToast = new bootstrap.Toast(toast, {
      animation: true, // Enable animation
      autohide: false  // Autohide after 3 seconds (adjust the time as needed)
    });
  
    bootstrapToast.show();

  // Initialize the toast and show it
  new bootstrap.Toast(toast).show();
  
  // Remove the toast after it hides
  toast.addEventListener('hidden.bs.toast', function () {
    toast.remove();
  });
}
