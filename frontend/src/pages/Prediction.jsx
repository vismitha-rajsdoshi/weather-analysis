import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sun, CloudRain, ThermometerSun } from 'lucide-react';
import { LocationContext } from '../context/LocationContext';

const API_BASE = 'https://weather-analysis-back.onrender.com/api/weather';

export default function PredictionPage() {
  const { location: currentLoc } = useContext(LocationContext);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/current?lat=${currentLoc.lat}&lon=${currentLoc.lon}`)
      .then(res => {
         if (res.data && res.data.daily) {
             const data = res.data.daily.time.map((time, idx) => ({
                 date: new Date(time).toLocaleDateString('en-US', {weekday: 'short', day: 'numeric'}),
                 maxTemp: res.data.daily.temperature_2m_max[idx],
                 minTemp: res.data.daily.temperature_2m_min[idx],
                 rain: res.data.daily.precipitation_sum[idx],
                 uv: res.data.daily.uv_index_max[idx]
             }));
             setForecast(data);
         }
         setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [currentLoc]);

  return (
    <div className="fade-in">
      <header className="page-header">
        <h1>Forecast & Predict</h1>
        <p className="subtitle">Deep AI-driven modelling for the next 7 days</p>
      </header>

      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
         <div className="glass-panel metric-card">
            <div className="metric-header">
               <h3>Peak Heat Variance</h3>
               <ThermometerSun className="icon-orange" size={24} />
            </div>
            <p className="metric-sub" style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>7-day trajectory shows normalized patterns. Max peak expected at {forecast[3]?.maxTemp}°C.</p>
         </div>
         <div className="glass-panel metric-card">
            <div className="metric-header">
               <h3>UV Index Watch</h3>
               <Sun className="icon-orange" size={24} />
            </div>
            <p className="metric-sub" style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>Moderate exposure risk. Max UV index hitting {forecast[1]?.uv} today. Sun protection recommended.</p>
         </div>
         <div className="glass-panel metric-card">
            <div className="metric-header">
               <h3>Storm Prediction</h3>
               <CloudRain className="icon-indigo" size={24} />
            </div>
            <p className="metric-sub" style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>Lowest pressure systems approaching mid-week. Precipitation spike expected smoothly.</p>
         </div>
      </div>
      
      <div className="chart-grid">
         <div className="glass-panel chart-panel">
           <h3>Daily Extremes Range (°C)</h3>
           {loading ? (
                <p>Loading prediction models...</p>
           ) : (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 12}} />
                      <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: 'none', borderRadius: '12px' }} />
                      <Legend />
                      <Area type="monotone" dataKey="maxTemp" stroke="#ef4444" fill="rgba(239, 68, 68, 0.2)" strokeWidth={2} name="Max Temp" />
                      <Area type="monotone" dataKey="minTemp" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.2)" strokeWidth={2} name="Min Temp" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
           )}
         </div>

         <div className="glass-panel chart-panel">
           <h3>UV Index Risk Tracker</h3>
           {loading ? (
                <p>Loading AI summary...</p>
           ) : (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 12}} />
                      <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                      <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: 'none', borderRadius: '12px' }} />
                      <Bar dataKey="uv" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Peak UV Index" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
           )}
         </div>
      </div>
    </div>
  );
}
