import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import styles from "../style";
import alarmSound from "../assets/beep_sound.mp3";
import eyeImage from "../assets/eye.png";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import GuidePopup from "./GuidePopup";
import Chart from "chart.js/auto";

const StartDetection = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State Management
    const [isDetecting, setIsDetecting] = useState(false);
    const [postureFeedback, setPostureFeedback] = useState("Press 'Start' to begin posture detection.");
    const [alarmTriggered, setAlarmTriggered] = useState(false);
    const hasShownToast = useRef(false);
    const videoRef = useRef(null);
    const animationRef = useRef(null);
    const lastSentFrameTime = useRef(0);
    const alarmIntervalRef = useRef(null);
    const frameInterval = 200; // Capture every 200ms

    const [eyePosition, setEyePosition] = useState({ top: 50, left: 50 });

    const [showSummaryPopup, setShowSummaryPopup] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [sessionReport, setSessionReport] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        let chartInstance = null;

        if (showReportModal && sessionReport && chartRef?.current) {
            const ctx = chartRef.current.getContext("2d");

            chartInstance = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: ["Good Posture", "Bad Posture"],
                    datasets: [
                        {
                            data: [sessionReport.good, sessionReport.bad],
                            backgroundColor: ["#22c55e", "#ef4444"],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: {
                                font: { size: 14 },
                                color: "#333",
                            },
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const value = context.raw;
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${context.label}: ${percentage}% (${value.toFixed(2)}s)`;
                                },
                            },
                        },
                    },
                },
            });
        }

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [showReportModal, sessionReport]);

    useEffect(() => {
        if (isDetecting) {
            startWebcam();
            startDetectionLoop();
        } else {
            stopWebcam();
            stopDetectionLoop();
            setAlarmTriggered(false);
        }
    }, [isDetecting]);

    useEffect(() => {
        if (alarmTriggered) {
            startAlarmLoop();
            startEyeAnimation();
        } else {
            stopAlarmLoop();
        }
    }, [alarmTriggered]);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Error accessing webcam:", error);
            setPostureFeedback("Error accessing webcam.");
        }
    };

    const stopWebcam = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const startDetectionLoop = () => {
        animationRef.current = requestAnimationFrame(captureFrame);
    };

    const stopDetectionLoop = () => {
        cancelAnimationFrame(animationRef.current);
    };

    const captureFrame = async (timestamp) => {
        if (videoRef.current && timestamp - lastSentFrameTime.current > frameInterval) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

            const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg"));
            lastSentFrameTime.current = timestamp;
            sendFrameToBackend(imageBlob);
        }
        animationRef.current = requestAnimationFrame(captureFrame);
    };

    const sendFrameToBackend = async (imageBlob) => {
        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch("http://127.0.0.1:5000/analyze", {
                method: "POST",
                body: imageBlob,
                headers: {
                    "User-ID": sessionId // Attach User ID
                }
            });
            const data = await response.json();
            setPostureFeedback(data.posture);
            setAlarmTriggered(data.alarm);
        } catch (error) {
            console.error("Error communicating with backend:", error);
            setPostureFeedback("Error connecting to backend.");
        }
    };

    const startAlarmLoop = () => {
        if (!alarmIntervalRef.current) {
            playAlarm();
            alarmIntervalRef.current = setInterval(playAlarm, 2000);
        }
    };

    const stopAlarmLoop = () => {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
    };

    const playAlarm = () => {
        const audio = new Audio(alarmSound);
        audio.play();
    };

    const startEyeAnimation = () => {
        const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;

        const moveEyeRandomly = () => {
            const windowHeight = window.innerHeight - 200;
            const windowWidth = window.innerWidth - 200;

            const xPos = Math.random() * windowWidth;
            const yPos = Math.random() * windowHeight;

            setEyePosition({ top: yPos, left: xPos });

            setTimeout(moveEyeRandomly, 3000); // Move every 3 seconds
        };

        moveEyeRandomly();
    };

    const handleDetection = () => {
        if (isDetecting) {
            setIsDetecting(false);
            setPostureFeedback("Press 'Start' to begin posture detection.");
            setAlarmTriggered(false);
            setShowSummaryPopup(true);
        } else {
            setIsDetecting(true);
            setPostureFeedback("Detecting Posture...");
        }
    };

    const handleViewReport = async () => {
        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch("http://127.0.0.1:5000/session_summary", {
                method: "GET",
                headers: {
                    "User-ID": sessionId
                }
            });
            const data = await response.json();
            setSessionReport(data);
            sessionStorage.setItem("sessionReport", JSON.stringify(data));
            setShowReportModal(true);
        } catch (error) {
            console.error("Error fetching session summary:", error);
        }
    };

    return (
        <div className="bg-primary w-full overflow-hidden">
            <div className="navbar">
                <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                    <div className={`${styles.boxWidth}`}></div>
                </div>
            </div>

            <div className={`bg-primary ${styles.flexCenter} min-h-screen`}>
                <div className={`${styles.boxWidth} flex flex-col items-center text-white`}>
                    <h1 className={`${styles.heading2} text-center mb-6`}>Posture Detection</h1>
                    <video ref={videoRef} autoPlay playsInline className="w-[640px] h-[480px] bg-black rounded-lg shadow-lg my-6" />
                    <p className={styles.paragraph}>{postureFeedback}</p>

                    <Button styles="mt-4" onClick={handleDetection}>
                        {isDetecting ? "Stop Detection" : "Start Detection"}
                    </Button>

                    {alarmTriggered && (
                        <div className="floating-eye" style={{ top: eyePosition.top, left: eyePosition.left }}>
                            <img src={eyeImage} alt="Eye" />
                        </div>
                    )}
                </div>
                <GuidePopup />

                {/* Summary Popup Modal */}
                {showSummaryPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
                        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-[90%] max-w-md text-center border border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Detection Stopped</h2>
                            <p className="text-gray-700 text-base mb-6">Would you like to view your posture report for this session?</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setShowSummaryPopup(false);
                                        handleViewReport();
                                    }}
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:opacity-90 transition"
                                >
                                    View Report
                                </button>
                                <button
                                    onClick={() => setShowSummaryPopup(false)}
                                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl font-medium shadow hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Modal */}
                {showReportModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-[95%] max-w-xl border border-gray-200">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">📊 Session Summary</h2>
                            <div className="w-full h-64 mb-6">
                                <canvas ref={chartRef}></canvas>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-xl font-medium shadow hover:opacity-90 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx="true">{`
                .floating-eye {
                    position: fixed;
                    z-index: 9999;
                    animation: pulse 5s infinite;
                    transition: top 3s ease-in-out, left 3s ease-in-out;
                }

                .floating-eye img {
                    width: 150px;
                    height: 150px;
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
};

export default StartDetection;
