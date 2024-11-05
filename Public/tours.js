let tickets = 5;
let siUsuarioPuede = false;

// Función para pedir el nombre del usuario y mostrar un mensaje personalizado
function pedirNombre() {
    let nombre;

    while (true) {
        nombre = prompt("Por favor, ingresa tu nombre:");

        if (nombre === null) return; // Si se cancela, salir

        if (nombre.trim() === "") {
            alert("Debes completar tu nombre.");
        } else if (nombre.length < 2) {
            alert("El nombre debe tener al menos 2 letras.");
        } else {
            break; // Nombre válido, salir del bucle
        }
    }

    const welcomeSpan = document.getElementById("welcome");
    welcomeSpan.textContent = `Hola, ${nombre.toUpperCase()}`;
    welcomeSpan.style.color = "white";

    // Llamar a la función para pedir la edad
    pedirEdad();
}

// Función para pedir la edad y verificar si el usuario puede comprar tickets
function pedirEdad() {
    const edad = prompt("¿Cuántos años tienes?");

    if (edad === null) {
        // Si el usuario cancela la edad, no permitir comprar
        siUsuarioPuede = false;
        deshabilitarBotones();
        return;
    }

    if (isNaN(edad) || edad < 0) {
        alert("Por favor, ingresa una edad válida.");
        return; // Si la edad no es válida, salir de la función
    }

    if (parseInt(edad) < 18) {
        // Si el usuario es menor de 18 años
        swal({
            title: "Acceso denegado",
            text: "Lo sentimos, no puedes comprar tickets si eres menor de edad.",
            icon: "error",
            button: "Cerrar"
        });
        return; // Salir de la función
    } else {
        siUsuarioPuede = true; // El usuario es mayor de 18 años
        habilitarBotones(); // Habilitar botones para adquirir tickets
    }
}

// Función para habilitar los botones de adquirir tickets
function habilitarBotones() {
    const buttons = document.querySelectorAll('.ticket-button');
    buttons.forEach(button => {
        button.disabled = false; // Habilitar el botón
    });
}

// Función para deshabilitar los botones de adquirir tickets
function deshabilitarBotones() {
    const buttons = document.querySelectorAll('.ticket-button');
    buttons.forEach(button => {
        button.disabled = true; // Deshabilitar el botón
    });
}

// Función para vender un ticket cuando el usuario hace clic en el botón
function venderTicket(event) {
    const button = event.target; // Obtener el botón que fue clicado

    if (!siUsuarioPuede) {
        // Si el usuario no es elegible, mostrar mensaje
        swal({
            title: "Acceso denegado",
            text: "Lo sentimos, no puedes comprar tickets si no has completado tu nombre y edad.",
            icon: "error",
            button: "Cerrar"
        });
        return; // Salir de la función
    }

    if (tickets > 0) {
        tickets--; // Disminuir la cantidad de tickets
        // Mostrar mensaje de éxito con SweetAlert
        swal({
            title: "¡Ticket adquirido con éxito!",
            text: `Has adquirido un ticket. Quedan ${tickets} tickets.`,
            icon: "success",
            button: "¡Genial!"
        }).then(() => {
            // Deshabilitar el botón después de la compra
            button.disabled = true;
        });
    } else {
        swal({
            title: "Tickets Agotados",
            text: "Lo sentimos, ya no hay más tickets disponibles.",
            icon: "warning",
            button: "Cerrar"
        });
    }
}

// Asignar el evento de clic a cada botón de adquirir tickets
document.querySelectorAll('.ticket-button').forEach(button => {
    button.addEventListener('click', venderTicket); // Escuchador de eventos
});

// Al iniciar la página, los botones están deshabilitados hasta completar nombre y edad
window.onload = () => {
    deshabilitarBotones();
    pedirNombre();
};
