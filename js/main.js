/* ============================================
   Devnex — main.js
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
    /* Manejo del menú desplegable para dispositivos móviles */
    const botonMenu = document.getElementById("mobileToggle");
    const menuMovil = document.getElementById("mobileMenu");

    if (botonMenu && menuMovil) {
        botonMenu.addEventListener("click", () => {
            menuMovil.classList.toggle("open");
            botonMenu.classList.toggle("active");
        });

        menuMovil.querySelectorAll("a").forEach((enlace) =>
            enlace.addEventListener("click", () => {
                menuMovil.classList.remove("open");
                botonMenu.classList.remove("active");
            }),
        );
    }

    /* Control del carrusel de proyectos y casos de éxito */
    const diapositivas = document.querySelectorAll(".slide");
    const botonPrevio = document.getElementById("prevBtn");
    const botonSiguiente = document.getElementById("nextBtn");

    if (diapositivas.length > 0) {
        let indiceActual = 0;

        function mostrarDiapositiva(n) {
            diapositivas[indiceActual].classList.remove("active");
            indiceActual = (n + diapositivas.length) % diapositivas.length;
            diapositivas[indiceActual].classList.add("active");
        }

        botonPrevio?.addEventListener("click", () =>
            mostrarDiapositiva(indiceActual - 1),
        );
        botonSiguiente?.addEventListener("click", () =>
            mostrarDiapositiva(indiceActual + 1),
        );

        setInterval(() => mostrarDiapositiva(indiceActual + 1), 5000);
    }

    /* Sistema de selección de servicios y barra de resumen */
    const tarjetas = document.querySelectorAll(".service-card");
    const barraCarrito = document.getElementById("cartBar");
    const contadorCarrito = document.getElementById("cartCount");
    const listaServiciosVisual = document.getElementById("cartServices");

    if (tarjetas.length > 0 && barraCarrito) {
        function actualizarCarrito() {
            const tarjetasSeleccionadas = document.querySelectorAll(
                ".service-card.selected",
            );
            const cantidad = tarjetasSeleccionadas.length;

            if (contadorCarrito) {
                contadorCarrito.textContent =
                    cantidad === 1
                        ? "1 servicio seleccionado"
                        : `${cantidad} servicios seleccionados`;
            }

            if (listaServiciosVisual) {
                listaServiciosVisual.innerHTML = "";
                tarjetasSeleccionadas.forEach((tarjeta) => {
                    const nombre =
                        tarjeta.querySelector("h3")?.textContent || "Servicio";
                    const etiqueta = document.createElement("span");
                    etiqueta.className = "cart-tag";
                    etiqueta.textContent = nombre;
                    listaServiciosVisual.appendChild(etiqueta);
                });
            }

            barraCarrito.classList.toggle("visible", cantidad > 0);
        }

        tarjetas.forEach((tarjeta) => {
            tarjeta.addEventListener("click", () => {
                tarjeta.classList.toggle("selected");
                actualizarCarrito();
            });
        });
    }

    /* Lógica para pre-llenar checkboxes en la página de contacto */
    const parametrosUrl = new URLSearchParams(window.location.search);
    const serviciosUrl = parametrosUrl.get("servicios");

    if (serviciosUrl) {
        const listaDesdeUrl = serviciosUrl.split(",").map((s) => s.trim());
        document.querySelectorAll(".svc-option input").forEach((input) => {
            if (listaDesdeUrl.includes(input.value)) {
                input.checked = true;
                input.closest(".svc-option").classList.add("checked");
            }
        });
    }

    /* Animaciones de aparición suave al bajar con el scroll */
    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("in-view");
                    observador.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.1 },
    );

    const elementosParaAnimar = document.querySelectorAll(
        ".section, .numbers-section, .img-scroll-wrap, .marquee-wrap, .why-card, .step, .service-card, .about-cta-inner",
    );

    elementosParaAnimar.forEach((el) => observador.observe(el));
});

/* Envío de los servicios seleccionados a la página de contacto */
function irAContacto() {
    const seleccionados = [];
    document.querySelectorAll(".service-card.selected").forEach((tarjeta) => {
        const nombre = tarjeta.querySelector("h3")?.textContent;
        if (nombre) seleccionados.push(nombre);
    });

    const parametros = seleccionados.join(",");
    const urlDestino = "contactar.html";

    window.location.href = seleccionados.length
        ? `${urlDestino}?servicios=${encodeURIComponent(parametros)}`
        : urlDestino;
}

/* Lógica para gestionar las opciones del formulario de contacto */
const opcionesServicio = document.querySelectorAll(".svc-option input");

if (opcionesServicio.length > 0) {
    // Manejo de clics manuales en los checkboxes
    opcionesServicio.forEach((input) => {
        input.addEventListener("change", function () {
            this.closest(".svc-option").classList.toggle(
                "checked",
                this.checked,
            );
        });
    });

    // Marcado automático basado en la URL
    const parametrosUrl = new URLSearchParams(window.location.search);
    const serviciosUrl = parametrosUrl.get("servicios");

    if (serviciosUrl) {
        const listaDesdeUrl = serviciosUrl.split(",").map((s) => s.trim());
        opcionesServicio.forEach((input) => {
            if (listaDesdeUrl.includes(input.value)) {
                input.checked = true;
                input.closest(".svc-option").classList.add("checked");
            }
        });
    }
}
