const btnPDF = document.getElementById('btnCrearPDF');

btnPDF.addEventListener("click", function () {
  var doc = new jsPDF();

  // Añadir título al documento
  doc.text("Mi documento PDF", 10, 10);

  // Extraer texto del elemento HTML con ID "texto-pdf"
  var texto = document.getElementById("TextoCard").innerText;

  // Añadir el texto al documento
  doc.text(texto, 10, 20);

  // Descargar el documento
  doc.save("mi-documento.pdf");

});