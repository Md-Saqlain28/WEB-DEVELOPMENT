import {User} from '../models/user.model.js';
import {Project} from '../models/project.models.js';
import {ProjectMember} from '../models/projectmemeber.models.js';
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async-handlers.js";
import mongoose from "mongoose";



const getProjects = asyncHandler(async (req, res) => {
    //test
});

const getProjectById = asyncHandler(async (req, res) => {
    //test
});


const createProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body;

    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId (req.user._id)
    });

    await ProjectMember.create({
        user: new mongoose.Types.ObjectId (req.user._id),
        project: new mongoose.Types.ObjectId (project._id),
        role: UserRolesEnum.ADMIN
    })

    return res
        .status(201)
        .json(new ApiResponse(true, "Project created successfully", project));
});


const updateProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    const {projectId} = req.params;

        await Project.findByIdAndUpdate(
            projectId,
            {
                name,
                description
            },
            {new: true}
        )

        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(true, "Project updated successfully", project));
});

const addMembersToProject = asyncHandler(async (req, res) => {
    //test
});

const getProjectMembers = asyncHandler(async (req, res) => {
    //test
});

const updateMemberRole = asyncHandler(async (req, res) => {
    //test
});

const deleteMember = asyncHandler(async (req, res) => {
    //test
});

const deleteProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params;

    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(true, "Project deleted successfully", project));
});


export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    addMembersToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember,
    deleteProject
};
