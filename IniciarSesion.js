import { IniciarSesion} from "./db.js";
import { MostrarMSJSinBarra } from "./MSJ.js";

const email = document.getElementById("txtEmail");
const password = document.getElementById("txtPswd");
const btnEntrar = document.getElementById("btnLogin");

btnEntrar.addEventListener("click", async () => {
    try {
        const credenciales = await IniciarSesion(email.value, password.value);  
        if(credenciales != null){
            location.href="./Menu.html";
        }
    } catch (err) {

        if (err.code === "auth/invalid-email") {
            MostrarMSJSinBarra("Correo o Contraseña Incorrectos", 4000);
        } else if (err.code === "auth/user-not-found") {
            MostrarMSJSinBarra("Usuario no encontrado", 4000);
        } else if (err.code === "auth/wrong-password") {
            MostrarMSJSinBarra("Contraseña incorrecta", 4000);
        } else if (err.code === "auth/network-request-failed") {
            MostrarMSJSinBarra("Hay problemas con la conexión", 4000);
        } else {
            console.log("Hubo un error " + err.code);
        }
    }
});




