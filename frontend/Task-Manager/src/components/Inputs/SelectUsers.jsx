import { useEffect, useState } from "react";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";
import { getInitials } from "../../utils/helper";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

            if (response?.data.success && response?.data?.data.length > 0) {
                setAllUsers(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const toggleUserSelection = (userId) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false);
    };

    const selectedUserAvatars = allUsers.filter((user) => selectedUsers?.includes(user._id));
    
    useEffect(() => {
        getAllUsers();
    }, []);
    
    useEffect(() => {
        if (selectedUsers?.length === 0) {
            setTempSelectedUsers([]);
        }
        
        return () => {};
    }, [selectedUsers]);


    return (
        <div className="space-y-4 mt-2">
            {selectedUserAvatars.length === 0 && (
                <button className="card-btn" onClick={() => setIsModalOpen(true)}>
                    <LuUsers className="text-sm" /> Add Members
                </button>
            )}

            {selectedUserAvatars.length > 0 && (
                <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Users">
                <div className="space-y-4 h-[60vh] overflow-auto">
                    {allUsers.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-4 p-3 border-b border-gray-200"
                        >
                            {user?.profileImageUrl ? (
                                <img
                                    src={user?.profileImageUrl}
                                    alt={user.name}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-14 h-14 rounded-full bg-gray-500 flex items-center justify-center text-2xl font-bold text-white"
                                >
                                    {getInitials(user.name)}
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {user.name}
                                </p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {user.email}
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                className="w-5 h-5 text-primary bg-gray-100 border-gray-400 rounded-sm outline-none"
                                checked={tempSelectedUsers.includes(user._id)}
                                onChange={() => toggleUserSelection(user._id)}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button className="card-btn" onClick={() => setIsModalOpen(false)}>
                        CANCEL
                    </button>
                    <button className="card-btn-fill" onClick={handleAssign}>
                        DONE
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SelectUsers;
