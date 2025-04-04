# Music Theory Learning App

This is a **Music Theory Learning App** designed to help users learn the basics of music theory, including scales, chords, and octaves. It provides exercises for recognizing notes on the piano, reading music from a stave, identifying chords, playing scales, and more.

## Project Overview

The application is built with **Next.js** and **MongoDB** for storing user progress, chapters, lessons, and exercises. The app is designed to give interactive lessons, quizzes, and exercises to help users improve their music theory knowledge.

### Features:

- **Music Theory Lessons**: Basic lessons on scales, chords, and intervals.
- **Exercises**: Interactive exercises to practice recognizing notes, identifying chords, playing scales, and more.
- **User Progress Tracking**: Keeps track of user progress and achievements in different chapters and exercises.

# LetsLearnMusic - Development Setup

This project uses Docker **only for MongoDB** to provide a consistent local database setup. The Next.js app is run using Node.js directly in your local environment.

## Prerequisites

Make sure the following are installed on your machine:

- Node.js (Recommended version: 18.x or later) – https://nodejs.org/en/
- Docker – [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- Docker Compose – [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Step 1: Install Node Dependencies

Before running the app, install the required npm packages:

`  npm install  `

## Step 2: Set Up Environment Variables

1.  Copy the example environment file and update it:

`  cp .env.template .env  `

1.  Edit the .env file with the appropriate values for:

- MONGODB_URI: MongoDB connection string used by the application (adjust if needed).
- SESSION_SECRET: A secret key for internal use (e.g., JWT signing or encryption).

## Step 3: Start MongoDB with Docker

MongoDB is containerized using Docker Compose for easy setup. This also includes initial data seeding for the collections: chapters, exercises, and scales.

1.  Start the MongoDB container and seed it with the necessary data:

`  docker-compose up --build -d`

(Add -d to run the container in detached mode or remove it if don't want it)

This will:

- Create a MongoDB container
- Mount a volume for persistent storage
- Import data from the ./dump folder into the letslearnmusic database

After this step, your MongoDB should be up and running on localhost:27017, with all required data pre-loaded.

## Step 4: Run the Application

Start the Next.js development server:

`  npm run dev  `

This will launch the app at: http://localhost:3000

## Available Features

- Lessons: Learn about musical scales, intervals, and chords
- Exercises: Practice with interactive activities such as identifying notes or constructing scales
- Progress Tracking: Your progress is stored in MongoDB so you can track your learning journey

## MongoDB Data Initialization

The dump/ folder includes JSON files for:

- chapters.json
- exercises.json
- scales.json

These are automatically imported when MongoDB starts (via the mongo-seed container defined in docker-compose.yml), ensuring the database is immediately usable.

## Notes

- You do NOT need to run the Next.js app inside Docker.
- Docker is only used to provide a consistent local MongoDB setup with preloaded data.
- To stop the MongoDB container:

`  docker-compose down  `

## Troubleshooting

If collections are empty after boot, make sure:

- The --host in mongoimport uses the correct service name (e.g., LetsLearnMusicMongo)
- The dump files are valid JSON arrays
- MongoDB is fully ready (sometimes adding a short sleep before import helps)

## Additional Notes

- **MongoDB Data**: If you ever need to update or reset the data in MongoDB, you can drop the current collections and re-import the MongoDB dump.
- **Persistent Data**: The MongoDB data is stored in a Docker volume (letslearnmusicdata:/data/db) that ensures the data persists across container restarts.
- **Future Improvements**: We plan to add more interactive lessons, quizzes, and exercises, as well as a user account system to track individual progress more efficiently.
