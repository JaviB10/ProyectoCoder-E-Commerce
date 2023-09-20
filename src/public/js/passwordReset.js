const form = document.getElementById("formReset");
const dataToken = document.getElementById("token");
const token = dataToken.dataset.token;

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    const newPassword = { password: obj.password, token };
    fetch(`/api/sessions/passwordReset`, {
        method: 'POST',
        body: JSON.stringify(newPassword),
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
                text: "The password was changed successfully.",
                icon: "succeess"
            });
            setTimeout(()=>{window.location.replace('/login');},2000)
        } else if (result.status === 400) {
            result.json().then(data => {
                if (data.error === 'The user has not entered any password') {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        title: "¡Error!",
                        text: "You have not submitted any password",
                        icon: "error"
                    });
                } else {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        title: "¡Error!",
                        text: "The password submitted is the same as the old password.",
                        icon: "error"
                    });
                }
            })
        }
    })
    .catch(error => {
        console.error("Error during the POST request:", error);
    });
})