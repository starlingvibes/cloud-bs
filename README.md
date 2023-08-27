---

# Cloud Backup Service API

The Cloud Backup API is a backend service that powers a cloud backup system. It allows users to securely create accounts and manage their backups in the cloud. This API is built using Google Cloud, Redis, ExpressJS, NodeJS, PostgreSQL, TypeScript and Jest for testing.

## Features

- User and admin registration: users and admins can create accounts with their full name, email address and password.
- User and admin login: users and admins can login to their accounts with their email address and password.
- Upload files: users can upload files (including photos and videos) of not more than 200MB.
- Stream photos and videos: Users can stream photos and videos from the cloud.
- Download files: users can download the files they uploaded to the bucket.
- View upload history: users can view their upload history.
- Delete files: users can delete files they created.
- View files: users can view all the files they created.
- View all upload history: Admins can view the upload history of the entire application.
- View all files: admins can view all the files of the entire application.
- Delete unsafe files: admins can delete files created by any user that are deemed unsafe.
- Secure Backup Storage: user files are securely stored on the cloud.
- API Testing: Comprehensive unit tests are implemented using Jest.


## API Endpoints
### Authentication (users and admins)
- `POST /api/v1/auth/register`: Register a new user account, admin accounts require a secret token.
- `POST /api/v1/auth/login`: Log in using email and password for both users and admins.
- `PUT /api/v1/auth/revoke/:userId`: Allows the Admin to revoke the session of a user

### User   functionalities
- `POST /api/v1/storage/upload`: Upload a file to the backup service
- `POST /api/v1/storage/create-folder`: Create a folder for storing files in the bucket
- `POST /api/v1/storage/upload`: Upload a file to a specified folder
- `GET /api/v1/storage/download/:fileName`: Download a file from the storage bucket
- `GET /api/v1/storage/download/:folderName/:fileName`: Download a file from a specified folder 
- `GET /api/v1/storage/list`: Get all files created by the user 
- `DELETE /api/v1/storage/delete/:fileName`: Delete file created by the user 
- `GET /api/v1/history/:userId`: Get the file upload history of the user
- `POST /api/v1/storage/compress`: Compress files and store them on the server

### Admin   functionalities
- `DELETE /api/v1/storage/delete/:fileName`: Delete a file from the storage bucket
- `GET /api/v1/storage/fetch-files`: Get all files stored on the bucket
- `GET /api/v1/storage/`: Get the history of all files uploaded to the bucket
- `GET /api/v1/history/:userId`: Get the file upload history of a given user
- `POST /api/v1/storage/mark-unsafe/:id`: Mark a file as unsafe
 
## Database Setup:

   - Launch a PostgreSQL shell and login using `psql -U <username>`.
   - Create a new database using `CREATE DATABASE "cloud_backup";`.
   - Connect to the database using `\c cloud_backup`.
   - Start the server, it will automatically describe the necessary tables

## Prerequisites

- Node.JS (v14.^.^ or higher)
- PostgreSQL database
- Postman for testing the API
- Redis for caching
- Docker for containerization

## Installation

1. Clone the repository:

```bash
git clone https://github.com/starlingvibes/cloud-bs.git
```

2. Navigate to the project directory:

```bash
cd cloud-bs
```

3. Install dependencies:

```bash
yarn add package.json
```

4. Create a `.env` file in the project root and set the following environment variables:

```env
# server settings
PORT=8000

# database settings
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=cloud_backup

# redis configuration
REDIS_HOST=
REDIS_PASSWORD=
REDIS_PORT=
REDIS_URL=

# application secrets
JWT_SECRET_USER=
JWT_SECRET_ADMIN=
ADMIN_TOKEN=
```

5. Set up your PostgreSQL database with the provided configuration.

6. Create a Google Cloud Storage bucket and download the JSON credentials file. Save it as `storage-keys.json` in the project root directory.

7. Create a Redis instance and set the environment variables in the `.env` file.

8. Start the server:

```bash
yarn start:dev
```


## Testing

The API includes unit tests implemented using Jest.

To run tests:

```bash
yarn test
```

## Dockerization 

The API is containerized using Docker. A Dockerfile is provided in the repository. To build and run the Docker container:

```bash
docker build -t cloud-bs .
docker run -p 13000:8000 -d cloud-bs
```

## Postman Collection

You can find a Postman collection with example API requests in the `src/postman` directory. Import this collection into Postman to test the API endpoints.

## Contributing

Contributions to this project are welcome! Feel free to submit issues and pull requests.
For any inquiries or questions, feel free to contact [dera@ieee.org](mailto:dera@ieee.org).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
