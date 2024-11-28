const express = require('express'); // Importing Express framework for creating the web server
const axios = require('axios'); // Importing Axios for making HTTP requests
const dotenv = require('dotenv'); // Importing dotenv to handle environment variables

// Load environment variables from .env file
dotenv.config();

const app = express(); // Initialize Express app
const PORT = process.env.PORT || 3000; // Use the port specified in environment variables or default to 3000

// Middleware to parse JSON bodies
app.use(express.json());

// Load Azure API credentials from environment variables
const AZURE_API_KEY = process.env.AZURE_API_KEY; // Your Azure Vision API key
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT; // The endpoint for your Azure Vision API

// Ensure API credentials are properly configured
if (!AZURE_API_KEY || !AZURE_ENDPOINT) {
  console.error('[ERROR] Missing Azure API credentials. Please check your .env file.');
  process.exit(1); // Terminate the application if credentials are not set
}

// Function to simplify and format the response from Azure Vision API
const processAzureResponse = (response) => {
  return {
    // Simplify categories, capitalizing the name and converting confidence to a percentage
    categories: response.categories.map((category) => ({
      category: category.name.charAt(0).toUpperCase() + category.name.slice(1),
      confidence: `${Math.round(category.score * 100)}%`
    })),
    // Extract and structure color information
    colors: {
      dominantForeground: response.color.dominantColorForeground,
      dominantBackground: response.color.dominantColorBackground,
      dominantColors: response.color.dominantColors,
      accentColor: `#${response.color.accentColor}`,
      isBlackAndWhite: response.color.isBWImg || response.color.isBwImg
    },
    // Structure image description details, including tags and captions
    description: {
      summary: response.description.captions[0]?.text || "No caption available",
      confidence: `${Math.round(response.description.captions[0]?.confidence * 100)}%`,
      tags: response.description.tags
    },
    // Provide image metadata like format and dimensions
    imageDetails: {
      format: response.metadata.format.toUpperCase(),
      resolution: `${response.metadata.width} x ${response.metadata.height}`
    },
    // Include additional details about the API request
    modelInfo: {
      version: response.modelVersion,
      requestId: response.requestId
    }
  };
};

// Define a route to analyze images using the Azure Vision API
app.post('/analyze-image', async (req, res) => {
  const { imageUrl } = req.body; // Extract the image URL from the request body

  // Check if imageUrl is provided in the request
  if (!imageUrl) {
    console.error('[ERROR] Image URL is missing.');
    return res.status(400).json({ error: 'Image URL is required' });
  }

  console.log(`[LOG] Received image URL: ${imageUrl}`);

  try {
    console.log('[LOG] Sending request to Azure Vision API...');
    // Make a POST request to the Azure Vision API with the provided image URL
    const response = await axios.post(
      `${AZURE_ENDPOINT}?visualFeatures=Categories,Description,Color`, // Query parameters for desired visual features
      { url: imageUrl }, // Payload containing the image URL
      {
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_API_KEY, // API key for authentication
          'Content-Type': 'application/json', // Content type of the request
        },
      }
    );

    console.log('[LOG] Received response from Azure Vision API.');

    // Process the response to make it more user-friendly
    const processedResponse = processAzureResponse(response.data);

    // Send the processed response back to the client
    res.json(processedResponse);
  } catch (error) {
    // Log the error and send a generic error response
    console.error('[ERROR] Failed to analyze the image:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to analyze image.',
      details: error.response?.data || error.message,
    });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`[STARTUP] Server is running at http://localhost:${PORT}`);
});
