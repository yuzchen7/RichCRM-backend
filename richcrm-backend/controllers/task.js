const TaskService = require('../db/task/task.service');
const TemplateController = require('./template');

const Types = require('../db/types');
const { v4: uuidv4 } = require('uuid');

class TaskController {
    async readTaskById(req, res) {
        const { taskId } = req.params;
        try {
            const task = await TaskService.getTaskById(taskId);
            if (task === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][readTaskById] Task not found'
                });
            }
            return res.status(200).json({
                status: "success",
                data: [{
                    taskId: task.TaskId,
                    taskType: task.TaskType,
                    name: task.Name,
                    status: task.Status,
                    templates: task.Templates,
                    fileURL: task.FileURL
                }],
                message: '[TaskController][readTaskById] Task found'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskController][readTaskById] Internal server error: ${error}`
            });
        }
    }

    async createTask(req, res) {
        const { taskType, name, status, templates, fileURL } = req.body;
        try {
            // Check if the taskType is valid
            const taskTypeEnum = Types.castIntToEnum(Types.taskType, taskType);
            if (taskTypeEnum === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][createTask] Invalid taskType'
                });
            }

            // Check if the status is valid
            const statusEnum = Types.castIntToEnum(Types.status, status);
            if (statusEnum === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][createTask] Invalid status'
                });
            }

            // Check if the templates exist
            const templateTitles = await TemplateController.validateTemplates(templates);

            const taskId = uuidv4();
            const taskObj = {
                taskId: taskId,
                taskType: taskType,
                name: name,
                status: status,
                templates: templateTitles,
                fileURL: fileURL
            };
            const data = await TaskService.createTask(taskObj);
            return res.status(200).json({
                status: "success",
                data: [{
                    taskId: data.TaskId,
                    taskType: data.TaskType,
                    name: data.Name,
                    status: data.Status,
                    templates: data.Templates,
                    fileURL: data.FileURL
                }],
                message: '[TaskController][createTask] Task created'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskController][createTask] Internal server error: ${error}`
            });
        }
    }

    async updateTask(req, res) {
        const { taskId, name, status, templates, fileURL } = req.body;
        try {
            // Check if the taskId is valid
            const task = await TaskService.getTaskById(taskId);
            if (task === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][updateTask] Task not found'
                });
            }

            var taskObj = {
                taskId: taskId,
                taskType: task.TaskType,
                name: task.Name,
                status: task.Status,
                templates: task.Templates,
                fileURL: task.FileURL
            };

            // Check if the status is valid
            if (status !== undefined) {
                const statusEnum = Types.castIntToEnum(Types.status, status);
                if (statusEnum === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[TaskController][updateTask] Invalid status'
                    });
                }

                taskObj.status = status;
            }

            if (name !== undefined) {
                taskObj.name = name;
            }

            if (templates !== undefined) {
                taskObj.templates = await TemplateController.validateTemplates(templates);
            }
            
            if (fileURL !== undefined) {
                taskObj.fileURL = fileURL;
            }

            const data = await TaskService.updateTask(taskObj);
            return res.status(200).json({
                status: "success",
                data: [{
                    taskId: data.TaskId,
                    taskType: data.TaskType,
                    name: data.Name,
                    status: data.Status,
                    templates: data.Templates,
                    fileURL: data.FileURL
                }],
                message: '[TaskController][updateTask] Task updated'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskController][updateTask] Internal server error: ${error}`
            });
        }
    }

    async deleteTask(req, res) {
        const { taskId } = req.body;
        try {
            const task = await TaskService.getTaskById(taskId);
            if (task === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][deleteTask] Task not found'
                });
            }
            const t = await TaskService.deleteTask(taskId);
            if (t !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [],
                    message: '[TaskController][deleteTask] Task deleted'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][deleteTask] Task not deleted successfully'
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskController][deleteTask] Internal server error: ${error}`
            });
        }
    }
}

module.exports = new TaskController();