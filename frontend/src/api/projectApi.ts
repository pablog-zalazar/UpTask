import { api } from "@/lib/axios"
import { dashboardProjectSchema, editProjectSchema, projectSchema, type Project, type ProjectFormData } from "@/types"
import { isAxiosError } from "axios"

export const createProject = async (formData: ProjectFormData) => {
    try {
        const { data } = await api.post("/projects", formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const getProjects = async () => {

    try {
        const { data } = await api.get("/projects")
        const response = dashboardProjectSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const getProjectByID = async (id: Project["_id"]) => {
    try {
        const { data } = await api.get(`http://localhost:4000/api/projects/${id}`)
        const response = editProjectSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const getFullProjectByID = async (id: Project["_id"]) => {
    try {
        const { data } = await api.get(`http://localhost:4000/api/projects/${id}`)
        const response = projectSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

type ProjectAPIType = {
    formData: ProjectFormData,
    projectId: Project["_id"]
}

export const updateProject = async ({ formData, projectId }: ProjectAPIType) => {

    try {
        const { data } = await api.put<string>(`http://localhost:4000/api/projects/${projectId}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const deleteProject = async (id: Project["_id"]) => {
    try {
        const { data } = await api.delete<string>(`http://localhost:4000/api/projects/${id}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}