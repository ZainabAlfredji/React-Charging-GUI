import React, { useState, useEffect } from 'react';
import './App.css';

const zoneTypes = {
  COMMUNICATION: 'communication',
  CHARGING: 'charging'
};

const zones = {
  [zoneTypes.COMMUNICATION]: [
    { x: 0, y: 0 }, // Top-left corner
    { x: 9, y: 0 }, // Top-right corner
    { x: 0, y: 9 }, // Bottom-left corner
    { x: 9, y: 9 }  // Bottom-right corner
  ],
  [zoneTypes.CHARGING]: [
    { x: 0, y: 0 }, // Top-left corner
    { x: 9, y: 0 }, // Top-right corner
    { x: 0, y: 9 }, // Bottom-left corner
    { x: 9, y: 9 }  // Bottom-right corner
  ]
};


const Cell = ({ isCommunicationZone, isChargingZone }) => {
  let className = 'cell';
  if (isCommunicationZone) {
    className += ' communication-zone';
  }
  
  return (
    <div className={className}>
      {isChargingZone && <div className="charging-zone"></div>}
    </div>
  );
};

const Truck = ({ position }) => {
  return (
    <div className="truck" style={{ top: `${position.y * 50}px`, left: `${position.x * 50}px` }}></div>
  );
};



const Grid = () => {
  const [truckPosition, setTruckPosition] = useState({ x: 0, y: 0 });

  // Random movement logic
  useEffect(() => {
    const moveTruck = () => {
      setTruckPosition(prevPosition => {
        // Determine the possible movements within grid bounds
        let possibleMoves = [];
        if (prevPosition.x > 0) possibleMoves.push({ x: prevPosition.x - 1, y: prevPosition.y });
        if (prevPosition.y > 0) possibleMoves.push({ x: prevPosition.x, y: prevPosition.y - 1 });
        if (prevPosition.x < 9) possibleMoves.push({ x: prevPosition.x + 1, y: prevPosition.y });
        if (prevPosition.y < 9) possibleMoves.push({ x: prevPosition.x, y: prevPosition.y + 1 });

        // Randomly select one of the possible moves
        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return move || prevPosition; // In case no move is possible (which shouldn't happen here)
      });
    };

    // Set an interval to move the truck every second
    const intervalId = setInterval(moveTruck, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const rows = Array.from({ length: 10 }, (_, rowIndex) => (
    <div key={rowIndex} className="row">
      {Array.from({ length: 10 }, (_, cellIndex) => {
        // Determine if the current cell is a special zone
        const isCommunicationZone = zones[zoneTypes.COMMUNICATION].some(zone => zone.x === cellIndex && zone.y === rowIndex);
        const isChargingZone = zones[zoneTypes.CHARGING].some(zone => zone.x === cellIndex && zone.y === rowIndex);

        return (
          <Cell
            key={cellIndex}
            isCommunicationZone={isCommunicationZone}
            isChargingZone={isChargingZone}
          />
        );
      })}
    </div>
  ));

  return (
    <div className="grid">
      {rows}
      <Truck position={truckPosition} />
    </div>
  );
};


export default Grid;