const deleteButton = document.getElementById("addBtnDelete");

deleteButton.addEventListener(`click`, () => {

    const pid = deleteButton.dataset.pid; 
    console.log(pid);

    const url = `http://localhost:8081/api/products/${pid}`;
    fetch(url, {
    method: "DELETE",
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
})