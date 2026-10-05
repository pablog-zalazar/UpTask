import type { NoteFormData } from "@/types"
import { useForm } from "react-hook-form"
import { ErrorMessage } from "../ErrorMessage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "@/api/noteApi"
import { toast } from "react-toastify"
import { useLocation, useParams } from "react-router-dom"

export const AddNoteForm = () => {

    const initialValues: NoteFormData = {
        content: ""
    }

    const params = useParams()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)

    const projectId = params.projectId!
    const taskId = queryParams.get("viewTask")!

    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors }
    } = useForm<NoteFormData>({
        defaultValues: initialValues
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createNote,

        onError: (error) => {
            toast.error(error.message)
        },

        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["viewProject", projectId] })
            queryClient.invalidateQueries({ queryKey: ["task", taskId] })
            resetField("content")
        }
    })

    const handleAddNote = (formData: NoteFormData) => {
        mutate({
            projectId,
            taskId,
            formData
        })
    }

    return (
        <form
            onSubmit={handleSubmit(handleAddNote)}
            noValidate
            className="space-y-3"
        >
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="content"
                    className="font-bold"
                >
                    Crear Nota
                </label>

                <input
                    id="content"
                    type="text"
                    placeholder="Contenido de la nota"
                    className="w-full p-3 border border-gray-300"
                    {...register("content", {
                        required: "El contenido de la nota es obligatorio"
                    })}
                />

                {errors.content && (
                    <ErrorMessage>
                        {errors.content.message}
                    </ErrorMessage>
                )}
            </div>

            <input
                type="submit"
                value="Crear Nota"
                className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer"
            />
        </form>
    )
}
