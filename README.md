# Weatherly ☀️🌧️  
Modern Weather Application

## Overview

Weatherly is a responsive weather application that provides real-time weather information, hourly temperature trends, and multi-day forecasts. The application is designed to deliver fast, accurate weather data with an intuitive user experience, focusing on efficient client-side data fetching and state management.

This project emphasizes frontend best practices such as API integration, caching, custom hooks, and data visualization.

---

## Problem Space

Users often need quick access to reliable weather information across different locations, but many weather apps suffer from slow load times, poor state handling, or cluttered interfaces.

Weatherly addresses these issues by:
- Efficiently fetching and caching weather data
- Providing clear visualizations for temperature trends
- Offering a clean, responsive UI across devices

---

## Core Features

### Current Weather & Forecast
- Displays current weather conditions
- Hourly temperature forecast with charts
- Multi-day weather forecast

### Location & Search
- Automatic weather data based on user’s current location
- City-based weather search
- Search history for quick access to recent locations
- Favorite cities management

### Data Visualization
- 24-hour temperature trends using charts
- Clear and readable forecast layouts

### User Experience
- Dark and light mode support
- Fully responsive design
- Fast loading states and error handling

---

## Architecture Overview

Weatherly is built as a client-side focused application with:

- **Component-driven UI** using React and TypeScript
- **Server-state management** using TanStack Query for caching and refetching
- **Custom hooks** for geolocation and reusable logic
- **API-driven data layer** for weather and location data
- **Declarative routing** for multi-page navigation

---

## Tech Stack

**Frontend**
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

**State Management & Data Fetching**
- TanStack Query (React Query)

**APIs**
- OpenWeather API
- Geolocation API

**Charts & Utilities**
- Recharts
- date-fns

**Routing**
- React Router DOM

---

## Engineering Focus

- Efficient API consumption and caching strategies
- Clean separation of UI and data-fetching logic
- Reusable components and custom hooks
- Responsive layouts and accessible UI
- Graceful loading and error states

---

## Why This Project

Weatherly demonstrates a practical approach to building data-driven frontend applications, focusing on performance, maintainability, and user experience when working with real-world APIs.
