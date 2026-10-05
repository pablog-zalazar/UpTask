import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { body, param } from "express-validator"
import { handleInputError } from "../middleware/validation"
import { authenticate } from "../middleware/auth"

export const router = Router()

router.post("/createAccount",
    body("name")
        .notEmpty().withMessage("El nombre no puede ir vacio"),
    body("password")
        .isLength({ min: 8 }).withMessage("Minimo 8 caracteres"),
    body("passwordConfirmation")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Los passwords no son iguales")
            }
            return true
        }),
    body("email")
        .isEmail().withMessage("Email no valido"),

    handleInputError,
    AuthController.createAccount
)

router.post("/confirmAccount",
    body("token")
        .notEmpty().withMessage("El token no puede ir vacio"),

    handleInputError,
    AuthController.confirmAccount
)

router.post("/login",
    body("password")
        .notEmpty().withMessage("El password no puede ir vacio"),
    body("email")
        .isEmail().withMessage("Email no valido"),

    handleInputError,
    AuthController.login
)

router.post("/requestCode",
    body("email")
        .isEmail().withMessage("Email no valido"),

    handleInputError,
    AuthController.requestConfirmationCode
)

router.post("/forgetPassword",
    body("email")
        .isEmail().withMessage("Email no valido"),

    handleInputError,
    AuthController.forgetPassword
)

router.post("/validateToken",
    body("token")
        .notEmpty().withMessage("El token no puede ir vacio"),

    handleInputError,
    AuthController.validateToken
)

router.post("/updatePassword/:token",
    param("token")
        .isNumeric().withMessage("Token no valido"),
    body("password")
        .isLength({ min: 8 }).withMessage("Minimo 8 caracteres"),
    body("passwordConfirmation")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Los passwords no son iguales")
            }
            return true
        }),

    handleInputError,
    AuthController.updatePasswordWithToken
)

router.get("/user",
    authenticate,
    AuthController.user
)

// Profile
router.put("/profile",
    authenticate,
    body("name")
        .notEmpty().withMessage("El nombre no puede ir vacio"),
    body("email")
        .isEmail().withMessage("Email no valido"),

    handleInputError,
    AuthController.updateProfile
)

router.post("/update/password",
    authenticate,
    body("currentPassword")
        .notEmpty().withMessage("El password actual no puede ir vacio"),
    body("password")
        .isLength({ min: 8 }).withMessage("Minimo 8 caracteres"),
    body("passwordConfirmation")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Los passwords no son iguales")
            }
            return true
        }),

    handleInputError,
    AuthController.updateCurrentUserPassword
)

router.post("/checkPassword",
    authenticate,
    body("password")
        .notEmpty().withMessage("El password no puede ir vacio"),

    handleInputError,
    AuthController.checkPassword
)