import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8081');

describe('Testing users', () => {
    let cookie;

    it('Debemos registar un user correctamente', async () => {
        const userMock = {
            name: 'Javier',
            last_name: 'Ballon',
            phone: '3412295482',
            age: 27,
            email: 'javiballon@gmail.com',
            password: 'topgun22'
        }
        
        const { statusCode, _body } = await requester.post('/api/users/register').send(userMock);
        expect(statusCode).to.be.eql(200);
        expect(_body).to.be.ok;
    })

    it('Debemos loguear al usuario y retornar una cookie', async () => {
        const credentialsMock = {
            email: 'javiballon@gmail.com',
            password: 'topgun22'
        };

        const loginResult = await requester.post('/api/users/login').send(credentialsMock);
        const cookieResult = loginResult.headers['set-cookie'][0];
        expect(cookieResult).to.be.ok;

        const cookieResultSplit = cookieResult.split('=');

        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1]
        };

        expect(cookie.name).to.be.ok.and.eql('coderCookieToken');
        expect(cookie.value).to.be.ok;
    });

    it('Debemos enviar una cookie en el servicio current y entregar la información al usuario', async () => {
        // Hacer la solicitud GET al servicio /api/users/current con la cookie
        const { _body } = await requester.get('/api/users/current')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]);

        // Verificar que la información del usuario en la respuesta sea correcta
        expect(_body.data.email).to.be.eql('javiballon@gmail.com')
        console.log(_body.data);
    });
})