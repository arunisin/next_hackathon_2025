"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const PhotoSearchPage = () => {
    const [query, setQuery] = useState('');
    const [photo, setPhoto] = useState<any>(null); // Changed to store a single photo
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setPhoto(null); // Reset photo on new search

        try {
            const response = await fetch(
                `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, // Changed to per_page=1
                {
                    headers: {
                        Authorization: process.env.NEXT_PUBLIC_PEXEL_KEY || '',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch photo');
            }

            const data = await response.json();
            // Set only the first photo (or null if no results)
            setPhoto(data.photos?.[0] || null);
        } catch (err) {
            setError('Error fetching photo. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Pexels Photo Search</h1>

            <div className="flex mb-6">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for a photo..."
                    className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !query.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r disabled:bg-blue-300"
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {photo ? (
                <div className="max-w-md mx-auto"> {/* Container for the single photo */}
                    <div className="rounded overflow-hidden shadow-lg">
                        <Image
                            src={photo.src.large} // Using large instead of medium for better quality
                            alt={photo.alt || 'Pexels photo'}
                            width={photo.width}
                            height={photo.height}
                            className="w-full h-auto"
                            placeholder="blur"
                            blurDataURL={photo.src.tiny}
                        />
                        <div className="px-4 py-2">
                            {photo.photographer && (
                                <p className="text-gray-600 text-sm">
                                    Photo by {photo.photographer}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                !isLoading && (
                    <div className="text-center text-gray-500">
                        {query.trim()
                            ? 'No photo found. Try a different search.'
                            : 'Enter a search term to find a photo.'}
                    </div>
                )
            )}

            {isLoading && (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
        </div>
    );
};

export default PhotoSearchPage;