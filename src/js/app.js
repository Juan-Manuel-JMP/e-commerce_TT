/* =========================================================
   URBAN SHOP - JAVASCRIPT + SWEETALERT2
   ========================================================= */
const ENVIO_GRATIS_DESDE = 100000;
const COSTO_ENVIO = 5000;
const STORAGE_KEY = "urbanShopCarrito";

/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

// Menú
const botonMenu = document.getElementById("menu-hamburguesa");
const nav = document.getElementById("nav");

// Carrito
const botonAbrirCarrito = document.getElementById("abrir-carrito");
const botonCerrarCarrito = document.getElementById("cerrar-carrito");

const carrito = document.getElementById("carrito");
const overlayCarrito = document.getElementById("overlay-carrito");

const carritoProductos =
    document.getElementById("carrito-productos");

const contadorCarrito =
    document.getElementById("contador-carrito");

const subtotalElemento =
    document.getElementById("subtotal");

const envioElemento =
    document.getElementById("envio");

const totalElemento =
    document.getElementById("total");

const envioInfo =
    document.getElementById("envio-info");

const botonVaciarCarrito =
    document.getElementById("vaciar-carrito");

const botonFinalizarCompra =
    document.getElementById("finalizar-compra");

// Formulario
const formularioContacto =
    document.getElementById("formulario-contacto");

/* =========================================================
   ESTADO
========================================================= */
let carritoItems = cargarCarrito();

/* =========================================================
   CONFIGURACIÓN SWEETALERT2
========================================================= */
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,

    didOpen: (toast) => {

        toast.addEventListener(
            "mouseenter",
            Swal.stopTimer
        );

        toast.addEventListener(
            "mouseleave",
            Swal.resumeTimer
        );

    }
});

/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    inicializarMenu();
    inicializarCarrito();
    inicializarProductos();
    inicializarFormulario();
    inicializarNavegacion();
    actualizarCarrito();
});

/* =========================================================
   MENÚ HAMBURGUESA
========================================================= */
function inicializarMenu() {

    if (!botonMenu || !nav) {
        return;
    }

    botonMenu.addEventListener("click", () => {

        const menuAbierto =
            nav.classList.toggle("activo");

        botonMenu.classList.toggle(
            "activo",
            menuAbierto
        );

        botonMenu.setAttribute(
            "aria-expanded",
            menuAbierto
        );

        botonMenu.setAttribute(
            "aria-label",
            menuAbierto
                ? "Cerrar menú"
                : "Abrir menú"
        );

    });

    const enlacesMenu =
        nav.querySelectorAll("a");


    enlacesMenu.forEach(enlace => {

        enlace.addEventListener(
            "click",
            cerrarMenu
        );

    });

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape" &&
                nav.classList.contains("activo")
            ) {

                cerrarMenu();

            }

        }
    );

}

function cerrarMenu() {

    if (!nav || !botonMenu) {
        return;
    }

    nav.classList.remove("activo");

    botonMenu.classList.remove("activo");

    botonMenu.setAttribute(
        "aria-expanded",
        "false"
    );

    botonMenu.setAttribute(
        "aria-label",
        "Abrir menú"
    );

}

/* =========================================================
   CARRITO - EVENTOS
========================================================= */
function inicializarCarrito() {

    if (botonAbrirCarrito) {

        botonAbrirCarrito.addEventListener(
            "click",
            abrirCarrito
        );

    }

    if (botonCerrarCarrito) {

        botonCerrarCarrito.addEventListener(
            "click",
            cerrarCarrito
        );

    }

    if (overlayCarrito) {

        overlayCarrito.addEventListener(
            "click",
            cerrarCarrito
        );

    }

    if (botonVaciarCarrito) {

        botonVaciarCarrito.addEventListener(
            "click",
            vaciarCarrito
        );

    }

    if (botonFinalizarCompra) {

        botonFinalizarCompra.addEventListener(
            "click",
            finalizarCompra
        );

    }

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape" &&
                carrito.classList.contains("activo")
            ) {

                cerrarCarrito();

            }

        }
    );

}

/* =========================================================
   ABRIR CARRITO
========================================================= */
function abrirCarrito() {

    if (!carrito || !overlayCarrito) {
        return;
    }

    carrito.classList.add("activo");
    overlayCarrito.classList.add("activo");
    document.body.classList.add(
        "carrito-abierto"
    );

}

/* =========================================================
   CERRAR CARRITO
========================================================= */
function cerrarCarrito() {

    if (!carrito || !overlayCarrito) {
        return;
    }

    carrito.classList.remove("activo");
    overlayCarrito.classList.remove("activo");
    document.body.classList.remove(
        "carrito-abierto"
    );

}

/* =========================================================
   PRODUCTOS
========================================================= */
function inicializarProductos() {

    const botonesAgregar =
        document.querySelectorAll(
            ".agregar-producto"
        );

    botonesAgregar.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                const producto =
                    obtenerProductoDesdeBoton(
                        boton
                    );


                if (!producto) {

                    mostrarError(
                        "No se pudo agregar el producto."
                    );

                    return;
                }

                agregarAlCarrito(producto);

            }
        );

    });

}

/* =========================================================
   OBTENER PRODUCTO
========================================================= */
function obtenerProductoDesdeBoton(boton) {

    const card =
        boton.closest(".producto-card");


    if (!card) {
        return null;
    }

    const id =
        boton.dataset.id;

    const nombre =
        boton.dataset.nombre;

    const precio =
        Number(boton.dataset.precio);

    const imagen =
        boton.dataset.imagen ||
        card.dataset.imagen ||
        card.querySelector("img")?.src ||
        "";

    if (
        !id ||
        !nombre ||
        Number.isNaN(precio)
    ) {

        return null;
    }

    return {

        id: String(id),
        nombre,
        precio,
        imagen,
        cantidad: 1
    };

}

/* =========================================================
   AGREGAR AL CARRITO
========================================================= */
function agregarAlCarrito(producto) {

    const productoExistente =
        carritoItems.find(
            item => item.id === producto.id
        );

    if (productoExistente) {

        productoExistente.cantidad++;

        mostrarToast(
            "success",
            "Producto actualizado",
            `${producto.nombre} ahora tiene ${productoExistente.cantidad} unidades.`
        );

    } else {

        carritoItems.push(producto);

        mostrarToast(
            "success",
            "¡Producto agregado!",
            producto.nombre
        );

    }

    guardarCarrito();
    actualizarCarrito();
    abrirCarrito();
}

/* =========================================================
   ACTUALIZAR CARRITO
========================================================= */
function actualizarCarrito() {
    renderizarCarrito();
    actualizarContador();
    actualizarResumen();
    guardarCarrito();
}


/* =========================================================
   RENDERIZAR CARRITO
========================================================= */
function renderizarCarrito() {
    if (!carritoProductos) {
        return;
    }

    if (carritoItems.length === 0) {

        carritoProductos.innerHTML = `

            <div class="carrito-vacio">

                <div class="carrito-vacio-icono">
                    🛒
                </div>

                <h3>
                    Tu carrito está vacío
                </h3>

                <p>
                    Agregá algunos productos
                    para comenzar tu compra.
                </p>

            </div>

        `;
        return;
    }

    carritoProductos.innerHTML =
        carritoItems
            .map(crearHTMLProductoCarrito)
            .join("");

    /* -----------------------------------------
       SUMAR
    ----------------------------------------- */
    const botonesMas =
        carritoProductos.querySelectorAll(
            ".cantidad-mas"
        );

    botonesMas.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                cambiarCantidad(
                    boton.dataset.id,
                    1
                );

            }
        );

    });

    /* -----------------------------------------
       RESTAR
    ----------------------------------------- */

    const botonesMenos =
        carritoProductos.querySelectorAll(
            ".cantidad-menos"
        );

    botonesMenos.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                cambiarCantidad(
                    boton.dataset.id,
                    -1
                );

            }
        );

    });

    /* -----------------------------------------
       ELIMINAR
    ----------------------------------------- */

    const botonesEliminar =
        carritoProductos.querySelectorAll(
            ".eliminar-producto"
        );

    botonesEliminar.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                eliminarDelCarrito(
                    boton.dataset.id
                );

            }
        );

    });

}

/* =========================================================
   HTML PRODUCTO CARRITO
========================================================= */
function crearHTMLProductoCarrito(item) {

    const precio =
        formatearPrecio(item.precio);

    const subtotalProducto =
        formatearPrecio(
            item.precio * item.cantidad
        );

    return `

        <div class="carrito-item">

            <div class="carrito-item-imagen">

                <img
                    src="${item.imagen}"
                    alt="${item.nombre}"
                >

            </div>

            <div class="carrito-item-info">

                <h3>
                    ${item.nombre}
                </h3>

                <p class="carrito-item-precio">
                    ${precio}
                </p>


                <div class="carrito-item-bottom">

                    <div class="cantidad">

                        <button
                            type="button"
                            class="cantidad-menos"
                            data-id="${item.id}"
                            aria-label="Disminuir cantidad"
                        >
                            −
                        </button>


                        <span>
                            ${item.cantidad}
                        </span>


                        <button
                            type="button"
                            class="cantidad-mas"
                            data-id="${item.id}"
                            aria-label="Aumentar cantidad"
                        >
                            +
                        </button>

                    </div>


                    <strong>
                        ${subtotalProducto}
                    </strong>

                </div>


                <button
                    type="button"
                    class="eliminar-producto"
                    data-id="${item.id}"
                >
                    Eliminar
                </button>

            </div>

        </div>

    `;

}

/* =========================================================
   CAMBIAR CANTIDAD
========================================================= */
function cambiarCantidad(id, cambio) {
    const producto =
        carritoItems.find(
            item => item.id === String(id)
        );

    if (!producto) {
        return;
    }

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {

        eliminarDelCarrito(id);

        return;
    }

    actualizarCarrito();

}

/* =========================================================
   ELIMINAR DEL CARRITO
========================================================= */
async function eliminarDelCarrito(id) {

    const producto =
        carritoItems.find(
            item => item.id === String(id)
        );

    if (!producto) {
        return;
    }

    const resultado =
        await Swal.fire({

            title: "¿Eliminar producto?",

            text:
                `"${producto.nombre}" será eliminado del carrito.`,

            icon: "warning",

            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#111",
            reverseButtons: true

        });

    if (!resultado.isConfirmed) {
        return;
    }

    carritoItems =
        carritoItems.filter(
            item => item.id !== String(id)
        );

    actualizarCarrito();

    mostrarToast(
        "success",
        "Producto eliminado",
        producto.nombre
    );

}

/* =========================================================
   VACIAR CARRITO
========================================================= */
async function vaciarCarrito() {
    if (carritoItems.length === 0) {
        mostrarToast(
            "info",
            "Carrito vacío",
            "No hay productos para eliminar."
        );

        return;
    }

    const resultado =
        await Swal.fire({

            title: "¿Vaciar carrito?",
            text:
                "Se eliminarán todos los productos.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText:
                "Sí, vaciar carrito",
            cancelButtonText:
                "Cancelar",
            confirmButtonColor:
                "#d33",
            cancelButtonColor:
                "#111",
            reverseButtons:
                true
        });

    if (!resultado.isConfirmed) {
        return;
    }

    carritoItems = [];

    actualizarCarrito();

    mostrarToast(
        "success",
        "Carrito vacío",
        "Todos los productos fueron eliminados."
    );

}

/* =========================================================
   CONTADOR
========================================================= */
function actualizarContador() {

    if (!contadorCarrito) {
        return;
    }

    const cantidadTotal =
        carritoItems.reduce(
            (total, item) => {

                return total + item.cantidad;
            },
            0
        );

    contadorCarrito.textContent =
        cantidadTotal;

    contadorCarrito.classList.add(
        "actualizado"
    );

    setTimeout(() => {
        contadorCarrito.classList.remove(
            "actualizado"
        );

    }, 300);

}

/* =========================================================
   RESUMEN
========================================================= */
function actualizarResumen() {
    const subtotal =
        carritoItems.reduce(
            (total, item) => {

                return total +
                    item.precio *
                    item.cantidad;

            },
            0
        );

    let costoEnvio = 0;

    if (
        subtotal > 0 &&
        subtotal < ENVIO_GRATIS_DESDE
    ) {

        costoEnvio =
            COSTO_ENVIO;

    }

    const total =
        subtotal + costoEnvio;

    if (subtotalElemento) {

        subtotalElemento.textContent =
            formatearPrecio(subtotal);
    }

    if (envioElemento) {

        envioElemento.textContent =
            costoEnvio === 0

                ? subtotal > 0
                    ? "GRATIS"
                    : "$0"

                : formatearPrecio(
                    costoEnvio
                );

    }

    if (totalElemento) {

        totalElemento.textContent =
            formatearPrecio(total);

    }

    actualizarMensajeEnvio(subtotal);

}

/* =========================================================
   ENVÍO GRATIS
========================================================= */
function actualizarMensajeEnvio(subtotal) {

    if (!envioInfo) {
        return;
    }

    if (subtotal === 0) {

        envioInfo.innerHTML =
            "🚚 Envío gratis desde $100.000";

        return;
    }

    if (
        subtotal >= ENVIO_GRATIS_DESDE
    ) {

        envioInfo.innerHTML =
            "🎉 ¡Tenés envío gratis!";

        return;
    }

    const falta =
        ENVIO_GRATIS_DESDE -
        subtotal;


    envioInfo.innerHTML = `
        🚚 Te faltan
        <strong>
            ${formatearPrecio(falta)}
        </strong>
        para tener envío gratis.

    `;

}

/* =========================================================
   FORMATEAR PRECIO
========================================================= */
function formatearPrecio(valor) {
    return new Intl.NumberFormat(
        "es-AR",
        {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }
    ).format(valor);

}

/* =========================================================
   LOCAL STORAGE
========================================================= */
function guardarCarrito() {
    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(carritoItems)
        );

    } catch (error) {

        mostrarError(
            "No se pudo guardar el carrito."
        );

    }

}

function cargarCarrito() {
    try {

        const carritoGuardado =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!carritoGuardado) {
            return [];
        }

        const carritoParseado =
            JSON.parse(
                carritoGuardado
            );


        if (
            !Array.isArray(
                carritoParseado
            )
        ) {

            return [];

        }

        return carritoParseado;

    } catch (error) {

        return [];

    }

}

/* =========================================================
   SWEETALERT - TOAST
========================================================= */
function mostrarToast(
    icono,
    titulo,
    texto = ""
) {

    Toast.fire({

        icon: icono,
        title: titulo,
        text: texto

    });

}

/* =========================================================
   SWEETALERT - ERROR
========================================================= */
function mostrarError(
    mensaje
) {

    Swal.fire({

        icon: "error",
        title: "Ocurrió un error",
        text: mensaje,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#111"

    });

}

/* =========================================================
   FINALIZAR COMPRA
========================================================= */
async function finalizarCompra() {
    if (carritoItems.length === 0) {
        Swal.fire({
            icon: "info",
            title: "Tu carrito está vacío",
            text:
                "Agregá al menos un producto antes de finalizar la compra.",
            confirmButtonText:
                "Ver productos",
            confirmButtonColor:
                "#ffb703",
            color:
                "#111"

        }).then(() => {

            cerrarCarrito();

            document
                .getElementById("productos")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        });

        return;
    }

    const subtotal =
        carritoItems.reduce(
            (total, item) => {

                return total +
                    item.precio *
                    item.cantidad;

            },
            0
        );

    const envio =
        subtotal >= ENVIO_GRATIS_DESDE
            ? 0
            : COSTO_ENVIO;

    const total =
        subtotal + envio;

    const productosHTML =
        carritoItems
            .map(item => `

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        gap:15px;
                        padding:8px 0;
                        border-bottom:1px solid #eee;
                        text-align:left;
                    "
                >

                    <span>
                        ${item.nombre}
                        × ${item.cantidad}
                    </span>

                    <strong>
                        ${formatearPrecio(
                            item.precio *
                            item.cantidad
                        )}
                    </strong>

                </div>

            `)
            .join("");

    const resultado =
        await Swal.fire({

            title:
                "Resumen de tu compra",

            html: `

                <div
                    style="
                        max-height:250px;
                        overflow-y:auto;
                        margin-bottom:15px;
                    "
                >
                    ${productosHTML}
                </div>


                <div
                    style="
                        text-align:left;
                        line-height:1.8;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                        "
                    >
                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${formatearPrecio(
                                subtotal
                            )}
                        </strong>
                    </div>


                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                        "
                    >
                        <span>
                            Envío
                        </span>

                        <strong>
                            ${
                                envio === 0
                                    ? "GRATIS"
                                    : formatearPrecio(
                                        envio
                                    )
                            }
                        </strong>
                    </div>


                    <hr>

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            font-size:1.2rem;
                        "
                    >
                        <strong>
                            Total
                        </strong>

                        <strong>
                            ${formatearPrecio(
                                total
                            )}
                        </strong>
                    </div>

                </div>

            `,

            showCancelButton:
                true,

            confirmButtonText:
                "Confirmar compra",

            cancelButtonText:
                "Seguir comprando",

            confirmButtonColor:
                "#ffb703",

            cancelButtonColor:
                "#111",

            color:
                "#111",

            reverseButtons:
                true

        });


    if (!resultado.isConfirmed) {
        return;
    }

    /* -----------------------------------------
       CONFIRMACIÓN
    ----------------------------------------- */
    await Swal.fire({

        icon: "success",

        title:
            "¡Compra realizada!",

        text:
            "Gracias por comprar en Urban Shop.",

        confirmButtonText:
            "Aceptar",

        confirmButtonColor:
            "#111"

    });

    // Vaciar carrito después de confirmar
    carritoItems = [];
    actualizarCarrito();
    cerrarCarrito();

}

/* =========================================================
   FORMULARIO DE CONTACTO
========================================================= */
function inicializarFormulario() {

    if (!formularioContacto) {
        return;
    }

    formularioContacto.addEventListener(
        "submit",
        manejarEnvioFormulario
    );

}

function manejarEnvioFormulario(evento) {
    const nombre =
        document.getElementById("nombre");
    const email =
        document.getElementById("email");
    const mensaje =
        document.getElementById("mensaje");

    if (
        !nombre ||
        !email ||
        !mensaje
    ) {

        return;
    }

    const nombreValor =
        nombre.value.trim();
    const emailValor =
        email.value.trim();
    const mensajeValor =
        mensaje.value.trim();

    if (!nombreValor) {

        evento.preventDefault();
        Swal.fire({
            icon: "warning",
            title: "Falta tu nombre",
            text:
                "Por favor ingresá tu nombre.",

            confirmButtonColor:
                "#111"

        }).then(() => {

            nombre.focus();

        });

        return;

    }

    if (!emailValor) {

        evento.preventDefault();

        Swal.fire({
            icon: "warning",
            title: "Falta tu email",
            text:
                "Por favor ingresá tu dirección de email.",
            confirmButtonColor:
                "#111"

        }).then(() => {

            email.focus();

        });

        return;

    }


    if (!validarEmail(emailValor)) {
        evento.preventDefault();
        Swal.fire({

            icon: "error",
            title: "Email inválido",
            text:
                "Ingresá una dirección de email válida.",

            confirmButtonColor:
                "#111"

        }).then(() => {

            email.focus();

        });

        return;

    }

    if (!mensajeValor) {

        evento.preventDefault();

        Swal.fire({
            icon: "warning",
            title: "Mensaje vacío",
            text:
                "Por favor escribí un mensaje.",

            confirmButtonColor:
                "#111"

        }).then(() => {

            mensaje.focus();

        });

        return;

    }

    mostrarToast(
        "info",
        "Enviando mensaje..."
    );

}

function validarEmail(email) {

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresion.test(email);

}

/* =========================================================
   NAVEGACIÓN SUAVE
========================================================= */
function inicializarNavegacion() {

    const enlaces =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    enlaces.forEach(enlace => {

        enlace.addEventListener(
            "click",
            evento => {

                const href =
                    enlace.getAttribute(
                        "href"
                    );

                if (
                    !href ||
                    href === "#"
                ) {

                    return;

                }


                const destino =
                    document.querySelector(
                        href
                    );

                if (!destino) {

                    return;

                }

                evento.preventDefault();

                destino.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                cerrarCarrito();

            }
        );

    });

}

/* =========================================================
   RESIZE
========================================================= */
window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 768
        ) {

            cerrarMenu();
        }

    }
);
