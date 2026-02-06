let carrito = [];

// Agregamos el 4to parámetro: cantidad (por defecto 1 para bebidas que no usan modal)
function agregarAlCarrito(nombre, precio, ingredientes = [], cantidad = 1) {

    document.body.classList.add("ocultar-flotantes");

    const key = ingredientes.sort().join(",");
    const existente = carrito.find(p => p.nombre === nombre && p.key === key);

    if (existente) {
        // Sumamos la cantidad que seleccionó el usuario
        existente.cantidad += cantidad;
    } else {
        // Creamos el producto con la cantidad seleccionada
        carrito.push({ nombre, precio, ingredientes, key, cantidad: cantidad });
    }

    actualizarUI();
}
function actualizarUI() {
    const lista = document.getElementById("cart-list");
    const totalSpan = document.getElementById("cart-total");
    const contenedor = document.getElementById("cart-container");

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((item, i) => {
        total += item.precio * item.cantidad;

        const extras = item.ingredientes.length
            ? `<small>(${item.ingredientes.join(", ")})</small>`
            : "";

        const li = document.createElement("li");
        li.className = "carrito-item"; // Agregamos clase para estilo
        li.innerHTML = `
            <div class="info-producto">
                <span class="cantidad-badge">${item.cantidad}x</span>
                <div class="detalles">
                    <strong>${item.nombre}</strong>
                    ${extras ? `<div class="subtexto">${extras}</div>` : ''}
                </div>
            </div>
            <div class="acciones-producto">
                <span class="precio-item">$${item.precio * item.cantidad}</span>
                <button class="btn-eliminar" onclick="eliminar(${i})">✕</button>
            </div>
        `;
        lista.appendChild(li);
    });

    totalSpan.textContent = total;
    contenedor.style.display = carrito.length ? "flex" : "none";
}

function eliminar(i) {
    carrito[i].cantidad > 1 ? carrito[i].cantidad-- : carrito.splice(i, 1);
    actualizarUI();
}

function vaciarCarrito() {
    if (confirm("¿Vaciar pedido?")) {
        carrito = [];
        actualizarUI();
    }
}

function cerrarCarrito() {
    document.body.classList.remove("ocultar-flotantes");
    document.getElementById("cart-container").style.display = "none";
}

function enviarWhatsApp() {
    let msg = "¡Hola Tacos Yiyo! 🌮\n\n";

    carrito.forEach(p => {
        const extras = p.ingredientes.length ? ` (${p.ingredientes.join(", ")})` : "";
        msg += `• ${p.cantidad}x ${p.nombre}${extras}\n`;
    });

    msg += `\nTotal: $${document.getElementById("cart-total").textContent}`;

    window.open(
        `https://wa.me/526871451508?text=${encodeURIComponent(msg)}`,
        "_blank"
    );
}
