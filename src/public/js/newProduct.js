const form = document.getElementById("formNewProduct");

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch(`/api/products`, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                title: "¡Success!",
                text: "The product was saved successfully.",
                icon: "succeess"
            });
            setTimeout(()=>{window.location.replace('/');},2000)
            
        } else if (result.status === 400) {
            result.json().then(data => {
                if (data.error === 'The user has not provided all the required values') {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        title: "¡Error!",
                        text: "The user has not provided all the required values.",
                        icon: "error"
                    });
                }
            })
        } else if (result.status === 500) {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                title: "¡Error!",
                text: "The code is already in use by another product..",
                icon: "error"
            });
        }
    })
    .catch(error => {
        console.error("Error during the POST request:", error);
    });
})