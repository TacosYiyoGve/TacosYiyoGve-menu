let productoTemporal = null;

const modal = document.getElementById("modal-ingredientes");
const listaOpciones = document.getElementById("lista-opciones");
const tituloModal = document.getElementById("modal-titulo");
const btnConfirmar = document.getElementById("btn-confirmar-add");

function abrirModal(nombre, precio, ingredientes) {
    productoTemporal = { nombre, precio };
    tituloModal.textContent = nombre;
    listaOpciones.innerHTML = "";

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

function cerrarModal() {
    modal.style.display = "none";
    productoTemporal = null;
}

btnConfirmar.addEventListener("click", () => {
    if (!productoTemporal) return;

    const seleccionados = [];
    listaOpciones.querySelectorAll("input:checked")
        .forEach(c => seleccionados.push(c.value));

    agregarAlCarrito(
        productoTemporal.nombre,
        productoTemporal.precio,
        seleccionados
    );

    cerrarModal();
});
