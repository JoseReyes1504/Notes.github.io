import { ObtenerDato, BorrarCard, AgregarCards, EliminarTema, CerrarSesion, obtenerClase, EliminarClase, AgregarTema, AgregarClase, onSnapshot, db, collection, query, where, getDocs, BorrarCards } from "./db.js";
const style = document.documentElement.style;

////////////////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////
const TituloCard = document.getElementById('TituloCard');
const btnInformacion = document.getElementById('VerInfor');
const ContenedorTexto = document.getElementById('TextoCard');
const btnCopy = document.getElementById('btnCopy');
const btnEliminarCard = document.getElementById('btnEliminarCard');
const btnFullCard = document.getElementById('btnFullCard');
const btnFullExit = document.getElementById('btnFullExit');


var btnAgregar = document.getElementById('btnAgregar');
const btnTema = document.getElementById('btnTema');
const btnClase = document.getElementById('btnClase');
const btnCard = document.getElementById('btnCard');
const btnDatos = document.getElementById('btnDatos');
const btnCerrar = document.getElementById('btnCerrarSesion');
const btnEliminar = document.getElementById('btnEliminar');
const MSJ = document.getElementById('MSJ');

var Titulo = '';
var Contenido = '';
var Boton = 0;
var CodigoClaseRef = '';
var CodigoClase = '';
var CodigoTema = '';
var CodigoTemaRef = '';
var btnClaseAct = false;

var Text = '';
var Text2 = '';
var Codigo = '';

var ApuntesActivo = false;
var NotasActivas = false;

////////////////////////////////////////////////// FUNCIONES //////////////////////////////////////////////////////

function ReplaceSaltos(texto) {
    texto = texto.replace(/\r?\n/g, "<br>");
    // texto = texto.replace(/\[b\](.*?)\[\/b\]/g, "<b> </b>")
    return texto;
}

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
    document.getElementById('Contenido').value = '';
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

            if (Boton == 0 || Boton == 3) {
                style.setProperty('--Index', '6');
            } else {
                style.setProperty('--IndexContenedor', '6');
            }

            btnEliminarStyle('Clase');
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
    } else {
        const Botones = ContenedorBtn.querySelectorAll('.Lista');

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


function ResetearIndex() {
    style.setProperty('--IndexClase', '3');
    style.setProperty('--Index', '4');
    style.setProperty('--IndexContenedor', '5');
    style.setProperty('--TranslateXD2Movil', '0px');
}

//////////////////////////////////////////////// FUNCION BOTONES //////////////////////////////////////////////////////

var contadorFullScreen = 0;

window.addEventListener("keydown", (btn) => {
    console.log(btn);
    if (btn.code == "Enter" && Boton != 0) {
        AgregarDatos();
    } else if (btn.shiftKey && btn.code == "Enter") {
        AgregarDatos();
    }

    if (btn.code == "KeyF" && NotasActivas == true) {
        contadorFullScreen++;
        if (contadorFullScreen == 1) {
            FullScreen();
        } else if (contadorFullScreen == 2) {
            ExitFullScreen();
            contadorFullScreen = 0;
        }
    } else if (btn.code == "Escape" && NotasActivas == true) {
        CerrarCard();
    }
});

btnAgregar.onclick = function () {
    AgregarDatos();
}

function AgregarDatos() {
    Titulo = document.getElementById('Titulo').value;
    Contenido = document.getElementById('Contenido').value;
    var Codigo = GenerarCodigo();

    switch (Boton) {
        case 0:
            if (Titulo == '' || Contenido == '') {
                AlertMSJ('LLene los Datos');
            } else {
                if (CodigoClase == '') {
                    AlertMSJ('Elija la clase');
                    ResetearIndex();
                    style.setProperty('--IndexClase', '6');
                    style.setProperty('--TranslateArrow', '0px');
                } else if (CodigoTema == '') {
                    AlertMSJ('Elija el tema');
                    style.setProperty('--TranslateArrow2', '0px');
                }
                else {
                    Contenido = ReplaceSaltos(Contenido);
                    AgregarCards(Titulo, Contenido, CodigoTema);
                    limpiar();
                    localStorage.setItem('CodigoTema', CodigoTema);
                    AlertMSJ('Se Agrego la nota');
                }
            }
            break;
        case 1:
            if (Titulo == '') {
                AlertMSJ('LLene el Nombre de la clase');
            } else {
                CodigoClase = Codigo;
                AgregarClase(Usuario, Codigo, Titulo);
                CargarTemas();
                style.setProperty('--TranslateArrow2', '0px');
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
                    AgregarTema(Titulo, Codigo, CodigoClase);
                    style.setProperty('--TranslateArrow2', '-80px');
                    CargarTemas();
                    AlertMSJ('Se agregaron los datos');
                    limpiar();
                    Cards();
                }
            }
            break;
        case 3:
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
            TipoAccion.innerHTML = 'Clase';
            ColoresBotonesOff(1, 3, 2, 5);
            document.getElementById('Contenido').style.opacity = '0%';
            btnClaseAct = true;
            FuncionBoton();
            Boton = 1;
            style.setProperty('--opacidadLista', '0%');

            break;
    }
}

btnEliminar.onclick = async function () {

    if (CodigoClase != '' && CodigoTema == '') {
        await EliminarClase(CodigoClaseRef);
        style.setProperty('--Color4', '#181818');
        LimpiarCodigos();
        AlertMSJ('Se elimino la clase');
        CargarClases();
        CargarTemas();
        await BorrarCards(CodigoTema);
        style.setProperty('--TranslateArrow', '-80px');
        style.setProperty('--TranslateArrow2', '-80px');
    } else if (CodigoClase == '') {
        AlertMSJ('Seleccione una clase');
    }

    if (CodigoClase != '' && CodigoTema != '') {
        EliminarTema(CodigoTemaRef);
        CargarTemas();
        style.setProperty('--Color4', '#181818');
        AlertMSJ('Se elimino el tema');
    }
}


function Clase() {
    MostrarControles(false);
    TipoAccion.innerHTML = 'Clase';
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

    if (CodigoClase == '' && CodigoTema == '') {
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
    } else if (CodigoTema == '') {
        AlertMSJ('Seleccione el Tema');
    } else {

    }
    TipoAccion.innerHTML = 'Apuntes';
    document.getElementById('Contenido').style.opacity = '0%';
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
        btnAgregar.value = 'Salir Notas';
        // style.setProperty('--Visibilidad', 'hidden');
    } else {
        btnAgregar.value = 'Agregar';
        document.getElementById('btnPantalla').style.opacity = '100%';
        document.getElementById('Titulo').style.opacity = '100%';
        document.getElementById('btnEliminar').style.opacity = '100%';
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
    ReplaceEnters2(Text);
    navigator.clipboard.writeText(TituloCard.innerHTML + "\n\n" + Text)
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
        Botones.classList.add("OcultarBotones");
        style.setProperty('--witdhArea', '1200px');
        style.setProperty('--witdhHeight', '110%');
        style.setProperty('--TranslateY2', '-40px');
        style.setProperty('--TranslateXD', '350px');
        style.setProperty('--TranslateXD2', '-350px');
    } else {
        Botones.classList.remove("OcultarBotones");
        style.setProperty('--witdhArea', '600px');
        style.setProperty('--witdhHeight', '550px');
        style.setProperty('--TranslateXD', '0px');
        style.setProperty('--TranslateXD2', '0px');
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

btnPantalla.addEventListener("click", function () {
    PantallaCompleta();
    document.getElementById("Contenido").focus();
});


//Variables
var btnActivo = false;
var Toques = 0;

btnInformacion.onclick = function () {
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

async function CargarCards() {
    const q = query(collection(db, "Cards"), where("IDTema", "==", CodigoTema));

    const querySnapshot = await getDocs(q);
    var lista = '';
    var Numero = 10;
    querySnapshot.forEach((doc) => {
        const Cards = doc.data();
        Numero--;
        lista += `
            <li class="Lista" style="--i:${Numero};"><a data-id=${doc.id} href="#">${Cards.Titulo}</a></li>                                    
            `
    });

    ContenedorBtn.innerHTML = lista;
    // ContenedorBtn.innerHTML = lista + `<li class="Lista" style="--i:0;"><a data-id="0" href="#">Cerrar Nota</a></li>`;
    const Botones = ContenedorBtn.querySelectorAll('.Lista');

    Botones.forEach(btn => {
        btn.addEventListener('click', async (event) => {
            const doc = await ObtenerDato(event.target.dataset.id);
            const Informacion = doc.data();
            Transladar();
            EliminarColorBoton(3)
            btn.classList.add('BotonSeleccionado');
            NotasActivas = true;


            if (event.target.dataset.id == 0) {
                CerrarCard();
            } else {
                TituloCard.innerHTML = Informacion.Titulo;
                ///Cortar String
                Text = Informacion.Contenido;
                Text = ReplaceEnters(Text);
                Text2 = Informacion.Contenido;
                Codigo = event.target.dataset.id;
                ContenedorTexto.innerHTML = Text2;
                style.setProperty('--Widthborder', '2px');
                style.setProperty('--heigth', '520px');
                style.setProperty('--CardTop', '400px');
                style.setProperty('--ListaBootom', '200px');

            }
        });
    });
}


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
}

function ReplaceEnters(texto) {
    texto = texto.replace(/<br>/g, "\r", "\n");
    // texto = texto.replace(/<b>(.*?)<\/b>/g, "[b]$1[/b]");
    return texto;
}

function ReplaceEnters2(texto) {
    // texto = texto.replace(/\[b\](.*?)\[\/b\]/g, "<b>$1</b>");
    texto = texto.replace(/\r\n/g, "<br>");
    return texto;
}


btnCopy.onclick = function () {
    Copy();
}


btnEliminarCard.onclick = async function () {
    await BorrarCard(Codigo);
    TituloCard.innerHTML = 'Seleccione una Nota';
    ContenedorTexto.innerHTML = '';
    CargarCards();
}

var elemento = document.getElementById("Menu");

btnFullCard.onclick = function () {
    FullScreen();
}

btnFullExit.onclick = function () {
    ExitFullScreen();
}


document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        ExitFullScreen();
    }
});

function FullScreen() {
    btnInformacion.style.display = "none";
    btnFullCard.style.display = "none";
    btnFullExit.style.display = "block";
    contadorFullScreen = 1;
    //Aumentar Tamaño Letra
    style.setProperty('--TamanoHeightLetra', '90%');
    style.setProperty('--FontSize', '25px');

    // Verifica si el navegador soporta la API Fullscreen
    if (elemento.requestFullscreen) {
        // Si es así, solicita que se ponga en pantalla completa
        elemento.requestFullscreen();
    } else if (elemento.mozRequestFullScreen) { /* Firefox */
        elemento.mozRequestFullScreen();
    } else if (elemento.webkitRequestFullscreen) { /* Chrome, Safari y Opera */
        elemento.webkitRequestFullscreen();
    } else if (elemento.msRequestFullscreen) { /* Internet Explorer y Edge */
        elemento.msRequestFullscreen();
    }
}


function ExitFullScreen() {
    btnFullCard.style.display = "block";
    btnFullExit.style.display = "none";
    btnInformacion.style.display = "block";
    style.setProperty('--TamanoHeightLetra', '80%');
    style.setProperty('--FontSize', '17px');
    contadorFullScreen = 0;

    // Verifica si el navegador soporta la API Fullscreen
    if (document.exitFullscreen) {
        // Si es así, solicita salir del modo pantalla completa
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        style.setProperty('--FontSize', '17px');
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari y Opera */
        style.setProperty('--FontSize', '17px');
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* Internet Explorer y Edge */
        style.setProperty('--FontSize', '17px');
        document.msExitFullscreen();
    }
}


ContenedorTexto.addEventListener('click', () => {
    Copy();
});