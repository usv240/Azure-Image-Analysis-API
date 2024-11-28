**Azure Image Analysis API**

This project uses Microsoft's Azure Vision API to analyze images. It processes an image URL and gives details like:

    What the image is about (e.g., "A man in a suit").
    The main colors in the image (e.g., Black, Grey).
    Tags describing the image (e.g., "business", "person").
    Technical details such as image size and format.

This API is simple to set up and can be used for personal or professional purposes, like building applications that analyze images automatically.
1. Overview

This application provides a single API endpoint to analyze images:

    You send an image URL to the API.
    The API calls Azure's Vision service.
    It returns the results in an easy-to-read format, including:
        Description: A caption for the image with confidence levels.
        Categories: The type of image (e.g., "people").
        Colors: Dominant colors, foreground/background colors, and accent colors.
        Image Details: Dimensions and file format.

2. Features

    1.Easy to Use: Simple API endpoint to analyze any publicly accessible image.
    2.Secure: The Azure API key is stored securely in a .env file.
    3.Customizable: You can expand it to include more Azure Vision features like face detection or landmark recognition.
    4.Error Handling: Provides meaningful error messages for invalid inputs.

3. How to Set It Up
Step 1: Prerequisites

Before you start, make sure you have:

    Node.js (at least version 14) installed on your system.
    An Azure Vision API account (you’ll need the API key and endpoint).
    Postman or a similar tool to test the API (optional).

Step 2: Clone the Repository

Download the project to your system:

    git clone https://github.com/usv240/azure-image-analysis.git
    cd azure-image-analysis

Step 3: Install Dependencies

Install all required packages:

    npm install

Step 4: Configure Environment Variables

  1.Create a .env file in the project folder.

  2.Add your Azure Vision API credentials:

    AZURE_API_KEY=your-azure-api-key
    AZURE_ENDPOINT=https://your-azure-endpoint.cognitiveservices.azure.com/vision/v3.2/analyze

    Replace your-azure-api-key and your-azure-endpoint with the values from your Azure portal.

Step 5: Start the Server

Run the application:

    node server.js

You should see:

    [STARTUP] Server running on http://localhost:3000

Your API is now live and ready to use.
4. How to Use the API
Endpoint

    URL: http://localhost:3000/analyze-image
    Method: POST

Headers

    Content-Type: application/json

Body

You must send a JSON object with an imageUrl field containing the URL of the image you want to analyze:

    {
      "imageUrl": "https://example.com/your-image.jpg"
    }

Example Request Using cURL

    curl -X POST http://localhost:3000/analyze-image \
    -H "Content-Type: application/json" \
    -d '{
      "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
    }'

Example Request Using Postman

    Open Postman.
    Create a new request:
        Method: POST
        URL: http://localhost:3000/analyze-image
    Go to the Body tab:
        Select raw.
        Set the content type to JSON.
        Add this:

        {
          "imageUrl": "https://example.com/your-image.jpg"
        }

    Click Send.

Example Response

If the request is successful, the API will return:

{
  "categories": [
    {
      "category": "People",
      "confidence": "59%"
    }
  ],
  "colors": {
    "dominantForeground": "Black",
    "dominantBackground": "Black",
    "dominantColors": ["Black"],
    "accentColor": "#605972",
    "isBlackAndWhite": false
  },
  "description": {
    "summary": "A man in a suit",
    "confidence": "56%",
    "tags": ["person", "man", "suit", "business"]
  },
  "imageDetails": {
    "format": "JPEG",
    "resolution": "400 x 600"
  },
  "modelInfo": {
    "version": "2021-05-01",
    "requestId": "03abb0d0-6bd7-44fb-8f37-b77abf2f3bbf"
  }
}

5. Error Handling

The API handles common errors gracefully:
Missing imageUrl

    Cause: You didn’t send an imageUrl in the request body.
    Response:

    {
      "error": "Image URL is required"
    }

Invalid Image URL

    Cause: The URL provided is not valid or not publicly accessible.
    Response:

    {
      "error": "Invalid Image URL"
    }

Azure API Error

    Cause: An error occurred while calling Azure Vision API.
    Response:

    {
      "error": "Failed to analyze image.",
      "details": "Specific error message from Azure."
    }

6. Deployment
Using PM2

PM2 keeps your application running even if the server restarts.

    Install PM2 globally:

    npm install -g pm2

Start the application with PM2:

    pm2 start server.js --name "azure-image-analysis"

Save the PM2 process list:

    pm2 save

Check the app status:

    pm2 list
