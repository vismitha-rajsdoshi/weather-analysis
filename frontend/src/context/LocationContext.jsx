import React, { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('weather_city');
    if (saved) return JSON.parse(saved);
    // Default to Bangalore
    return { name: 'Bangalore, India', lat: 12.9716, lon: 77.5946 };
  });

  // Track if we successfully auto-located so we don't spam prompt
  const [hasAutoLocated, setHasAutoLocated] = useState(() => {
    return localStorage.getItem('has_auto_located') === 'true';
  });

  useEffect(() => {
    // Save to local storage whenever it changes
    localStorage.setItem('weather_city', JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    // Auto Geolocation on first load
    if (!hasAutoLocated && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
           const lat = position.coords.latitude;
           const lon = position.coords.longitude;
           
           try {
             // Reverse Geocoding to get City Name
             const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
             if (response.ok) {
                 const data = await response.json();
                 setLocation({
                    name: `${data.city || data.locality || 'Unknown Area'}, ${data.countryName || ''}`,
                    lat,
                    lon
                 });
             } else {
                 setLocation({ name: 'Your Location', lat, lon });
             }
           } catch(e) {
               setLocation({ name: 'Your Location', lat, lon });
           }
           
           setHasAutoLocated(true);
           localStorage.setItem('has_auto_located', 'true');
        },
        (error) => {
           console.log("Geolocation permission denied or failed.");
           setHasAutoLocated(true);
           localStorage.setItem('has_auto_located', 'true');
        }
      );
    }
  }, [hasAutoLocated]);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
