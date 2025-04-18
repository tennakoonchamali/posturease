// The Recommendation component displays a list of recommended videos to help users improve their posture, with two categories: "Sitting Posture" and "Yoga for Better Posture." The videos are fetched from YouTube, and users can watch a selected video in a modal with a YouTube player embedded.

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Video Data
const sittingPostureVideos = [
    { id: "1", title: "7 Tips For Sitting Posture", youtubeId: "OfnEZulM9mA" },
    { id: "2", title: "How to Sit Properly", youtubeId: "kx0c6JGTrUQ" },
    { id: "3", title: "Desk setup ergonomics🧘🏻‍♀️", youtubeId: "zPYQ5_Y2OBQ" },
    { id: "4", title: "You're Sitting Wrong at Desk", youtubeId: "Ree1CWifQTg" },
];

const yogaVideos = [
    { id: "5", title: "10 Minute Daily Stretch Routine", youtubeId: "BPlCatqZRPI" },
    { id: "6", title: "Yoga For Improve Body Posture", youtubeId: "HTuSi6TZxRs" },
    { id: "7", title: "5 min Yoga for Good Posture", youtubeId: "hu_-_6VwaS8" },
    { id: "8", title: "FIX FORWARD HEAD POSTURE", youtubeId: "uP9mwq5_lr4" },
];

const Recommendation = () => {

    // State Management
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Loading YouTube API
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Recommended Videos for Better Posture</h2>

            {/* Modal for Video Playback */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-2xl p-4 max-w-4xl w-full relative"
                            initial={{ y: "-50px", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-50px", opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative pb-[56.25%]">
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                                    src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            </div>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="mt-4 px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition absolute top-3 right-3"
                            >
                                ✖
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Maintain Your Sitting Posture */}
            <h3 className="text-2xl font-bold mt-6 mb-4 text-white border-b border-white pb-2">
                🪑 Maintain Your Sitting Posture
            </h3>

            {/*Video Thumbnail Grid*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {sittingPostureVideos.map((video) => (
                    <motion.div
                        key={video.id}
                        className="bg-white p-3 rounded-xl shadow-lg cursor-pointer hover:scale-[1.03] transition-transform duration-300"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedVideo(video.youtubeId)}
                    >
                        <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                            alt={video.title}
                            className="rounded-lg w-full"
                        />
                        <p className="text-md font-semibold mt-2 text-gray-800">{video.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Yoga for Better Posture */}
            <h3 className="text-2xl font-bold mt-10 mb-4 text-white border-b border-white pb-2">
                🧘 Yoga for Better Posture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {yogaVideos.map((video) => (
                    <motion.div
                        key={video.id}
                        className="bg-white p-3 rounded-xl shadow-lg cursor-pointer hover:scale-[1.03] transition-transform duration-300"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedVideo(video.youtubeId)}
                    >
                        <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                            alt={video.title}
                            className="rounded-lg w-full"
                        />
                        <p className="text-md font-semibold mt-2 text-gray-800">{video.title}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Recommendation;
