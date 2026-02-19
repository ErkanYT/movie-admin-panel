import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get('/api/requests');
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/requests/${id}/status`, { status });
            fetchRequests();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"><CheckCircle size={12} /> Completed</span>;
            case 'rejected':
                return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"><XCircle size={12} /> Rejected</span>;
            default:
                return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold">Content Requests</h2>
                <p className="text-gray-400">Manage user content requests</p>
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">No requests found</td></tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-3 font-medium">{req.title}</td>
                                    <td className="px-6 py-3">{getStatusBadge(req.status)}</td>
                                    <td className="px-6 py-3 text-gray-400 text-sm">{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-3 text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => updateStatus(req.id, 'completed')}
                                                    className="btn-primary px-3 py-1 text-xs bg-green-600 hover:bg-green-500"
                                                >
                                                    Complete
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(req.id, 'rejected')}
                                                    className="btn-secondary px-3 py-1 text-xs hover:bg-red-500/20 text-red-400 hover:border-red-500/30"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Requests;
