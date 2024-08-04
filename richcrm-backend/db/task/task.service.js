const Task = require('./task.db');

class TaskService {
    async getTaskById(taskId) {
        const data = await Task.getTaskById(taskId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async createTask(task) {
        // Check if the task object is valid
        if (task.taskId === undefined ||
            task.taskType === undefined ||
            task.name === undefined ||
            task.status === undefined) {
            console.log("[TASK-Create] Invalid task object");
            return null;
        }

        const data = await Task.createTask(task);
        return data;
    }

    async updateTask(task) {
        // Check if the task object is valid
        if (task.taskId === undefined ||
            task.name === undefined ||
            task.status === undefined ||
            task.taskType === undefined) {
            console.log("[TASK-Update] Invalid task object");
            return null;
        }

        const data = await Task.updateTask(task);
        return data;
    }

    async deleteTask(taskId) {
        // Check if the task ID is valid
        if (taskId === undefined) {
            console.log("[TASK-Delete] Invalid task ID");
            return null;
        }

        const data = await Task.deleteTask(taskId);
        return data;
    }
}

module.exports = new TaskService();