import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ filters, totalPages, onPageChange }) => {
    // If there is only one page, we can hide the pagination
    if (totalPages <= 1) return null;

    const currentPage = filters.page || 1;

    return (
        <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-4">
            {/* Page Info */}
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
            </p>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-8">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-blue-600 disabled:opacity-10 disabled:pointer-events-none transition-all cursor-pointer"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Prev</span>
                </button>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-blue-600 disabled:opacity-10 disabled:pointer-events-none transition-all cursor-pointer"
                >
                    <span>Next</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;