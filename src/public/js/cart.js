const deleteProductBtn = document.getElementsByClassName("btnDeleteProduct");
const deleteAll = document.getElementById("btnDeleteAllProducts");
const finallyOrder = document.getElementById("btnFinallyOrder");
const user = document.getElementById("cartInfo")
const cid = user.dataset.cid;

for (let i = 0; i < deleteProductBtn.length; i++) {
    const deleteProduct = deleteProductBtn[i];
    deleteProduct.addEventListener(`click`, () => {
        const pid = deleteProduct.dataset.pid; 
        fetch(`/api/carts/${cid}/product/${pid}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
            }
        })
        .then(result => {
            if (result.status === 200) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    title: "¡Success!",
                    text: "The product was deleted successfully.",
                    icon: "succeess"
                });
            }
        })
        .catch(error => {
            console.error("Error during the POST request:", error);
        });
    });
}

deleteAll.addEventListener(`click`, () => {
    fetch(`/api/carts/${cid}`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json"
        }
    })
    .then(result => {
        if (result.status === 200) {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                title: "¡Success!",
                text: "The products was deleted successfully.",
                icon: "succeess"
            });
        } else if (result.status === 400) {
            result.json().then(data => {
                if (data.error === 'The cart has no products') {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        title: "¡Error!",
                        text: "The cart has no products",
                        icon: "error"
                    });
                }
            })
        }
    })
    .catch(error => {
        console.error("Error during the POST request:", error);
    });
});

finallyOrder.addEventListener(`click`, () => {
    // Realizar la solicitud POST aquí
    fetch(`/api/carts/${cid}/purchase`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
        }
    })
    .then(result => {
        if (result.status === 200) {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                title: "¡Success!",
                text: "The order was completed successfully.",
                icon: "succeess"
            });
            setTimeout(()=>{window.location.replace('/payments');},1000)
        } else if (result.status === 400) {
            result.json().then(data => {
                if (data.error === 'The cart has no products') {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        title: "¡Error!",
                        text: "The cart has no products",
                        icon: "error"
                    });
                }
            })
        }
    })
    .catch(error => {
        console.error("Error during the POST request:", error);
    });
});