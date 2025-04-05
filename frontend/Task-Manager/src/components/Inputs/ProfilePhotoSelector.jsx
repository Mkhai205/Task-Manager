import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import { useRef, useState } from "react";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(image);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Upload the image state
            setImage(file);

            // Generate a preview URL for the selected image
            const preview = URL.createObjectURL(file);
            setPreviewImage(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewImage(null);
        if (inputRef.current) {
            inputRef.current.value = ""; // Clear the file input
        }
    };

    const onChooseImage = () => {
        if (inputRef.current) {
            inputRef.current.click(); // Trigger the file input click
        }
    };

    return (
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={e => handleImageChange(e)}
                className="hidden"
            />

            {!image ? (
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 relative cursor-pointer">
                    <LuUser className="text-4xl text-primary" />

                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                        onClick={onChooseImage}
                    >
                        <LuUpload className="" />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img
                        src={previewImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
                        onClick={handleRemoveImage}
                    >
                        <LuTrash className="" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
