import { getInitials } from "../utils/helper";

const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
    return (
        <div className="flex items-center">
            {avatars?.slice(0, maxVisible).map((avatar, index) =>
                (avatar.profileImageUrl ? (
                    <img
                        key={index}
                        src={avatar.profileImageUrl} // Access the profileImageUrl property
                        alt={`Avatar ${index + 1}`}
                        className={`w-12 h-12 rounded-full object-cover border-2 border-white ${
                            index > 0 ? "-ml-2" : ""
                        }`}
                    />
                ) : (
                    <div
                        key={index}
                        className={`w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-2xl font-bold border-2 border-white text-white ${
                            index > 0 ? "-ml-2" : ""
                        }`}
                    >
                        {getInitials(avatar.name)} {/* Use initials if no profileImageUrl */}
                    </div>
                ))
            )}

            {avatars?.length > maxVisible && (
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-sm font-medium border-2 border-white -ml-2 overflow-hidden">
                    +{avatars.length - maxVisible}
                </div>
            )}
        </div>
    );
};

export default AvatarGroup;
