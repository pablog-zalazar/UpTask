import { Link, useNavigate } from "react-router-dom"
import ProjectForm from "./ProjectForm"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Project, ProjectFormData } from "@/types"
import { updateProject } from "@/api/projectApi"
import { toast } from "react-toastify"

interface props {
    data: ProjectFormData,
    projectId: Project["_id"]
}

export const EditProjectForm = ({ data, projectId }: props) => {

    const navigate = useNavigate()

    const initialValues: ProjectFormData = {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    }
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            queryClient.invalidateQueries({ queryKey: ["editProject", projectId] })
            toast.success(data)
            navigate("/")
        }
    })

    const handleForm = (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutation.mutate(data)
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">

                <h1 className="text-5xl font-black">Editar Proyectos</h1>
                <p className="text-2xl font-light text-gray-500 mt-3">Completa el formulario para editar el proyecto</p>

                <nav className="my-5">
                    <Link
                        className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to="/"
                    >Volver a Proyectos</Link>
                </nav >

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <ProjectForm
                        register={register}
                        errors={errors}
                    />
                    <input
                        type="submit"
                        value="Editar Proyecto"
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />
                </form>
            </div>
        </>
    )
}
