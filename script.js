const fileInput = document.querySelector("#fileInput");
const dropArea = document.querySelector("#dropArea");
const previewCard = document.querySelector("#previewCard");
const previewImage = document.querySelector("#previewImage");
const fileName = document.querySelector("#fileName");
const fileSize = document.querySelector("#fileSize");
const error = document.querySelector("#error");
const progress = document.querySelector("#progress");
const progressText = document.querySelector("#progressText");
const successMessage = document.querySelector("#successMessage");
const removeBtn = document.querySelector("#removeBtn");

const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    handleFile(file);
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, function (event) {
    event.preventDefault();
    dropArea.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, function (event) {
    event.preventDefault();
    dropArea.classList.remove("dragover");
  });
});

dropArea.addEventListener("drop", function (event) {
  const file = event.dataTransfer.files[0];

  if (file) {
    handleFile(file);
  }
});

function handleFile(file) {
  error.textContent = "";

  if (!allowedTypes.includes(file.type)) {
    showError("Invalid file! Please upload JPG, PNG or GIF.");
    resetInput();
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    previewImage.src = event.target.result;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    previewCard.classList.add("show");
    successMessage.classList.remove("show");

    simulateUpload(event.target.result, file.name);
  };

  reader.readAsDataURL(file);
}

function simulateUpload(imageData, name) {
  let percent = 0;

  progress.style.width = "0%";
  progressText.textContent = "0%";

  const timer = setInterval(function () {
    percent += 10;

    progress.style.width = percent + "%";
    progressText.textContent = percent + "%";

    if (percent >= 100) {
      clearInterval(timer);

      successMessage.classList.add("show");
      saveImage(imageData, name);
      displaySavedImages();
    }
  }, 150);
}

function saveImage(imageData, name) {
  let images = JSON.parse(localStorage.getItem("uploadedImages")) || [];

  images.push({
    name: name,
    image: imageData,
  });

  if (images.length > 5) {
    images = images.slice(-5);
  }

  localStorage.setItem("uploadedImages", JSON.stringify(images));
}

removeBtn.addEventListener("click", function () {
  previewImage.src = "";
  previewCard.classList.remove("show");
  successMessage.classList.remove("show");
  progress.style.width = "0%";
  progressText.textContent = "0%";
  resetInput();
});

function showError(message) {
  error.textContent = message;

  setTimeout(function () {
    error.textContent = "";
  }, 3000);
}

function resetInput() {
  fileInput.value = "";
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + units[i];
}
displaySavedImages();
