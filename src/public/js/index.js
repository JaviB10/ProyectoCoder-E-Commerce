const ver = (_id) => {
    window.location.href = "/products/" + _id;
}

const agregar = (id) => {
    console.log(id);
    
}

const socket = io()
const container = document.getElementById('container')

socket.on("showProducts", data =>{
    container.innerHTML = ``;
    data.forEach(prod=>{
        container.innerHTML += `
            <ul>
                <li>title: ${prod.title}</li> 
                <li>description: ${prod.description}</li>
                <li>code: ${prod.code}</li>
                <li>price: ${prod.price}</li>
                <li>status: ${prod.status}</li>
                <li>stock: ${prod.stock}</li>
                <li>category: ${prod.category}</li>
                <li>id: ${prod._id}</li>
            </ul>
            `
    })
})

let user;
const chatbox = document.getElementById('chatBox');

Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresa el usuario para indentificarte en el chat',
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre de usuario para comenzar a chatear"
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then(result => {
    user = result.value;
    socket.emit('authenticated', user);
});

chatbox.addEventListener('keyup', evt => {
    if(evt.key==='Enter') {
        if(chatbox.value.trim().length > 0) {
            socket.emit('message', { user, message: chatbox.value});
            chatbox.value='';
        }
    }
});

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs');
    let messages = '';
    data.forEach(message => {
        messages += `${message.user} dice: ${message.message}<br/>`
    });
    log.innerHTML=messages;
});


socket.on('newUserConnected', data => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: 'success'
    });
});


