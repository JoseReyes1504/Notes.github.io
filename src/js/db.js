
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

export const BorrarCards = (ID) => deleteDoc(doc(db, 'Cards', where("IDTema", "==", ID)));


export const ActualizarCard = (ID) => doc(db, "Cards", ID);

export const EliminarTema = (id) => deleteDoc(doc(db, 'Tema', id));

export function AgregarCards(Titulo, Contenido, IDTema, Fecha, Usuario) {
    addDoc(collection(db, 'Cards'), { Titulo, Contenido, IDTema, Fecha, Usuario});
}

export function AgregarTema(Titulo, ID, IDClase, Usuario) {
    addDoc(collection(db, 'Tema'), { Titulo, ID, IDClase, Usuario});
}

export function AgregarClase(IDUser,ID, Titulo) {
    addDoc(collection(db, 'Clases'), {IDUser, Titulo, ID });
}



export async function ObetnerBusquedaTema(BsTema) {
    const startQ = query(collection(db, "Cards"), where("Titulo", ">=", BsTema));
    const endQ = query(collection(db, "Cards"), where("Titulo", "<=", BsTema + "\uf8ff"));
    
    const [startSnapshot, endSnapshot] = await Promise.all([getDocs(startQ), getDocs(endQ)]);

    const results = [];

    
    startSnapshot.forEach((doc) => {
        if (results.length < 2) { // Agregar solo si aún no hay 2 resultados
            const Datos = doc.data();
            results.push(Datos);
        }
    });

    endSnapshot.forEach((doc) => {
        if (results.length < 2) { // Agregar solo si aún no hay 2 resultados
            const Datos = doc.data();
            // Evitar duplicados
            if (!results.some(result => result.id === Datos.id)) {
                results.push(Datos);
            }
        }
    });

    return results;
}

export const obtenerClase = (ID) => getDoc(doc(db, 'Clases', ID));

export {
    db,
    collection,
    onSnapshot,
    query,
    where, getDocs,
    getAuth,
    onAuthStateChanged,
    getDoc,
    updateDoc
}


