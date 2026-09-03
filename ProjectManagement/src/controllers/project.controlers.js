import {User} from '../models/user.model.js';
import {Project} from '../models/project.models.js';
import {ProjectMember} from '../models/projectmemeber.models.js';
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async-handlers.js";




const getProjects = asyncHandler(async (req, res) => {
    //test
});

const getProjectById = asyncHandler(async (req, res) => {
    //test
});


const createProject = asyncHandler(async (req, res) => {
    //test
});


const updateProject = asyncHandler(async (req, res) => {
    //test
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
    //test
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
