import { deleteNote } from '@/api/noteApi'
import { useAuth } from '@/hooks/useAuth'
import type { Note } from '@/types'
import { formateDate } from '@/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

type NoteDetailProps = {
    note: Note
}

export const NoteDetail = ({ note }: NoteDetailProps) => {
    const params = useParams()
    const projectId = params.projectId!

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get("viewTask")!

    const { data, isLoading } = useAuth()
    const canDelete = useMemo(() => note.createdBy._id.toString() === data?._id.toString(), [data])

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["task", taskId] })
        }
    })

    if (isLoading) return "Cargando"

    return (
        <div className='p-3 flex justify-between items-center'>
            <div>
                <p>
                    {note.content} por: <span className='font-bold'>{note.createdBy.name}</span>
                </p>
                <p className='text-xs text-slate-500'>
                    {formateDate(note.createdAt)}
                </p>
            </div>

            {canDelete && (
                <button
                    type="button"
                    onClick={() => mutate({ taskId, projectId, noteId: note._id })}
                    className='bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors'>Eliminar</button>
            )}
        </div>
    )
}
