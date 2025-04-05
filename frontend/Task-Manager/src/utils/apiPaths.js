export const BASE_URL = "http://localhost:8000/api"; // Base URL for the API

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        REGISTER: `/auth/register`, // Register a new user (Admin or Member)
        LOGIN: `/auth/login`, // Authenticate user & return JWT token
        GET_PROFILE: `/auth/profile`, // Get user profile details
    },

    USERS: {
        GET_ALL_USERS: `/users`, // Get all users (Admin only)
        GET_USER_BY_ID: (userId) => `/users/${userId}`, // Get user by ID
        CREATE_USER: `/users`, // Create a new user (Admin only)
        UPDATE_USER: (userId) => `/users/${userId}`, // Update user details 
        DELETE_USER: (userId) => `/users/${userId}`, // Delete user (Admin only)
    },

    TASKS: {
        GET_DASHBOARD_DATA: `/tasks/dashboard-data`, // Get dashboard data (Admin only)
        GET_USER_DASHBOARD_DATA: `/tasks/user-dashboard-data`, // Get user dashboard data (Member only)
        GET_ALL_TASKS: `/tasks`, // Get all tasks (Admin: all tasks, Member: only assigned tasks)
        GET_TASK_BY_ID: (taskId) => `/tasks/${taskId}`, // Get task by ID
        CREATE_TASK: `/tasks`, // Create a new task (Admin only)
        UPDATE_TASK: (taskId) => `/tasks/${taskId}`, // Update task details
        DELETE_TASK: (taskId) => `/tasks/${taskId}`, // Delete task (Admin only)

        UPDATE_TASK_STATUS: (taskId) => `/tasks/${taskId}/status`, // Update task status (Admin only)
        UPDATE_TASK_CHECKLIST: (taskId) => `/tasks/${taskId}/todo`, // Update task checklist
    },

    REPORTS: {
        EXPORT_TASKS: `/reports/export/tasks`, // Export all tasks to Excel (Admin only)
        EXPORT_USERS: `/reports/export/users`, // Export user-task to Excel (Admin only)
    },

    IMAGE: {
        UPLOAD_IMAGE: `/auth/upload-image`, // Upload image (Profile picture)
    }
};
