import { api } from "@/lib/axios"
import { isAxiosError } from "axios"
import { userSchema, type CheckPaswordForm, type ConfirmToken, type ForgetPasswordForm, type NewPasswordFormData, type RequestConfirmationCodeForm, type User, type UserLoginForm, type UserRegistrationForm } from "@/types"

export const createAccount = async (formData: UserRegistrationForm) => {
    try {
        const { data } = await api.post<string>("/auth/createAccount", formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const confirmAccount = async (formData: ConfirmToken) => {
    try {
        const { data } = await api.post<string>("/auth/confirmAccount", formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const requestConfirmationCode = async (formData: RequestConfirmationCodeForm) => {
    try {
        const { data } = await api.post<string>("/auth/requestCode", formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const authenticateUser = async (formData: UserLoginForm) => {
    try {
        const { data } = await api.post<string>("/auth/login", formData)
        localStorage.setItem("AUTH_TOKEN", data)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const forgetPassword = async (formData: ForgetPasswordForm) => {
    try {
        const { data } = await api.post<string>("/auth/forgetPassword", formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const validateToken = async (formData: ConfirmToken) => {
    try {
        const { data } = await api.post<string>("/auth/validateToken", formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const updatePasswordWithToken = async ({ formData, token }: { formData: NewPasswordFormData, token: ConfirmToken["token"] }) => {
    try {
        const { data } = await api.post<string>(`/auth/updatePassword/${token}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const getUser = async () => {
    try {
        const { data } = await api<User>("/auth/user")
        const response = userSchema.safeParse(data)
        if (response.success) {
            return response.data
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const checkpassword = async (formData: CheckPaswordForm) => {
    try {
        const { data } = await api.post<string>("/auth/checkPassword", formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}