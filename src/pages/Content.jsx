import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Search, Link, Film, Tv, Play, ChevronDown, ChevronRight } from 'lucide-react';

const CATEGORIES = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Drama' },
    { id: 3, name: 'Sci-Fi' },
    { id: 4, name: 'Comedy' },
    { id: 5, name: 'Horror' },
    { id: 6, name: 'Thriller' },
];

const Content = () => {
    const [contentList, setContentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [manageSeasonsMode, setManageSeasonsMode] = useState(null); // ID of series being managed

    // Smart Form State
    const [addMode, setAddMode] = useState('manual'); // 'manual' | 'auto'
    const [tmdbId, setTmdbId] = useState('');
    const [isFetchingTmdb, setIsFetchingTmdb] = useState(false);

    // Main Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        poster_url: '',
        backdrop_url: '',
        video_url: '',
        category_id: 1,
        rating: 7.0,
        release_date: new Date().toISOString().split('T')[0],
        type: 'movie' // 'movie' or 'series'
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data } = await axios.get('/api/content');
            setContentList(data);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchTMDB = async () => {
        if (!tmdbId) return;
        setIsFetchingTmdb(true);
        try {
            const { data } = await axios.get(`/api/tmdb/fetch?tmdb_id=${tmdbId}&type=${formData.type}`);
            setFormData({
                ...formData,
                title: data.title,
                description: data.description,
                poster_url: 'https://image.tmdb.org/t/p/w500' + data.poster_url.replace('https://image.tmdb.org/t/p/w500', ''), // Ensure correct format if API returns full URL
                backdrop_url: 'https://image.tmdb.org/t/p/original' + data.backdrop_url.replace('https://image.tmdb.org/t/p/w500', ''),
                rating: data.rating,
                release_date: data.release_date || new Date().toISOString().split('T')[0],
                category_id: data.category_id
            });
            setAddMode('manual'); // Switch to manual to review/edit
        } catch (error) {
            console.error('Error fetching from TMDB:', error);
            alert('Failed to fetch data from TMDB. Please check the ID and try again.');
        } finally {
            setIsFetchingTmdb(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this content?')) {
            // Optimistic UI update
            const originalList = [...contentList];
            setContentList(contentList.filter(item => item.id !== id));

            try {
                await axios.delete(`/api/content/${id}`);
            } catch (error) {
                console.error('Error deleting content:', error);
                // Revert if failed
                setContentList(originalList);
                alert('Failed to delete content');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/content', formData);
            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                poster_url: '',
                backdrop_url: '',
                video_url: '',
                category_id: 1,
                rating: 7.0,
                release_date: new Date().toISOString().split('T')[0],
                type: 'movie'
            });
            setTmdbId('');
            setAddMode('manual');
            fetchContent();
        } catch (error) {
            console.error('Error adding content:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredContent = contentList.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold">Content Library</h2>
                    <p className="text-gray-400">Manage movies and TV series</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Content
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search titles..."
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Content List */}
            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Poster</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredContent.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">No content found</td></tr>
                        ) : (
                            filteredContent.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-3">
                                        <img
                                            src={item.poster_url}
                                            alt={item.title}
                                            className="w-12 h-16 object-cover rounded-md bg-gray-800"
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/48x64?text=No+Img'}
                                        />
                                    </td>
                                    <td className="px-6 py-3 font-medium">{item.title}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${item.type === 'series' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                            {item.type === 'series' ? 'SERIES' : 'MOVIE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-secondary border border-secondary/20">
                                            {item.category_name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-yellow-400 flex items-center gap-1">
                                        <span>★</span> {item.rating}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            {item.type === 'series' && (
                                                <button
                                                    onClick={() => setManageSeasonsMode(item)}
                                                    className="text-purple-400 hover:text-purple-300 p-2 hover:bg-purple-400/10 rounded-lg transition"
                                                    title="Manage Seasons"
                                                >
                                                    <Tv size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Content Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold">Add New Content</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Mode Toggle */}
                            <div className="flex bg-white/5 p-1 rounded-lg mb-4">
                                <button
                                    type="button"
                                    onClick={() => setAddMode('manual')}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${addMode === 'manual' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Manual Entry
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAddMode('auto')}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${addMode === 'auto' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Auto Fetch (TMDB)
                                </button>
                            </div>

                            {/* Content Type Selection (Always Visible) */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Content Type</label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 cursor-pointer border p-3 rounded-xl text-center transition ${formData.type === 'movie' ? 'bg-primary/20 border-primary text-primary' : 'border-white/10 hover:bg-white/5'}`}>
                                        <input type="radio" name="type" value="movie" className="hidden" checked={formData.type === 'movie'} onChange={handleChange} />
                                        <Film className="mx-auto mb-1" size={20} />
                                        Movie
                                    </label>
                                    <label className={`flex-1 cursor-pointer border p-3 rounded-xl text-center transition ${formData.type === 'series' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'border-white/10 hover:bg-white/5'}`}>
                                        <input type="radio" name="type" value="series" className="hidden" checked={formData.type === 'series'} onChange={handleChange} />
                                        <Tv className="mx-auto mb-1" size={20} />
                                        Series
                                    </label>
                                </div>
                            </div>

                            {/* TMDB Input Section */}
                            {addMode === 'auto' && (
                                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-4">
                                    <label className="block text-sm font-medium text-blue-300 mb-2">TMDB ID</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input-field flex-1"
                                            placeholder={`Enter TMDB ID for this ${formData.type}`}
                                            value={tmdbId}
                                            onChange={(e) => setTmdbId(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleFetchTMDB}
                                            disabled={!tmdbId || isFetchingTmdb}
                                            className="btn-primary whitespace-nowrap px-4"
                                        >
                                            {isFetchingTmdb ? 'Fetching...' : 'Fetch Data'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-blue-300/60 mt-2">
                                        Enter the ID from themoviedb.org URL (e.g. 550 for Fight Club)
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input name="title" required className="input-field" value={formData.title} onChange={handleChange} placeholder="e.g. Breaking Bad" />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea name="description" rows="3" className="input-field resize-none" value={formData.description} onChange={handleChange} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <select name="category_id" className="input-field" value={formData.category_id} onChange={handleChange}>
                                        {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-surface">{c.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Rating</label>
                                    <input type="number" step="0.1" min="0" max="10" name="rating" className="input-field" value={formData.rating} onChange={handleChange} />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Poster URL</label>
                                    <input name="poster_url" className="input-field" placeholder="https://..." value={formData.poster_url} onChange={handleChange} />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Backdrop URL</label>
                                    <input name="backdrop_url" className="input-field" placeholder="https://..." value={formData.backdrop_url} onChange={handleChange} />
                                </div>

                                {formData.type === 'movie' && (
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Video URL</label>
                                        <input name="video_url" className="input-field" placeholder="https://..." value={formData.video_url} onChange={handleChange} />
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-gray-300 hover:bg-white/5 transition">Cancel</button>
                                <button type="submit" className="btn-primary">Save {formData.type === 'series' ? 'Series' : 'Movie'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Seasons Modal */}
            {manageSeasonsMode && (
                <SeasonManager
                    series={manageSeasonsMode}
                    onClose={() => setManageSeasonsMode(null)}
                />
            )}
        </div>
    );
};

// Sub-component for managing seasons and episodes
const SeasonManager = ({ series, onClose }) => {
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSeason, setExpandedSeason] = useState(null);

    // New Episode State
    const [newEpisode, setNewEpisode] = useState({ title: '', video_url: '', episode_number: 1 });

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const { data } = await axios.get(`/api/content/${series.id}`);
            if (data.seasons) setSeasons(data.seasons);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addSeason = async () => {
        const nextSeasonNum = seasons.length + 1;
        try {
            await axios.post(`/api/content/${series.id}/seasons`, {
                season_number: nextSeasonNum,
                title: `Season ${nextSeasonNum}`
            });
            fetchDetails();
        } catch (error) {
            console.error('Error adding season:', error);
        }
    };

    const addEpisode = async (seasonId) => {
        try {
            await axios.post(`/api/content/seasons/${seasonId}/episodes`, {
                ...newEpisode,
                duration: 45 // Default duration mock
            });
            setNewEpisode({ title: '', video_url: '', episode_number: newEpisode.episode_number + 1 });
            fetchDetails();
        } catch (error) {
            console.error('Error adding episode:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40">
                    <div>
                        <h3 className="text-xl font-bold">{series.title}</h3>
                        <p className="text-sm text-gray-400">Manage Seasons & Episodes</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-semibold text-white">Seasons</h4>
                        <button onClick={addSeason} className="btn-secondary text-sm flex items-center gap-2">
                            <Plus size={16} /> Add Season {seasons.length + 1}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {seasons.map((season) => (
                            <div key={season.id} className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                                <div
                                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition"
                                    onClick={() => setExpandedSeason(expandedSeason === season.id ? null : season.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        {expandedSeason === season.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        <span className="font-medium">{season.title}</span>
                                        <span className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">
                                            {season.episodes?.length || 0} Episodes
                                        </span>
                                    </div>
                                </div>

                                {expandedSeason === season.id && (
                                    <div className="p-4 bg-black/20 border-t border-white/10">
                                        <div className="mb-4 grid grid-cols-12 gap-2 items-end">
                                            <div className="col-span-1">
                                                <label className="text-xs text-gray-500">No.</label>
                                                <input
                                                    type="number"
                                                    className="input-field py-1 px-2 text-sm"
                                                    value={newEpisode.episode_number}
                                                    onChange={e => setNewEpisode({ ...newEpisode, episode_number: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <label className="text-xs text-gray-500">Title</label>
                                                <input
                                                    className="input-field py-1 px-2 text-sm"
                                                    placeholder="Episode Title"
                                                    value={newEpisode.title}
                                                    onChange={e => setNewEpisode({ ...newEpisode, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-span-5">
                                                <label className="text-xs text-gray-500">Video URL</label>
                                                <input
                                                    className="input-field py-1 px-2 text-sm"
                                                    placeholder="https://..."
                                                    value={newEpisode.video_url}
                                                    onChange={e => setNewEpisode({ ...newEpisode, video_url: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <button
                                                    onClick={() => addEpisode(season.id)}
                                                    className="btn-primary w-full py-1 text-sm h-[30px] flex items-center justify-center"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        <table className="w-full text-left text-sm">
                                            <thead className="text-gray-500 border-b border-white/5">
                                                <tr>
                                                    <th className="py-2 px-2">#</th>
                                                    <th className="py-2 px-2">Title</th>
                                                    <th className="py-2 px-2">URL</th>
                                                    <th className="py-2 px-2 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {season.episodes?.map((ep) => (
                                                    <tr key={ep.id} className="hover:bg-white/5">
                                                        <td className="py-2 px-2 text-gray-400">{ep.episode_number}</td>
                                                        <td className="py-2 px-2">{ep.title}</td>
                                                        <td className="py-2 px-2 text-gray-500 truncate max-w-[200px]">{ep.video_url}</td>
                                                        <td className="py-2 px-2 text-right">
                                                            <button className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;
