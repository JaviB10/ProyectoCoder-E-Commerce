import config from "../config/config.js"
const port = Number(config.port)

export const resetPassword = (token) =>
    `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset your password</title>
        </head>
        <body>
            <h1>Redirect Page</h1>
            <p>Click the button below to reset your password:</p>
            <a href="http://localhost:${port}/passwordReset?token=${token}">Reset Password</a>
        </body>
    </html>`

export const deleteUserNotification = (user) =>
    `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notification that your account was deleted</title>
        </head>
        <body>
            <h1>The account "${user.email}" was deleted</h1>
            <p>Your account was disconnected for two days. It's the reason why we deleted them.</p>
        </body>
    </html>
    `

export const deleteProductNotification = (product) =>
    `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notification that your product was deleted</title>
        </head>
        <body>
            <h1>The product "${product.title}" was deleted</h1>
            <p>Your product has been removed because it no longer meets the requirements to be listed for sale on the platform in English</p>
        </body>
    </html>
    `