import React from "react";
import { Dialog } from "@headlessui/react";

const ReportModal = ({ isOpen, onClose, onViewReport, summary }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <Dialog.Title className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Posture Detection Ended
                    </Dialog.Title>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">Your posture detection session has ended.</p>
                    <div className="text-left text-sm mb-6">
                        <p className="text-green-600">✅ Good Posture Time: {summary.goodTime} seconds</p>
                        <p className="text-red-500">⚠️ Bad Posture Time: {summary.badTime} seconds</p>
                        <p className="text-yellow-500">🔔 Alarms Triggered: {summary.alarms}</p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            onClick={onViewReport}
                        >
                            View Report
                        </button>
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ReportModal;
