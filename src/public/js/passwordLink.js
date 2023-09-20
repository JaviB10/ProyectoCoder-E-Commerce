const form = document.getElementById("formLink");

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch(`/api/sessions/passwordLink`, {
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
                text: "The link was sent successfully.",
                icon: "succeess"
            });
            setTimeout(()=>{window.location.replace('/login');},2000)
        } else {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                title: "¡Error!",
                text: "The email entered is not registered in the database.",
                icon: "error"
            });
        }
    })
    .catch(error => {
        console.error("Error during the POST request:", error);
    });
})