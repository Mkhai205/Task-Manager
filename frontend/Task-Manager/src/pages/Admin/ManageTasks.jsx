import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

const ManageTasks = () => {
    const [allTasks, setAllTasks] = useState([]);

    const [tabs, setTabs] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");

    const navigate = useNavigate();

    const getAllTasks = async (filterStatus) => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
                params: {
                    status: filterStatus === "All" ? "" : filterStatus,
                },
            });

            setAllTasks(response.data?.data?.tasks.length > 0 ? response?.data?.data?.tasks : []);

            //  Map statusSummary data with fixed labels and order
            const statusSummary = response.data?.data?.statusSummary || {};

            const statusArray = [
                { label: "All", count: statusSummary.all || 0 },
                { label: "Pending", count: statusSummary.pending || 0 },
                { label: "In Progress", count: statusSummary.inProgress || 0 },
                { label: "Completed", count: statusSummary.completed || 0 },
            ];

            setTabs(statusArray);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleClick = (taskData) => {
        navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
    };

    const handleDownloadReport = (async) => {};

    useEffect(() => {
        getAllTasks(filterStatus);
        return () => {};
    }, [filterStatus]);

    return (
        <DashboardLayout activeMenu="Manege Tasks">
            <div className="my-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-bold md:text-xl">My Tasks</h2>

                        <button
                            className="flex lg:hidden download-btn"
                            onClick={handleDownloadReport}
                        >
                            <LuFileSpreadsheet className="text-lg" />
                            Download Report
                        </button>
                    </div>

                    {allTasks?.length > 0 && (
                        <div className="flex items-center gap-3">
                            <TaskStatusTabs
                                tabs={tabs}
                                activeTab={filterStatus}
                                setActiveTab={setFilterStatus}
                            />

                            <button
                                className="hidden lg:flex download-btn"
                                onClick={handleDownloadReport}
                            >
                                <LuFileSpreadsheet className="text-lg" />
                                Download Report
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {allTasks?.map((item) => (
                        <TaskCard
                            key={item._id}
                            title={item.title}
                            description={item.description}
                            status={item.status}
                            priority={item.priority}
                            progress={item.progress}
                            createdAt={item.createdAt}
                            dueDate={item.dueDate}
                            assignedTo={item.assignedTo}
                            attachmentCount={item.attachments?.length || 0}
                            completedTodoCount={item.completedTodoCount || 0}
                            todoChecklist={item.todoChecklist || []}
                            onClick={() => handleClick(item)}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManageTasks;
