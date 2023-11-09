const fileUpload = document.getElementById("file");
const fileName = document.querySelector(".file-name");
// const URL = "http://localhost:8082/submit-complaint";
const URL = "http://localhost:8082/submit-complaint"

// fileUpload.addEventListener("change", (e) => {
//   const files = e.target.files;
//   if (files.length > 0) {
//     fileName.textContent = files[0].name;
//   } else {
//     fileName.textContent = "No file selected";
//   }
// });

const form = document.getElementById("complaint-form");
const confirmation = document.getElementById("confirmation");
const clientname = document.getElementById("clientname");
const username = document.getElementById("name");
const email = document.getElementById("email");
const problem = document.getElementById("problem");
const issue = document.getElementById("issue");

const sendData = async (data) => {
  const urlEncoded = new URLSearchParams(data).toString();
  try {
    const res = await fetch(URL, {
      method: "POST",
      body: urlEncoded,
      headers: { "Content-type": "application/x-www-form-urlencoded" },
    });
    if (res.ok) {
      showToast("Your complaint is registered successfully")
    } else {
      alert("Submission failed");
    }
  } catch (error) {
    console.log(error);
    alert("Error while submitting request", error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  sendData(formData); 
  // You can handle the form submission here, e.g., send data to the server.
  // For this example, we'll just display a confirmation message.

  form.reset();
});

const resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener("click", () => {
  fileName.textContent = "No file selected";
});


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
