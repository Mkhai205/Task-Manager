export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 8;
};

export const addThousandSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart ? `${formattedIntegerPart}.${fractionalPart}` : formattedIntegerPart;
};

// Get the first letter of the username for the avatar fallback
export const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
};

export const getStatusTagColor = (status) => {
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

export const getPriorityTagColor = (priority) => {
    switch (priority) {
        case "Low":
            return "text-emerald-500 bg-emerald-100 border border-emerald-500/10";
        case "Medium":
            return "text-amber-500 bg-amber-100 border border-amber-500/10";
        case "High":
            return "text-rose-500 bg-rose-100 border border-rose-500/10";
        default:
            return "text-gray-500 bg-gray-100 border border-gray-500/10";
    }
};
