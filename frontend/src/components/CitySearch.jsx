import React, { useState, useContext, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { LocationContext } from '../context/LocationContext';

export default function CitySearch() {
  const { location, setLocation } = useContext(LocationContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      // Free geocoding API from Open-Meteo
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`)
        .then(res => res.json())
        .then(data => {
            if (data.results) {
                setResults(data.results);
                setShowDropdown(true);
            } else {
                setResults([]);
            }
            setIsSearching(false);
        })
        .catch(err => {
            console.error(err);
            setIsSearching(false);
        });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (city) => {
      setLocation({
          name: `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}, ${city.country}`,
          lat: city.latitude,
          lon: city.longitude
      });
      setQuery('');
      setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="search-container" style={{ position: 'relative', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Location</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
            <MapPin size={18} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{location.name}</span>
        </div>

        <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
                type="text" 
                placeholder="Search global city..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if(results.length > 0) setShowDropdown(true); }}
                style={{
                   width: '100%',
                   padding: '12px 12px 12px 40px',
                   borderRadius: '12px',
                   border: '1px solid var(--glass-border)',
                   background: 'rgba(15, 23, 42, 0.4)',
                   color: 'var(--text-main)',
                   fontFamily: 'inherit',
                   outline: 'none',
                   transition: 'all 0.2s ease',
                   boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
            />
            {isSearching && <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>...</span>}
        </div>

        {showDropdown && results.length > 0 && (
            <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0, right: 0,
                background: 'var(--bg-panel)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                zIndex: 100,
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                overflow: 'hidden'
            }}>
                {results.map((r, i) => (
                    <div 
                       key={i} 
                       onClick={() => handleSelect(r)}
                       style={{
                           padding: '12px 16px',
                           cursor: 'pointer',
                           borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                           display: 'flex',
                           flexDirection: 'column',
                           gap: '4px'
                       }}
                       onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                       onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span style={{ fontWeight: '500' }}>{r.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.admin1 ? r.admin1 + ', ' : ''}{r.country}</span>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}
