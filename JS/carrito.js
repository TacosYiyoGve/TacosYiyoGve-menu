let carrito = [];

function agregarAlCarrito(nombre, precio, ingredientes = []) {

    const key = ingredientes.sort().join(",");
    const existente = carrito.find(p => p.nombre === nombre && p.key === key);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ nombre, precio, ingredientes, key, cantidad: 1 });
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
        li.innerHTML = `
            <div>
                <strong>${item.cantidad}x ${item.nombre}</strong><br>${extras}
            </div>
            <span>$${item.precio * item.cantidad}</span>
            <button onclick="eliminar(${i})">✕</button>
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