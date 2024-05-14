const fileUpload = document.getElementById("file");
const fileName = document.querySelector(".file-name");
// const URL = "https://smile-service.onrender.com/submit-complaint"
const URL = "https://smile-service.onrender.com/submit-complaint";
// const URL = "https://lazy-gabardine-lion.cyclic.app/submit-complaint";
const form = document.getElementById("registration-form");
const confirmation = document.getElementById("confirmation");
const clientname = document.getElementById("clientname");
const username = document.getElementById("name");
const email = document.getElementById("email");
const problem = document.getElementById("problem");
const issue = document.getElementById("issue");
const issueName = document.getElementById('issueName');
const dropdown = document.getElementById("issueDropdown");

async function newSendData(data){
  try {
   
  const res = await fetch(URL+'/2', {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)

  });
  if (res.ok) {
    // showToast("Your complaint is registered successfully") --old toast option 
    // new option to show submit confirmation using SweetAlert
    swal("Registration Complete", "Welcome to Smile Computers!", "success")
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
