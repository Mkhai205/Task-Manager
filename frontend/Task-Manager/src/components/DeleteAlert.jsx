

const DeleteAlert = ({content, onDelete}) => {



    return (
        <div>
            <p className="text-sm dark:text-white">{content}</p>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 ease-in-out cursor-pointer"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteAlert;