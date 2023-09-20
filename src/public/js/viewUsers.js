const deleteUserBtn = document.getElementsByClassName("deleteUserBtn");
const changeRoleBtn = document.getElementsByClassName("changeRoleBtn");
const deleteAll = document.getElementById("deleteAllBtn");

//Dentro de este for se itera cada uno de los usuarios y se llama mediante fetch al metodo para cambiar el role de un usuario.
for (let i = 0; i < changeRoleBtn.length; i++) {
    const changeRole = changeRoleBtn[i];
    changeRole.addEventListener(`click`, () => {
        const uid = changeRole.dataset.uid; 
        fetch(`/api/users/premium/${uid}`, {
        method: "PUT",
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
                    text: "The users role was successfully changed",
                    icon: "success"
                });
            } else if (result.status === 400) {
                result.json().then(data => {
                if (data.error === 'The user has a role as ADMIN') {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        title: "¡Error!",
                        text: "The user is an administrator and cannot change their role",
                        icon: "error"
                    });
                } else {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        title: "¡Error!",
                        text: "The user has not uploaded all the required documents yet",
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
                    title: '¡Error!',
                    text: "An error occurred while processing the request",
                    icon: "error"
                });
            }
        })
        .catch(error => {
            console.error("Error during the POST request:", error);
        });
    });
}

//Dentro de este for se itera cada uno de los usuarios y se llama mediante fetch al metodo para eliminar a un usuario
for (let i = 0; i < deleteUserBtn.length; i++) {
    const deleteUser = deleteUserBtn[i];
    deleteUser.addEventListener(`click`, () => {
        const uid = deleteUser.dataset.uid; 
        fetch(`/api/users/${uid}`, {
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
                    text: "The user has been deleted successfully.",
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    title: "¡Error!",
                    text: "An error occurred while processing the request.",
                    icon: "error"
                });
            }
        })
        .catch(error => {
            console.error("Error during the POST request:", error);
        });
    });
}

//Este metodo llama a la funcion la cual eliminara a todos los usuarios los cuales permanecieron sin conexion durante mas de 2 dias
deleteAll.addEventListener(`click`, () => {
    fetch("/api/users", {
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
                text: "The users have been deleted and notified successfully due to their 2-day absence without connectiono.",
                icon: "success"
            });
        } 
        if (result.status === 400) {
            result.json().then(data => {
                if (data.error === 'The user has a role as ADMIN') {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        title: "¡Error!",
                        text: "The user is an administrator and cannot change their role",
                        icon: "error"
                    });
                } else {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        title: "¡Error!",
                        text: "No user has remained without connection for 2 days.",
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