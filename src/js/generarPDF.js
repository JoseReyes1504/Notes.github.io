const btnPDF = document.getElementById('btnCrearPDF');

btnPDF.addEventListener("click", function () {
  var bloques = [];
  var doc = new jsPDF();

  var Contenido = document.getElementById("TextoCard").innerText;
  ReplaceEnters2(Contenido);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);

  // Añadir título al documento
  doc.text("\n" + document.getElementById('TituloCard').innerText, 10, 10);

  // Extraer texto del elemento HTML con ID "texto-pdf"
  var texto = "\n \n \n \n" + Contenido;


  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  // Añadir el texto al documento
  while (texto.length > 0) {
    bloques.push(texto.substring(0, 3100));
    texto = texto.substring(3100);
  }
  
  // Agregamos cada bloque a una página del documento
  for (var i = 0; i < bloques.length; i++) {
    // Agregamos una nueva página al documento
    if (i > 0) {      
      doc.addPage();
    }    
    // Agregamos el bloque actual al documento
    doc.text(bloques[i], 10, 15);
  }  

  // Descargar el documento
  doc.save(document.getElementById('TituloCard').innerText);

});


function ReplaceEnters2(texto) {
  texto = texto.replace(/\r\n/g, "<br>");
  return texto;
}
