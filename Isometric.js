import { ObtenerDato, BorrarCard, db, collection, query, where, getDocs } from "./db.js";


const style = document.documentElement.style;
const Titulo = document.getElementById('TituloCard');
const btnInformacion = document.getElementById('VerInfor');
const ContenedorTexto = document.getElementById('TextoCard');
const btnCopy = document.getElementById('btnCopy');
const btnEliminar = document.getElementById('btnEliminarCard');

const MSJ = document.getElementById('MSJ');

var Text = '';
var Text2 = '';
var Codigo = '';



function Copy() {
    navigator.clipboard.writeText(Titulo.innerHTML + "\n\n" + Text)
        .then(() => {
            AlertMSJ('Se copio al portapapeles', true);
        })
        .catch(err => {
            AlertMSJ('ah ocurrido un error al copiar', true);
        });
}


function Esconder() {
    style.setProperty('--TranslateMsj', '-200px');
}

function AlertMSJ(Descripcion) {
    MSJ.innerHTML = Descripcion;
    style.setProperty('--TranslateMsj', '0px');
    setTimeout(Esconder, 3000);
}

//Variables
var btnActivo = false;
var Toques = 0;

btnInformacion.onclick = function () {
    Toques++;

    if (Toques == 1) {
        style.setProperty('--WidthCard', '800px');
        CambiarOrientacion(-410, 0);
        btnActivo = true;
        ContenedorTexto.innerHTML = Text2;
        btnInformacion.value = 'Resumen';
    } else {
        style.setProperty('--WidthCard', '300px');
        CambiarOrientacion(-410, 0);
        btnActivo = false;

        ContenedorTexto.innerHTML = Text + '...';

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
        CambiarOrientacion(-410, 0);
    } else {
        CambiarOrientacion(-410, 0);
    }
}

const ContenedorBtn = document.getElementById('ListaTodo');
var CodigoTema = localStorage.getItem('CodigoTema');

//ObtenerDatos
window.addEventListener('DOMContentLoaded', async () => {
    CargarCards();
});

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
    ContenedorBtn.innerHTML = lista + `<li class="Lista" style="--i:0;"><a data-id="0" href="#">Salir</a></li>`;
    const Botones = ContenedorBtn.querySelectorAll('.Lista');

    Botones.forEach(btn => {
        btn.addEventListener('click', async (event) => {
            const doc = await ObtenerDato(event.target.dataset.id);
            const Informacion = doc.data();
            Transladar();

            if (event.target.dataset.id == 0) {
                CambiarOrientacion(0, 0);
                style.setProperty('--WidthCard', '300px');
                style.setProperty('--heigth', '520px');
                style.setProperty('--ListaBootom', '-400px');
                Titulo.innerHTML = 'Salir';
                ContenedorTexto.innerHTML = '';                
            } else {
                Titulo.innerHTML = Informacion.Titulo;
                ///Cortar String
                Text = Informacion.Contenido;
                Text = ReplaceEnters(Text);
                Text2 = Informacion.Contenido;
                Codigo = event.target.dataset.id;                
                ContenedorTexto.innerHTML = Text2;
                style.setProperty('--heigth', '520px');
                style.setProperty('--CardTop', '400px');
                style.setProperty('--ListaBootom', '200px');
            }
        });
    });
}


function ReplaceEnters(texto) {
    texto = texto.replace(/<br>/g, "\r","\n");
    return texto;
}


btnCopy.onclick = function () {
    Copy();
}


btnEliminar.onclick = function () {
    BorrarCard(Codigo);
    Titulo.innerHTML = 'Seleccione una Nota';
    ContenedorTexto.innerHTML = '';
    CargarCards();
}