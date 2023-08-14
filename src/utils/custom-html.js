import config from "../config/config.js"
const port = Number(config.port)

export const loginNotification = (token) =>
    `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notificación de Inicio de Sesión</title>
        </head>
        <body>
            <h1>Página de Redirección</h1>
            <p>Haga clic en el botón a continuación para restablecer su contraseña:</p>
            <a href="http://localhost:${port}/password-reset?token=${token}">Restablecer Contraseña</a>
        </body>
    </html>`