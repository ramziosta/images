# Image Processing API

Welcome to the Image Processing API! This API allows you to upload images and perform various processing tasks on them using TypeScript and Express.

## Features

- **Image Upload**: Upload images to the server for processing.
- **Image Resizing**: Resize uploaded images to your desired dimensions.
- **Image Cropping**: Crop specific areas from uploaded images.
- **Image Downloading**: Download the processed images after applying transformations.
- **Error Handling**: Receives informative messages in case of processing failures or invalid requests.

### Bonus Features (to be implemented)

- **Image Filtering**: Apply filters like grayscale and blur (coming soon).
- **Image Watermarking**: Add a watermark to your processed images (coming soon).

## Getting Started

### Prerequisites

- This API requires an HTTP client or tools like Postman for interaction.
- The API is written in TypeScript and uses Node.js and npm on the server side.

### Running the API

1. **Clone this repository:**

    ```bash
    git clone https://github.com/<your-github-username>/image-processing-api.git
    ```

2. **Install dependencies:**

    ```bash
    cd image-processing-api
    npm install
    ```

3. **Start the server:**

    ```bash
    npm start
    ```

This will start the API server on the default port (usually 3000).

### Using the API

The API endpoints will be documented here as they are implemented. The documentation will include details on:

- Endpoint URLs and methods (GET, POST, etc.)
- Request parameters (if any)
- Response format and expected data

#### Example:

**Endpoint**: `/api/resize` (POST method)

**Request Parameters:**

- `width`: Desired width of the resized image (integer)
- `height`: Desired height of the resized image (integer)
- `image`: The image file uploaded in the request body (using a file upload field)

**Response:**

- **On success**: The response will contain a URL where the resized image can be downloaded.
- **On error**: The response will contain an error message describing the issue.

(Note: This is just an example, the actual endpoints and parameters will be documented as we build the functionalities.)

## Contributing

We welcome contributions to this project! Feel free to fork the repository, make changes, and submit pull requests.

## License

This project is licensed under the MIT License.