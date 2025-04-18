import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const GuidePopup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        const hasOptedOut = localStorage.getItem("hideHomeGuidePopup");

        if (!hasOptedOut) {
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem("hideHomeGuidePopup", "true");
        }
        setShowPopup(false);
    };

    if (!showPopup) return null;

    return (
        <motion.div
            className="fixed bottom-6 right-6 bg-white shadow-2xl border border-gray-200 rounded-2xl p-6 z-50 max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">👋 Welcome to Posture Detection</h2>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        Make sure you're seated comfortably with your webcam active. Hit
                        <strong> "Start Detection"</strong> and we’ll alert you if your posture goes off track.
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={22} />
                </button>
            </div>

            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    id="dont-show"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="mr-2 accent-blue-600"
                />
                <label htmlFor="dont-show" className="text-sm text-gray-500 select-none">
                    Don’t show this again
                </label>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleClose}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    Got it!
                </button>
            </div>
        </motion.div>
    );
};

export default GuidePopup;
