import { ObtenerDato, buscarCards, BorrarCard, AgregarCards, ActualizarTodo, EliminarTema, CerrarSesion, obtenerClase, EliminarClase, AgregarTema, AgregarClase, db, collection, query, where, getDocs, BorrarCards } from "./db.js";
const style = document.documentElement.style;

////////////////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////
const TituloCard = document.getElementById('TituloCard');
const btnInformacion = document.getElementById('VerInfor');
const ContenedorTexto = document.getElementById('TextoCard');
const btnEliminarCard = document.getElementById('btnEliminarCard');
const btnFullCard = document.getElementById('btnFullCard');
const btnFullExit = document.getElementById('btnFullExit');
const btnEditarNota = document.getElementById('btnEditarNota');
const btnModo = document.getElementById("btnModo");

var TextArea = document.getElementById('Contenido');

var btnAgregar = document.getElementById('btnAgregar');
const btnTema = document.getElementById('btnTema');
const btnClase = document.getElementById('btnClase');
const btnCard = document.getElementById('btnCard');
const btnDatos = document.getElementById('btnDatos');
const btnCerrar = document.getElementById('btnCerrarSesion');
const btnEliminar = document.getElementById('btnEliminar');
const MSJ = document.getElementById('MSJ');

const btnBusqueda = document.getElementById("Busqueda");
var txtBusqueda = document.getElementById("txtBusqueda");

var Titulo = '';
var Contenido = '';
var Boton = 0;
var CodigoClaseRef = '';
var CodigoClase = '';
var CodigoTema = '';
var CodigoTemaRef = '';
var btnClaseAct = false;
btnAgregar.style.display = 'none';
var CodigoCard = '';
var EdicionActiva = false;

var Text = '';
var Text2 = '';
var Codigo = '';

var ApuntesActivo = false;
var NotasActivas = false;
var MenuActivo = true;

////////////////////////////////////////////////// FUNCIONES //////////////////////////////////////////////////////

const btnInfo = document.getElementById("btnInfo");
var ToquesInfo = 0;

btnInfo.addEventListener("click", () => {
    ToquesInfo++;
    if (ToquesInfo <= 1) {
        style.setProperty("--displayInfo", "block");
        document.getElementById("Creado").innerHTML = "Creado Por: " + localStorage.getItem("NoteUser");
        document.getElementById("Fecha").innerHTML = "Fecha: " + localStorage.getItem("Fecha");
    } else {
        style.setProperty("--displayInfo", "none");
        ToquesInfo = 0;
    }
});
const tarjeta = document.getElementById("Menu");
const btnCardTema = document.getElementById("btnCardTema");
const colorPicker = document.getElementById("colorPicker");
const tarjetaInfo = document.getElementById("InformacionNote");

btnCardTema.addEventListener("click", () => {
    colorPicker.click();
});

const colorGuardado = localStorage.getItem("colorTarjeta");
if (colorGuardado) {
    tarjeta.style.background = colorGuardado;
    tarjetaInfo.style.background = colorGuardado;
    colorPicker.value = colorGuardado;
}

colorPicker.addEventListener("input", (e) => {
    const color = e.target.value;
    tarjeta.style.background = color;
    tarjetaInfo.style.background = color;
    localStorage.setItem("colorTarjeta", color);

    const textoColor = esColorClaro(color) ? "black" : "white";
    tarjeta.style.color = textoColor;
    tarjetaInfo.style.color = textoColor;
});


function esColorClaro(hexColor) {
    hexColor = hexColor.replace("#", "");

    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminancia > 0.5;
}





function ReplaceSaltos(texto) {
    texto = texto.replace(/\r?\n/g, "<br>");
    return texto;
}

function BotonTema(Temas) {
    Temas.forEach(btn => {
        btn.addEventListener('click', async (event) => {
            const doc = await obtenerClase(event.target.dataset.id);
            CodigoTema = doc.id;
            CodigoTemaRef = event.target.dataset.idref;
            style.setProperty('--TranslateArrow2', '-80px');
            EliminarColorBoton(2);
            btn.classList.add('BotonSeleccionado');
            ResetearIndex();
            style.setProperty('--IndexContenedor', '6');
            btnEliminarStyle('Tema');

            if (ApuntesActivo == true) {
                style.setProperty('--opacidadLista', '100%');
            } else {
                style.setProperty('--opacidadLista', '0%');
            }

            localStorage.setItem('CodigoTema', CodigoTema);
            CargarCards();
        });
    });
}


async function ejecutarAccionCard(btn) {
    const doc = await ObtenerDato(btn.dataset.id);
    const Informacion = doc.data();

    localStorage.setItem("NoteUser", Informacion.Usuario);
    localStorage.setItem("Fecha", Informacion.Fecha);
    
    Transladar();
    EliminarColorBoton(4);
    btn.classList.add('BotonSeleccionado');
    NotasActivas = true;
    CodigoCard = btn.dataset.id;
    MenuActivo = false;

    if (btn.dataset.id == 0) {
        CerrarCard();
    } else {
        TituloCard.innerHTML = Informacion.Titulo;
        // Cortar String
        Text = Informacion.Contenido;
        Text = ReplaceEnters(Text);
        Text2 = Informacion.Contenido;
        Codigo = btn.dataset.id;
        ContenedorTexto.innerHTML = Text2;
        style.setProperty('--Widthborder', '2px');
        style.setProperty('--heigth', '520px');
        style.setProperty('--CardTop', '400px');
        style.setProperty('--ListaBootom', '200px');
    }
}

// Asigna el evento de clic a los botones
function BotonCard(Cards) {
    Cards.forEach(btn => {
        const btna = btn.querySelector("a");
        btn.addEventListener('click', () => ejecutarAccionCard(btna));
    });
}

async function Busqueda() {
    try {
        const cards = await buscarCards(txtBusqueda.value.toUpperCase());
        var Numero = 10;
        var lista = "";
        cards.forEach((card) => {
            Numero--;
            lista += `
            <li class="Lista" style="--i:${Numero};"><a data-id=${card.objectID} href="#">${card.Titulo}</a></li>
            `
        });
        ContenedorBtn.innerHTML = lista;
        var Listas = ContenedorBtn.querySelectorAll('.Lista');
        BotonCard(Listas);
        if (ApuntesActivo == true) {
            style.setProperty('--opacidadLista', '100%');
        } else {
            style.setProperty('--opacidadLista', '0%');
        }
    } catch (err) {
        console.log("Error al buscar cards:", err);
    }
}

txtBusqueda.addEventListener("input", function () {
    Busqueda();
});

btnCerrar.addEventListener("click", async () => {
    try {
        await CerrarSesion();
        location.href = '../../index.html';
        localStorage.clear();
    } catch (err) {
        console.log(err);
    }
});

function limpiar() {
    document.getElementById('Contenido').innerHTML = '';
    document.getElementById('Titulo').value = '';
}

function LimpiarCodigos() {
    CodigoClase = '';
    CodigoTema = '';
    CodigoClaseRef = '';
    btnClaseAct = false;
    EliminarColorBoton(1);
    EliminarColorBoton(0);
}

function AlertMSJ(Descripcion) {
    MSJ.innerHTML = Descripcion;
    style.setProperty('--TranslateMsj', '0px');
    setTimeout(EsconderMSJ, 3000);
}

function EsconderMSJ() {
    style.setProperty('--TranslateMsj', '-200px');
}

function AlertMSJSinEsconder(Descripcion) {
    MSJ.innerHTML = Descripcion;
    style.setProperty('--TranslateMsj', '0px');
}

function CambiarColorMSJ(Color = '#3bafde') {
    style.setProperty('--ColorMSJ', Color);
}

function GenerarCodigo(i = 0) {
    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
    var contraseña = "";
    for (i = 0; i < 6; i++) contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return contraseña;
}

function btnEliminarStyle(Titulo) {
    btnEliminar.value = 'Eliminar ' + Titulo;
    style.setProperty('--Color4', '#C70039');
    btnEliminar.removeAttribute('disabled');
}

////////////////////////////////////////////////////////////////// CARGAR DOM //////////////////////////////////////////////////////
const ContenedorListaClases = document.getElementById('ContenedorLista');
const ContenedorListaClases2 = document.getElementById('ContenedorLista2');

var Usuario = localStorage.getItem("User");

window.addEventListener('DOMContentLoaded', () => {
    CargarClases();
});

async function CargarClases() {
    const q = query(collection(db, "Clases"), where("IDUser", "==", Usuario));
    const querySnapshot = await getDocs(q);
    var lista = '';
    var Numero = 10;
    querySnapshot.forEach(doc => {
        const Datos = doc.data();
        Numero--;
        lista += `
                <li class="Lista1" style="--i:${Numero};"><a data-id=${Datos.ID} data-IDRef=${doc.id} href="#">${Datos.Titulo}</a></li>                                    
                `
    });

    ContenedorListaClases.innerHTML = lista;
    const Clases = ContenedorListaClases.querySelectorAll('.Lista1');


    Clases.forEach(btn => {
        btn.addEventListener('click', async (event) => {
            const doc = await obtenerClase(event.target.dataset.id);
            CodigoClase = doc.id;
            CodigoClaseRef = event.target.dataset.idref;
            CargarTemas();
            CodigoTema = '';

            style.setProperty('--TranslateArrow', '80px');
            style.setProperty('--TranslateXD', '0px');
            style.setProperty('--TranslateArrow2', '0px');
            EliminarColorBoton(1);
            btn.classList.add('BotonSeleccionado');
            ResetearIndex();
            btnAgregar.style.display = 'block';
            if (Boton == 0 || Boton == 3) {
                style.setProperty('--Index', '6');
            } else {
                style.setProperty('--IndexContenedor', '6');
            }

            btnEliminarStyle('Directorio');
        });
    });
}

function EliminarColorBoton(Lista) {
    if (Lista == 1) {
        const Botones = ContenedorListaClases.querySelectorAll('.Lista1');

        Botones.forEach(btn => {
            btn.classList.remove('BotonSeleccionado');
        });
    } else if (Lista == 2) {
        const Botones = ContenedorListaClases2.querySelectorAll('.Lista2');

        Botones.forEach(btn => {
            btn.classList.remove('BotonSeleccionado');
        });
    } else if (Lista == 3) {
        const Botones = ContenedorBtn.querySelectorAll('.Lista');

        Botones.forEach(btn => {
            btn.classList.remove('BotonSeleccionado');
        });
    } else {
        const Botones = ContenedorBtn.querySelectorAll('a');

        Botones.forEach(btn => {
            btn.classList.remove('BotonSeleccionado');
        });
    }
}

async function CargarTemas() {
    const q = query(collection(db, "Tema"), where("IDClase", "==", CodigoClase));

    const querySnapshot = await getDocs(q);
    var lista = '';
    var Numero = 10;
    querySnapshot.forEach((doc) => {
        const Datos = doc.data();
        Numero--;
        lista += `
            <li class="Lista2" style="--i:${Numero};"><a data-id=${Datos.ID} data-IDRef=${doc.id} href="#"> ${Datos.Titulo}</a></li>                                    
            `
    });

    ContenedorListaClases2.innerHTML = lista;
    const Temas = ContenedorListaClases2.querySelectorAll('.Lista2');
    BotonTema(Temas);
}


function ResetearIndex() {
    style.setProperty('--IndexClase', '3');
    style.setProperty('--Index', '4');
    style.setProperty('--IndexContenedor', '5');
    style.setProperty('--TranslateXD2Movil', '0px');
}

// function PDF() {
//     var doc = new jsPDF();
//     var Contenido = document.getElementById("TextoCard").innerHTML;

//     doc.setFont("TimesNewRoman", "bold");
//     doc.setFontSize(16);
//     // Añadir título al documento
//     doc.text(document.getElementById('TituloCard').innerText, 10, 10);

//     doc.setFont("TimesNewRoman", "normal");
//     doc.setFontSize(11);

//     doc.fromHTML(Contenido, 10, 10, {
//         width: 180
//     });
//     // Descargar el documento
//     doc.save(document.getElementById('TituloCard').innerText);
// }

// function crearImagen() {
//     const contenido = document.getElementById('Menu');

//     domtoimage.toPng(contenido)
//         .then(dataUrl => {
//             const link = document.createElement('a');
//             link.href = dataUrl;
//             link.download = 'captura.png';
//             link.click();
//         })
//         .catch(error => {
//             console.error('Error al capturar la imagen:', error);
//         });
//     MSJ("Se a creado la imagen");
// }

//////////////////////////////////////////////// FUNCION BOTONES //////////////////////////////////////////////////////

let Modo = parseInt(localStorage.getItem("modo")) || 0;

function aplicarModo() {
    if (Modo === 1) {
        style.setProperty("--ModoNoche", "#181818");
        style.setProperty("--ModoNocheFont", "#E1DBD6");
        btnModo.value = "Día";
    } else {
        style.setProperty("--ModoNoche", "#E1DBD6");
        style.setProperty("--ModoNocheFont", "#181818");
        btnModo.value = "Noche";
    }
}
aplicarModo();

btnModo.addEventListener("click", () => {
    Modo++;
    if (Modo > 1) Modo = 0;
    localStorage.setItem("modo", Modo);
    aplicarModo();
});

var contadorFullScreen = 0;

window.addEventListener("keydown", async (btn) => {
    if (btn.code == "Enter" && Boton != 0) {
        AgregarDatos();
    }
    else if (btn.shiftKey && btn.code == "Enter" && EdicionActiva == false) {
        AgregarDatos();
    }
    else if (btn.shiftKey && btn.code == "Enter" && EdicionActiva == true) {
        EditarNota();
    }

    if (btn.code == "KeyT" && NotasActivas == true) {
        AbrirCard();
    }

    // if (btn.code == "KeyS" && NotasActivas == true) {
    //     crearImagen();
    // }

    // if (btn.code == "KeyC" && NotasActivas == true) {
    //     Copy();
    // }

    // if (btn.code == "KeyD" && NotasActivas == true) {
    //     PDF();
    // }

    if (btn.code == "KeyF" && NotasActivas == true) {
        contadorFullScreen++;
        if (contadorFullScreen == 1) {
            FullScreen(elemento);
        } else if (contadorFullScreen == 2) {
            ExitFullScreen();
            contadorFullScreen = 0;
        }
    } else if (btn.code == "Escape" && NotasActivas == true && MenuActivo == false) {
        CerrarCard();
    }

    if (btn.code == "Escape" && MenuActivo == true) {
        CerrarCardsScreen();
    }

    items.forEach(item => item.classList.remove("BotonSeleccionado"));

    if (CardsCargadas == true) {
        if (btn.key === "ArrowDown") {
            currentIndex = (currentIndex + 1) % items.length;
            ArrowActions();
        } else if (btn.key === "ArrowUp") {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            ArrowActions();
        }
    }

});

function ArrowActions() {
    const selectedItem = items[currentIndex];
    selectedItem.classList.add("BotonSeleccionado");
    const btn = selectedItem.querySelector("a");
    ejecutarAccionCard(btn);
}

btnAgregar.onclick = function () {
    AgregarDatos();
}

var fechaActual = new Date();

var año = fechaActual.getFullYear();
var mes = fechaActual.getMonth() + 1;
var dia = fechaActual.getDate();

var Fecha = `${año}-${mes}-${dia}`;


function AgregarDatos() {
    Titulo = document.getElementById('Titulo').value;
    Contenido = document.getElementById('Contenido').innerHTML;
    var Codigo = GenerarCodigo();

    switch (Boton) {
        case 0:
            //NOTAS
            if (Titulo == '' || Contenido == '') {
                AlertMSJ('LLene los Datos');
            } else {
                if (CodigoClase == '') {
                    AlertMSJ('Elija el directorio');
                    ResetearIndex();
                    style.setProperty('--IndexClase', '6');
                    style.setProperty('--TranslateArrow', '0px');
                } else if (CodigoTema == '') {
                    AlertMSJ('Elija el tema');
                    style.setProperty('--TranslateArrow2', '0px');
                }
                else {
                    Contenido = ReplaceSaltos(Contenido);
                    AgregarCards(Titulo, Contenido, CodigoTema, Fecha, Usuario);
                    limpiar();
                    localStorage.setItem('CodigoTema', CodigoTema);
                    CambiarColorMSJ(" #adee7a");
                    AlertMSJ('Se Agrego la nota');
                }
            }
            break;
        case 1:
            //CLASES
            if (Titulo == '') {
                AlertMSJ('LLene el Nombre del directorio');
            } else {
                CodigoClase = Codigo;
                AgregarClase(Usuario, Codigo, Titulo);
                CargarTemas();
                style.setProperty('--TranslateArrow2', '0px');
                CambiarColorMSJ(" #adee7a");
                AlertMSJ('Se Agregaron los datos');
                limpiar();
                Tema();
                style.setProperty('--TranslateArrow', '80px');
                style.setProperty('--TranslateXD', '0px');
                Boton = 2;
                CargarClases('Clases', ContenedorListaClases, 1);
            }
            break;
        case 2:
            //TEMAS
            if (CodigoClase == '') {
                AlertMSJ('Elija la clase');
                style.setProperty('--TranslateArrow', '0px');
                ResetearIndex();
                style.setProperty('--IndexClase', '6');
            } else {
                if (Titulo == '') {
                    AlertMSJ('LLene el nombre del tema');
                } else {
                    var Codigo = GenerarCodigo();
                    CodigoTema = Codigo;
                    AgregarTema(Titulo.toUpperCase(), Codigo, CodigoClase, Usuario);
                    style.setProperty('--TranslateArrow2', '-80px');
                    CargarTemas();
                    CambiarColorMSJ("#adee7a");
                    AlertMSJ('Se agregaron los datos');
                    limpiar();
                    Cards();
                }
            }
            break;
        case 3:
            CerrarCardsScreen();
            break;

        case 4:
            EditarNota();
            break;
    }
}


function CerrarCardsScreen() {
    Botones.classList.remove("OcultarBotones");
    style.setProperty('--witdhArea', '600px');
    style.setProperty('--IndexCards', '0');
    style.setProperty('--witdhHeight', '550px');
    CambiarOrientacion(-80, -80);
    style.setProperty('--WidthCard', '300px');
    style.setProperty('--heigth', '520px');
    style.setProperty('--ListaBootom', '-400px');
    style.setProperty('--Widthborder', '0px');
    TituloCard.innerHTML = 'Salir';
    ContenedorTexto.innerHTML = '';
    btnInformacion.value = 'Ver más información';
    Toques = 0;
    Tocar4 = 0;
    ApuntesActivo = false;
    MostrarControles(false);
    TipoAccion.innerHTML = 'Directorio';
    ColoresBotonesOff(1, 3, 2, 5);
    document.getElementById('Contenido').style.opacity = '0%';
    btnClaseAct = true;
    FuncionBoton();
    Boton = 1;
    style.setProperty('--opacidadLista', '0%');
    contadorFullScreen = 0;
    NotasActivas = false;
}

btnEliminar.onclick = async function () {

    if (CodigoClase != '' && CodigoTema == '') {
        const confirmar = confirm("¿Estás seguro que deseas eliminar la clase?");
        if (confirmar) {
            await EliminarClase(CodigoClaseRef);
            style.setProperty('--Color4', '#181818');
            LimpiarCodigos();
            CambiarColorMSJ("#e74c3c");
            AlertMSJ('Se elimino el Directorio');
            CargarClases();
            CargarTemas();
            await BorrarCards(CodigoTema);
            style.setProperty('--TranslateArrow', '-80px');
            style.setProperty('--TranslateArrow2', '-80px');
        }
    } else if (CodigoClase == '') {
        AlertMSJ('Seleccione un directorio');
    }

    if (CodigoClase != '' && CodigoTema != '') {
        const confirmar = confirm("¿Estás seguro que deseas eliminar el tema?");
        if (confirmar) {
            EliminarTema(CodigoTemaRef);
            CargarTemas();
            style.setProperty('--Color4', '#181818');
            CambiarColorMSJ("#e74c3c");
            AlertMSJ('Se elimino el tema');
        }
    }
}


function Clase() {
    MostrarControles(false);
    TipoAccion.innerHTML = 'Directorio';
    ColoresBotonesOff(1, 3, 2, 5);
    document.getElementById('Contenido').style.opacity = '0%';
    btnClaseAct = true;
    FuncionBoton();
    Boton = 1;
}

function Tema() {
    MostrarControles(false);
    TipoAccion.innerHTML = 'Tema';
    ColoresBotonesOff(2, 1, 3, 5);
    btnTemaAct = true
    document.getElementById('Contenido').style.opacity = '0%';
    FuncionBoton();
    Boton = 2;
}

function Cards() {
    MostrarControles(false);
    TipoAccion.innerHTML = 'Nota';
    btnCardAct = true;
    ColoresBotonesOff(3, 1, 2, 5);
    document.getElementById('Contenido').style.opacity = '100%';
    style.setProperty('--Visibilidad', 'visible');
    style.setProperty('--opacity', '100%');
    FuncionBoton();
    Boton = 0;
}

btnClase.onclick = function () {
    Clase();
}

btnTema.onclick = function () {
    Tema();
}

btnCard.onclick = function () {
    Cards();
}

btnDatos.onclick = function () {
    btnAgregar.style.display = 'block';
    if (CodigoClase == '' && CodigoTema == '') {
        CambiarColorMSJ("#3bafde");
        AlertMSJ('Seleccione la clase y el tema');
        style.setProperty('--TranslateArrow', '0px');
        style.setProperty('--TranslateArrow2', '0px');
        ResetearIndex();
        style.setProperty('--IndexClase', '6');
    }
    else if (CodigoClase == '') {
        AlertMSJ('Seleccione una clase');
        ResetearIndex();
        style.setProperty('--IndexClase', '6');
    } else {
        AlertMSJ('Seleccione el Tema');
    }
    AbrirApuntesScreen();
}

function AbrirApuntesScreen() {
    TipoAccion.innerHTML = 'Apuntes';
    document.getElementById('Contenido').style.opacity = '0%';
    style.setProperty('--opacity', '0%');
    ColoresBotonesOff(5, 3, 2, 1);
    MostrarControles(true);
    style.setProperty('--TranslateY2', '-40px');
    ApuntesActivo = true;
    if (ApuntesActivo == true && CodigoTema != "") {
        style.setProperty('--opacidadLista', '100%');
        CargarCards();
    } else {
        style.setProperty('--opacidadLista', '0%');
    }
    btnDatosAct = true;
    FuncionBoton();
    style.setProperty('--TranslateXD', '0px');
    Boton = 3;
    PantallaCompleta2();
}

function ColoresBotonesOff(ColorAct, Color2, Color3, Color5) {
    style.setProperty('--Color' + ColorAct, '#2e4053');
    style.setProperty('--Color' + Color2, '#181818');
    style.setProperty('--Color' + Color3, '#181818');
    style.setProperty('--Color' + Color5, '#181818');
}

function MostrarControles(NoMostrar) {
    if (NoMostrar == true) {
        document.getElementById('Titulo').style.opacity = '0%';
        document.getElementById('btnPantalla').style.opacity = '0%';
        document.getElementById('btnEliminar').style.opacity = '0%';
        document.getElementById('txtBusqueda').style.visibility = 'visible';
        document.getElementById('Busqueda').style.visibility = 'visible';
        btnAgregar.value = 'Salir Notas';
    } else {
        style.setProperty('--opacity', '0%');
        btnAgregar.value = 'Agregar';
        document.getElementById('btnPantalla').style.opacity = '100%';
        document.getElementById('Titulo').style.opacity = '100%';
        document.getElementById('btnEliminar').style.opacity = '100%';
        document.getElementById('txtBusqueda').style.visibility = 'hidden';
        document.getElementById('Busqueda').style.visibility = 'hidden';
    }
}

//////////////////////////////// Variables de botones /////////////////////
var btnClaseAct = false;
var btnTemaAct = false;
var btnCardAct = false;
var btnDatosAct = false;

function FuncionBoton() {
    if ((btnClaseAct || btnTemaAct || btnCardAct || btnDatosAct) == true) {
        document.getElementById("Titulo").focus();
        style.setProperty('--TranslateY', '-320px');
        style.setProperty('--Heigth', '50px');
        style.setProperty('--ColorHover', 'rgb(170,255,169)');
        style.setProperty('--BotonsHeigth', '50px');
        style.setProperty('--TranslateXD2', '0px');
        style.setProperty('--witdhArea', '600px');
        Tocar = 0;
    }

    else if ((btnClaseAct && btnTemaAct && btnCardAct) == false) {
        style.setProperty('--TranslateY2', '-40px');
        style.setProperty('--TranslateY', '00px');
        style.setProperty('--Heigth', '640px');
        style.setProperty('--BotonsHeigth', '200px');
        style.setProperty('--Color4', '#181818');
        style.setProperty('--ColorHover', 'rgb(170,255,169)');
        style.setProperty('--TranslateXD', '350px');
        style.setProperty('--TranslateXD2', '-350px');
        style.setProperty('--TranslateArrow', '80px');
        style.setProperty('--TranslatdeArrow2', '-80px');
        btnEliminar.value = 'Eliminar';
        btnEliminar.setAttribute('disabled', true);
        LimpiarCodigos();
    }
}

function Copy() {

    navigator.clipboard.writeText(document.getElementById("TextoCard").innerText)
        .then(() => {
            AlertMSJ('Se copio al portapapeles', true);
        })
        .catch(err => {
            AlertMSJ('ah ocurrido un error al copiar', true);
        });
}

const btnPantalla = document.getElementById("btnPantalla");
const Botones = document.getElementById("ContenedorBotones");
var Tocar = 0;
var Tocar4 = 0;

function PantallaCompleta() {
    Tocar++;
    if (Tocar == 1) {
        FullScreen(Contenedor);
    } else {
        ExitFullScreen();
        Tocar = 0;
    }
}

function PantallaCompleta2() {
    Tocar4++;
    if (Tocar4 == 1) {
        Botones.classList.add("OcultarBotones");
        style.setProperty('--witdhArea', '800px');
        style.setProperty('--witdhHeight', '110%');
        style.setProperty('--IndexCards', '5');
    } else {
        Botones.classList.remove("OcultarBotones");
        style.setProperty('--witdhArea', '600px');
        style.setProperty('--IndexCards', '0');
        style.setProperty('--witdhHeight', '550px');
        CambiarOrientacion(-80, -80);
        style.setProperty('--WidthCard', '300px');
        style.setProperty('--heigth', '520px');
        style.setProperty('--ListaBootom', '-400px');
        TituloCard.innerHTML = 'Salir';
        ContenedorTexto.innerHTML = '';
        btnInformacion.value = 'Ver más información';
        Toques = 0;
        Tocar4 = 0;
    }
}

const Contenedor = document.getElementById("Contenedor");

btnPantalla.addEventListener("click", function () {
    PantallaCompleta();
    document.getElementById("Contenido").focus();
});

//Variables
var btnActivo = false;
var Toques = 0;

btnInformacion.onclick = function () {
    AbrirCard();
}

function AbrirCard() {
    Toques++;
    if (Toques == 1) {
        style.setProperty('--WidthCard', '800px');
        CambiarOrientacion(-510, 0);
        btnActivo = true;
        ContenedorTexto.innerHTML = Text2;
        btnInformacion.value = 'Resumen';
    } else {
        style.setProperty('--WidthCard', '300px');
        CambiarOrientacion(-510, 0);
        btnActivo = false;

        btnInformacion.value = 'Ver más información';
        Toques = 0;
    }
}

function CambiarOrientacion(Translatex, TranslateInfox) {
    style.setProperty('--Translatex', Translatex + 'px');
    style.setProperty('--TranslateInfox', TranslateInfox + 'px');
}

function Transladar() {
    if (btnActivo == true) {
        CambiarOrientacion(-510, 0);
    } else {
        CambiarOrientacion(-510, 0);
    }
}

const ContenedorBtn = document.getElementById('ListaTodo');

var CardsCargadas = false;
async function CargarCards() {
    const q = query(collection(db, "Cards"), where("IDTema", "==", CodigoTema));
    const querySnapshot = await getDocs(q);

    let lista = '';
    let Numero = 10;

    querySnapshot.forEach((doc) => {
        const Cards = doc.data();
        Numero--;
        lista += `
        <li class="Lista" style="--i:${Numero};"><a data-id=${doc.id} href="#">${Cards.Titulo}</a></li>
      `;
    });

    const ContenedorBtn = document.getElementById("ListaTodo");
    ContenedorBtn.innerHTML = lista;

    items = Array.from(ContenedorBtn.querySelectorAll('.Lista'));

    BotonCard(items);
    CardsCargadas = true;
}

let currentIndex = -1;
let items = [];




function CerrarCard() {
    CambiarOrientacion(-80, -80);
    style.setProperty('--WidthCard', '300px');
    style.setProperty('--heigth', '520px');
    style.setProperty('--Widthborder', '0px');
    style.setProperty('--ListaBootom', '-400px');
    TituloCard.innerHTML = 'Cerrada';
    ContenedorTexto.innerHTML = '';
    btnInformacion.value = 'Ver más información';
    Toques = 0;
    NotasActivas = false;
    EliminarColorBoton(3);
    SetMenuActivo();
    style.setProperty("--displayInfo", "none");
    ToquesInfo = 0;
}

function SetMenuActivo() {
    setTimeout(function () {
        MenuActivo = true;
    }, 1000);
}

function ReplaceEnters(texto) {
    texto = texto.replace(/<br>/g, "\r", "\n");
    return texto;
}

btnCopy.onclick = function () {
    Copy();
}


btnEliminarCard.onclick = async function () {
    const confirmar = confirm("¿Estás seguro que deseas eliminar esta tarjeta?");
    if (confirmar) {
        await BorrarCard(Codigo);
        CambiarColorMSJ(" #e74c3c");
        AlertMSJ("Se elimino el apunte: " + TituloCard.innerText);
        TituloCard.innerHTML = 'Seleccione una Nota';
        ContenedorTexto.innerHTML = '';
        CargarCards();
    }
}

var elemento = document.getElementById("Menu");

btnFullCard.onclick = function () {
    FullScreen(elemento);
}

btnFullExit.onclick = function () {
    ExitFullScreen();
}


document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        ExitFullScreen();
    }
});

function FullScreen(Element) {
    btnInformacion.style.display = "none";
    btnFullCard.style.display = "none";
    btnFullExit.style.display = "block";
    contadorFullScreen = 1;

    style.setProperty('--TamanoHeightLetra', '90%');
    style.setProperty('--FontSize', '25px');

    if (Element.requestFullscreen) {

        Element.requestFullscreen();
    } else if (Element.mozRequestFullScreen) {
        Element.mozRequestFullScreen();
    } else if (Element.webkitRequestFullscreen) {
        Element.webkitRequestFullscreen();
    } else if (Element.msRequestFullscreen) {
        Element.msRequestFullscreen();
    }
}


function ExitFullScreen() {
    btnFullCard.style.display = "block";
    btnFullExit.style.display = "none";
    btnInformacion.style.display = "block";
    style.setProperty('--TamanoHeightLetra', '80%');
    style.setProperty('--FontSize', '20px');
    contadorFullScreen = 0;
    Tocar = 0;

    if (document.exitFullscreen) {

        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

btnEditarNota.addEventListener('click', async () => {
    document.getElementById('Titulo').value = TituloCard.innerText;
    TextArea.innerHTML = Text2;
    EdicionActiva = true;
    CambiarColorMSJ("#f7dc6f");
    AlertMSJSinEsconder("Editando Nota: " + document.getElementById('Titulo').value);
    CerrarCardsScreen();
    Cards();
    PantallaCompleta();
    NotasActivas = false;
    btnAgregar.value = "Editar Nota";
});


async function EditarNota() {
    // Obtener valores de los campos de entrada
    const Contenido = ReplaceSaltos(document.getElementById('Contenido').innerHTML);
    const Titulo = document.getElementById('Titulo').value;

    // Actualizar en Firestore
    ActualizarTodo(CodigoCard, Contenido, Titulo);
    // Confirmación de la edición
    EdicionActiva = false;
    CambiarColorMSJ("#adee7a");
    AlertMSJ("Edición realizada");
    AbrirApuntesScreen();
    limpiar();

    Boton = 3;
    btnAgregar.value = "Salir Notas";
}





