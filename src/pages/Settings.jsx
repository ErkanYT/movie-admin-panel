import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, RefreshCw, AlertTriangle, Smartphone, Globe, Shield } from 'lucide-react';

import { API_URL } from '../config';

const Settings = () => {
    const [settings, setSettings] = useState({
        app_name: '',
        maintenance_mode: 'false',
        primary_color: '',
        tmdb_api_key: '',
        min_version: '1.0.0',
        announcement_text: '',
        announcement_active: 'false'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch settings on mount
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/settings`);
            setSettings(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching settings:', err);
            // Fallback for dev if backend fails  
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? String(checked) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/settings/update`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Settings updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error saving settings:', err);
            setMessage('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white p-8">Loading settings...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Global Settings</h1>
                <button
                    onClick={fetchSettings}
                    className="p-2 bg-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.includes('success') ? <Save size={18} /> : <AlertTriangle size={18} />}
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* General Settings */}
                <div className="bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <Globe size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-white">General App Config</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">App Name</label>
                            <input
                                type="text"
                                name="app_name"
                                value={settings.app_name || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Primary Color (Hex)</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={settings.primary_color || '#E50914'}
                                    disabled
                                    className="h-10 w-10 rounded cursor-pointer bg-transparent border-none"
                                />
                                <input
                                    type="text"
                                    name="primary_color"
                                    value={settings.primary_color || ''}
                                    onChange={handleChange}
                                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* System & Maintenance */}
                <div className="bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-white">System Control</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-700/50">
                            <div>
                                <h3 className="font-medium text-white">Maintenance Mode</h3>
                                <p className="text-xs text-gray-400">Lock the app with a "Coming Soon" screen</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="maintenance_mode"
                                    checked={settings.maintenance_mode === 'true'}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Minimum App Version</label>
                            <input
                                type="text"
                                name="min_version"
                                value={settings.min_version || ''}
                                onChange={handleChange}
                                placeholder="1.0.0"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-1">Users below this version will be forced to update.</p>
                        </div>
                    </div>
                </div>

                {/* Announcement (Dynamic Banner) */}
                <div className="bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 shadow-xl lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                            <Smartphone size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Mobile Announcement</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="announcement_active"
                                    checked={settings.announcement_active === 'true'}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 peer-checked:bg-yellow-500"></div>
                            </label>
                            <span className="text-sm font-medium text-gray-300">Show Announcement Banner</span>
                        </div>

                        <textarea
                            name="announcement_text"
                            value={settings.announcement_text || ''}
                            onChange={handleChange}
                            rows="2"
                            placeholder="New episode arriving this weekend!"
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        ></textarea>
                    </div>
                </div>

            </form>

            {/* Floating Save Button */}
            <div className="fixed bottom-8 right-8">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save size={24} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Settings;
