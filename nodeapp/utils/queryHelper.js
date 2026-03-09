exports.buildSmartQuery = async (req, UserModel, extraQuery = {}) => {
    const { search, status, startDate, endDate } = req.query;
    let query = { ...extraQuery };

    // 1. Status Filter (for Leaves/WFH)
    if (status && status !== 'All') query.status = status;

    // 2. Date Range Filter
    if (startDate || endDate) {
        query.startDate = {};
        if (startDate) query.startDate.$gte = new Date(startDate);
        if (endDate) query.startDate.$lte = new Date(endDate);
    }

    // 3. Smart Search
    if (search) {
        if (extraQuery.employeeId) {
            /**
             * CASE 1: Employee View (Searching own History)
             * We only search fields that exist in Leave/WFH models (reason, leaveType)
             */
            query.$or = [
                { reason: { $regex: search, $options: "i" } },
                { leaveType: { $regex: search, $options: "i" } }
            ];
        } else if (UserModel) {
            /**
             * CASE 2: Manager View (Searching Requests across all users)
             * Search reason OR find User IDs by name/email
             */
            const matchingUsers = await UserModel.find({
                $or: [
                    { userName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }).select("_id");

            query.$or = [
                { reason: { $regex: search, $options: "i" } },
                { leaveType: { $regex: search, $options: "i" } },
                { employeeId: { $in: matchingUsers.map(u => u._id) } }
            ];
        } else {
            /**
             * CASE 3: Directory View (Searching User collection directly)
             */
            query.$or = [
                { userName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } }
            ];
        }
    }

    return query;
};