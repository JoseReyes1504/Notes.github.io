import { onAuthStateChanged, auth } from "./db.js";

export var Usuario = "";

onAuthStateChanged(auth, (user) => {
    if (!user) {        
        location.href = './index.html';
    }
    
    console.log(user);
    // if (user.email === "jose.reyessuazo@gmail.com") {
        
    // } else {

    // }
});