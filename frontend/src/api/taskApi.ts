import { api } from "@/lib/axios"
import { taskSchema, type Project, type Task, type TaskFormData } from "@/types"
import { isAxiosError } from "axios"


type TaskApiType = {
    formData: TaskFormData,
    projectId: Project["_id"],
    taskId: Task["_id"],
    status: Task["status"]
}

export const createTask = async ({ formData, projectId }: Pick<TaskApiType, "formData" | "projectId">) => {
    try {
        const { data } = await api.post<string>(`http://localhost:4000/api/projects/${projectId}/tasks`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const getTaskByID = async ({ projectId, taskId }: Pick<TaskApiType, "projectId" | "taskId">) => {
    try {
        const { data } = await api.get(`http://localhost:4000/api/projects/${projectId}/tasks/${taskId}`)
        const response = taskSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const updateTask = async ({ projectId, taskId, formData }: Pick<TaskApiType, "projectId" | "taskId" | "formData">) => {
    try {
        const { data } = await api.put<string>(`http://localhost:4000/api/projects/${projectId}/tasks/${taskId}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const deleteTask = async ({ projectId, taskId }: Pick<TaskApiType, "projectId" | "taskId">) => {
    try {
        const { data } = await api.delete<string>(`http://localhost:4000/api/projects/${projectId}/tasks/${taskId}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const updateStatus = async ({ projectId, taskId, status }: Pick<TaskApiType, "projectId" | "taskId" | "status">) => {
    try {
        const { data } = await api.post<string>(`http://localhost:4000/api/projects/${projectId}/tasks/${taskId}/status`, { status })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}