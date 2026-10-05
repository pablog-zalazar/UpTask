import { type Project, type TaskProject, type taskStatus } from "@/types"
import { TaskCard } from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import { DropTask } from "./DropTask"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { updateStatus } from "@/api/taskApi"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"


type taskListProps = {
    tasks: TaskProject[],
    canEdit: boolean
}

type GroupedTask = {
    [key: string]: TaskProject[]
}

const initialStatusGroups: GroupedTask = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: []
}

const statusStyles: { [key: string]: string } = {
    pending: "border-t-slate-500",
    onHold: "border-t-red-500",
    inProgress: "border-t-blue-500",
    underReview: "border-t-amber-500",
    completed: "border-t-emerald-500"
}

export const TaskList = ({ tasks, canEdit }: taskListProps) => {

    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const groupedTasks = tasks.reduce((acc, task) => {
        const currentGroup = acc[task.status]
            ? [...acc[task.status]]
            : []

        return {
            ...acc,
            [task.status]: [...currentGroup, task]
        }
    }, initialStatusGroups)

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["viewProject", projectId] })

            toast.success(data)
            navigate(location.pathname, { replace: true })
        }
    })

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) return

        const taskId = active.id.toString()
        const status = over.id as taskStatus

        mutation.mutate({ projectId, taskId, status })
        queryClient.setQueryData(["viewProject", projectId], (prevData: Project) => {
            const updatedTasks = prevData.tasks.map((task) => {
                if (task._id.toString() === active.id.toString()) {
                    return {
                        ...task,
                        status
                    }
                }
                return task
            })

            return {
                ...prevData,
                tasks: updatedTasks
            }
        })
    }

    return (
        <>
            <h2 className="text-5xl font-black my-10">
                Tareas
            </h2>

            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">

                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div
                            key={status}
                            className="min-w-75 2xl:min-w-0 2xl:w-1/5"
                        >
                            <h3
                                className={`capitaliza text-xl text-center border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}
                            >
                                {statusTranslations[status]}
                            </h3>

                            <DropTask status={status} />

                            <ul className="mt-5 space-y-5">
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">
                                        No Hay tareas
                                    </li>
                                ) : (
                                    tasks.map(task => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            canEdit={canEdit}
                                        />
                                    ))
                                )}
                            </ul>
                        </div>
                    ))}

                </div>
            </DndContext>
        </>
    )
}
