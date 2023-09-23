let reservas = [];  

//Guardo la reserva en localStorage junto a las reservas previas
function guardarReserva(documento, habitacion, precio, fechaIngreso, fechaEgreso){
    const diasTotales = calcularEstadia(fechaIngreso, fechaEgreso);
    let precioFinal = diasTotales * precio;
    reservas = JSON.parse(localStorage.getItem("reservas"));
    reservas == null ? reservas = [] : false;
    reservas.push({dni: documento, habitacion: habitacion, precio: precioFinal, dias: diasTotales, llegada: fechaIngreso, salida: fechaEgreso});
    const reservasJS = JSON.stringify(reservas);
    localStorage.setItem("reservas", reservasJS);
    Toastify({
        text: "Su reserva se ha realizado con exito",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast(); 
}

//Calculo los dias que se va a quedar la persona
function calcularEstadia(fechaIngreso, fechaEgreso){
    let fIng = new Date(fechaIngreso).getTime();
    let fEgr = new Date(fechaEgreso).getTime();
    let diasTotales = (fEgr - fIng) / 86400000;
    return diasTotales; 
}

//Busco la reserva
function verReserva(array, dni){
    return array.find(el=>{ return el.dni == dni}) || null
}

//Busco la habitacion
function buscarHabitacion(array, habitacion){
    return array.find(el=>{ return el.nombre == habitacion}) || null
}

//Armo el HTML para mostrar las fotos de las habitaciones
function crearHtml(el) {
    const {nombre, precio, img} = el;
    fetch("https://dolarapi.com/v1/dolares")
        .then((response) => response.json())
        .then((datos) => {
            const precioPesos = precio * datos[1].venta;
            imgHabitacion.innerHTML = "";
            let html = `<div class="card">
                        <img class="foto"src=" ./img/${img}" alt="${nombre}">
                        <hr>
                        <h3>${nombre}</h3>
                        <p>Precio: USD ${precio} / ARS ${precioPesos}</p>
                            <div class="card-action">
                            </div>
                        </div>`;
            imgHabitacion.innerHTML = imgHabitacion.innerHTML + html;});
}

//Defino las habitaciones
const habitaciones = [
    { id: 1, nombre: "simple", precio: 10, img: 'hab1.jpg'},
    { id: 2, nombre: "doble", precio: 15, img: 'hab2.jpg'},
    { id: 3, nombre: "matrimonial", precio: 20, img: 'habm.jpg'},
  ];

//Defino los elementos con Eventos
const btnReservar = document.querySelector("#btnReservar"), inputs = document.querySelectorAll('input'), btnBuscar = document.querySelector("#btnSearch");
const select = document.querySelector("#habitaciones");
const imgHabitacion = document.querySelector("#imgHab");

//Reservar Habitacion
btnReservar.addEventListener("click", () => {
    const dni = (inputs[1].value), fechai = (inputs[2].value), fechae = (inputs[3].value), tipoh = select.options[select.selectedIndex].value;
    const precio = buscarHabitacion(habitaciones, tipoh)
    dni == "" || fechai == "" || fechae == "" ? Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor complete todos los campos',
    }) : guardarReserva(dni, tipoh, precio.precio, fechai, fechae);
})

//Ver Reserva de Habitacion
btnBuscar.addEventListener("click", () => {
    reservas = JSON.parse(localStorage.getItem("reservas"));
    const reserva = verReserva(reservas, inputs[0].value);
    reserva == null ?
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ud. no tiene reservas realizadas!',
        })
    :
    fetch("https://dolarapi.com/v1/dolares")
        .then((response) => response.json())
        .then((datos) => {
                const precioPesos = reserva.precio * datos[1].venta;
                Swal.fire({
                    icon: 'success',
                    title: 'Ud tiene una reserva',
                    text: `Su reserva es por una habitacion ${reserva.habitacion}\n por un total de USD ${reserva.precio} / ARS ${precioPesos} `,
                })});    
})

//Armar lista de Habitaciones
habitaciones.forEach(habitacion => {
    let option = document.createElement('option');
    option.innerText = habitacion.nombre;
    option.value = habitacion.nombre;
    select.appendChild(option);
})

//Mostrar imagenes y precios de cada Habitacion
select.addEventListener("change", () => {
    let option = select.options[select.selectedIndex].value;
    const encontrado = buscarHabitacion(habitaciones, option);
    crearHtml(encontrado);
})

