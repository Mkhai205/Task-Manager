const Progress = ({ progress, status }) => {
    const getColor = () => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800 border border-green-500/10";
            case "In Progress":
                return "bg-yellow-100 text-yellow-800 border border-yellow-500/10";
            case "Pending":
                return "bg-red-100 text-red-800 border border-red-500/10";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-500/10";
        }
    };

    return (
        <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`} style={{ width: `${progress}%` }}>

            </div>
        </div>
    );
};

export default Progress;
