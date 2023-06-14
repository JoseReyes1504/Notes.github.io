const textarea = document.getElementById("Contenido");
const Negrita = document.getElementById("Bold");

function formatoFuente(sCmd, sValue) {
  document.execCommand(sCmd, false, sValue);
}

function processFiles(files) {
  var file = files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
      var output = document.getElementById("Contenido");
      output.innerHTML = e.target.result;
  };
  reader.readAsText(file);

}
var dropBox;
window.onload = function () {
  dropBox = document.getElementById("Contenido");
  dropBox.ondragenter = ignoreDrag;
  dropBox.ondragover = ignoreDrag;
  dropBox.ondrop = drop;
}

function ignoreDrag(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  var data = e.dataTransfer;
  var files = data.files;
  processFiles(files);
}

