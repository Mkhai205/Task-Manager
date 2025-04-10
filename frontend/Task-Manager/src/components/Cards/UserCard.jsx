import { getInitials, getStatusTagColor } from "../../utils/helper";

const UserCard = ({ userInfo }) => {
    return (
        <div className="user-card p-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {userInfo?.profileImageUrl ? (
                        <img
                            src={userInfo?.profileImageUrl}
                            alt={userInfo.name}
                            className="w-14 h-14 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-500 flex items-center justify-center text-2xl font-bold text-white">
                            {getInitials(userInfo.name)}
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium">{userInfo?.name}</p>
                        <p className="text-xs text-gray-500">{userInfo?.email}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-end gap-3 mt-5">
                <StatusCard
                    label="Pending"
                    count={userInfo?.taskCounts?.pending || 0}
                    status="Pending"
                />
                <StatusCard
                    label="In Progress"
                    count={userInfo?.taskCounts?.inProgress || 0}
                    status="In Progress"
                />
                <StatusCard
                    label="Completed"
                    count={userInfo?.taskCounts?.completed || 0}
                    status="Completed"
                />
            </div>
        </div>
    );
};

export default UserCard;

const StatusCard = ({ label, count, status }) => {
    return (
        <div
            className={`flex-1 text-[10px] font-medium ${getStatusTagColor(
                status
            )} px-4 py-0.5 rounded`}
        >
            <span className="text-[12px] font-semibold">{count}</span> <br /> {label}
        </div>
    );
};
