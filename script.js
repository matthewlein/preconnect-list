function onDrop(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files;
  const file = files[0];

  readFile(file);
}

function readFile(file) {
  var reader = new FileReader();

  reader.onload = function(e) {
    const results = JSON.parse(e.target.result);
    const entries = results.log.entries;
    const urls = entries.map(entry =>
      entry.request.url
        .split("/")
        .slice(0, 3)
        .join("/")
    );
    const uniqUrls = [...new Set(urls)];
    output.innerHTML = uniqUrls.sort().join("\n");
    dropZone.innerHTML = file.name;
    dropZone.classList.add("drop-zone--success");
    connectionSection.classList.add("connections--visible");
  };

  if (
    file.name
      .split(".")
      .pop()
      .toLowerCase() === "har"
  ) {
    reader.readAsText(file);
  } else {
    dropZone.classList.remove("drop-zone--over");
    dropZone.classList.add("drop-zone--error");
    fileInput.value = null;
  }
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  dropZone.classList.add("drop-zone--over");
  evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
}

function handleDragLeave() {
  dropZone.classList.remove("drop-zone--over");
}

function onClear() {
  output.innerHTML = "";
  dropZone.classList.remove("drop-zone--success");
  dropZone.classList.remove("drop-zone--over");
  dropZone.classList.remove("drop-zone--error");
  connectionSection.classList.remove("connections--visible");
  dropZone.innerHTML = dropZoneStartingHtml;
  initDropZoneListeners();
  fileInput.value = null;
}

function onFileButtonClick(e) {
  fileInput.click();
}

function onFileChange(e) {
  const file = e.target.files[0];
  readFile(file);
}

function initDropZoneListeners() {
  chooseFileButton = document.getElementById("choose-file");
  fileInput = document.getElementById("file-input");
  chooseFileButton.addEventListener("click", onFileButtonClick, false);
  fileInput.addEventListener("change", onFileChange, false);
}

const output = document.getElementById("output");
const dropZone = document.getElementById("dropZone");
const clear = document.getElementById("clear");
const connectionSection = document.getElementById("connections");
const dropZoneStartingHtml = dropZone.innerHTML;
let chooseFileButton;
let fileInput;

dropZone.addEventListener("dragleave", handleDragLeave, false);
dropZone.addEventListener("dragover", handleDragOver, false);
dropZone.addEventListener("drop", onDrop, false);
clear.addEventListener("click", onClear, false);
initDropZoneListeners();

// add onChange to file input
// https://github.com/GoogleChromeLabs/squoosh/blob/master/src/components/intro/index.tsx#L62
