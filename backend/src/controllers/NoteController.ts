import type { Request, Response } from "express"
import { Note, INote } from "../models/Note"
import { Types } from "mongoose"

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {

    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body
        const note = new Note()
        note.content = content
        note.createdBy = req.user._id
        note.task = req.task._id

        req.task.notes.push(note._id)
        try {
            await Promise.allSettled([req.task.save(), note.save()])
            console.log("first")
            res.send("Nota creada correctamente")
        } catch (error) {
            console.log("second")
            res.status(500).send({ error: error.message })
        }

    }

    static getTaskNotes = async (req: Request, res: Response) => {

        try {
            const notes = await Note.find({ task: req.task._id })
            res.json(notes)
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const { noteId } = req.params

        try {
            const note = await Note.findById(noteId)

            if (!note) {
                const error = new Error("Nota no encontrada")
                return res.status(404).json({ error: error.message })
            }

            if (note.createdBy._id.toString() !== req.user._id.toString()) {
                const error = new Error("Accion no valida")
                return res.status(401).json({ error: error.message })
            }

            req.task.notes = req.task.notes.filter(note => note._id.toString() !== noteId.toString())

            await Promise.allSettled([note.deleteOne(), req.task.save()])
            res.send("Nota Eliminada")

        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

}