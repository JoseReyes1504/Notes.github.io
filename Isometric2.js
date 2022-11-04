import { AgregarCards, EliminarTema, obtenerClase, EliminarClase, AgregarTema, AgregarClase, onSnapshot, db, collection, query, where, getDocs } from "./db.js";
const style = document.documentElement.style;


////////////////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////
var btnAgregar = document.getElementById('btnAgregar');
const btnTema = document.getElementById('btnTema');
const btnClase = document.getElementById('btnClase');
const btnCard = document.getElementById('btnCard');
const btnDatos = document.getElementById('btnDatos');
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


////////////////////////////////////////////////////////////////// FUNCIONES //////////////////////////////////////////////////////

function limpiar() {
    document.getElementById('Contenido').value = '';
    document.getElementById('Titulo').value = '';
}

function LimpiarCodigos() {
    CodigoClase = '';
    CodigoTema = '';
    CodigoClaseRef = '';
    btnClaseAct = false;
}

function AlertMSJ(Descripcion, Funcion) {
    if (Funcion == true) {
        MSJ.innerHTML = Descripcion;
        style.setProperty('--TranslateMsj', '0px');
    } else {
        style.setProperty('--TranslateMsj', '-200px');
    }
}

function GenerarCodigo(i = 0) {
    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
    var contraseña = "";
    for (i = 0; i < 6; i++) contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return contraseña;
}

function btnEliminarStyle(Titulo) {
    btnEliminar.value = 'Eliminar ' + Titulo;
    style.setProperty('--Color4', '#2e4053');
    btnEliminar.removeAttribute('disabled');
}

////////////////////////////////////////////////////////////////// CARGAR DOM //////////////////////////////////////////////////////
const ContenedorListaClases = document.getElementById('ContenedorLista');
const ContenedorListaClases2 = document.getElementById('ContenedorLista2');

window.addEventListener('DOMContentLoaded', async () => {

    CargarClases('Clases', ContenedorListaClases, 1);
});

function CargarClases(Coleccion, Contenedor, NLista) {
    onSnapshot(collection(db, Coleccion), (QuerySnapShot) => {
        var lista = '';
        var Numero = 10;
        QuerySnapShot.forEach(doc => {
            const Datos = doc.data();
            Numero--;
            lista += `
            <li class="Lista${NLista}" style="--i:${Numero};"><a data-id=${Datos.ID} data-IDRef=${doc.id} href="#">${Datos.Titulo}</a></li>                                    
            `
        });

        Contenedor.innerHTML = lista;
        const Clases = Contenedor.querySelectorAll('.Lista1');

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
                ResetearIndex();
                if (Boton == 0 || Boton == 3) {
                    style.setProperty('--Index', '6');
                } else {
                    style.setProperty('--IndexContenedor', '6');
                }

                btnEliminarStyle('Clase');
                AlertMSJ('msj', false);
            });
        });
    });
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
            ResetearIndex();
            style.setProperty('--IndexContenedor', '6');
            btnEliminarStyle('Tema');
            localStorage.setItem('CodigoTema', CodigoTema);
            AlertMSJ('msj', false);
        });
    });
}


function ResetearIndex() {
    style.setProperty('--IndexClase', '3');
    style.setProperty('--Index', '4');
    style.setProperty('--IndexContenedor', '5');
    style.setProperty('--TranslateXD2Movil', '0px');        
}

function ReplaceEnters(texto) {
    texto = texto.replace(/\r?\n/g, "<br>");
    return texto;
}

////////////////////////////////////////////////////////////////// FUNCION BOTONES //////////////////////////////////////////////////////

btnAgregar.onclick = function () {
    Titulo = document.getElementById('Titulo').value;
    Contenido = document.getElementById('Contenido').value;
    var Codigo = GenerarCodigo();

    switch (Boton) {
        case 0:
            if (Titulo == '' || Contenido == '') {
                AlertMSJ('LLene los Datos', true);
            } else {
                if (CodigoClase == '') {
                    AlertMSJ('Elija la clase', true);
                    ResetearIndex();
                    style.setProperty('--IndexClase', '6');
                    style.setProperty('--TranslateArrow', '0px');                                    
                } else if (CodigoTema == '') {
                    AlertMSJ('Elija el tema', true);                    
                    style.setProperty('--TranslateArrow2', '0px');
                }
                else {
                    Contenido = ReplaceEnters(Contenido);
                    AgregarCards(Titulo, Contenido, CodigoTema);
                    limpiar();
                    AlertMSJ('Se Agrego la nota', true);
                }
            }
            break;
        case 1:
            if (Titulo == '') {
                AlertMSJ('LLene el Nombre de la clase', true);
            } else {
                AgregarClase(Codigo, Titulo);
                AlertMSJ('Se Agregaron los datos', true);
                limpiar();
            }
            break;
        case 2:
            if (CodigoClase == '') {
                AlertMSJ('Elija la clase', true);
                style.setProperty('--TranslateArrow', '0px');
                ResetearIndex();
                style.setProperty('--IndexClase', '6');
            } else {
                if (Titulo == '') {
                    AlertMSJ('LLene el nombre del tema', true);
                } else {
                    var Codigo = GenerarCodigo();
                    AgregarTema(Titulo, Codigo, CodigoClase);
                    CargarTemas();
                    AlertMSJ('Se agregaron los datos', true);
                    limpiar();
                }
            }
            break;
        case 3:
            if (CodigoClase == '' && CodigoTema == '') {
                AlertMSJ('Seleccione la clase y el tema', true);
                style.setProperty('--TranslateArrow', '0px');
                style.setProperty('--TranslateArrow2', '0px');
                ResetearIndex();
                style.setProperty('--IndexClase', '6');
            }
            else if (CodigoClase == '') {
                AlertMSJ('Seleccione una clase', true);
                ResetearIndex();
                style.setProperty('--IndexClase', '6');
            } else if (CodigoTema == '') {
                AlertMSJ('Seleccione el Tema', true);
            } else {
                location.href = './Isometric.html';
            }
            break;
    }
}

btnEliminar.onclick = function () {


    if (CodigoClase != '' && CodigoTema == '') {
        EliminarClase(CodigoClaseRef);
        style.setProperty('--Color4', '#181818');
        LimpiarCodigos();
        AlertMSJ('Se elimino la clase', true);

    } else if (CodigoClase == '') {
        AlertMSJ('Seleccione una clase', true);        
    }

    if (CodigoClase != '' && CodigoTema != '') {
        EliminarTema(CodigoTemaRef);
        CargarTemas();
        style.setProperty('--Color4', '#181818');
        AlertMSJ('Se elimino el tema', true);
    }
}


btnClase.onclick = function () {
    MostrarControles(false);
    TipoAccion.innerHTML = 'Clase';
    ColoresBotonesOff(1, 3, 2, 5);
    document.getElementById('Contenido').style.opacity = '0%';
    btnClaseAct = true;
    FuncionBoton();
    LimpiarCodigos();
    Boton = 1;
}

btnTema.onclick = function () {
    MostrarControles(false);
    TipoAccion.innerHTML = 'Tema';
    ColoresBotonesOff(2, 1, 3, 5);
    btnTemaAct = true
    document.getElementById('Contenido').style.opacity = '0%';
    FuncionBoton();
    LimpiarCodigos();
    Boton = 2;
}

btnCard.onclick = function () {
    MostrarControles(false);
    TipoAccion.innerHTML = 'Nota';
    btnCardAct = true;
    ColoresBotonesOff(3, 1, 2, 5);
    document.getElementById('Contenido').style.opacity = '100%';
    style.setProperty('--Visibilidad', 'visible');
    FuncionBoton();
    LimpiarCodigos();
    Boton = 0;
}

btnDatos.onclick = function () {
    TipoAccion.innerHTML = 'Datos';
    document.getElementById('Contenido').style.opacity = '0%';
    ColoresBotonesOff(5, 3, 2, 1);
    MostrarControles(true);
    btnDatosAct = true;
    FuncionBoton();
    Boton = 3;
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
        document.getElementById('btnEditar').style.opacity = '0%';
        document.getElementById('btnEliminar').style.opacity = '0%';
        btnAgregar.value = 'Ver Notas';
        // style.setProperty('--Visibilidad', 'hidden');
    } else {
        btnAgregar.value = 'Agregar';
        document.getElementById('Titulo').style.opacity = '100%';
        document.getElementById('btnEditar').style.opacity = '100%';
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
        style.setProperty('--TranslateY', '-320px');
        style.setProperty('--TranslateY2', '0px');
        style.setProperty('--Heigth', '50px');
        style.setProperty('--ColorHover', '#181818');
        style.setProperty('--BotonsHeigth', '50px');
        style.setProperty('--TranslateXD2', '0px');
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
        AlertMSJ('msj', false);
        btnEliminar.value = 'Eliminar';
        btnEliminar.setAttribute('disabled', true);
        LimpiarCodigos();
    }
}