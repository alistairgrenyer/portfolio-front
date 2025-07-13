'use client';

import { useState, useEffect } from 'react';
import ukGeoData from './uk.geo.low.city.geo.json';

// Define city coordinates as percentages for positioning on the UK SVG map
export interface CityCoordinate {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
}

// Location data with coordinates for map
export interface LocationData {
  company: string;
  position: string;
  dates: string;
  location: string;
  coordinates: CityCoordinate;
}

// This will be computed from the GeoJSON city polygons
export const UK_CITY_COORDINATES: Record<string, CityCoordinate> = {};

// Component for simple location map with pins
interface LocationMapProps {
  locations: LocationData[];
  onPinClick: (companyName: string) => void;
}

// Define the GeoJSON types for TypeScript
interface GeoJSONFeature {
  type: string;
  properties: {
    location?: string;
    [key: string]: any;
  };
  geometry: {
    type: string; // Can be 'Point' or 'Polygon' or 'MultiPolygon'
    coordinates: any[]; // For Point: [lng, lat], for Polygon: [[[lng, lat], ...]], for MultiPolygon: [[[[lng, lat], ...]]]
  };
  id: number;
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

export const LocationMap = ({ locations, onPinClick }: LocationMapProps) => {
  const [activePin, setActivePin] = useState<string | null>(null);
  const [transformedData, setTransformedData] = useState<{
    ukPath: string;
    cityPoints: Record<string, {x: number, y: number, rawX: number, rawY: number}>;
  }>({ ukPath: '', cityPoints: {} });
  
  // Transform all GeoJSON data at once - both UK outline and city points
  useEffect(() => {
    // Cast to the appropriate type
    const geoData = ukGeoData as unknown as GeoJSONData;
    if (!geoData || !geoData.features || geoData.features.length === 0) return;
    
    // Extract UK outline (feature index 0)
    const ukCoordinates = geoData.features[0].geometry.coordinates as number[][][][];
    
    // Find min/max bounds of the UK map for scaling
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    ukCoordinates.forEach((polygon: number[][][]) => {
      polygon.forEach((ring: number[][]) => {
        ring.forEach((coord: number[]) => {
          const lng = coord[0];
          const lat = coord[1];
          minX = Math.min(minX, lng);
          minY = Math.min(minY, lat);
          maxX = Math.max(maxX, lng);
          maxY = Math.max(maxY, lat);
        });
      });
    });
    
    // Calculate scale factors - used for both UK path and city points
    const width = 800;
    const height = 800;
    const padding = 50;
    
    const scaleX = (width - padding * 2) / (maxX - minX);
    const scaleY = (height - padding * 2) / (maxY - minY);
    
    // 1. Generate UK map path
    let ukPath = '';
    
    ukCoordinates.forEach((polygon: number[][][], polyIndex: number) => {
      polygon.forEach((ring: number[][], ringIndex: number) => {
        ring.forEach((coord: number[], i: number) => {
          // Apply transformation
          const lng = coord[0];
          const lat = coord[1];
          const x = (lng - minX) * scaleX + padding;
          const y = height - ((lat - minY) * scaleY + padding); // Invert Y
          
          // Build path
          if (i === 0) {
            ukPath += `${polyIndex > 0 || ringIndex > 0 ? ' M' : 'M'} ${x},${y}`;
          } else {
            ukPath += ` L ${x},${y}`;
          }
          
          if (i === ring.length - 1) {
            ukPath += ' Z';
          }
        });
      });
    });
    
    // 2. Transform city points with the exact same transformation
    const cityPoints: Record<string, {x: number, y: number, rawX: number, rawY: number}> = {};
    
    // Process city point features (starting from index 1)
    geoData.features.slice(1).forEach((feature: GeoJSONFeature) => {
      if (feature.properties?.location && feature.geometry.type === 'Point') {
        const cityName = feature.properties.location;
        const coord = feature.geometry.coordinates as number[];
        const rawX = coord[0];
        const rawY = coord[1];
        
        // Apply the exact same transformation as UK map path
        const x = (rawX - minX) * scaleX + padding;
        const y = height - ((rawY - minY) * scaleY + padding); // Invert Y
        
        cityPoints[cityName] = {
          x: x / width * 100, // Convert to percentage for CSS positioning
          y: y / height * 100,
          rawX,
          rawY
        };
      }
    });
    
    // Store both the UK path and transformed city points
    setTransformedData({
      ukPath,
      cityPoints
    });
    
  }, []);
  
  // No need for a separate function - path is pre-calculated in transformedData
  const ukMapPath = transformedData.ukPath;
  
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 800 800" 
            xmlns="http://www.w3.org/2000/svg" 
            preserveAspectRatio="xMidYMid meet"
          >
            <path 
              d={ukMapPath} 
              className="fill-gray-200 dark:fill-gray-700 stroke-gray-400 dark:stroke-gray-500" 
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      
      {/* Location pins */}
      {locations.map((loc) => {
        // Extract city name from location string (e.g., "Some Company, York" -> "york")
        const cityName = loc.location.split(',').pop()?.trim().toLowerCase() || '';
        
        // Find matching city coordinates from pre-calculated city points
        // Look for both lowercase and capitalized versions of the city name
        const cityPoint = transformedData.cityPoints[cityName] || 
                         transformedData.cityPoints[cityName.charAt(0).toUpperCase() + cityName.slice(1)] || 
                         { x: 50, y: 50 }; // Fallback to center if not found
        
        return (
          <div 
            key={loc.company}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${cityPoint.x}%`,
              top: `${cityPoint.y}%`,
              zIndex: activePin === loc.company ? 30 : 20,
            }}
          onMouseEnter={() => setActivePin(loc.company)}
          onMouseLeave={() => setActivePin(null)}
        >
          <div className="relative group">
            {/* Pin */}
            <div 
              className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md cursor-pointer hover:ring-4 hover:ring-blue-300 dark:hover:ring-blue-700 transition-all"
              onClick={() => onPinClick(loc.company)}
            >
              {/* Pulse animation on hover */}
              <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 dark:bg-blue-500 animate-ping"></span>
            </div>
            
            {/* City name */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 mb-1 whitespace-nowrap">
              <span className="text-xs font-bold bg-white dark:bg-gray-800 px-1 py-0.5 rounded shadow text-gray-900 dark:text-white">
                {loc.location.split(',')[1]?.trim() || loc.location.split(',')[0].trim()}
              </span>
            </div>

            {/* Info tooltip */}
            <div 
              className={`absolute z-10 w-48 p-2 bg-white dark:bg-gray-800 rounded shadow-lg text-left transition-opacity duration-200 border border-gray-200 dark:border-gray-700 ${activePin === loc.location ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
            >
              <h4 className="font-bold text-sm">{loc.company}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{loc.position}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{loc.dates}</p>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default LocationMap;
