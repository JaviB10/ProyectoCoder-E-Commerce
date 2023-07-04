const postButtons = document.getElementsByClassName("deleteAllBtn");
if(postButtons) {
    const user = document.getElementById('cartInfo')
    const cid = user.dataset.cid;
    
    
    for (let i = 0; i < postButtons.length; i++) {
        const postButton = postButtons[i];
        postButton.addEventListener(`click`, () => {
    
    
        const url = `http://localhost:8081/api/carts/${cid}`;
        console.log(url);
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
    });
    }
}
