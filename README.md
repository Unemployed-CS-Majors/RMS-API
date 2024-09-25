# RMS-API

This project is a Firebase Cloud Functions project using Express.js to handle HTTP requests.

## Prerequisites

- Node.js (version 18)
- Firebase CLI
- npm (Node Package Manager)

## Setup Instructions

1. **Clone the repository:**

    ```sh
    git clone https://github.com/yourusername/RMS-API.git
    cd RMS-API
    ```

2. **Install dependencies:**

    ```sh
    cd functions
    npm install
    ```

3. **Set up Firebase CLI:**

    If you haven't already, install the Firebase CLI globally:

    ```sh
    npm install -g firebase-tools
    ```

    Log in to Firebase:

    ```sh
    firebase login
    ```

4. **Initialize Firebase project:**

    If this is a new project, initialize Firebase in your project directory:

    ```sh
    firebase init
    ```

    Follow the prompts to set up your Firebase project.

5. **Start the Firebase emulators:**

    ```sh
    firebase emulators:start --only functions,firestore
    ```

    This will start the emulators for the services specified in your [`firebase.json`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fjakubolszewski%2FDeveloper%2FRMS-API%2Ffirebase.json%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%221cc10ff2-9313-4edd-8e6c-265abad775ac%22%5D "/Users/jakubolszewski/Developer/RMS-API/firebase.json") file.