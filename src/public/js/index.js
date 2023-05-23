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


