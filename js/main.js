"use strict";

var titre;
var seigleStock, seigleRec, nbStockSeigle, nbRecolteSeigle; // ressources
var ecu; //argent
var fauxAchete, araireAchete, charetteAchete; // Outils

//Controle de LocalStorage + Initialisation des variables
if (typeof localStorage !== 'undefined') {
    
    if ("titrePlayer" in localStorage) {
        titre = localStorage.getItem("titrePlayer");
    } else { titre = "métayer"; }
    
    if ("argent" in localStorage) {
        ecu = localStorage.getItem("argent");
    } else { ecu = 0; }
    
    if ("seigleRec" in localStorage) {
        seigleRec = localStorage.getItem("seigleRec");
        seigleRec = parseInt(seigleRec);
    } else { seigleRec = 0; }
    
    if ("seigleStock" in localStorage) {
        seigleStock = localStorage.getItem("seigleStock");
        seigleStock = parseInt(seigleStock);
    } else { seigleStock = 0; }
    
    if ("recolteSeigleData" in localStorage) {
        nbRecolteSeigle = localStorage.getItem("recolteSeigleData");
        nbRecolteSeigle = parseInt(nbRecolteSeigle);
    } else { nbRecolteSeigle = 1; }
    
    if ("stockSeigleData" in localStorage) {
        nbStockSeigle = localStorage.getItem("stockSeigleData");
        nbStockSeigle = parseInt(nbRecolteSeigle);
    } else { nbStockSeigle = 1; }

    if ("fauxAcheteSAV" in localStorage) {
        fauxAchete = localStorage.getItem("fauxAcheteSAV");
    } else { fauxAchete = false; }
    
    if ("araireAcheteSAV" in localStorage) {
        araireAchete = localStorage.getItem("araireAcheteSAV");
    } else { araireAchete = false; }
    
    if ("charetteAcheteSAV" in localStorage) {
        charetteAchete = localStorage.getItem("charetteAcheteSAV");
    } else { charetteAchete = false; }
}

//affichage du titre
titreID.innerHTML = titre;

// Si la faux a été acheté, on modifie le texte et disable le bouton
if (fauxAchete) {
    achatFaux.innerHTML = "Acheté";
    $("#achatFaux").attr("disabled", "disabled");
} else {$("#achatAraire").attr("disabled", "disabled"); }
 
// Si l'araire a été acheté, on modifie le texte et disable le bouton
if (araireAchete) {
    achatAraire.innerHTML = "Acheté";
    $("#achatAraire").attr("disabled", "disabled");
}

if (charetteAchete) {
    achatCharette.innerHTML = "Acheté";
    $("#achatCharette").attr("disabled", "disabled");
    stockMultiplicateur.innerHTML = "X " + nbStockSeigle;
}

// Si on a pas assez de seigle => disable le bouton
if (seigleRec < (nbStockSeigle * 2)) {
    $("#ButtonStockSeigle").attr("disabled", "disabled");
}

if (seigleStock < 100) {
    $("#ButtonVendreSeigle").attr("disabled", "disabled");
}

recolteMultiplicateur.innerHTML = nbRecolteSeigle;
if (ecu >=2) {
argent.innerHTML = ecu + " écus";
}else{
argent.innerHTML = ecu + " écu";
}

if (titre === "métayer" && ecu >= 2) {
    $("#achatChamps").removeClass("hidden");
}

// Affichage des ressources
displayRess(seigleRec, 1);
displayRess(seigleStock, 2);



/* ---------- BUTTON --------- */


// --- Bouton Recolter Seigle ----
$("#ButtonRecSeigle").click(function () {
    recolterSeigle();
});
    
// --- Bouton stocker ---
$("#ButtonStockSeigle").click(function () {
    stockerSeigle();
});

// --- Bouton vendre ---
$("#ButtonVendreSeigle").click(function () {
    vendreSeigle();
});

// --- bouton achat champ ---
$("#achatChamps").click(function () {
    acheterChamps();
});


//-------------- ACHAT OUTILS -----------------

// BOUTON FAUX
$("#achatFaux").click(function () {
    if (seigleStock >= 50) {
            
        seigleStock -= 50;
        displayRess(seigleStock, 2);
        
        nbRecolteSeigle = 2;
        localStorage.setItem("recolteSeigleData", nbRecolteSeigle);

        $("#achatFaux").attr("disabled", "disabled");
        achatFaux.innerHTML = "Acheté";
        localStorage.setItem("fauxAcheteSAV", true);
        $("#achatAraire").removeAttr("disabled");

        recolteMultiplicateur.innerHTML = nbRecolteSeigle;
    }
});
$("#achatFaux").hover(function () {
    $("#achatFaux span").css("display", "inline");
},
function(){
    $("#achatFaux span").css("display", "none");
});   



// BOUTON ARAIRE
$("#achatAraire").click(function () {
    if (seigleStock >= 300) {
    
        seigleStock -= 300;
        displayRess(seigleStock, 2);

        nbRecolteSeigle = 4;
        localStorage.setItem("recolteSeigleData", nbRecolteSeigle);

        $("#achatAraire").attr("disabled", "disabled");
        achatAraire.innerHTML = "Acheté";
        localStorage.setItem("araireAcheteSAV", true);

        recolteMultiplicateur.innerHTML = nbRecolteSeigle;
    }
});
$("#achatAraire").hover(function () {
    $("#achatAraire span").css("display", "inline");
},
function(){
    $("#achatAraire span").css("display", "none");
});   



$("#achatCharette").click(function () {
    if (seigleStock >= 75) {
    
        seigleStock -= 75;
        displayRess(seigleStock, 2);
        
        nbStockSeigle = 2;
        localStorage.setItem("stockSeigleData", nbStockSeigle);
        
        $("#achatCharette").attr("disabled", "disabled");
        achatCharette.innerHTML = "Acheté";
        localStorage.setItem("charetteAcheteSAV", true);
        
        stockMultiplicateur.innerHTML = "X " + nbStockSeigle;
    }
});
$("#achatCharette").hover(function () {
    $("#achatCharette span").css("display", "inline");
},
function(){
    $("#achatCharette span").css("display", "none");
});   


// --- Bouton Reset ---
$("#reset").click(function () {
    var x = confirm("Etes-vous sûr de vouloir réinitialiser ?");
    if(x){
        reset();
        window.location = document.location;
    }

});




/* ------------- FONCTIONS ------------------ */

// DISPLAY RESSOURCES
function displayRess(ress, index) {  //pour afficher les ressources + mettre à jour la sauvegarde

/*
Index des ressources :
1 - Seigle recolté
2 - Seigle stocké
*/

    switch (index) {
        
        case 1:  //seigle
            recolteSeigleID.innerHTML = seigleRec;
            localStorage.setItem("seigleRec", seigleRec);
        break;
            
        case 2:
            stockSeigleID.innerHTML = seigleStock;
            localStorage.setItem("seigleStock", seigleStock);
        break;
        
        default:
            alert('Erreur de ressource');
    }
}


// RECOLTER SEIGLE
function recolterSeigle() {
    
    seigleRec += nbRecolteSeigle;
    
    displayRess(seigleRec, 1);
    
    if (titre === "métayer") {
        
        if (seigleRec >= (nbStockSeigle * 2)) {
            $("#ButtonStockSeigle").removeAttr("disabled");
        }
        
    } else { 
        
        if (seigleRec >= nbStockSeigle) {
            $("#ButtonStockSeigle").removeAttr("disabled");
        }
    }
}


// STOCKER SEIGLE
function stockerSeigle() {
    
    if (titre === "métayer") {
        
        if (seigleRec >= (nbStockSeigle * 2)) { //4
                
            seigleRec -= (nbStockSeigle * 2);
            seigleStock += nbStockSeigle;
                
            if (seigleRec < (nbStockSeigle * 2)) { // 4
                $("#ButtonStockSeigle").attr("disabled", "disabled");
            }
                    
            displayRess(seigleRec, 1);
            displayRess(seigleStock, 2);
                
        } else { $("#ButtonStockSeigle").attr("disabled", "disabled"); }
            
        
    } else {
        
        if (seigleRec >= nbStockSeigle) { //2
                
            seigleRec -= nbStockSeigle;
            seigleStock += nbStockSeigle;
                
            if (seigleRec < nbStockSeigle) { // 2
                $("#ButtonStockSeigle").attr("disabled", "disabled");
            }
                
            displayRess(seigleRec, 1);
            displayRess(seigleStock, 2);
                
        } else { $("#ButtonStockSeigle").attr("disabled", "disabled"); }
    
    }
  
    if (seigleStock >= 100) {
        $("#ButtonVendreSeigle").removeAttr("disabled");
    }
}


// VENDRE SEIGLE
function vendreSeigle() {
    if (seigleStock >= 100) {
        seigleStock -= 100;
        
        ++ecu;
        localStorage.setItem("argent", ecu);
        if (ecu >= 2) {
            argent.innerHTML = ecu + " écus";
        } else {
            argent.innerHTML = ecu + " écu";
        }
        
        displayRess(seigleStock, 2);
        
        if (titre === "métayer" && ecu >= 2) {
            $("#achatChamps").removeClass("hidden");
        }
    }
    
    if (seigleStock < 100) {
        $("#ButtonVendreSeigle").attr("disabled", "disabled");
    }
}


//ACHETER CHAMPS
function acheterChamps() {
    ecu -= 2;
    localStorage.setItem("argent", ecu);
    argent.innerHTML = ecu;
    
    titre = "laboureur";
    localStorage.setItem("titrePlayer", titre);
    titreID.innerHTML = titre;
    
    $("#achatChamps").addClass("hidden");
}
 

// RESET LOCAL STORAGE
function reset() {                            
    if (typeof localStorage !== 'undefined') {
        
        localStorage.removeItem("titrePlayer");
        
        localStorage.removeItem("argent");

        // ressources
        localStorage.removeItem("seigleRec");
        localStorage.removeItem("seigleStock");
        localStorage.removeItem("recolteSeigleData");
        localStorage.removeItem("stockSeigleData");
          
        localStorage.removeItem("fauxAcheteSAV");
        localStorage.removeItem("araireAcheteSAV");
        localStorage.removeItem("charetteAcheteSAV");
    }
    
}

