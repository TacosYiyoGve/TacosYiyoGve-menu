let productoTemporal = null;
let cantidadActual = 1; // Variable para el contador

const modal = document.getElementById("modal-ingredientes");
const tituloModal = document.getElementById("modal-titulo");
const listaCarnes = document.getElementById("lista-carnes");
const tituloCarnes = document.getElementById("titulo-carnes");
const listaVariantes = document.getElementById("lista-variantes");
const listaOpciones = document.getElementById("lista-opciones");
const spanCantidad = document.getElementById("cantidad-numero"); // El número visible

const btnConfirmar = document.getElementById("btn-confirmar-add");

// --- FUNCIÓN PARA CONTROLAR LOS BOTONES + Y - ---
window.cambiarCantidad = function(cambio) {
    cantidadActual += cambio;
    if (cantidadActual < 1) cantidadActual = 1; // No bajar de 1
    if (cantidadActual > 20) cantidadActual = 20; // Límite opcional
    spanCantidad.textContent = cantidadActual;
};

function abrirModal(nombre, carnes, precioBase, ingredientes) {
    
    // Reseteamos la cantidad a 1 cada vez que se abre el modal
    cantidadActual = 1;
    spanCantidad.textContent = "1";

    productoTemporal = { 
        nombre, 
        carnes, 
        precioBase, 
        ingredientesOriginales: [...ingredientes] 
    };

    tituloModal.textContent = nombre;
    listaCarnes.innerHTML = "";
    listaVariantes.innerHTML = "";
    listaOpciones.innerHTML = "";

    // 1. CARNES
    const tieneCarnes = Object.keys(carnes).length > 0;
    if (tieneCarnes) {
        tituloCarnes.style.display = "block";
        let contador = 0;
        for (const [tipo, precio] of Object.entries(carnes)) {
            const isChecked = contador === 0 ? "checked" : "";
            listaCarnes.innerHTML += `
                <label class="ingredient-option">
                    <input type="radio" name="seleccion-carne" value="${tipo}" data-precio="${precio}" ${isChecked}>
                    <span>${tipo} - <b>$${precio}</b></span>
                </label>
            `;
            contador++;
        }
    } else {
        tituloCarnes.style.display = "none";
    }

    // 2. VARIANTES
    const nombreNormalizado = nombre.toLowerCase().trim();
    if (nombre === "Mixta Sencilla") {
        renderizarVariantes("Tipo de Tortilla", [
            { label: "Maíz", valor: "Maíz" },
            { label: "Harina", valor: "Harina" }
        ]);
    }
    else if (nombreNormalizado.includes("gordita") || nombreNormalizado.includes("gordichilena")) {
        renderizarVariantes("Tipo de Tapa", [
            { label: "Maíz", valor: "Tapa Maíz" },
            { label: "Harina", valor: "Tapa Harina" }
        ]);
    }

    // 3. INGREDIENTES
    ingredientes.forEach(ing => {
        listaOpciones.innerHTML += `
            <label class="ingredient-option">
                <input type="checkbox" value="${ing}" checked>
                <span>${ing}</span>
            </label>
        `;
    });

    modal.style.display = "flex";
}

function renderizarVariantes(titulo, opciones) {
    let html = `<p class="modal-subtitle">${titulo}</p>`;
    opciones.forEach((op, i) => {
        const checked = i === 0 ? "checked" : ""; 
        html += `
            <label class="ingredient-option">
                <input type="radio" name="seleccion-variante" value="${op.valor}" ${checked}>
                <span>${op.label}</span>
            </label>
        `;
    });
    listaVariantes.innerHTML = html;
}

function cerrarModal() {
    modal.style.display = "none";
    productoTemporal = null;
}

btnConfirmar.addEventListener("click", () => {
    if (!productoTemporal) return;

    let precioFinal = productoTemporal.precioBase;
    let nombreFinal = productoTemporal.nombre;

    // A. CARNE
    const radioCarne = document.querySelector("input[name='seleccion-carne']:checked");
    if (radioCarne) {
        nombreFinal += ` (${radioCarne.value})`; 
        precioFinal = parseFloat(radioCarne.dataset.precio);
    }

    // B. VARIANTE
    const radioVariante = document.querySelector("input[name='seleccion-variante']:checked");
    if (radioVariante) {
        nombreFinal += ` - ${radioVariante.value}`;
    }

    // C. INGREDIENTES (Lógica Negativa)
    const originales = productoTemporal.ingredientesOriginales;
    const seleccionados = [];
    listaOpciones.querySelectorAll("input:checked").forEach(c => seleccionados.push(c.value));
    const eliminados = originales.filter(ing => !seleccionados.includes(ing));

    let textoPersonalizacion = "";
    if (originales.length === 0) textoPersonalizacion = ""; 
    else if (seleccionados.length === 0) textoPersonalizacion = "Natural";
    else if (eliminados.length === 0) textoPersonalizacion = "Con Todo";
    else textoPersonalizacion = "Sin: " + eliminados.join(", ");

    const arrayFinal = textoPersonalizacion ? [textoPersonalizacion] : [];

    // D. ENVIAR AL CARRITO (¡AHORA CON CANTIDAD!)
    agregarAlCarrito(
        nombreFinal,
        precioFinal,
        arrayFinal,
        cantidadActual // <--- AQUÍ ENVIAMOS EL NÚMERO
    );

    cerrarModal();
});