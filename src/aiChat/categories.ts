export const categories = {
  location: {
    intro: "🌍 Assist with location-based queries and navigation.",
    prompts: {
      fetch_current_location: {
        title: "Fetch Current Location",
        prompt: "📍 Fetch the user's current location and provide nearby landmarks.",
        description: "This fetches the user's location and lists nearby places of interest.",
      },
      directions: {
        title: "Find Directions",
        prompt: "🗺️ Find the best route from {start} to {end}, avoiding traffic delays.",
        description: "This provides optimized travel directions using real-time data.",
      },
      nearby_places: {
        title: "Nearby Places",
        prompt: "🔍 List the top 5 family-friendly locations near {location}.",
        description: "Includes parks, cafes, and attractions within a 5km radius.",
      },
    },
  },
  weather: {
    intro: "🌦️ Provide real-time weather updates and forecasts.",
    prompts: {
      current_weather: {
        title: "Current Weather",
        prompt: "🌡️ The current weather in {location} is {temperature}°C with {conditions}.",
        description: "Displays the current temperature, weather conditions, and any alerts.",
      },
      weekly_forecast: {
        title: "7-Day Forecast",
        prompt: "📅 Provide a detailed 7-day weather forecast for {location}.",
        description: "Includes temperature highs and lows, precipitation chances, and wind speeds.",
      },
    },
  },
};

