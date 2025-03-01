import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';

export const createProject = async ({
    name, userId
}) => {
    if (!name) {
        throw new Error('Name is required')
    }
    if (!userId) {
        throw new Error('UserId is required')
    }

    let project;
    try {
        project = await projectModel.create({
            name,
            users: [ userId ]
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project name already exists');
        }
        throw error;
    }

    return project;

}

export const getAllProjectByUserId = async ({ userId }) => {
    if (!userId) {
        throw new Error('UserId is required')
    }

    const allUserProjects = await projectModel.find({
        users: userId
    })

    return allUserProjects
}

export const addUserToProject = async ({ projectId, users }) => {
    if (!projectId) {
        throw new Error('ProjectId is required')
    }
    if (!users) {
        throw new Error('Users are required')
    }

    const project = await projectModel.findById(projectId);

    if (!project) {
        throw new Error('Project not found')
    }

    const projectUsers = project.users;

    users.forEach(user => {
        if (!projectUsers.includes(user)) {
            projectUsers.push(user);
        }
    })

    project.users = projectUsers;

    await project.save();

    return project;
}

export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error('ProjectId is required')
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }
    const project = await projectModel.findOne({
        _id: projectId
    }).populate('users')
    
    return project;
}