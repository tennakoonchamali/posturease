from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import time
import datetime
import threading
import firebase_admin
from firebase_admin import credentials, firestore
import pytz

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)

# Constants
ALARM_THRESHOLD = 10  # Seconds of incorrect posture to trigger alarm
UPDATE_INTERVAL = 60  # Interval for updating Firestore in seconds

# Global Variables
incorrect_start_time = None
posture_start_time = None  # Track when posture status changes
good_posture_time = {}  # Store time spent in good posture
bad_posture_time = {}  # Store time spent in bad posture
alarm_count = {}  # Store number of alarms triggered
last_update_time = time.time()  # Last Firestore update time
lock = threading.Lock()  # Thread lock for safe updates
alarm_active = {}  # Track if an alarm is already counted for a bad session
last_posture_status = {}  # Track last posture status to detect changes

# Load Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Set Sri Lanka Time Zone
sri_lanka_tz = pytz.timezone("Asia/Colombo")

def update_posture_summary(user_id, posture_status, alarm_triggered):
    global good_posture_time, bad_posture_time, alarm_count, last_update_time, posture_start_time, last_posture_status

    now = datetime.datetime.now(sri_lanka_tz)
    today_date = now.strftime("%Y-%m-%d")

    if user_id not in good_posture_time:
        good_posture_time[user_id] = 0
        bad_posture_time[user_id] = 0
        alarm_count[user_id] = 0
        alarm_active[user_id] = False
        last_posture_status[user_id] = posture_status
        posture_start_time = time.time()  # Start tracking from the beginning

    current_time = time.time()

    # Calculate time since last status change
    if posture_start_time is not None and user_id in last_posture_status:
        elapsed_time = current_time - posture_start_time
        if "Good" in last_posture_status[user_id]:
            good_posture_time[user_id] += elapsed_time
        else:
            bad_posture_time[user_id] += elapsed_time

    # Count alarm only once per bad posture session
    if alarm_triggered and not alarm_active[user_id]:
        alarm_count[user_id] += 1
        alarm_active[user_id] = True
    elif not alarm_triggered:
        alarm_active[user_id] = False

    # Update posture start time only if the posture status changed
    if posture_status != last_posture_status[user_id]:
        posture_start_time = current_time
        last_posture_status[user_id] = posture_status

    # Periodically push updates to Firestore
    if current_time - last_update_time >= UPDATE_INTERVAL:
        last_update_time = current_time

        def firestore_update():
            with lock:
                for uid in good_posture_time.keys():
                    doc_ref = db.collection("posture_reports").document(f"{uid}_{today_date}")

                    try:
                        existing_doc = doc_ref.get()
                        if existing_doc.exists:
                            existing_data = existing_doc.to_dict()
                            good_posture_time[uid] += existing_data.get("good", 0)
                            bad_posture_time[uid] += existing_data.get("bad", 0)
                            alarm_count[uid] += existing_data.get("alarms", 0)
                    except Exception as e:
                        print(f"Firestore read error: {e}")

                    updated_data = {
                        "good": good_posture_time[uid],
                        "bad": bad_posture_time[uid],
                        "alarms": alarm_count[uid]
                    }

                    doc_ref.set(updated_data, merge=True)

                # Clear all after update
                good_posture_time.clear()
                bad_posture_time.clear()
                alarm_count.clear()
                alarm_active.clear()
                last_posture_status.clear()

        threading.Thread(target=firestore_update, daemon=True).start()

# Posture analysis function
def analyze_posture(frame):
    global incorrect_start_time

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        if incorrect_start_time is None:
            incorrect_start_time = time.time()  # Start timer
        return "⚠️ Bad Posture, Please correct it!"

    for (x, y, w, h) in faces:
        face_center_x = x + w // 2
        frame_center_x = frame.shape[1] // 2

        if abs(face_center_x - frame_center_x) > 100:
            if incorrect_start_time is None:
                incorrect_start_time = time.time()  # Start timer
            return "⚠️ Bad Posture, Please correct it!"

    incorrect_start_time = None
    return "✅ Good Posture"

@app.route('/analyze', methods=['POST'])
def analyze_video():
    global incorrect_start_time, posture_start_time

    try:
        nparr = np.frombuffer(request.data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        posture_status = analyze_posture(frame)
        alarm_triggered = False

        if incorrect_start_time is not None:
            elapsed_time = time.time() - incorrect_start_time
            if elapsed_time >= ALARM_THRESHOLD:
                alarm_triggered = True

        user_id = request.headers.get("User-ID")  # Get user ID from request headers
        if user_id:
            update_posture_summary(user_id, posture_status, alarm_triggered)

        # Reset posture tracking start time if this is the first frame processed
        if posture_start_time is None:
            posture_start_time = time.time()

        return jsonify({"posture": posture_status, "alarm": alarm_triggered})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/session_summary', methods=['GET'])
def get_session_summary():
    user_id = request.headers.get("User-ID")
    if not user_id:
        return jsonify({"error": "Missing User-ID"}), 400

    summary = {
        "good": round(good_posture_time.get(user_id, 0), 2),
        "bad": round(bad_posture_time.get(user_id, 0), 2),
        "alarms": alarm_count.get(user_id, 0)
    }

    # Clear session data for the user after summary is sent
    good_posture_time.pop(user_id, None)
    bad_posture_time.pop(user_id, None)
    alarm_count.pop(user_id, None)
    alarm_active.pop(user_id, None)
    last_posture_status.pop(user_id, None)

    return jsonify(summary)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
