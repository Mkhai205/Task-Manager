import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { getStatusTagColor } from "../../utils/helper";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { LuPanelTopDashed, LuSquareArrowOutUpRight } from "react-icons/lu";
import toast from "react-hot-toast";

const ViewTaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);

    // get Task todo Check
    const getTaskDetailsByID = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));

            if (response.data?.success) {
                setTask(response.data?.data);
            }
        } catch (error) {
            console.error("Error fetching task details:", error.message);
        }
    };

    // handle todo check
    const updateTodoChecklist = async (index) => {
        const todoChecklist = [...(task?.todoChecklist ?? [])];
        const taskId = id;

        if (todoChecklist && todoChecklist[index]) {
            todoChecklist[index].completed = !todoChecklist[index].completed;

            try {
                const response = await axiosInstance.put(
                    API_PATHS.TASKS.UPDATE_TASK_CHECKLIST(taskId),
                    { todoChecklist }
                );

                if (response.data?.success) {
                    setTask(response.data?.data.task || task);
                } else {
                    todoChecklist[index].completed = !todoChecklist[index].completed;
                }
            } catch (error) {
                todoChecklist[index].completed = !todoChecklist[index].completed;
                console.error("Error updating todo checklist:", error);
                toast.error("Something went wrong while updating checklist.");
            }
        }
    };

    // handle attachment link click
    const handleAttachmentLinkClick = async (link) => {
        if (!/^(http|https):\/\//i.test(link)) {
            link = `http://${link}`;
        }

        window.open(link, "_blank");
    };

    useEffect(() => {
        if (id) {
            getTaskDetailsByID();
        }
    }, [id]);

    return (
        <DashboardLayout activeMenu="My Tasks">
            <div className="mt-5">
                {task && (
                    <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                        <div className="form-card col-span-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg md:text-xl font-semibold">{task?.title}</h2>

                                <div
                                    className={`text-[12px] md:text[13px] font-medium ${getStatusTagColor(
                                        task?.status
                                    )} px-4 py-0.5 rounded`}
                                >
                                    {task?.status}
                                </div>
                            </div>

                            <div className="mt-4">
                                <InfoBox label="Description" value={task?.description} />
                            </div>

                            <div className="grid grid-cols-12 gap-4 mt-4">
                                <div className="col-span-6 md:col-span-4">
                                    <InfoBox label="Priority" value={task?.priority} />
                                </div>

                                <div className="col-span-6 md:col-span-4">
                                    <InfoBox
                                        label="Due Date"
                                        value={
                                            task?.dueDate
                                                ? moment(task?.dueDate).format("Do MMM YYYY")
                                                : "N/A"
                                        }
                                    />
                                </div>

                                <div className="col-span-6 md:col-span-4">
                                    <label className="text-sm font-medium text-slate-500">
                                        Assigned To
                                    </label>

                                    <AvatarGroup avatars={task?.assignedTo} maxVisible={5} />
                                </div>
                            </div>

                            <div className="mt-2">
                                <label className="text-sm font-medium text-slate-500">
                                    Todo Checklist
                                </label>

                                {task?.todoChecklist?.map((item, index) => (
                                    <TodoCheckList
                                        key={`todo_${index}`}
                                        text={item?.text}
                                        isChecked={item?.completed}
                                        onChange={() => updateTodoChecklist(index)}
                                    />
                                ))}
                            </div>

                            {task?.attachments?.length > 0 && (
                                <div className="mt-2">
                                    <label className="text-sm font-medium text-slate-500">
                                        Attachments
                                    </label>

                                    {task?.attachments?.map((link, index) => (
                                        <Attachment
                                            key={`link_${index}`}
                                            link={link}
                                            index={index}
                                            onclick={() => handleAttachmentLinkClick(link)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ViewTaskDetail;

const InfoBox = ({ label, value }) => {
    return (
        <>
            <label className="text-sm font-medium text-slate-500">{label}</label>

            <p className="text-[13px] md:text-[14px] font-medium text-gray-900 mt-0.5">{value}</p>
        </>
    );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
    return (
        <div className="flex items-center gap-3 p-3">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none hover:ring-0 focus:ring-0 cursor-pointer"
            />

            <p className="text-[13px] text-black">{text}</p>
        </div>
    );
};

const Attachment = ({ link, index, onclick }) => {
    return (
        <div
            className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer hover:shadow-sm transition-all duration-200 ease-in-out"
            onClick={onclick}
        >
            <div className="flex-1 flex items-center gap-3">
                <span className="text-sm text-gray-400 font-semibold mr-2">
                    {index < 9 ? `0${index + 1}` : index + 1}
                </span>

                <p className="text-[13px] text-black">{link}</p>
            </div>

            <LuSquareArrowOutUpRight className="text-gray-400" />
        </div>
    );
};
