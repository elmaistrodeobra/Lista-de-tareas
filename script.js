let loteTela = {
    id: "",
    tipoFibra: "",
    kilogramos: 0,
    
    calcularAgua: function() {
        if (this.tipoFibra === 'algodon') {
            return this.kilogramos * 10000;
        } else if (this.tipoFibra === 'poliester') {
            return this.kilogramos * 300;
        }
        return 0; 
    }
};

document.getElementById("btnRegistrar").addEventListener("click", function() {
    registrarLote();
});

let registrarLote = function() {
    let id = document.getElementById("idLote").value;
    let fibra = document.getElementById("tipoFibra").value;
    let kilos = document.getElementById("kilogramos").value;

    if (id !== "" && kilos > 0) {
        loteTela.id = id;
        loteTela.tipoFibra = fibra;
        loteTela.kilogramos = parseFloat(kilos);

        let aguaConsumida = loteTela.calcularAgua();

        let loteGuardar = {
            id: loteTela.id,
            fibra: loteTela.tipoFibra,
            kilos: loteTela.kilogramos,
            agua: aguaConsumida
        };

        let historial = obtenerHistorial();
        historial.push(loteGuardar);
        localStorage.setItem("historialTextil", JSON.stringify(historial));

        document.getElementById("idLote").value = "";
        document.getElementById("kilogramos").value = "";

        actualizarDOM();
    } else {
        alert("Por favor, ingresa un ID válido y una cantidad de kilogramos mayor a 0.");
    }
}

let obtenerHistorial = function() {
    let datos = localStorage.getItem("historialTextil");
    if (datos) {
        return JSON.parse(datos);
    } else {
        return [];
    }
}

let actualizarDOM = function() {
    let historial = obtenerHistorial();
    let listaLotes = ""; 
    let consumoTotal = 0;

    for (let i = 0; i < historial.length; i++) {
        consumoTotal += historial[i].agua;
        
        let nombreFibra = "";
        if (historial[i].fibra === 'algodon') {
            nombreFibra = "Algodón";
        } else {
            nombreFibra = "Poliéster";
        }

        listaLotes += '<li>';
        listaLotes += '<span>ID: ' + historial[i].id + ' | ' + nombreFibra + ' (' + historial[i].kilos + 'kg) -> ' + historial[i].agua + ' L</span>';
        listaLotes += '<button class="btn-eliminar-lote" onclick="eliminarLote(' + i + ')">X</button>';
        listaLotes += '</li>';
    }

    document.getElementById("historialLotes").innerHTML = listaLotes;
    
    document.getElementById("consumoTotal").textContent = consumoTotal + " Litros";

    if (consumoTotal > 100000) {
        document.getElementById("consumoTotal").classList.add("peligro"); 
        document.getElementById("mensajeAlerta").classList.replace("oculto", "mostrar-alerta");
        if (!document.getElementById("mensajeAlerta").classList.contains("mostrar-alerta")) {
             document.getElementById("mensajeAlerta").classList.add("mostrar-alerta");
        }
    } else {
        document.getElementById("consumoTotal").classList.remove("peligro");
        document.getElementById("mensajeAlerta").classList.remove("mostrar-alerta");
        document.getElementById("mensajeAlerta").classList.add("oculto");
    }
}

let eliminarLote = function(indice) {
    let historial = obtenerHistorial();
    historial.splice(indice, 1);
    localStorage.setItem("historialTextil", JSON.stringify(historial));
    actualizarDOM();
}

actualizarDOM();