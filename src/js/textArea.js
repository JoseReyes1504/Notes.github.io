const textarea = document.getElementById("Contenido");
// const Negrita = document.getElementById("btnNegrita");

// Negrita.addEventListener('click', () => {
//   // alert(NPaginas);
//   // toggleNegrita()
// });

var negritaActiva = false;

function toggleNegrita() { 
  var selectedNode = window.getSelection().focusNode;
  var parentNode = selectedNode.parentNode;

  if (parentNode.tagName === "B") {
    var text = parentNode.innerHTML.trim();
    var newNode = document.createTextNode(text);
    parentNode.parentNode.insertBefore(newNode, parentNode);
    parentNode.parentNode.removeChild(parentNode);
    negritaActiva = false;
  } else {
    var range = window.getSelection().getRangeAt(0);
    var selectedText = range.toString();
    var newNode = document.createElement("b");
    newNode.innerHTML = selectedText;
    range.deleteContents();
    range.insertNode(newNode);
    negritaActiva = true;
  }
}


// var NPaginas = parseInt(document.getElementById("ContadorPG").innerText);
// var multiplicador = 1;
// var CantidadCar = 10;


// textarea.addEventListener('input', function () {
//   if (textarea.textContent.length == (CantidadCar * multiplicador)) {
//     document.getElementById("ContadorPG").innerHTML = NPaginas++;
//     multiplicador++;    
//   }

//   if (textarea.textContent.length == ((CantidadCar * multiplicador) - 1)) {
//     if (NPaginas == '1') {
//       // alert("Hola");
//     } 
//     // else {
//     //   document.getElementById("ContadorPG").innerHTML = NPaginas--;
//     //   multiplicador--;
//     //   alert(multiplicador);
//     // }

//   }
// });

