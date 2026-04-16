import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { LocationContext } from '../context/LocationContext';

const API_BASE = 'https://weather-analysis-back.onrender.com/api/weather';

export default function HistoryPage() {
  const { location: currentLoc } = useContext(LocationContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/history-api?lat=${currentLoc.lat}&lon=${currentLoc.lon}`)
      .then(res => {
         if (res.data && res.data.daily) {
             const data = res.data.daily.time.map((time, idx) => ({
                 date: new Date(time).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
                 temp: res.data.daily.temperature_2m_mean[idx],
                 rain: res.data.daily.precipitation_sum[idx]
             }));
             setHistory(data);
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
        <h1>Historical Analysis</h1>
        <p className="subtitle">Last 14 days of tracked climate data variations</p>
      </header>
      
      <div className="chart-grid">
          <div className="glass-panel chart-panel">
            <h3>Temperature Baseline</h3>
            {loading ? (
                 <p>Loading historical data...</p>
            ) : (
                 <div className="chart-container">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorTempHist" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ec4899" stopOpacity={0.6}/>
                           <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                       <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 12}} />
                       <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                       <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: 'none', borderRadius: '12px' }} />
                       <Area type="monotone" dataKey="temp" name="Avg Temp (°C)" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorTempHist)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
            )}
          </div>

          <div className="glass-panel chart-panel">
            <h3>Precipitation Volume</h3>
            {loading ? (
                 <p>Loading history...</p>
            ) : (
                 <div className="chart-container">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                       <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 12}} />
                       <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                       <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: 'none', borderRadius: '12px' }} />
                       <Bar dataKey="rain" name="Rain Vol (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
            )}
          </div>
      </div>
    </div>
  );
}
