import { Request, Response } from "express"
import { User } from "../models/User"
import { Token } from "../models/Token"
import { checkpassword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../email/authEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            // Verificar que no existe el usuario
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error("El usuario ya esta registrado")
                return res.status(409).json({ error: error.message })
            }

            // Crear usuario
            const user = new User(req.body)
            user.password = await hashPassword(password)

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            // Enviar el email
            AuthEmail.confirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send("Cuenta creada, revisa tu email para confirmarla")
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }


    static confirmAccount = async (req: Request, res: Response) => {
        try {
            // Verificar que exista el token
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error("Token no valido")
                return res.status(404).json({ error: error.message })
            }

            // Buscar y confirmar el usuario vinculado al token
            const user = await User.findById(tokenExists.user)
            user.confirm = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send("Cuenta confirmada correctamente")
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            // Verificar que exista el usuario
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error("Usuario no registrado")
                return res.status(404).json({ error: error.message })
            }

            // Verificar que el usuario este confirmado
            if (!user.confirm) {
                const token = new Token()
                token.user = user._id
                token.token = generateToken()

                AuthEmail.confirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                await Promise.allSettled([user.save(), token.save()])

                const error = new Error("El usuario no esta varificado, se envio un mail de confirmacion al email de confirmacion")
                return res.status(401).json({ error: error.message })
            }

            // Revisar password
            const isPasswordCorrect = await checkpassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error("Contraseña incorrecta")
                return res.status(401).json({ error: error.message })
            }

            const jwtoken = generateJWT({ id: user._id })

            res.send(jwtoken)

        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            // Verificar que existe el usuario
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error("El usuario no esta registrado")
                return res.status(404).json({ error: error.message })
            }

            // Verificar que el usuario no este confirmado
            if (user.confirm) {
                const error = new Error("El usuario ya esta confirmado")
                return res.status(403).json({ error: error.message })
            }

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            // Enviar el email
            AuthEmail.confirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send("Se envio un nuevo token a tu mail")
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

    static forgetPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            // Verificar que existe el usuario
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error("El usuario no esta registrado")
                return res.status(404).json({ error: error.message })
            }

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id
            await token.save()

            // Enviar el email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send("Se envio un nuevo token a tu mail")
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            // Verificar que exista el token
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error("Token no valido")
                return res.status(404).json({ error: error.message })
            }


            res.send("Token valido, Define tu nuevo password")
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            // Verificar que exista el token
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error("Token no valido")
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send("Password modificado correctamente")
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

    static user = async (req: Request, res: Response) => {
        return res.json(req.user)
    }

    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body

        const userExists = await User.findOne({ email })

        if (userExists && userExists._id.toString() === req.user._id.toString()) {
            const error = new Error("Ese email ya esta registrado")
            return res.status(409).json({ error: error.message })
        }

        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send("Perfil actualizado correctamente")
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { password, currentPassword } = req.body

        const user = await User.findById(req.user._id)
        const isPasswordCorrect = await checkpassword(currentPassword, user.password)
        if (!isPasswordCorrect) {
            const error = new Error("Contraseña incorrecta")
            return res.status(401).json({ error: error.message })
        }

        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send("El password se modifico correctamente")
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body

        const user = await User.findById(req.user._id)
        const isPasswordCorrect = await checkpassword(password, user.password)

        if (!isPasswordCorrect) {
            const error = new Error("El password es incorrecto")
            return res.status(401).json({ error: error.message })
        }

        res.send("Password correcto")
    }
}