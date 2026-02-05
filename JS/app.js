document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {

            const nombre = btn.dataset.nombre;
            const precio = parseFloat(btn.dataset.precio);
            const ingredientes = btn.dataset.ingredientes;

            if (!ingredientes) {
                agregarAlCarrito(nombre, precio);
            } else {
                abrirModal(nombre, precio, ingredientes.split(","));
            }
        });
    });

});
