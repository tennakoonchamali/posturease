// The Reports component fetches and displays posture-related data for a user over time. The data is retrieved from a Firebase Firestore collection, and the component visualizes this data using charts (line chart and pie chart) to show posture trends and overall posture performance (good vs. bad posture).

import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import styles from "../style";

const Reports = () => {

    // State Management
    const [postureData, setPostureData] = useState([]);

    useEffect(() => {

        // Fetching Data from Firebase
        const fetchReports = async () => {
            const sessionId = localStorage.getItem("sessionId");
            if (!sessionId) {
                console.warn("No sessionId found in localStorage");
                return;
            }

            try {
                const querySnapshot = await getDocs(collection(db, "posture_reports"));
                const data = [];

                querySnapshot.forEach(doc => {
                    const docId = doc.id;

                    // Check if document ID contains the session ID
                    if (docId.startsWith(sessionId)) {
                        const report = doc.data();

                        // Extract date from the document ID (last part after "_")
                        const date = docId.split("_").pop();

                        data.push({ ...report, date });
                    }
                });

                // Sort by date (ascending)
                data.sort((a, b) => new Date(a.date) - new Date(b.date));

                setPostureData(data);
            } catch (error) {
                console.error("Error fetching posture reports:", error);
            }
        };

        fetchReports();
    }, []);

    // Fallback for No Data
    if (postureData.length === 0) {
        return (
            <div className="text-white text-center mt-10">
                <h2>No posture data available yet. Keep using the posture tracker!</h2>
            </div>
        );
    }

    // Data Extraction and Processing
    const dates = postureData.map(item => item.date);
    const goodPostureMinutes = postureData.map(item => ((item.good || 0) / 60).toFixed(2)); // Convert seconds to minutes
    const badPostureMinutes = postureData.map(item => ((item.bad || 0) / 60).toFixed(2));   // Convert seconds to minutes
    const alarms = postureData.map(item => item.alarms || 0);

    // Convert total posture durations to minutes
    const totalGoodMinutes = (goodPostureMinutes.reduce((sum, min) => sum + parseFloat(min), 0)).toFixed(2);
    const totalBadMinutes = (badPostureMinutes.reduce((sum, min) => sum + parseFloat(min), 0)).toFixed(2);
    const totalDurationMinutes = (parseFloat(totalGoodMinutes) + parseFloat(totalBadMinutes)).toFixed(2);

    const goodPercentage = totalDurationMinutes > 0 ? ((totalGoodMinutes / totalDurationMinutes) * 100).toFixed(1) : 0;
    const badPercentage = totalDurationMinutes > 0 ? ((totalBadMinutes / totalDurationMinutes) * 100).toFixed(1) : 0;

    // Data for Line Chart - Posture Trends Over Time (in minutes)
    const lineChartData = {
        labels: dates,
        datasets: [
            {
                label: "Good Posture (minutes)",
                data: goodPostureMinutes,
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                fill: true
            },
            {
                label: "Bad Posture (minutes)",
                data: badPostureMinutes,
                borderColor: "#FF3D00",
                backgroundColor: "rgba(255, 61, 0, 0.2)",
                fill: true
            },
            {
                label: "Alarms Triggered",
                data: alarms,
                borderColor: "#FFC107",
                backgroundColor: "rgba(255, 193, 7, 0.2)",
                fill: true
            }
        ]
    };

    // Pie Chart Data (Overall Posture Summary)
    const pieChartData = {
        labels: ["Good Posture (%)", "Bad Posture (%)"],
        datasets: [
            {
                data: [goodPercentage, badPercentage],
                backgroundColor: ["#4CAF50", "#FF3D00"]
            }
        ]
    };

    return (
        <div className={`bg-primary w-full overflow-hidden ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth} flex flex-col items-center text-white`}>
                <h1 className={`${styles.heading2} text-center mb-6`}>Posture Reports</h1>

                {/* Line Chart for Posture Trends */}
                <div className="w-full max-w-3xl bg-gray-900 p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg mb-3 text-center">Posture Trends Over Time (Minutes)</h2>
                    <Line data={lineChartData} />
                </div>

                {/* Pie Chart for Overall Posture Summary */}
                <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg mt-6">
                    <h2 className="text-lg mb-3 text-center">Overall Posture Summary</h2>
                    <Pie data={pieChartData} />
                    <p className="text-center mt-3">
                        <strong>Good:</strong> {totalGoodMinutes} min |
                        <strong> Bad:</strong> {totalBadMinutes} min
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reports;
