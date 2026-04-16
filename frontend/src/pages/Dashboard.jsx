import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Droplets, Wind, Thermometer, CloudRain } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/weather';

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/current?lat=12.9716&lon=77.5946`)
      .then(res => {
        setWeather(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="glass-panel"><h2>Loading Live Data...</h2></div>;
  if (!weather || !weather.current_weather) return <div className="glass-panel"><h2>Error loading data. Backend might be down.</h2></div>;

  const current = weather.current_weather;
  const currentHumidity = weather.hourly.relative_humidity_2m[0];
  const currentRain = weather.hourly.precipitation[0];
  
  // Format hourly data for the chart (next 24 hours)
  const hourlyData = weather.hourly.time.slice(0, 24).map((timeStr, idx) => ({
    time: new Date(timeStr).getHours() + ':00',
    temp: weather.hourly.temperature_2m[idx],
    humidity: weather.hourly.relative_humidity_2m[idx],
    rain: weather.hourly.precipitation[idx]
  }));

  return (
    <div className="fade-in">
      <header className="page-header">
         <div>
             <h1>Live Dashboard</h1>
             <p className="subtitle">Real-time planetary metrics for Bangalore, India</p>
         </div>
      </header>
      
      <div className="dashboard-grid">
        <div className="glass-panel metric-card">
          <div className="metric-header">
             <h3>Temperature</h3>
             <Thermometer className="icon-orange" size={24} />
          </div>
          <div className="metric-value">{current.temperature}°C</div>
          <p className="metric-sub">Feels like {(current.temperature + 1.2).toFixed(1)}°C</p>
        </div>
        
        <div className="glass-panel metric-card">
          <div className="metric-header">
             <h3>Wind Speed</h3>
             <Wind className="icon-teal" size={24} />
          </div>
          <div className="metric-value">{current.windspeed} km/h</div>
          <p className="metric-sub">Direction: {current.winddirection}°</p>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-header">
             <h3>Humidity</h3>
             <Droplets className="icon-blue" size={24} />
          </div>
          <div className="metric-value">{currentHumidity}%</div>
          <p className="metric-sub">Dew Point: {(current.temperature - 3).toFixed(1)}°C</p>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-header">
             <h3>Precipitation</h3>
             <CloudRain className="icon-indigo" size={24} />
          </div>
          <div className="metric-value">{currentRain} mm</div>
          <p className="metric-sub">Next 3 hrs: {(hourlyData[3].rain).toFixed(1)} mm</p>
        </div>
      </div>

      <div className="chart-grid">
          <div className="glass-panel chart-panel">
            <h3>24-Hour Temperature Trends</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                     <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                       <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{fontSize: 12}} />
                  <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Area type="natural" dataKey="temp" stroke="#f59e0b" strokeWidth={3} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-panel chart-panel">
            <h3>Humidity vs Precipitation</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{fontSize: 12}} />
                  <YAxis yAxisId="left" stroke="#3b82f6" orientation="left" tick={{fontSize: 12}} />
                  <YAxis yAxisId="right" stroke="#8b5cf6" orientation="right" tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="humidity" name="Humidity (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="rain" name="Rain (mm)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
    </div>
  );
}
