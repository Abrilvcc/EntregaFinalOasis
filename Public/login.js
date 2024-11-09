document.addEventListener("DOMContentLoaded", function () {
    const formularioLogin = document.querySelector("#login-form");
  
    // Verifica si el formulario existe
    if (formularioLogin) {
      formularioLogin.addEventListener("submit", async function (event) {
        event.preventDefault();
        const username = document.querySelector("input[name='usuario']").value;
        const password = document.querySelector("input[name='contraseña']").value;
  
        if (username === "" || password === "") {
          Swal.fire({
            title: "¡Error!",
            text: "Por favor, completa todos los campos.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          return;
        }
  
        if (password.length < 6) {
          Swal.fire({
            title: "¡Error!",
            text: "Tu contraseña es demasiado corta.",
            icon: "warning",
            confirmButtonText: "Aceptar",
          });
          return;
        }
  
        const loginData = {
          email: username,
          password: password,
        };
  
        try {
          const response = await axios.post("http://localhost:5000/user/login", loginData, {
            withCredentials: true,
          });
  
          Swal.fire({
            title: "¡Éxito!",
            text: "Inicio de sesión exitoso",
            icon: "success",
            confirmButtonText: "Aceptar",
          }).then(() => {
            // Redirige al usuario a la página de inicio
            window.location.href = "./index.html";
          });
        } catch (error) {
          Swal.fire({
            title: "¡Error!",
            text: "Email o contraseña incorrectos.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      });
    }
  });
  