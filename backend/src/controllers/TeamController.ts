import { Request, Response } from "express"
import { User } from "../models/User"
import { Project } from "../models/Projct"

export class TeamMemberController {

    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        try {
            // Buscar usuario por email
            const user = await User.findOne({ email }).select("_id email name")
            if (!user) {
                const error = new Error("Usuario no encontrado")
                return res.status(404).json({ error: error.message })
            }
            if (user._id.toString() === req.project.manager.toString()) {
                const error = new Error("No puedes agregarte como colaborador")
                return res.status(404).json({ error: error.message })
            }

            res.json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.project._id).populate({
                path: "team",
                select: "_id name email"
            })

            res.json(project.team)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static addMemberByID = async (req: Request, res: Response) => {
        const { id } = req.body

        try {
            // Buscar usuario por id
            const user = await User.findById(id).select("_id")
            if (!user) {
                const error = new Error("Usuario no encontrado")
                return res.status(404).json({ error: error.message })
            }

            // Comprobar que no pertenece ya al proyecto
            if (req.project.team.some(teamMember => teamMember.toString() === user._id.toString())) {
                const error = new Error("El usuario ya pertenece al proyecto")
                return res.status(409).json({ error: error.message })
            }

            // Agregra al proyecto
            req.project.team.push(user._id)
            await req.project.save()

            res.send("Usuario agregado correctamente")
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static removeMemberByID = async (req: Request, res: Response) => {
        const { userId } = req.params

        try {

            // Comprobar que no pertenece ya al proyecto
            if (!req.project.team.some(teamMember => teamMember.toString() === userId.toString())) {
                const error = new Error("El usuario no pertenece al proyecto")
                return res.status(409).json({ error: error.message })
            }

            // Remover usuario del proyecto
            req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId.toString())
            await req.project.save()

            res.send("Usuario removido del proyecto correctamente")
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }


}