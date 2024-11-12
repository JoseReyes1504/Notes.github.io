import { getFirestore, doc, collection, addDoc, deleteDoc, getDocs, onSnapshot, getDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js"
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyC4MRrMA11cs63aGCfseXYj0pM44WmvQSU",
    authDomain: "presentaciones-6212e.firebaseapp.com",
    projectId: "presentaciones-6212e",
    storageBucket: "presentaciones-6212e.appspot.com",
    messagingSenderId: "365506274813",
    appId: "1:365506274813:web:8187b939f3af866c606594"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export const auth = getAuth(app);


// Inicializar Algolia
const algoliasearch = window.algoliasearch;
const client = algoliasearch('UJZQ1RWCH0', '3cff8501a563622f3c8cd1358710ea39');
const index = client.initIndex('Cards-Search');

/// Inicio De Sesion

export const IniciarSesion = (Correo, Password) => signInWithEmailAndPassword(auth, Correo, Password);

export const CerrarSesion = () => signOut(auth);

export const SesionCurso = () => onAuthStateChanged(auth);

export const ObtenerDatos = () => getDocs(collection(db, 'Cards'));

export const ObtenerDato = (id) => getDoc(doc(db, 'Cards', id));

// export const BorrarCard = (id) => deleteDoc(doc(db, 'Cards', id));

// Función para borrar un documento en Firestore y en Algolia
export const BorrarCard = (id) => {
    try {
        // Eliminar de Firestore
        deleteDoc(doc(db, 'Cards', id));
        console.log(`Card ${id} eliminada de Firestore`);

        // Eliminar de Algolia
        index.deleteObject(id);  // Usa el mismo `id` como `objectID` en Algolia
        console.log(`Card ${id} eliminada de Algolia`);
    } catch (error) {
        console.error("Error al borrar la card:", error);
    }
};


export const EliminarClase = (id) => deleteDoc(doc(db, 'Clases', id));

export const BorrarCards = (ID) => deleteDoc(doc(db, 'Cards', where("IDTema", "==", ID)));

export const obtenerClase = (ID) => getDoc(doc(db, 'Clases', ID));

export const ActualizarCard = (ID) => doc(db, "Cards", ID);

export const ActualizarCardAlgolia = async (ID, data) => {
    try {
        const card = { ...data, objectID: ID };
        await index.saveObject(card);
        console.log(`Card ${ID} actualizada en Algolia`);
    } catch (error) {
        console.error("Error al actualizar la card en Algolia:", error);
    }
};

export function ActualizarTodo(CodigoCard, Contenido, Titulo) {
    // Objeto con los datos a actualizar
    const datosActualizados = {
        "Titulo": Titulo,
        "Contenido": Contenido
    };

    try {
        // Actualizar en Firestore
        updateDoc(ActualizarCard(CodigoCard), datosActualizados);
        console.log(`Documento ${CodigoCard} actualizado en Firestore`);

        // Actualizar en Algolia
        ActualizarCardAlgolia(CodigoCard, datosActualizados);
        console.log(`Documento ${CodigoCard} actualizado en Algolia`);
    } catch (error) {
        console.error("Error al actualizar el documento:", error);
    }
}


export const EliminarTema = (id) => deleteDoc(doc(db, 'Tema', id));

// Función para agregar una "Card" a Firestore y sincronizarla con Algolia
export function AgregarCards(Titulo, Contenido, IDTema, Fecha, Usuario) {
    // Agregar el documento a Firestore
    addDoc(collection(db, 'Cards'), { Titulo, Contenido, IDTema, Fecha, Usuario })
        .then((docRef) => {
            console.log(`Card agregada a Firestore con ID: ${docRef.id}`);

            // Agregar el documento "Card" a Algolia
            const card = {
                objectID: docRef.id, Titulo, Contenido, IDTema, Fecha, Usuario
            };

            index.saveObject(card)
                .then(() => {
                    console.log(`Card ${docRef.id} sincronizada con Algolia`);
                })
                .catch(error => {
                    console.error("Error al sincronizar con Algolia: ", error);
                });
        })
        .catch(error => {
            console.error("Error al agregar card a Firestore: ", error);
        });
}


export function AgregarTema(Titulo, ID, IDClase, Usuario) {
    addDoc(collection(db, 'Tema'), { Titulo, ID, IDClase, Usuario });
}

export function AgregarClase(IDUser, ID, Titulo) {
    addDoc(collection(db, 'Clases'), { IDUser, Titulo, ID });
}

// Función de búsqueda en Algolia
export async function buscarCards(query) {
    try {
        const results = await index.search(query);  // Esperamos a que se resuelva la búsqueda
        console.log(results.hits);  // Mostramos los resultados de la búsqueda
        return results.hits;  // Retornamos las cards encontradas
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        return [];  // Retornamos un array vacío si hay un error
    }
}


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


