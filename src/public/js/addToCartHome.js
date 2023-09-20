const postButtons = document.getElementsByClassName("btnAddProduct");
const user = document.getElementById("userInfo")
const cid = user.dataset.cid;
const uid = user.dataset.uid;


for (let i = 0; i < postButtons.length; i++) {
    const postButton = postButtons[i];
    postButton.addEventListener(`click`, () => {

        const pid = postButton.dataset.pid; 
        const data = {
            uid: uid
        };
        fetch(`http://localhost:8081/api/carts/${cid}/product/${pid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            },
        body: JSON.stringify(data)
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
                    icon: "success"
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
}
