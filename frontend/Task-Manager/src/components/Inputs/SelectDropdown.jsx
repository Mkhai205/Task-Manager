import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            {/* Dropdown button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full mt-2 text-sm flex items-center justify-between p-3 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                <span className="ml-2">{isOpen ? <LuChevronDown className="rotate-180" /> : <LuChevronDown className="" />}</span>
            </button>
    
            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute w-full bg-white border border-slate-100 rounded-md shadow-md z-10">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectDropdown;
