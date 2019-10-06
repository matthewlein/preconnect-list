function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files;
  var reader = new FileReader();
  const file = files[0];

  reader.onload = function(e) {
    const results = JSON.parse(e.target.result);
    const entries = results.log.entries;
    const urls = entries.map(entry =>
      entry.request.url
        .split("/")
        .slice(0, 3)
        .join("/")
    );
    const uniqUrls = _.uniq(urls);
    output.innerHTML = uniqUrls.sort().join("\n");
    dropZone.innerHTML = file.name;
    dropZone.classList.add("drop-zone--success");
    connectionSection.classList.add("connections--visible");
  };

  // Read in the image file as a data URL.
  reader.readAsText(file);
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
}

function onClear(e) {
  output.innerHTML = "";
  dropZone.classList.remove("drop-zone--success");
  connectionSection.classList.remove("connections--visible");
  dropZone.innerHTML = dropZoneStartingHtml;
}

// Setup the dnd listeners.
const output = document.getElementById("output");
const dropZone = document.getElementById("dropZone");
const clear = document.getElementById("clear");
const connectionSection = document.getElementById("connections");
const dropZoneStartingHtml = dropZone.innerHTML;

dropZone.addEventListener("dragover", handleDragOver, false);
dropZone.addEventListener("drop", handleFileSelect, false);
clear.addEventListener("click", onClear, false);
