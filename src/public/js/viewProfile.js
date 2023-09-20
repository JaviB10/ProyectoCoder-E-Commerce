const form = document.getElementById("formUploader");
const user = document.getElementById("userInfo");
const uid = user.dataset.uid;

form.addEventListener(`submit`, e => {
    e.preventDefault();
    const data = new FormData(form);  // No es necesario convertirlo a un objeto aquí
    fetch(`/api/users/${uid}/documents`, {
        method: 'POST',
        body: data  // Envía directamente el FormData
    }).then(result => {
        if (result.status === 200) {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                title: "¡Success!",
                text: "User documents uploaded successfully.",
                icon: "succeess"
            });
            setTimeout(()=>{window.location.replace('/login');},2000)
        } else if (result.status === 400) {
            result.json().then(data => {
                if (data.error === 'The user has successfully uploaded all the required documents') {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        title: "¡Error!",
                        text: "The user has successfully uploaded all the required documents.",
                        icon: "error"
                    });
                }
            })
        }
    })    
    .catch(error => {
        console.error('Error during the POST request:', error);
    });
});

