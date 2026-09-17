import {Router} from "express";
import {getProjects, getProjectById, createProject, updateProject, addMembersToProject, getProjectMembers, updateMemberRole, deleteMember, deleteProject} from "../controllers/project.controlers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {createProjectValidators, addMembertoProjectValidator} from "../validators/index.js";
import {verifyJWT, validateProjectPermission} from "../middlewares/auth.middleware.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);

router
    .route("/")
    .get(getProjects)
    .post(createProjectValidators(), validate, createProject)

router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRoles), getProjectById)
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), validate, createProjectValidators(), updateProject)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteProject)


router
    .route("/:projectId/members")
    .get(getProjectMembers)
    .post(validateProjectPermission([UserRolesEnum.ADMIN]), addMembertoProjectValidator(), validate, addMembersToProject)


router
    .route("/:projectId/members/:userId")
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateMemberRole)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteMember)


    

export default router