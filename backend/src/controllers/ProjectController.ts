import { Request, Response } from "express"
import { Project } from "../models/Projct"

export class ProjectController {

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: req.user._id },
                    { team: req.user._id }
                ]
            })
            res.json(projects)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static getProjectByID = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate("tasks")
            if (!project) {
                const error = new Error("Proyecto no encontrado")
                return res.status(404).json({ error: error.message })
            }

            if (project.manager.toString() !== req.user._id.toString() && !project.team.includes(req.user._id)) {
                const error = new Error("Acion no valida")
                return res.status(404).json({ error: error.message })
            }

            res.json(project)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }


    static createProject = async (req: Request, res: Response) => {

        try {
            await Project.create({ ...req.body, manager: req.user })
            res.send("Proyecto creado Correctamente")
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.projectName = req.body.projectName
            req.project.clientName = req.body.clientName
            req.project.description = req.body.description
            await req.project.save()
            res.send("Proyecto actualizado")
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne()
            res.send("Proyecto Eliminado")
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}