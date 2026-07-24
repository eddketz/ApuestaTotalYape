// ===============================
// CONEXIÓN CON SUPABASE
// ===============================

const SUPABASE_URL = "https://czbbexbkmhrejgjtjtka.supabase.co";

const SUPABASE_KEY = "sb_publishable_m4RqKgy9G_jLXrd9I9r_gg_sv23A0_A";

const clienteSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



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
    dias[hoy.getDay()] + ", " +
    hoy.getDate() + " " +
    meses[hoy.getMonth()] + " " +
    hoy.getFullYear();

document.getElementById("fecha").textContent = fecha;

// ===============================
// REGISTRAR VISITA
// ===============================

async function registrarVisita() {

    const { data, error } = await clienteSupabase
        .from("visitas")
        .insert([
            {
                pais: "Peru"
            }
        ])
        .select();

    if (error) {
        console.error("Error al registrar la visita:", error);
    } else {
        console.log("✅ Visita registrada correctamente");
        console.log(data);
    }
}



async function mostrarContador() {

    const { count, error } = await clienteSupabase
        .from("visitas")
        .select("*", { count: "exact", head: true });

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("contador").textContent =
        "👥 Visitantes: " + count;

}

(async () => {
    await registrarVisita();
    await mostrarContador();
})();