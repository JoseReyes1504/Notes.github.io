const btnPDF = document.getElementById('btnCrearPDF');
const btnWord = document.getElementById('btnCrearDoc');


btnPDF.addEventListener("click", function () {
  PDF();
});

btnWord.addEventListener("click", function () {
  crearDocumento();
});


function PDF() {
  var doc = new jsPDF();
  var Contenido = document.getElementById("TextoCard").innerHTML;

  doc.setFont("TimesNewRoman", "bold");
  doc.setFontSize(16);

  // Añadir título al documento
  doc.text(document.getElementById('TituloCard').innerText, 10, 10);

  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(11);

  doc.fromHTML(Contenido, 10, 10, {
    width: 180
  });

  // Descargar el documento
  doc.save(document.getElementById('TituloCard').innerText);
}

function crearDocumento() {
  // Obtener el contenido del elemento editable
  var titulo = document.getElementById('TituloCard').innerText;
  var Contenido = document.getElementById("TextoCard").innerText;
  Contenido += titulo + Contenido;
  // Crear un objeto Blob con el contenido en formato HTML
  var blob = new Blob([Contenido], { type: 'application/msword' });

  // Descargar el archivo usando FileSaver.js
  saveAs(blob, document.getElementById('TituloCard').innerText);
}
