import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { handleInputError } from "../middleware/validation"
import { TaskController } from "../controllers/TasksController"
import { projectExists } from "../middleware/project"
import { hasAuthorization, taskBelongToProject, taskExists } from "../middleware/task"
import { authenticate } from "../middleware/auth"
import { TeamMemberController } from "../controllers/TeamController"
import { NoteController } from "../controllers/NoteController"

export const router = Router()

router.use(authenticate)

router.get("/", ProjectController.getAllProjects)

router.get("/:id",
    param("id")
        .isMongoId().withMessage("ID no valido"),
    handleInputError,

    ProjectController.getProjectByID
)

router.post("/",
    body("projectName")
        .notEmpty().withMessage("El nombre del proyecto es obligatorio"),
    body("clientName")
        .notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripcion del proyecto es obligatoria"),
    handleInputError,

    ProjectController.createProject
)

router.param("projectId", projectExists)

router.put("/:projectId",
    hasAuthorization,
    param("projectId")
        .isMongoId().withMessage("ID no valido"),
    body("projectName")
        .notEmpty().withMessage("El nombre del proyecto es obligatorio"),
    body("clientName")
        .notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripcion del proyecto es obligatoria"),
    handleInputError,

    ProjectController.updateProject
)

router.delete("/:projectId",
    hasAuthorization,
    param("projectId")
        .isMongoId().withMessage("ID no valido"),
    handleInputError,

    ProjectController.deleteProject
)

// Routes for tasks
router.post("/:projectId/tasks",
    hasAuthorization,
    param("projectId")
        .isMongoId().withMessage("ID no valido"),
    body("name")
        .notEmpty().withMessage("El nombre de la es obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripcion de la tarea es obligatoria"),
    handleInputError,

    TaskController.createTask
)

router.get("/:projectId/tasks",
    TaskController.getProjectTasks
)


router.param("taskId", taskExists)
router.param("taskId", taskBelongToProject)

router.get("/:projectId/tasks/:taskId",
    param("taskId")
        .isMongoId().withMessage("ID no valido"),
    handleInputError,
    TaskController.getTaskByID
)

router.put("/:projectId/tasks/:taskId",
    hasAuthorization,
    param("taskId")
        .isMongoId().withMessage("ID no valido"),
    body("name")
        .notEmpty().withMessage("El nombre de la es obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripcion de la tarea es obligatoria"),
    handleInputError,
    TaskController.updateTask
)

router.delete("/:projectId/tasks/:taskId",
    hasAuthorization,
    param("taskId")
        .isMongoId().withMessage("ID no valido"),
    handleInputError,
    TaskController.deleteTask
)

router.post("/:projectId/tasks/:taskId/status",
    param("taskId")
        .isMongoId().withMessage("ID no valido"),
    body("status")
        .notEmpty().withMessage("El nuevo estado es obligatorio"),
    handleInputError,
    TaskController.updateTaskStatus
)

// Rutas para el team
router.post("/:projectId/team/find",
    body("email")
        .isEmail().toLowerCase().withMessage("Email no valido"),

    handleInputError,
    TeamMemberController.findMemberByEmail
)

router.get("/:projectId/team",
    handleInputError,
    TeamMemberController.getProjectTeam
)

router.post("/:projectId/team",
    body("id")
        .isMongoId().withMessage("ID no valido"),

    handleInputError,
    TeamMemberController.addMemberByID
)

router.delete("/:projectId/team/:userId",
    param("userId")
        .isMongoId().withMessage("ID de usuario no valido"),
    handleInputError,
    TeamMemberController.removeMemberByID
)

// Rutas para notes
router.post("/:projectId/tasks/:taskId/notes",
    body("content")
        .notEmpty().withMessage("El contenido de la nota es obligatorio"),

    handleInputError,
    NoteController.createNote
)

router.get("/:projectId/tasks/:taskId/notes",

    handleInputError,
    NoteController.getTaskNotes
)

router.delete("/:projectId/tasks/:taskId/notes/:noteId",
    param("noteId")
        .isMongoId().withMessage("ID no valido"),

    handleInputError,
    NoteController.deleteNote
)