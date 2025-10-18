# Codexist Pinpoint App - Frontend

A React-based web application for searching and saving nearby places using Google Maps API. Users can search for various types of places within a specified radius, view them on an interactive map, and save their favorites.

## Live Demo

The application is deployed at: https://codexist-pinpoint-nisadost-f7b7a218afdb.herokuapp.com/

## Features

- Interactive Google Maps integration
- Search nearby places by type (restaurants, cafes, hospitals, etc.)
- Customizable search radius
- Real-time map updates with smooth animations
- User authentication (register/login)
- Save and manage favorite places
- Visual distinction between saved and unsaved places on map
- Responsive design

## Technologies Used

- React 18
- React Router DOM (for routing)
- Axios (for API requests)
- Google Maps JavaScript API
- @react-google-maps/api (for map integration)
- CSS3 (for styling)

## Prerequisites

Before running this application, ensure you have:

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- A Google Maps API key
- Backend API running (see backend README)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_API_BASE_URL=http://localhost:8070
```

Replace `your_google_maps_api_key` with your actual Google Maps API key.

For production, update `REACT_APP_API_BASE_URL` to your backend server URL.

## Installation

1. Clone the repository
```bash
git clone https://github.com/NisaDost/Codexist-Pinpoint-Frontend
cd Codexist-Pinpoint-Frontend
```

2. Install dependencies
```bash
npm install
```

3. Create and configure the `.env` file as described above

4. To set up your backend server, follow instructions on this repository: https://github.com/NisaDost/Codexist-Pinpoint

5. Start the development server
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

### `npm start`
Runs the app in development mode at http://localhost:3000

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
Ejects from Create React App (one-way operation, use with caution)

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── Map.js          # Google Maps component
│   ├── Navbar.js       # Navigation bar
│   ├── PlacesList.js   # List of places display
│   └── SearchForm.js   # Search form component
├── context/            # React Context for state management
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Home.js         # Main search page
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   └── SavedPlaces.js  # Saved places page
├── services/           # API services
│   └── api.js          # API calls and configuration
├── utils/              # Utility functions
│   └── errorHandler.js # Error handling utilities
├── App.js              # Main application component
├── App.css             # Application styles
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Usage

### Search for Places

1. Enter longitude and latitude coordinates (or click on the map)
2. Set the search radius in meters
3. Select a place type from the dropdown
4. Click "Search Places"
5. View results in the sidebar and as markers on the map

### Save Places

1. Register for an account or login
2. Search for places
3. Click "Save Place" on any result
4. Access saved places from the navigation menu

### Manage Saved Places

1. Navigate to "Saved Places" from the menu
2. View all your saved places
3. Delete places using the "Delete" button

## Map Features

- Red marker: Current search center
- Blue markers: Unsaved places
- Green markers: Saved places
- Red circle: Search radius visualization
- Smooth animations when changing location

## Security Features

- JWT-based authentication
- Secure password handling (hashed on backend)
- HTTPS enforced in production
- Input sanitization
- Rate limiting on API requests
- Auto-logout on authentication failure

## API Integration

The frontend communicates with the backend through the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/places/nearby` - Search nearby places
- `GET /api/saved-places` - Get user's saved places
- `POST /api/saved-places` - Save a place
- `DELETE /api/saved-places/:id` - Delete a saved place

## Error Handling

The application provides user-friendly error messages for:

- Connection errors
- Authentication failures
- Validation errors
- Rate limit exceeded
- Duplicate saves
- Not found errors

## Troubleshooting

### Map not loading
- Check if your Google Maps API key is valid
- Ensure the API key has the necessary permissions
- Verify the `.env` file is properly configured

### Cannot connect to backend
- Ensure the backend server is running
- Check the `REACT_APP_API_BASE_URL` in `.env`
- Verify CORS settings on the backend

### Places not showing
- Check browser console for errors
- Verify your Google Maps API key has Places API enabled
- Ensure you're within the rate limits

## License

This project is part of the Codexist Pinpoint Case Study by Nisa Dost.
