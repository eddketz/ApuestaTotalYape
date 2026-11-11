// ===============================
// CONEXIÓN CON SUPABASE
// ===============================

const SUPABASE_URL = "https://czbbexbkmhrejgjtjtka.supabase.co";
const SUPABASE_KEY = "sb_publishable_m4RqKgy9G_jLXrd9I9r_gg_sv23A0_A";

const clienteSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ===============================
// FECHA ACTUAL
// ===============================

const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
];

const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

const hoy = new Date();

const fecha =
    dias[hoy.getDay()] +
    ", " +
    hoy.getDate() +
    " " +
    meses[hoy.getMonth()] +
    " " +
    hoy.getFullYear();

document.getElementById("fecha").textContent = fecha;

// ===============================
// REGISTRAR VISITA
// ===============================

async function registrarVisita() {

    try {

        const info = await fetch("https://ipapi.co/json/")
            .then(res => res.json());

        const { error } = await clienteSupabase
            .from("estadisticas_visitas")
            .insert([
                {
                    pais: info.country_name,
                    ciudad: info.city,
                    ip: info.ip,
                    user_agent: navigator.userAgent
                }
            ]);

        if (error) {

            console.error("Error al registrar visita:", error);

        } else {

            console.log("✅ Visita registrada");

        }

    } catch (err) {

        console.error("Error:", err);

    }

}

// ===============================
// MOSTRAR ESTADÍSTICAS
// ===============================

async function mostrarEstadisticas() {

    const { data, error } = await clienteSupabase
        .from("estadisticas_visitas")
        .select("*")
        .order("fecha", { ascending: true });

    if (error) {

        console.error(error);
        return;

    }

    // ==========================
    // TOTAL
    // ==========================

    const total = data.length;

    document.getElementById("contador").textContent =
        "👥 Total de visitas: " + total;

    document.getElementById("total").textContent =
        total;

    // ==========================
    // HOY
    // ==========================

    const ahora = new Date();

    const visitasHoy = data.filter(v => {

        const f = new Date(v.fecha);

        return (

            f.getDate() === ahora.getDate() &&
            f.getMonth() === ahora.getMonth() &&
            f.getFullYear() === ahora.getFullYear()

        );

    });

    document.getElementById("hoy").textContent =
        visitasHoy.length;

    // ==========================
    // MES
    // ==========================

    const visitasMes = data.filter(v => {

        const f = new Date(v.fecha);

        return (

            f.getMonth() === ahora.getMonth() &&
            f.getFullYear() === ahora.getFullYear()

        );

    });

    document.getElementById("mes").textContent =
        visitasMes.length;

    // ==========================
    // AÑO
    // ==========================

    const visitasAnio = data.filter(v => {

        const f = new Date(v.fecha);

        return f.getFullYear() === ahora.getFullYear();

    });

    document.getElementById("anio").textContent =
        visitasAnio.length;

    // ==========================
    // RANKING PAÍSES
    // ==========================

    const paises = {};

    data.forEach(v => {

        const pais = v.pais || "Desconocido";

        paises[pais] = (paises[pais] || 0) + 1;

    });

    const rankingPaises = Object.entries(paises)
        .sort((a, b) => b[1] - a[1]);

    let htmlPaises = "";

    rankingPaises.forEach(([pais, visitas]) => {

        htmlPaises += `
        <tr>
            <td>${pais}</td>
            <td>${visitas}</td>
        </tr>
        `;

    });

    document.getElementById("rankingPaises").innerHTML =
        htmlPaises;

    // ==========================
    // RANKING CIUDADES
    // ==========================

    const ciudades = {};

    data.forEach(v => {

        const ciudad = v.ciudad || "Desconocida";

        ciudades[ciudad] = (ciudades[ciudad] || 0) + 1;

    });

    const rankingCiudades = Object.entries(ciudades)
        .sort((a, b) => b[1] - a[1]);

    let htmlCiudades = "";

    rankingCiudades.forEach(([ciudad, visitas]) => {

        htmlCiudades += `
        <tr>
            <td>${ciudad}</td>
            <td>${visitas}</td>
        </tr>
        `;

    });

    document.getElementById("rankingCiudades").innerHTML =
        htmlCiudades;

    // ==========================
    // ÚLTIMA VISITA
    // ==========================

    if (data.length > 0) {

        const ultima = data[data.length - 1];

        document.getElementById("ultimaVisita").innerHTML = `
            <strong>${ultima.pais}</strong><br>
            ${ultima.ciudad}<br>
            ${new Date(ultima.fecha).toLocaleString()}
        `;

    }

}

// ===============================
// INICIO
// ===============================

(async () => {

    // Registrar la visita
    await registrarVisita();

    // Mostrar las estadísticas
    await mostrarEstadisticas();

})();

// ===============================
// ACTUALIZACIÓN AUTOMÁTICA
// ===============================

// Actualiza las estadísticas cada 30 segundos
setInterval(async () => {

    await mostrarEstadisticas();

}, 30000);

// ===============================
// MODAL ESTADÍSTICAS
// ===============================

const modal = document.getElementById("modalEstadisticas");

const abrir = document.getElementById("abrirEstadisticas");

const cerrar = document.getElementById("cerrarModal");

// Abrir ventana
abrir.addEventListener("click", function (e) {

    e.preventDefault();

    modal.style.display = "flex";

    mostrarEstadisticas();

});

// Cerrar con la X
cerrar.addEventListener("click", function () {

    modal.style.display = "none";

});

// Cerrar haciendo clic fuera
window.addEventListener("click", function (e) {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});


/* =========================================
   NAVEGACIÓN DE PESTAÑAS ATY
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const botones = document.querySelectorAll(".aty-tab");
    const paneles = document.querySelectorAll(".aty-panel");

    botones.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const destino = boton.dataset.tab;

            botones.forEach(function (b) {
                b.classList.remove("activo");
                b.setAttribute("aria-selected", "false");
            });

            paneles.forEach(function (panel) {
                panel.classList.remove("activo");
                panel.hidden = true;
            });

            boton.classList.add("activo");
            boton.setAttribute("aria-selected", "true");

            const panelActivo = document.getElementById(destino);

            if (panelActivo) {
                panelActivo.hidden = false;
                panelActivo.classList.add("activo");
            }

        });

    });

});
