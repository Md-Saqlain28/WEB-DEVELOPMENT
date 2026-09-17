import {User} from '../models/user.model.js';
import {Project} from '../models/project.models.js';
import {Task} from '../models/task.models.js';
import {Subtask} from '../models/subtask.models.js';
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async-handlers.js";
import mongoose from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from '../utils/constants.js';


const getTasks = asyncHandler(async (req , res) => {
    //chai
});

const createTasks = asyncHandler(async (req , res) => {
    //chai
}); 

const getTaskById = asyncHandler(async (req , res) => {
    //chai
}); 

const updateTask = asyncHandler(async (req , res) => {
    //chai
}); 

const deleteTask = asyncHandler(async (req , res) => {
    //chai
}); 


const createSubTask = asyncHandler(async (req , res) => {
    //chai
});

const updateSubTask = asyncHandler(async (req , res) => {
    //chai
});

const deleteSubTask = asyncHandler(async (req , res) => {
    //chai
});


export{
    createTasks,
    createSubTask,
    getTasks,
    getTaskById,
    updateTask,
    updateSubTask,
    deleteTask,
    deleteSubTask,
};
