import { useDroppable } from '@dnd-kit/core'

interface DropTaskProps {
    status: string
}

export const DropTask = ({ status }: DropTaskProps) => {

    const {
        isOver,
        setNodeRef,
    } = useDroppable({
        id: status,
    })

    return (
        <div
            ref={setNodeRef}
            className={` text-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500 transition  ${isOver ? 'bg-slate-100' : ''} `}
        >
            Arrastrar tareas
        </div>
    )
}

