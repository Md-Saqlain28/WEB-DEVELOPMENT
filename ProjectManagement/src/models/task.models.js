import mongoose, { Schema } from "mongoose";
import {AvailableUserRoles, TaskStatusEnum} from "../utils/constants";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assinedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    assinedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: TaskStatusEnum,
        default: TaskStatusEnum.TODO
    },
    attachments: {
        type: [{
            url: String,
            mimetype: String,
            size: Number
        }],
        default: []
    },

}, {timestamps: true});

export const Task = mongoose.model("Task", taskSchema);