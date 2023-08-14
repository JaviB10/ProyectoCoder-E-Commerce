const postButtons = document.getElementById(`addBtn`);
const user = document.getElementById('userInfo')
const cid = user.dataset.cid;

postButtons.addEventListener(`click`, () => {
    // Obtener el valor de pid
    const pid = postButtons.dataset.pid; // Reemplaza 'pid' por la forma en que obtienes el valor de pid dinámicamente
    // Realizar la solicitud POST aquí
    fetch(`http://localhost:8081/api/carts/${cid}/product/${pid}`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
        }
    })
    .then(response => {
    if (response.ok) {
        console.log("Solicitud POST exitosa");
        Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            title: "¡Éxito!",
            text: "El producto se agrego correctamente al carrito.",
            icon: 'success'
        });
    } else {
        console.error("Error al realizar la solicitud POST");
        Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            title: "¡Error!",
            text: "Se produjo un error en la operación.",
            icon: "error"
        });
    }
    })
    .catch(error => {
        console.error("Error al realizar la solicitud POST:", error);
    });
});