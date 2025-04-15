require('dotenv').config(); // Load environment variables from .env file

export default {
  "expo": {
    "name": "sf-fam",
    "slug": "sf-fam",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "expo-localization"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "apiKey": process.env.GOOGLE_API_KEY,
      "eas": {
        // Optional: Add EAS build configuration if needed
        // "projectId": "your-eas-project-id"
      }
    }
  }
};
