const postButtons = document.getElementById("btnAddProduct");
const deleteButton = document.getElementById("btnDeleteProduct");
const user = document.getElementById("userInfo")
const cid = user.dataset.cid;

postButtons.addEventListener(`click`, () => {
    const pid = postButtons.dataset.pid; 
    fetch(`http://localhost:8081/api/carts/${cid}/product/${pid}`, {
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
                text: "The product was successfully added to the cart.",
                icon: 'success'
            });
        } else {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                title: "¡Error!",
                text: "The user cant be add product.",
                icon: "error"
            });
        }
    })
    .catch(error => {
        console.error("Error during the POST request:", error);
    });
});

deleteButton.addEventListener(`click`, () => {
    const pid = deleteButton.dataset.pid; 
    fetch(`http://localhost:8081/api/products/${pid}`, {
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
                icon: 'success'
            });
            setTimeout(()=>{window.location.replace('/login');},1000)
        } else {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                title: "¡Error!",
                text: "The user cant delete this product.",
                icon: "error"
            });
        }
    })
    .catch(error => {
        console.error("Error during the POST request:", error);
    });
})