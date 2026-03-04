// const WfhRequest = require('../models/wfhRequestModel');

// const getWfhRequestById = async (req, res) => {
//   try {
//     const wfhRequest = await WfhRequest.findById(req.params.id);
//     if (!wfhRequest) {
//       return res.status(404).json({ message: 'Not found' });
//     }
//     res.status(200).json(wfhRequest);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const addWfhRequest = async (req, res) => {
//   try {
//     const wfhRequest = await WfhRequest.create(req.body);
//     res.status(200).json(wfhRequest);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const updateWfhRequest = async (req, res) => {
//   try {
//     const updated = await WfhRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) {
//       return res.status(404).json({ message: 'Not found' });
//     }
//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
// const deleteWfhRequest = async (req, res) => {
//   try {
//     const deleted = await WfhRequest.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ message: 'Not found' });
//     }
//     res.status(200).json({ message: 'Request deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// module.exports = { getWfhRequestById, addWfhRequest, updateWfhRequest,deleteWfhRequest };