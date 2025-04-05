import Task from "../models/Task.js";
import { sendResponse } from "../utils/responseHelper.js";

// @desc   Get all tasks (Admin: all, User: only assigned tasks)
// @route  GET /api/tasks/
// @access Private (Admin or User)
const getTasks = async (req, res) => {
    try {
        const { status } = req.query; // Get status from query parameters
        let filter = {};

        if (status) {
            filter.status = status; // Filter by status if provided
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }

        // Add completed todoChecklist count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter((item) => item.completed).length;
                return { ...task._doc, completedTodoCount: completedCount };
            })
        );

        // Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        return sendResponse(res, 200, true, "Tasks fetched successfully", {
            tasks,
            statusSummary: {
                all: allTasks,
                pending: pendingTasks,
                inProgress: inProgressTasks,
                completed: completedTasks,
            },
        });
    } catch (error) {
        return sendResponse(res, 500, false, "Error fetching tasks", error.message);
    }
};

// @desc   Get task by ID
// @route  GET /api/tasks/:id
// @access Private (Admin or User)
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if (!task) {
            return sendResponse(res, 404, false, "Task not found");
        }

        return sendResponse(res, 200, true, "Task fetched successfully", task);
    } catch (error) {
        return sendResponse(res, 500, false, "Error fetching task", error.message);
    }
};

// @desc   Create a new task (Admin only)
// @route  POST /api/tasks/
// @access Private (Admin only)
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } =
            req.body;

        if (!Array.isArray(assignedTo)) {
            return sendResponse(res, 400, false, "AssignedTo must be an array of user IDs.");
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachments,
            todoChecklist,
        });

        return sendResponse(res, 201, true, "Task created successfully", task);
    } catch (error) {
        return sendResponse(res, 500, false, "Error creating task", error.message);
    }
};

// @desc   Update task details
// @route  PUT /api/tasks/:id
// @access Private (Admin or User)
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return sendResponse(res, 404, false, "Task not found");
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return sendResponse(res, 400, false, "AssignedTo must be an array of user IDs.");
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();

        return sendResponse(res, 200, true, "Task updated successfully", updatedTask);
    } catch (error) {
        return sendResponse(res, 500, false, "Error updating task", error.message);
    }
};

// @desc   Delete a task (Admin only)
// @route  DELETE /api/tasks/:id
// @access Private (Admin only)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return sendResponse(res, 404, false, "Task not found");
        }

        await task.deleteOne();

        return sendResponse(res, 200, true, "Task deleted successfully");
    } catch (error) {
        return sendResponse(res, 500, false, "Error deleting task", error.message);
    }
};

// @desc   Update task status
// @route  PUT /api/tasks/:id/status
// @access Private (Admin or User)
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return sendResponse(res, 404, false, "Task not found");
        }

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== "admin") {
            return sendResponse(res, 403, false, "You are not authorized to update this task");
        }

        task.status = req.body.status || task.status;

        if (task.status === "Completed") {
            task.todoChecklist.forEach((item) => {
                item.completed = true; // Mark all todo items as completed
            });
            task.progress = 100; // Set progress to 100%
        }

        await task.save();

        return sendResponse(res, 200, true, "Task status updated successfully", task);
    } catch (error) {
        return sendResponse(res, 500, false, "Error updating task status", error.message);
    }
};

// @desc   Update task checklist
// @route  PUT /api/tasks/:id/todo
// @access Private (Admin or User)
const updateTaskChecklist = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return sendResponse(res, 404, false, "Task not found");
        }

        if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return sendResponse(res, 403, false, "You are not authorized to update this task");
        }

        const { todoChecklist } = req.body; // Expecting an array of todo items

        if (!Array.isArray(todoChecklist)) {
            return sendResponse(res, 400, false, "Todo checklist must be an array.");
        }

        task.todoChecklist = todoChecklist;

        // Auto-update progess based on checklist completion
        const completedCount = todoChecklist.filter((item) => item.completed).length;
        const totalCount = todoChecklist.length;
        task.progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0; // Calculate progress percentage

        // Auto-update status based on progress
        if (task.progress === 100) {
            task.status = "Completed"; // Set status to completed if all items are done
        } else if (task.progress > 0) {
            task.status = "In Progress"; // Set status to in progress if some items are done
        } else {
            task.status = "Pending"; // Set status to pending if no items are done
        }

        await task.save();

        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        return sendResponse(res, 200, true, "Task checklist updated successfully", {
            task: updatedTask,
        });
    } catch (error) {
        return sendResponse(res, 500, false, "Error updating task checklist", error.message);
    }
};

// @desc   Get dashboard data (Admin only)
// @route  GET /api/tasks/dashboard-data
// @access Private (Admin only)
const getDashboardData = async (req, res) => {
    try {
        // Fetch statistics for the dashboard
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const inProgressTasks = await Task.countDocuments({ status: "In Progress" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            status: { $ne: "Completed" }, // Exclude completed tasks
            dueDate: { $lt: new Date() },
        });

        // Ensure all possible statuses are included in the response
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ""); // Format status to match the key format
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0; // Default to 0 if not found
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks; // Add total tasks to the distribution

        // Ensure all priority levels are included in the response
        const taskPriorities = ["Low", "Medium", "High"];
        const priorityDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                priorityDistributionRaw.find((item) => item._id === priority)?.count || 0; // Default to 0 if not found
            return acc;
        }, {});

        // Fetch recent 10 tasks
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("title status priority dueDate createdAt");

        return sendResponse(res, 200, true, "Dashboard data fetched successfully", {
            statistics: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        return sendResponse(res, 500, false, "Error fetching dashboard data", error.message);
    }
};

// @desc   Get user dashboard data (User only)
// @route  GET /api/tasks/user-dashboard-data
// @access Private (User only)
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id; // Get the user ID from the request

        // Fetch statistics for the user dashboard
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "Completed",
        });
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" }, // Exclude completed tasks
            dueDate: { $lt: new Date() },
        });

        // Task distribution by status
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId }, // Filter by assigned user
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "_").toLowerCase(); // Format status to match the key format
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0; // Default to 0 if not found
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks; // Add total tasks to the distribution

        // Task distribution by priority
        const taskPriorities = ["Low", "Medium", "High"];
        const priorityDistributionRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId }, // Filter by assigned user
            },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                priorityDistributionRaw.find((item) => item._id === priority)?.count || 0; // Default to 0 if not found
            return acc;
        }, {});

        // Fetch recent 10 tasks assigned to the user
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("title status priority dueDate createdAt");

        return sendResponse(res, 200, true, "User dashboard data fetched successfully", {
            statistics: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        return sendResponse(res, 500, false, "Error fetching user dashboard data", error.message);
    }
};

export {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData,
};
