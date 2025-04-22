# Spotify Clone - Microservices Architecture

This project is a fully functional Spotify Clone built using a microservices architecture. It is designed to provide a seamless music streaming experience with features like user authentication, playlist management, and song/album browsing. The project is deployed on modern cloud platforms with auto-deployment enabled for both frontend and backend services.

## Use The Application directly from this link

```bash
https://spotify-clone-orcin-seven.vercel.app/
```

## Project Overview

### Frontend

- **Stack**: React, TypeScript, TailwindCSS
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Features**:
  - User authentication (login/register)
  - Browse songs and albums
  - Manage playlists
  - Admin dashboard for adding songs and albums

### Backend

- **Microservices**:
  1. **User Service**: Handles user authentication and playlist management.
  2. **Admin Service**: Allows admins to add songs and albums.
  3. **Song Service**: Provides song and album data to the frontend.
- **Stack**: Node.js, Express, TypeScript
- **Databases**:
  - **MongoDB**: Used for user data and playlist management.
  - **Neon PostgreSQL**: Used for storing song and album data.
- **Caching**: Redis is used to cache frequently accessed data, improving performance and reducing database load.
- **Deployment**: Railway

### Deployment

- **Frontend**: Deployed on Vercel for fast and reliable hosting.
- **Backend**: Each microservice is independently deployed on Railway.
- **Auto-Deployment**: The project is configured for auto-deployment. Any commit and push to the GitHub repository triggers deployment for both frontend and backend services.

## Redis for Performance

Redis is used to cache frequently accessed data, such as song and album details. This reduces the load on the Neon PostgreSQL database and improves response times for the user.

### Example:

- When a user requests a list of songs, the Song Service first checks Redis for cached data.
- If the data is available in Redis, it is returned immediately.
- If not, the data is fetched from the database, cached in Redis, and then returned to the user.

## Cloudinary for Image Upload

This project uses **Cloudinary** for uploading and managing images. Cloudinary is integrated into the `admin_service` to handle image uploads for albums and songs.

### How Cloudinary is Used:

1. **Album Thumbnails**:

   - When an admin adds a new album, the thumbnail image is uploaded to Cloudinary.
   - The uploaded image's URL is stored in the PostgreSQL database.

2. **Song Thumbnails**:

   - Admins can upload thumbnails for songs, which are also stored in Cloudinary.

3. **Cloudinary Configuration**:
   - The following environment variables are used in the `admin_service` to configure Cloudinary:
     - `CLOUD_NAME`: Your Cloudinary cloud name.
     - `CLOUD_API_KEY`: API key for authentication.
     - `CLOUD_SECRET_KEY`: Secret key for secure access.

### Example Workflow:

- When an admin uploads an image, it is converted to a buffer and sent to Cloudinary using the Cloudinary SDK.
- Cloudinary returns a secure URL for the uploaded image, which is then saved in the database.

### Benefits of Using Cloudinary:

- **Scalability**: Handles large-scale image uploads efficiently.
- **Performance**: Optimizes images for faster loading.
- **Security**: Provides secure URLs for accessing images.

### Cloudinary Integration Code:

The integration is implemented in the `admin_service/src/controller.ts` file. Below is a snippet of the code:

```typescript
const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
  folder: "albums",
});

const result = await sql`
    INSERT INTO albums (title, description, thumbnail) 
    VALUES (${title}, ${description}, ${cloud.secure_url})
 RETURNING *`;
```

For more details, refer to the `admin_service` codebase.

## Environment Variables

Each service in this project uses specific environment variables for configuration. Below is a detailed list of the environment variables used in each service:

### 1. **Frontend**

- **File**: `frontend/.env`
- **Variables**:
  - `REACT_APP_ADMIN_SERVICE_URL`: URL of the Admin Service (e.g., `https://hopeful-respect-production.up.railway.app`)
  - `REACT_APP_USER_SERVICE_URL`: URL of the User Service (e.g., `https://spotifyclone-production-ea6a.up.railway.app`)
  - `REACT_APP_SONG_SERVICE_URL`: URL of the Song Service (e.g., `https://lavish-kindness-production.up.railway.app`)

### 2. **User Service**

- **File**: `user_service/.env`
- **Variables**:
  - `PORT`: Port number for the User Service (e.g., `5000`)
  - `MONGO_URI`: MongoDB connection string for user data (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/Spotify`)
  - `JWT_SECRET`: Secret key for signing JWT tokens (e.g., `your_jwt_secret`)

### 3. **Admin Service**

- **File**: `admin_service/.env`
- **Variables**:
  - `PORT`: Port number for the Admin Service (e.g., `5001`)
  - `DB_URL`: PostgreSQL connection string for album and song data (e.g., `postgresql://<username>:<password>@host/dbname`)
  - `USER_URL`: URL of the User Service for authentication (e.g., `https://spotifyclone-production-ea6a.up.railway.app`)
  - `CLOUD_NAME`: Cloudinary cloud name for file uploads
  - `CLOUD_API_KEY`: Cloudinary API key
  - `CLOUD_SECRET_KEY`: Cloudinary secret key
  - `REDIS_HOST`: Redis host for caching
  - `REDIS_PASSWORD`: Redis password
  - `REDIS_PORT`: Redis port (e.g., `13465`)

### 4. **Song Service**

- **File**: `song_service/.env`
- **Variables**:
  - `PORT`: Port number for the Song Service (e.g., `5002`)
  - `DB_URL`: PostgreSQL connection string for song and album data (e.g., `postgresql://<username>:<password>@host/dbname`)
  - `REDIS_HOST`: Redis host for caching
  - `REDIS_PASSWORD`: Redis password
  - `REDIS_PORT`: Redis port (e.g., `13465`)

### Notes:

- Ensure all `.env` files are properly configured before running the services.
- Do not commit `.env` files to version control to protect sensitive information.

## How to Run Locally

### Prerequisites

- Node.js and npm installed
- MongoDB and PostgreSQL databases set up
- Redis server running

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/nik8839/Spotify_Clone.git
   cd spotify-clone
   ```

2. Install dependencies for each service:

   ```bash
   cd frontend
   npm install
   cd ../user_service
   npm install
   cd ../admin_service
   npm install
   cd ../song_service
   npm install
   ```

3. Set up environment variables:

   - Create `.env` files in each service directory with the required variables (e.g., database URLs, JWT secrets).

4. Start the services:

   ```bash
   # Start frontend
   cd frontend
   npm run dev

   # Start user service
   cd ../user_service
   npm run dev

   # Start admin service
   cd ../admin_service
   npm run dev

   # Start song service
   cd ../song_service
   npm run dev
   ```

5. Access the application:
   - Frontend: `http://localhost:3000`
   - User Service: `http://localhost:5000`
   - Admin Service: `http://localhost:5001`
   - Song Service: `http://localhost:5002`

## Images to Add

- **Architecture Diagram**:
  ![Architecture Diagram](frontend/public/img_20.PNG)

- **Frontend UI**:
  ![Login Page](frontend/public/img_2.PNG)
  ![Register Page](frontend/public/img_3.PNG)
  ![Home](frontend/public/img_4.PNG)
  ![My Playlist](frontend/public/img_6.PNG)
  ![Add Album](frontend/public/img_7.PNG)
  ![Add Song](frontend/public/img_8.PNG)
  ![AfterAdding Song](frontend/public/img_11.PNG)
  ![Home Page](frontend/public/img_1.PNG)

## Conclusion

This Spotify Clone demonstrates the power of microservices architecture, modern frontend frameworks, and cloud deployment. It is scalable, efficient, and easy to maintain, making it a great example of a production-ready application.
