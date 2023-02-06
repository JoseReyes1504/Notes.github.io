const style = document.documentElement.style;
const Barra = document.querySelector(".Barra");

export function MostrarMSJ(MSJ) {
    Progreso.classList.remove("ProgressAnimacion");
    Barra.setAttribute("style", "opacity: 1");
    Progreso.classList.add("ProgressAnimacion");
    style.setProperty('--translate', '0px');        
    document.getElementById("MSJR").innerHTML = MSJ;
    
}

export function MostrarMSJSinBarra(MSJ, Tiempo) {
    style.setProperty('--translate', '0px');
    document.getElementById("MSJR").innerHTML = MSJ;
    Barra.setAttribute("style", "opacity: 0");

    setTimeout(EsconderMSJ, Tiempo);
}

export function EsconderMSJ() {
    style.setProperty('--translate', '-120px');    
}

