const form = document.getElementById("form");
const user = document.getElementById('userInfo');
const uid = user.dataset.uid;


    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);  // No es necesario convertirlo a un objeto aquí
        fetch(`/api/users/${uid}/documents`, {
            method: 'POST',
            body: data,  // Envía directamente el FormData
        }).then(result => {
            if (result.status === 200) {
                window.location.replace('/login');
            } else {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    title: "¡Error!",
                    text: "Los campos ingresados son incorrectos.",
                    icon: "error"
                });
            }
        });
    });

