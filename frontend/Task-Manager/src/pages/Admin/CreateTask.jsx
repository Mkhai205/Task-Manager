import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentInput from "../../components/Inputs/AddAttachmentInput";

const CreateTask = () => {
    const location = useLocation();
    const { taskId } = location.state || {};
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "Low",
        dueDate: "",
        assignedTo: [],
        todoChecklist: [],
        attachments: [],
    });

    const [currentTask, setCurrentTask] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    const handleValueChange = (key, value) => {
        setTaskData((prevData) => ({ ...prevData, [key]: value }));
    };

    const clearTaskData = () => {
        setTaskData({
            title: "",
            description: "",
            priority: "Low",
            dueDate: "",
            assignedTo: [],
            todoChecklist: [],
            attachments: [],
        });
    };

    // Create Task
    const createTask = async () => {
        setLoading(true);

        try {
            const todoList = taskData.todoChecklist.map((item) => ({
                text: item,
                completed: false,
            }));

            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(),
                todoChecklist: todoList,
            });

            if(response.data.success) {
                toast.success("Task created successfully!");
                clearTaskData();
            }
        } catch (error) {
            console.error("Error creating task:", error);
            setError("Failed to create task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Update Task
    const updateTask = async () => {};

    // Delete Task
    const deleteTask = async () => {};

    // Get Task info by ID
    const getTaskDetailsByID = async () => {};

    // Submit Task
    const handleSubmit = async () => {
        setError("");

        // Input Validation
        if(!taskData.title.trim()) {
            setError("Please enter task title");
            return;
        }
        if(!taskData.description.trim()) {
            setError("Please enter task description");
            return;
        }
        if(!taskData.dueDate.trim()) {
            setError("Please select due date");
            return;
        }
        if(taskData.assignedTo.length === 0) {
            setError("Please select at least one user to assign the task");
            return;
        }
        if(taskData.todoChecklist.length === 0) {
            setError("Please add at least one item to the checklist");
            return;
        }

        if(taskId) {
            updateTask();
            return;
        }

        createTask();
    };

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                setError(""); // Clear the error after 5 seconds
            }, 5000);
    
            // Cleanup the timeout when the component unmounts or `error` changes
            return () => clearTimeout(timeout);
        }
    }, [error]);

    return (
        <DashboardLayout activeMenu="Create Task">
            <div className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                    <div className="form-card col-span-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl md:text-xl font-medium">
                                {taskId ? "Update Task" : "Create Task"}
                            </h2>

                            {taskId && (
                                <button
                                    className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                                    onClick={() => setOpenDeleteAlert(true)}
                                >
                                    <LuTrash2 className="text-base" size={20} />
                                    Delete Task
                                </button>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="text-xs font-medium text-slate-600">Task Title</label>

                            <input
                                placeholder="Create App UI"
                                className="form-input"
                                value={taskData.title}
                                onChange={(e) => handleValueChange("title", e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                Description
                            </label>

                            <textarea
                                placeholder="Describe task"
                                className="form-input"
                                rows={4}
                                value={taskData.description}
                                onChange={(e) => handleValueChange("description", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-4 mt-2">
                            <div className="col-span-6 md:col-span-4">
                                <label className="text-xs font-medium text-slate-600">
                                    Priority
                                </label>

                                <SelectDropdown
                                    options={PRIORITY_DATA}
                                    value={taskData?.priority}
                                    onChange={(value) => handleValueChange("priority", value)}
                                    placeholder="Select Priority"
                                />
                            </div>

                            <div className="col-span-6 md:col-span-4">
                                <label className="text-xs font-medium text-slate-600">
                                    Due Date
                                </label>

                                <input
                                    placeholder="Select Due Date"
                                    className="form-input"
                                    value={taskData?.dueDate}
                                    onChange={(e) => handleValueChange("dueDate", e.target.value)}
                                    type="date"
                                />
                            </div>

                            <div className="col-span-12 md:col-span-3">
                                <label className="text-xs font-medium text-slate-600">
                                    Assigned To
                                </label>

                                <SelectUsers
                                    selectedUsers={taskData?.assignedTo}
                                    setSelectedUsers={(value) =>
                                        handleValueChange("assignedTo", value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-xs font-medium text-slate-600">
                                TODO Checklist
                            </label>

                            <TodoListInput
                                todoList={taskData?.todoChecklist}
                                setTodoList={(value) => handleValueChange("todoChecklist", value)}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="text-xs font-medium text-slate-600">
                                Add Attachments
                            </label>

                            <AddAttachmentInput
                                attachments={taskData?.attachments}
                                setAttachments={(value) => handleValueChange("attachments", value)}
                            />
                        </div>

                        {error && (
                            <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
                        )}

                        <div className="flex justify-end mt-7">
                            <button
                                className="add-btn"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {taskId ? "Update Task" : "Create Task"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateTask;
