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

fetch("https://api.countapi.xyz/hit/apuestatotalyape/visitas")
    .then(response => response.json())
    .then(data => {
        document.getElementById("contador").textContent =
            "👥 Visitantes: " + data.value.toLocaleString();
    })
    .catch(error => {
        console.log(error);
        document.getElementById("contador").textContent =
            "👥 Error al cargar";
    });