import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Search, Link } from 'lucide-react';

const CATEGORIES = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Drama' },
    { id: 3, name: 'Sci-Fi' },
    { id: 4, name: 'Comedy' },
    { id: 5, name: 'Horror' },
    { id: 6, name: 'Thriller' },
];

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        poster_url: '',
        video_url: '',
        category_id: 1,
        rating: 7.0,
        release_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const { data } = await axios.get('/api/movies');
            setMovies(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this movie?')) {
            try {
                await axios.delete(`/api/movies/${id}`);
                fetchMovies(); // Refresh list
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/movies', formData);
            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                poster_url: '',
                video_url: '',
                category_id: 1,
                rating: 7.0,
                release_date: new Date().toISOString().split('T')[0]
            });
            fetchMovies();
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredMovies = movies.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold">Movies</h2>
                    <p className="text-gray-400">Manage your content library</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Movie
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search movies..."
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Movie List */}
            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Poster</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredMovies.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">No movies found</td></tr>
                        ) : (
                            filteredMovies.map((movie) => (
                                <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-3">
                                        <img
                                            src={movie.poster_url}
                                            alt={movie.title}
                                            className="w-12 h-16 object-cover rounded-md bg-gray-800"
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/48x64?text=No+Img'}
                                        />
                                    </td>
                                    <td className="px-6 py-3 font-medium">{movie.title}</td>
                                    <td className="px-6 py-3">
                                        <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-secondary border border-secondary/20">
                                            {movie.category_name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-yellow-400 flex items-center gap-1">
                                        <span>★</span> {movie.rating}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => handleDelete(movie.id)}
                                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Movie Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold">Add New Movie</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input
                                        name="title"
                                        required
                                        className="input-field"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. The Dark Knight"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        className="input-field resizing-none"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <select
                                        name="category_id"
                                        className="input-field"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c.id} value={c.id} className="bg-surface">{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Release Date</label>
                                    <input
                                        type="date"
                                        name="release_date"
                                        className="input-field"
                                        value={formData.release_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Poster URL</label>
                                    <div className="relative">
                                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            name="poster_url"
                                            className="input-field pl-10"
                                            placeholder="https://..."
                                            value={formData.poster_url}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Video URL (YouTube/MP4)</label>
                                    <div className="relative">
                                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            name="video_url"
                                            className="input-field pl-10"
                                            placeholder="https://..."
                                            value={formData.video_url}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Rating (0-10)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        name="rating"
                                        className="input-field"
                                        value={formData.rating}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-xl text-gray-300 hover:bg-white/5 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Save Movie
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Movies;
