# WeatherWave 🌤️

A modern, responsive weather application built with React, TypeScript, and Tailwind CSS. Get current weather data for any location worldwide using the Weatherstack API.

## ✨ Features

- **Current Weather**: Real-time weather data for any city or location
- **Smart Location Search**: Auto-complete suggestions powered by OpenStreetMap
- **Responsive Design**: Beautiful glass-morphism UI that works on all devices
- **Type-Safe**: Built with TypeScript for better development experience
- **Fast & Modern**: Powered by Vite for lightning-fast development and builds

## 🚀 Live Demo

Visit the live application: [WeatherWave](https://weather-wave.vercel.app)

> **Note**: If you're deploying this app, make sure to set the `VITE_WEATHERSTACK_API_KEY` environment variable in your deployment platform. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next generation frontend tooling
- **Weatherstack API** - Reliable weather data
- **OpenStreetMap Nominatim** - Location search and geocoding

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Karthikkarthiii08/WeatherWave.git
cd WeatherWave
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Weatherstack API key to the `.env` file:
```
VITE_WEATHERSTACK_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

## 🔑 API Key Setup

1. Sign up for a free account at [Weatherstack](https://weatherstack.com/)
2. Get your API key from the dashboard
3. Add it to your `.env` file as shown above

## 🎯 Usage

1. Type any city or location name in the search box
2. Press Enter or click "Fetch current weather"
3. View detailed weather information including:
   - Current temperature and "feels like" temperature
   - Weather conditions and description
   - Wind speed and direction
   - Humidity and atmospheric pressure
   - UV index and visibility

## 📱 Screenshots

![WeatherWave Interface](https://via.placeholder.com/800x400?text=WeatherWave+Interface)

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Vercel or Netlify.

**Quick Deploy to Vercel:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Karthikkarthiii08/WeatherWave)

Remember to add your `VITE_WEATHERSTACK_API_KEY` environment variable in the Vercel dashboard!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Karthik K**
- GitHub: [@Karthikkarthiii08](https://github.com/Karthikkarthiii08)

---

Made with ❤️ by Karthik K