const btnPDF = document.getElementById('btnCrearPDF');

btnPDF.addEventListener("click", function () {    
  PDF();
});


function PDF(){
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