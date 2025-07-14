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
  
  // A utility function to transform coordinates using the same scaling logic
  const transformCoordinate = (
    coord: number[],
    minX: number,
    minY: number,
    scaleX: number,
    scaleY: number,
    height: number,
    padding: number
  ): {x: number, y: number} => {
    const lng = coord[0];
    const lat = coord[1];
    const x = (lng - minX) * scaleX + padding;
    const y = height - ((lat - minY) * scaleY + padding); // Invert Y
    return {x, y};
  };
  
  // Find min/max bounds of the GeoJSON coordinates
  const findBounds = (coordinates: number[][][][]): {minX: number, minY: number, maxX: number, maxY: number} => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    coordinates.forEach((polygon: number[][][]) => {
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
    
    return {minX, minY, maxX, maxY};
  };

  // Generate SVG path from coordinates
  const generateSvgPath = (
    coordinates: number[][][][],
    minX: number,
    minY: number,
    scaleX: number,
    scaleY: number,
    height: number,
    padding: number
  ): string => {
    let path = '';
    
    coordinates.forEach((polygon: number[][][], polyIndex: number) => {
      polygon.forEach((ring: number[][], ringIndex: number) => {
        ring.forEach((coord: number[], i: number) => {
          // Apply transformation
          const {x, y} = transformCoordinate(coord, minX, minY, scaleX, scaleY, height, padding);
          
          // Build path
          if (i === 0) {
            path += `${polyIndex > 0 || ringIndex > 0 ? ' M' : 'M'} ${x},${y}`;
          } else {
            path += ` L ${x},${y}`;
          }
          
          if (i === ring.length - 1) {
            path += ' Z';
          }
        });
      });
    });
    
    return path;
  };
  
  // Transform all GeoJSON data at once - both UK outline and city points
  useEffect(() => {
    // Cast to the appropriate type
    const geoData = ukGeoData as unknown as GeoJSONData;
    if (!geoData || !geoData.features || geoData.features.length === 0) return;
    
    // Extract UK outline (feature index 0)
    const ukCoordinates = geoData.features[0].geometry.coordinates as number[][][][];
    
    // Find min/max bounds and calculate scaling factors once
    const {minX, minY, maxX, maxY} = findBounds(ukCoordinates);
    
    const width = 800;
    const height = 800;
    const padding = 50;
    
    const scaleX = (width - padding * 2) / (maxX - minX);
    const scaleY = (height - padding * 2) / (maxY - minY);
    
    // 1. Generate UK map path using the reusable function
    const ukPath = generateSvgPath(ukCoordinates, minX, minY, scaleX, scaleY, height, padding);
    
    // 2. Transform city points using the same transformation function
    const cityPoints: Record<string, {x: number, y: number, rawX: number, rawY: number}> = {};
    
    // Process city point features (starting from index 1)
    geoData.features.slice(1).forEach((feature: GeoJSONFeature) => {
      if (feature.properties?.location && feature.geometry.type === 'Point') {
        const cityName = feature.properties.location;
        const coord = feature.geometry.coordinates as number[];
        const rawX = coord[0];
        const rawY = coord[1];
        
        // Apply the exact same transformation as UK map path
        const {x, y} = transformCoordinate(coord, minX, minY, scaleX, scaleY, height, padding);
        
        cityPoints[cityName] = {
          x: x, // Store absolute coordinates for SVG positioning
          y: y,
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
        <svg 
          className="w-full h-full" 
          viewBox="0 0 800 800" 
          xmlns="http://www.w3.org/2000/svg" 
          preserveAspectRatio="xMidYMid meet"
        >
          {/* UK Map Path */}
          <path 
            d={ukMapPath} 
            className="fill-gray-200 dark:fill-gray-700 stroke-gray-400 dark:stroke-gray-500" 
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          
          {/* Location pins */}
          {locations.map((loc) => {
            // Extract city name from location string (e.g., "Some Company, York" -> "york")
            const cityName = loc.location.split(',').pop()?.trim().toLowerCase() || '';
            
            // Find matching city coordinates from pre-calculated city points
            // Look for both lowercase and capitalized versions of the city name
            const cityPoint = transformedData.cityPoints[cityName] || 
                             transformedData.cityPoints[cityName.charAt(0).toUpperCase() + cityName.slice(1)] || 
                             { x: 400, y: 400 }; // Fallback to center if not found
            
            const isActive = activePin === loc.company;
            
            return (
              <g 
                key={loc.company}
                transform={`translate(${cityPoint.x}, ${cityPoint.y})`}
                onMouseEnter={() => setActivePin(loc.company)}
                onMouseLeave={() => setActivePin(null)}
                onClick={() => onPinClick(loc.company)}
                style={{ cursor: 'pointer' }}
              >
                {/* Invisible larger hit area for better interaction */}
                <circle 
                  cx="0" 
                  cy="0" 
                  r="30" 
                  className="fill-transparent"
                />
                
                {/* Pin shadow (only for active pin) */}
                {isActive && (
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="30" 
                    className="fill-blue-300 dark:fill-blue-700 opacity-50"
                  />
                )}
                
                {/* Pin pulse animation (only for active pin) */}
                {isActive && (
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="24"
                    className="animate-ping fill-blue-400 dark:fill-blue-600 opacity-75"
                  />
                )}
                
                {/* Pin circle */}
                <circle 
                  cx="0" 
                  cy="0" 
                  r="20" 
                  className="fill-blue-600 stroke-white stroke-2"
                />
                
                {/* City name label */}
                <text
                  x="0"
                  y="-40"
                  textAnchor="middle"
                  fontSize="50"
                  fontWeight="bold"
                  className="fill-gray-900 dark:fill-white"
                  style={{ pointerEvents: 'none' }}
                >
                  <tspan
                    dy="0"
                    x="0"
                    className="stroke-white dark:stroke-gray-900 stroke-[2px] paint-order-stroke"
                  >
                    {cityName.charAt(0).toUpperCase() + cityName.slice(1)}
                  </tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default LocationMap;
