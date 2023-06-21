import Router from "../router.js"
import Users from "../../dao/dbManagers/user.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import { createHash, generateToken, isValidPassword } from "../../utils.js"
import Carts from "../../dao/dbManagers/carts.js"

const cartManager = new Carts()

const userManager = new Users()

// export default class SessionsRouter extends Router {
//     init() {
//         this.get("/login", ["PUBLIC"], (req, res) => {
//             try {
//                 const user = {
//                     email: req.body.email,
//                     role: "USER"
//                 }

//                 const token = jwt.sign(user, "secretCoder")
//                 res.sendSuccess({ token })

//             } catch (error) {
//                 res.sendServerError(error.message)
//             }
            
//         })
//     }
// }

export default class UsersRouter extends Router {
    init() {

        this.post("/login", ["PUBLIC"], passportStrategiesEnum.NOTHING, async (req, res) => {
            const { email, password } = req.body 
            const user = await userManager.getUserByEmail(email)
            if (!user) return res.sendClientError("Incorrect credentials")
            const comparePassword = isValidPassword(user, password)
            if (!comparePassword) {
                return res.sendClientError("Incorrect credentials")
            }

            const accessToken = generateToken(user)
            return res.cookie(
                'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
            ).sendSuccess({ accessToken });
            
        });

        this.post("/register", ["PUBLIC"], passportStrategiesEnum.NOTHING, async (req, res) => {
            try {
                const { first_name, last_name, age, email, password, role } = req.body;
                if (!first_name || !last_name || !age || !email || password)
                    return res.sendClientError("Incomplete values")
                
                const exists = await userManager.getUserByEmail(email)
                if (exists) 
                    return res.sendClientError("Incomplete values")
                
                const hashedPassword = createHash(password);

                const newUser = {
                    ...req.body, cart: await cartManager.newCart()._id
                }
                
                newUser.password = hashedPassword

                const result = await userManager.save(newUser)
                res.sendSuccess(result)
            } catch (error) {
                res.sendServerError(error.message)
            }
        });

        this.get('/logout', ["PUBLIC"], passportStrategiesEnum.NOTHING, (req, res) => {
            res.clearCookie("coderCookieToken").redirect('/login')
        });
    };
}
