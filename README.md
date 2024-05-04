# Museum-Review-System

This repository contains the code for 'MuseoReview', a Museum Information Display and Reviews Sharing Platform. It utilizes MongoDB for the backend, Angular for the frontend, and Flask for the middleware.

# Installation and Setup
## Prerequisites
Before getting started, ensure you have the following installed:
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- [Python](https://www.python.org/) (for Flask)


### Backend Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/CaseyXiaoyu/Museum-Review-System.git
    ```

2. **Navigate to the backend directory**:

    ```bash
    cd 551-backend
    ```
3. **Activate the virtual environment**:

    ```bash
    source venv/bin/activate
    ```

4. **Start MongoDB**:

    ```bash
    sudo mongod --dbpath=/Users/your_own_path/data/db
    ```

    Make sure to replace `/Users/your_own_path/data/db` with your actual MongoDB data directory.
   

## Running the Flask Server

1. **Open a new terminal window**.

2. **Navigate to the backend directory**:

    ```bash
    cd 551-backend
    ```

3. **Activate the virtual environment**:

    ```bash
    source venv/bin/activate
    ```
    
4. **Install Python dependencies**:

    ```bash
    pip install -r requirements.txt
    ```
    
5. **Start the Flask server**:

    ```bash
    python app.py
    ```
    If you encounter a `ModuleNotFoundError` for Flask or any other module, use pip to install it:
    
    ```bash
    pip install flask
    ```
    

### Frontend Setup

1. **Navigate to the frontend directory**:

    ```bash
    cd 551-frontend
    ```

2. **Install Angular dependencies**:

    ```bash
    npm install
    ```

3. **Start the Angular development server**:

    ```bash
    ng serve
    ```

## Accessing the Application

Once the backend server and frontend development server are running, you can access the platform by navigating to `http://localhost:4200` in your web browser.

## Troubleshooting

- If you encounter a `ModuleNotFoundError` for any Python or Node.js module, use the respective package managers (pip for Python, npm for Node.js) to install the missing modules.


