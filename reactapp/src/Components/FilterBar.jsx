import { Search, X } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, showStatus = true, showDates = true }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 my-4 items-end justify-between border-b border-gray-100 pb-6">
            <div className="flex flex-wrap items-center gap-4 w-full">
                {/* Smart Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-blue-100 outline-none transition-all"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                {showStatus && (
                    <select
                        className="w-full sm:w-40 px-3 py-2 bg-gray-50 border-transparent rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-100 cursor-pointer transition-all"
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                )}

                {/* Date Filters */}
                {showDates && (
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
                        <input
                            type="date"
                            className="bg-transparent text-xs border-none outline-none p-1"
                            value={filters.startDate}
                            onChange={(e) => onFilterChange('startDate', e.target.value)}
                        />
                        <span className="text-gray-300">-</span>
                        <input
                            type="date"
                            className="bg-transparent text-xs border-none outline-none p-1"
                            value={filters.endDate}
                            onChange={(e) => onFilterChange('endDate', e.target.value)}
                        />
                        {(filters.startDate || filters.endDate) && (
                            <button
                                onClick={() => { onFilterChange('startDate', ''); onFilterChange('endDate', ''); }}
                                className="p-1 hover:bg-gray-200 rounded-full"
                            >
                                <X size={12} className="text-gray-400" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBar;