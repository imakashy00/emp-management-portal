import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export const useTableData = (apiEndpoint, initialParams = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Filter State
    const [filters, setFilters] = useState({
        page: 1,
        limit: 5,
        search: '',
        status: '',
        startDate: '',
        endDate: '',
        ...initialParams
    });

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(filters.search);
            setFilters(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(handler);
    }, [filters.search]);
    const { page, limit, status, startDate, endDate } = filters;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await axios.get(apiEndpoint, {
                params: { ...filters, search: debouncedSearch },
                headers: { Authorization: `Bearer ${token}` }
            });

            // Handle different API response structures from your controllers
            const result = response.data;
            setData(result.data || []);
            setTotalPages(result.pages || result.pagination?.totalPages || 1);
            setTotalItems(result.total || result.pagination?.totalItems || 0);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to sync data");
        } finally {
            setLoading(false);
        }
    }, [apiEndpoint, page, status, startDate, endDate, debouncedSearch, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateFilter = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value, page: name === 'page' ? value : 1 }));
    };

    return { data, loading, filters, totalPages, totalItems, updateFilter, refresh: fetchData };
};