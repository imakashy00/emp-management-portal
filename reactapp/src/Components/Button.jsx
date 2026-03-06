const Button = ({ children, loading, ...props }) => (
    <button
        {...props}
        disabled={loading || props.disabled}
        className={`w-full bg-[#1C4587] hover:bg-[#153669] text-white py-2.5 rounded font-bold text-sm mt-8 transition-all transform active:scale-95 disabled:opacity-50 ${props.className}`}
    >
        {loading ? "Processing..." : children}
    </button>
);
export default Button