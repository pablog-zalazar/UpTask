import { api } from "@/lib/axios"
import type { Note, NoteFormData, Project, Task } from "@/types"
import { isAxiosError } from "axios"

type NoteApiType = {
    formData: NoteFormData,
    projectId: Project["_id"],
    taskId: Task["_id"],
    noteId: Note["_id"]
}

export const createNote = async ({ projectId, taskId, formData }: Pick<NoteApiType, "projectId" | "taskId" | "formData">) => {
    // console.log("TOKEN:", localStorage.getItem("AUTH_TOKEN"))
    try {
        const url = `http://localhost:4000/api/projects/${projectId}/tasks/${taskId}/notes`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}

export const deleteNote = async ({ projectId, taskId, noteId }: Pick<NoteApiType, "projectId" | "taskId" | "noteId">) => {
    try {
        const url = `http://localhost:4000/api/projects/${projectId}/tasks/${taskId}/notes/${noteId}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error, { cause: error })
        }
    }
}