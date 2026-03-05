const Input = ({ label, error, icon: Icon, onIconClick, ...props }) => {
    return (
        <div className={`group relative ${props.containerClass || ""}`}>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">
                {label} {props.required && "*"}
            </label>

            <div className="relative">
                <input
                    {...props}
                    className={`w-full py-1.5 border-b-2 outline-none transition-colors text-sm pr-10 
              ${error ? 'border-red-500' : 'border-gray-200 focus:border-[#3C78D8]'} 
              ${props.disabled ? 'bg-gray-50' : ''} ${props.className}`}
                />

                {Icon && (
                    <span
                        onClick={onIconClick}
                        className="absolute right-0 top-1.5 text-gray-400 cursor-pointer hover:text-[#3C78D8]"
                    >

                        <Icon size={18} strokeWidth={2} />
                    </span>
                )}
            </div>

            {error && <p className="text-[#CC0000] text-[10px] mt-0.5 font-semibold">{error}</p>}
        </div>
    );
};

export default Input;