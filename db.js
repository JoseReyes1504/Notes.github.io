
import { getFirestore, doc, collection, addDoc, deleteDoc, getDocs, onSnapshot, getDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js"
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";


const firebaseConfig = {
    apiKey: "AIzaSyC4MRrMA11cs63aGCfseXYj0pM44WmvQSU",
    authDomain: "presentaciones-6212e.firebaseapp.com",
    projectId: "presentaciones-6212e",
    storageBucket: "presentaciones-6212e.appspot.com",
    messagingSenderId: "365506274813",
    appId: "1:365506274813:web:8187b939f3af866c606594"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export const auth = getAuth(app);



/// Inicio De Sesion

export const IniciarSesion = (Correo, Password) => signInWithEmailAndPassword(auth, Correo, Password);

export const CerrarSesion = () => signOut(auth); 

export const SesionCurso = () => onAuthStateChanged(auth); 

export const ObtenerDatos = () => getDocs(collection(db, 'Cards'));

export const ObtenerDato = (id) => getDoc(doc(db, 'Cards', id));

export const BorrarCard = (id) => deleteDoc(doc(db, 'Cards', id));

export const EliminarClase = (id) => deleteDoc(doc(db, 'Clases', id));

export const BorrarTodosTemas = (ID) => deleteDoc(doc(db, 'Tema', ID));


export const EliminarTema = (id) => deleteDoc(doc(db, 'Tema', id));

export function AgregarCards(Titulo, Contenido, IDTema) {
    addDoc(collection(db, 'Cards'), { Titulo, Contenido, IDTema });
}

export function AgregarClase(ID, Titulo) {
    addDoc(collection(db, 'Clases'), { Titulo, ID });
}


export async function ObtenerTemaClase(Tema, arrTema, CodigoClase){
    const q = query(collection(db, "Tema"), where("IDClase", "==", CodigoClase));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const Datos = doc.data();
        Tema = {
            'Titulo': Datos.Titulo,
            "ID": Datos.ID,
            "IDClase": Datos.IDClase,
        };
        arrTema = Tema;
        // console.log(arrTema);
    });
}


export const obtenerClase = (ID) => getDoc(doc(db, 'Clases', ID));

export function AgregarTema(Titulo, ID, IDClase) {
    addDoc(collection(db, 'Tema'), { Titulo, ID, IDClase });
}

export {
    db,
    collection,
    onSnapshot,
    query,
    where, getDocs,
    getAuth,
    onAuthStateChanged,
    getDoc
}


