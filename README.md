# Welcome to Project PosturEase

A web application that monitors and analyzes posture in real-time using a webcam. The system provides feedback, tracks statistics, and generates reports to help users improve their posture.

## Features

- **Real-Time Detection**: Continuously analyzes posture using webcam input and provides immediate feedback.

- **Alarm System**: Triggers an alarm if bad posture persists for more than 10 seconds.

- **Statistics Tracking**: Records time spent in good and bad posture, and counts the number of alarms triggered.

- **Daily Reports**: Displays posture trends and statistics in a user-friendly chart format.

- **User Authentication**: Secure login system to maintain individual user data.

## Prerequisites

To run this project locally, ensure you have the following installed:

- **Backend**:
  - Python 3.8 or above
  - Flask
  - Firebase Admin SDK
  - OpenCV
  - NumPy
  - pytz
  - Flask-CORS

- **Frontend**:
  - Node.js 16.x or above
  - npm (Node Package Manager)
  - Vite (for React development)

## Table of Contents

-   [Installation](#installation)
    
-   [Usage](#usage)
    
-   [Technologies](#technologies)
    
-   [API Endpoints](#api-endpoints)
    
-   [Contributors](#contributors)
    
-   [License](#license)

## Installation
**Backend Setup**
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/posturease.git
    cd posturease-main/backend
   ```

2. Create and activate a virtual environment:
    ```bash
   python -m venv venv
   source venv/bin/activate # On Mac
   venv\Scripts\activate # On Windows
   ```
   
3. Install the required dependencies:
pip install -r requirements.txt

4. Add your Firebase Admin SDK key file:
Place your `serviceAccountKey.json` file in the `backend` directory.

5. Run the Flask server:
   ```bash
   python posture_detector.py
   ```

   The backend server will be running at http://127.0.0.1:5000/

**Frontend (React) Setup**

1. Navigate to the posture_ease_app folder:
     ```bash
     cd posture_ease_app
   ```
   
2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be running at `http://localhost:5173/`.


## Usage

1. **Login**: 
Users must log in before starting posture detection.

3. **Start Detection**:
Click the "Start Detection" button to initiate the webcam-based posture analysis. The system monitors posture in real-time and provides feedback.

4. **Posture Feedback**:
The application will display "Good Posture" or "Bad Posture" based on alignment. An alarm triggers if bad posture persists for over 10 seconds.

5. **Posture Statistics**:
Tracks and stores time spent in good and bad posture as well as the number of alarms triggered. Data is saved in Firebase Firestore.

6. **Reports**:
Daily reports displayed as charts provide trends in posture detection, showing time spent in good and bad posture to help track progress.

## Technologies

- **Backend**:
  - Flask (Python-based web framework)
  - Firebase Firestore (Database for storing posture data)
  - OpenCV (Real-time posture analysis)

- **Frontend**:
  - React (UI development)
  - Vite (Frontend build tool)
  - Chart.js (Data visualization for reports)

## API Endpoints

### Backend

1. **POST `/analyze`**:
   - Input: Webcam frame (image data)
   - Output: Posture status (`Good Posture` or `Bad Posture`) and alarm trigger status

2. **GET `/session_summary`**:
   - Input: `User-ID` header
   - Output: Session summary including time spent in good/bad posture and alarm count

## Contributors

- [Chamali Lakprabha](https://github.com/tennakoonchamali) - Developer

## License

This project is licensed under the [MIT License](./LICENSE.txt). You are free to use, modify, and distribute this software under the terms of the MIT License.

---
Happy coding and stay healthy!

