import chai from "chai"
import supertest from "supertest"

const expect = chai.expect
const requester = supertest("http://localhost:8081")

describe("Testing de products", () => {
    let cookie;

    before(async function () {
        const credentialsMock = {
            email: 'javiballon@gmail.com',
            password: 'topgun22'
        };

        const loginResult = await requester.post('/api/sessions/login').send(credentialsMock);
        const cookieResult = loginResult.headers['set-cookie'][0];
        const cookieResultSplit = cookieResult.split('=');

        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1]
        };
    });

    it("POST de /api/products debe crear un producto correctamente", async () => {
        const productMock = {
            title: 'Coca Cola',
            description: 'Bebida de cola azucarada',
            code: 'coca123',
            price: 750,
            stock: 100,
            category: 'bebidas',
            thumbnail: '123'
        }

        const { statusCode, ok, _body } = await requester.post('/api/products').set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productMock);

        expect(statusCode).to.be.eql(200)
        expect(_body.data).to.have.property('_id')
        
    })

    it("POST de /api/products debe dar un error 500 si 'code' ya existe entre los productos de la BDD", async () => {
        const existingProductMock = {
            title: 'Pepsi',
            description: 'Otra bebida de cola',
            code: 'coca123', // Este código ya existe en la base de datos
            price: 800,
            stock: 50,
            category: 'bebidas',
            thumbnail: '456'
        }
    
        const { statusCode } = await requester.post('/api/products').set('Cookie', [`${cookie.name}=${cookie.value}`]).send(existingProductMock);
    
        expect(statusCode).to.be.eql(500);
    })

    it("POST de /api/products debe guardar 'ADMIN' como owner si no se proporciona", async () => {
        const productMock = {
            title: 'Sprite',
            description: 'Bebida azucarada con gusto a lima limon',
            code: 'sprite123',
            price: 750,
            stock: 100,
            category: 'bebidas',
            thumbnail: '789'
        }
    
        const { statusCode, _body } = await requester.post('/api/products').set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productMock);
    
        expect(statusCode).to.be.eql(200);
        expect(_body.data).to.have.property('_id');
        expect(_body.data.owner).to.be.eql('ADMIN');
    });

    it("POST de /api/products debe guardar el valor de 'owner' proporcionado por el usuario", async () => {
        const productMock = {
            title: 'Fanta',
            description: 'Bebida azucara con gusto a naranja',
            code: 'fanta123',
            price: 750,
            stock: 100,
            category: 'bebidas',
            thumbnail: '789',
            owner: 'javiballon@gmail.com' // Cambia esto al correo del usuario real
        }
    
        const { statusCode, _body } = await requester.post('/api/products').set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productMock);
    
        expect(statusCode).to.be.eql(200);
        expect(_body.data).to.have.property('_id');
        expect(_body.data.owner).to.be.eql('javiballon@gmail.com');
    });

})