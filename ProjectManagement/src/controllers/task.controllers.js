import {User} from '../models/user.model.js';
import {Project} from '../models/project.models.js';
import {Task} from '../models/task.models.js';
import {Subtask} from '../models/subtask.models.js';
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async-handlers.js";
import mongoose, { mongo } from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from '../utils/constants.js';
import { pipeline } from 'nodemailer/lib/xoauth2/index.js';


const getTasks = asyncHandler(async (req , res) => {
    const {projectId} = req.params;

    const project = await Project.findById(projectId);

    if(!project){
        throw new ApiError(404, "Project not found");
    }
    
    const Tasks = await Task.find({
        project: new mongoose.Types.ObjectId(projectId),
    }).populate("assignedTo", "avatar username fullName")

     return res
        .status(201)
        .json(
            new ApiResponse(201, Tasks, "Tasks fetched successfully")
        )


});

const createTasks = asyncHandler(async (req , res) => {
    const {title, description, assignedTo, status} = req.body;
    const {projectId} = req.params;

    const project = await Project.findById(projectId);

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    const files = req.files || []

    files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimeType: file.mimetype,
            size: file.size
        }
    });

    const task = await Task.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(projectId),
        assinedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo): undefined,
        status,
        assignedBy: new mongo.Types.ObjectId(req.user._id),
        attachments
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, task, "Task created successfully")
        )


}); 

const getTaskById = asyncHandler(async (req , res) => {
    const {taskId} = req.params

    const task = await Task.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(taskId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedTo",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                 $lookup: {
                    from: "subtasks",
                    localField: "_id",
                    foreignField: "task",
                    as: "subtasks",
                    pipeline: [
                        {
                             $lookup: {
                                from: "users",
                                localField: "createdBy",
                                foreignField: "_id",
                                as: "createdBy",
                                pipeline: [
                                    {
                                        $project: {
                                        _id: 1,
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                            }
                        }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                createdBy: {
                                    $arratElemAt: ["$createdBy", 0]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    assignedTo: {
                        $arratElemAt: ["$assignedTo", 0]
                    }
                }
            }
    ]);

    if(!task || task.length === 0){
        throw new ApiError(404, "Task not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, task[0], "task fetched successfully")
        )


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
