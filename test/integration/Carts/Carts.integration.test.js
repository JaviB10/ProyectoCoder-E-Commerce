import chai from "chai"
import supertest from "supertest"

const expect = chai.expect
const requester = supertest("http://localhost:8081")

describe('Testing de carts', () => {
    let cookie;
    let cid;
    const pid = '64e50f2ab6f1068dbfa3e441'
    const pid2 = '64d8074ecd5b770d3e1c9f62'

    before(async function () {
        const credentialsMock = {
            email: 'conrado@hotmail.com',
            password: 'topgun22'
        };

        const loginResult = await requester.post('/api/users/login').send(credentialsMock);
        const cookieResult = loginResult.headers['set-cookie'][0];
        const cookieResultSplit = cookieResult.split('=');

        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1]
        };

        const { _body } = await requester.get('/api/users/current')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]);

        expect(_body.data.email).to.be.eql('conrado@hotmail.com');
        cid = _body.data.cid._id;
        console.log(cid);
    });

    it("GET de /api/carts/:cid debe mostrar el carrito de productos al user", async () => {
        
        const { statusCode } = await requester.get(`/api/carts/${cid}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        
        expect(statusCode).to.be.eql(200);
    })

    it("POST de /api/carts/:cid/product/:pid debe agregar el producto al carrito", async () => {
        
        const { statusCode, _body } = await requester.post(`/api/carts/${cid}/product/${pid}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        
        expect(statusCode).to.be.eql(200);
    })

    it("POST de /api/carts/:cid/product/:pid no debe agregar el producto si el user es el creador del mismo", async () => {
        
        const { statusCode, _body } = await requester.post(`/api/carts/${cid}/product/${pid2}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        
        expect(statusCode).to.be.eql(400);
    })

    it("PUT de /api/carts/:cid/product/:pid se envia un quantity y se debe modificar el mismo en el producto solicitado", async () => {
        const newQuantity = '5';

        const { statusCode, _body } = await requester.put(`/api/carts/${cid}/product/${pid}`).set('Cookie', [`${cookie.name}=${cookie.value}`]).send(newQuantity);
        console.log(_body);
        expect(statusCode).to.be.eql(200);
        expect(_body).to.have.property('_id', pid2);
        expect(_body).to.have.property('quantity', newQuantity);
    })
})