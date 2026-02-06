document.addEventListener("DOMContentLoaded", () => {

    // Seleccionamos todos los botones con la clase .add-to-cart
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {

            const nombre = btn.dataset.nombre;

            // ===============================================
            // 🔒 REGLA DE NEGOCIO: FECHAS COMBO PAREJA
            // ===============================================
            if (nombre === "Combo Pareja") { 
                const hoy = new Date();
                const mes = hoy.getMonth(); // Enero = 0, Febrero = 1
                const dia = hoy.getDate();

                // Validación: ¿Es Febrero (1) y el día está entre 10 y 20?
                const esFechaValida = (mes === 1) && (dia >= 10 && dia <= 20);

                if (!esFechaValida) {
                    alert("🚫 Lo sentimos.\n\nEl Combo Pareja solo está disponible del 10 al 20 de Febrero.");
                    return; // Detiene la ejecución aquí.
                }
            }
            // ===============================================


            // 1. CAPTURA DE DATOS DEL BOTÓN
            const carnesRaw = btn.dataset.carnes;           // Ej: "Puerco:34,Res:40"
            const ingredientesRaw = btn.dataset.ingredientes; // Ej: "Cebolla,Cilantro"
            const precioBase = parseFloat(btn.dataset.precio); // Ej: 25 (para bebidas)

            // 2. DECISIÓN: ¿NECESITA MODAL?
            // Si tiene carnes O ingredientes definidos, es un producto configurable.
            const requiereModal = (carnesRaw && carnesRaw.trim().length > 0) || 
                                  (ingredientesRaw && ingredientesRaw.trim().length > 0);

            if (requiereModal) {
                // === CAMINO A: ABRIENDO MODAL (Tacos, Gorditas, etc) ===
                
                // Procesamos las carnes en un objeto { Puerco: 34, Res: 40 }
                const carnes = {};
                if (carnesRaw) {
                    carnesRaw.split(",").forEach(c => {
                        const parts = c.split(":");
                        if (parts.length === 2) {
                            carnes[parts[0].trim()] = parseFloat(parts[1]);
                        }
                    });
                }

                // Procesamos los ingredientes en un array ["Cebolla", "Cilantro"]
                const ingredientes = ingredientesRaw ? ingredientesRaw.split(",") : [];

                // Llamamos a la función en modal.js
                // Pasamos precioBase || 0 por seguridad, aunque el modal usará el precio de la carne
                abrirModal(nombre, carnes, precioBase || 0, ingredientes);

            } else {
                // === CAMINO B: DIRECTO AL CARRITO (Bebidas, Papas solas) ===
                
                if (!isNaN(precioBase)) {
                    // Agregamos sin ingredientes extra
                    agregarAlCarrito(nombre, precioBase, []);
                    
                    // Opcional: Podrías poner un Toast o alerta pequeña aquí
                    // console.log("Producto agregado directo: " + nombre);
                } else {
                    console.error("Error: El producto " + nombre + " no tiene precio definido en el HTML.");
                }
            }
        });
    });

    const carrito = document.getElementById("cart-container");

    carrito.addEventListener("wheel", (e) => {
        e.stopPropagation();
    }, { passive: true });

    carrito.addEventListener("touchmove", (e) => {
        e.stopPropagation();
    }, { passive: true });

    // 🔒 BLOQUEO REAL DEL SCROLL
    carrito.addEventListener("mouseenter", () => {
        document.body.style.overflow = "hidden";
    });

    carrito.addEventListener("mouseleave", () => {
        document.body.style.overflow = "";
    });

    carrito.addEventListener("touchstart", () => {
        document.body.style.overflow = "hidden";
    });

    carrito.addEventListener("touchend", () => {
        document.body.style.overflow = "";
    });
});