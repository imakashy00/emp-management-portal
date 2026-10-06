
import axios from 'axios';
import { Edit3, Mail, Phone, Save, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../apiConfig';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ userName: '', mobile: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API.ME, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setFormData({ userName: res.data.userName, mobile: res.data.mobile });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(API.UPDATE_PROFILE, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.data);
      // Optional: Update localStorage if you use it globally for the name
      localStorage.setItem('userName', res.data.data.userName);
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-white flex justify-center items-start pt-12 p-6">
      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <User size={32} className="text-gray-300" />
          </div>
          {isEditing ? (
            <input
              className="text-xl font-semibold text-center border-b border-blue-500 outline-none w-full"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            />
          ) : (
            <h1 className="text-xl font-semibold text-gray-800">{user?.userName}</h1>
          )}
          <p className="text-sm text-blue-500 font-medium mt-1 uppercase tracking-widest">{user?.role}</p>
        </div>

        {/* Info List */}
        <div className="space-y-6">
          {/* Email - Always Read Only */}
          <div className="flex items-center gap-4 py-3 border-b border-gray-50">
            <Mail size={18} className="text-gray-300" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
              <p className="text-sm text-gray-500 italic">{user?.email}</p>
            </div>
          </div>

          {/* Mobile - Editable */}
          <div className="flex items-center gap-4 py-3 border-b border-gray-50">
            <Phone size={18} className="text-gray-300" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
              {isEditing ? (
                <input
                  className="text-sm text-gray-800 border-b border-blue-400 outline-none w-full"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-700">{user?.mobile}</p>
              )}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Save size={16} /> Save Changes
              </button>
              <button
                onClick={() => { setIsEditing(false); setFormData({ userName: user.userName, mobile: user.mobile }); }}
                className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <X size={16} /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-8 py-2 border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;