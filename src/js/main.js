import { onAuthStateChanged, auth } from "./db.js";


onAuthStateChanged(auth, (user) => {                
    if (!user) {        
        location.href = '../../index.html';
    }
});