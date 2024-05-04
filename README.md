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


## Data Initialization

# Adding Data to the Project

During the initial setup of the project, you may want to add some sample data of Museum information. You can use the following `curl` command to add data to the project:

```bash
curl -X POST http://127.0.0.1:5000/museums/batch -H "Content-Type: application/json" -d '[
  {
    "MuseumName": "Newseum",
    "Location": "555 Pennsylvania Ave NW, Washington DC, DC 20001-2114",
    "Description": "Find out for yourself why everyone is calling the Newseum the best experience Washington, D.C. has to offer. Each of the seven levels in this magnificent building is packed with interactive exhibits that explore free expression and the five freedoms of the First Amendment: religion, speech, press, assembly and petition. Whether you have just a few hours or want to spend all day, you will find something for everyone in the family in the Newseums 15 theaters and 15 galleries.",
    "Fee": "Yes",
    "LengthOfVisit": "2-3 hours",
    "PhoneNum": "+1 888-639-7386"
  },
  {
    "MuseumName": "The Metropolitan Museum of Art",
    "Location": "1000 5th Ave, New York City, NY 10028-0198",
    "Description": "At New York Citys most visited museum and attraction, you will experience over 5,000 years of art from around the world. The Met is for anyone as a source of inspiration, insight and understanding. You can learn, escape, play, dream, discover, connect.",
    "Fee": "Yes",
    "LengthOfVisit": "2-3 hours",
    "PhoneNum": "+1 212-535-7710"
  },
  {
    "MuseumName": "The National WWII Museum",
    "Location": "945 Magazine Street, New Orleans, LA 70130-3813",
    "Description": "Founded by historian and author, Stephen Ambrose, the Museum tells the story of the American Experience in the war that changed the world - why it was fought, how it was won, and what it means today - so that all generations will understand the price of freedom and be inspired by what they learn.",
    "Fee": "",
    "LengthOfVisit": "",
    "PhoneNum": "+1 504-528-1944"
  },
  {
    "MuseumName": "Denver Museum of Nature & Science",
    "Location": "2001 N Colorado Blvd, Denver, CO 80205-5798",
    "Description": "The Denver Museum of Nature & Science is the Rocky Mountain regions leading resource for informal science education. A variety of exhibitions, programs, and activities help Museum visitors experience the natural wonders of Colorado, Earth, and the universe.",
    "Fee": "",
    "LengthOfVisit": "",
    "PhoneNum": "+1 303-370-6000"
  },
  {
    "MuseumName": "Art Institute of Chicago",
    "Location": "111 S Michigan Ave, Chicago, IL 60603-6488",
    "Description": "This Classical Renaissance structure, guarded by two bronze lions at its entrance, boasts one of the worlds great art collections, including the trademark American Gothic.",
    "Fee": "Yes",
    "LengthOfVisit": "More than 3 hours",
    "PhoneNum": "+1 312-443-3600"
  }
]'


