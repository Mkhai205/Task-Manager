import User from "../models/User.js";
import Task from "../models/Task.js";
import excelJS from "exceljs";
import { sendResponse } from "../utils/responseHelper.js";

// @desc   Export all tasks as an Excel file
// @route  GET /api/reports/export/tasks
// @access Private/Admin
const exportTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { haeder: "Status", key: "status", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Created At", key: "createdAt", width: 20 },
        ];

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo
                .map((user) => `${user.name} (${user.email})`)
                .join(", ");
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                assignedTo: assignedTo || "Unassigned",
                dueDate: task.dueDate.toLocaleDateString(),
                createdAt: task.createdAt.toLocaleDateString(),
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=tasks_report.xlsx");

        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
    } catch (error) {
        return sendResponse(res, 500, false, "Errror exporting task report", error.message);
    }
};

// @desc   Export all user-task report as an Excel file
// @route  GET /api/reports/export/users
// @access Private/Admin
const exportUserReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const userTasks = await Task.find().populate("assignedTo", "name email _id");

        const userTaskMap = {};
        users.forEach((user) => {
            userTaskMap[user._id] = {
                _id: user._id,
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        userTasks.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((user) => {
                    if (userTaskMap[user._id]) {
                        userTaskMap[user._id].taskCount += 1;
                        if (task.status === "Pending") {
                            userTaskMap[user._id].pendingTasks += 1;
                        } else if (task.status === "In Progress") {
                            userTaskMap[user._id].inProgressTasks += 1;
                        } else if (task.status === "Completed") {
                            userTaskMap[user._id].completedTasks += 1;
                        }
                    }
                });
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Task Report");

        worksheet.columns = [
            { header: "User ID", key: "_id", width: 25 },
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 50 },
            { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=user_task_report.xlsx");

        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
    } catch (error) {
        return sendResponse(res, 500, false, "Errror exporting user report", error.message);
    }
};

export { exportTaskReport, exportUserReport };
