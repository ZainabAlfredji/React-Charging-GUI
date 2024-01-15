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

const Truck = ({ position, onClick, isSelected, details }) => {
  return (
    <div 
      className="truck" 
      style={{ 
        top: `${position.y * 100 + 50}px`, 
        left: `${position.x * 100 + 50}px`
      }}
      onClick={onClick}
    >
    {isSelected && (
        <div className="chat-bubble">
        <ul>
          <li>Node ID: {details.id}</li>
          <li>Battery: {details.battery}%</li>
          <li>Position: ({details.position.x}, {details.position.y})</li>
          <li>Destination: {details.destination}</li>
        </ul>
      </div>
      )}
    </div>
  );
};



const Grid = () => {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const paths = [
    // Path from CS1 to CS2
    [{x: 1, y: 9}, {x: 2, y: 9}, {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9}, {x: 6, y: 9}, {x: 7, y: 9}, {x: 8, y: 9}, {x: 9, y: 9}],
    
    // Path from CS1 to CS3
    [{x: 0, y: 8}, {x: 0, y: 7}, {x: 0, y: 6}, {x: 0, y: 5}, {x: 0, y: 4}, {x: 0, y: 3}, {x: 0, y: 2}, {x: 0, y: 1}, {x: 0, y: 0}],
    
    // Path from CS1 to CS4
    [{x: 1, y: 9}, {x: 1, y: 8}, {x: 2, y: 8}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 3, y: 6}, {x: 4, y: 6}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 5, y: 4}, {x: 6, y: 4}, {x: 6, y: 3}, {x: 7, y: 3}, {x: 7, y: 2}, {x: 8, y: 2}, {x: 8, y: 1}, {x: 9, y: 1}, {x: 9, y: 0}],
    
    [{x: 8, y: 9}, {x: 7, y: 9}, {x: 6, y: 9}, {x: 5, y: 9}, {x: 4, y: 9}, {x: 3, y: 9}, {x: 2, y: 9}, {x: 1, y: 9}, {x: 0, y: 9}], // CS2_CS1
    [{x: 9, y: 8}, {x: 9, y: 7}, {x: 9, y: 6}, {x: 9, y: 5}, {x: 9, y: 4}, {x: 9, y: 3}, {x: 9, y: 2}, {x: 9, y: 1}, {x: 9, y: 0}], // CS2_CS4
    [{x: 9, y: 8}, {x: 8, y: 8}, {x: 8, y: 7}, {x: 7, y: 7}, {x: 7, y: 6}, {x: 6, y: 6}, {x: 6, y: 5}, {x: 5, y: 5}, {x: 5, y: 4}, {x: 4, y: 4}, {x: 4, y: 3}, {x: 3, y: 3}, {x: 3, y: 2}, {x: 2, y: 2}, {x: 2, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 0, y: 0}], // CS2_CS3

    [{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}, {x: 0, y: 5}, {x: 0, y: 6}, {x: 0, y: 7}, {x: 0, y: 8}, {x: 0, y: 9}], // CS3_CS1
    [{x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0}], // CS3_CS4
    [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 6, y: 7}, {x: 7, y: 7}, {x: 7, y: 8}, {x: 8, y: 8}, {x: 8, y: 9}, {x: 9, y: 9}], 

    [{x: 8, y: 0}, {x: 8, y: 1}, {x: 7, y: 1}, {x: 7, y: 2}, {x: 6, y: 2}, {x: 6, y: 3}, {x: 5, y: 3}, {x: 5, y: 4}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 3, y: 5}, {x: 3, y: 6}, {x: 2, y: 6}, {x: 2, y: 7}, {x: 1, y: 7}, {x: 1, y: 8}, {x: 0, y: 8}, {x: 0, y: 9}],
    [{x: 9, y: 1}, {x: 9, y: 2}, {x: 9, y: 3}, {x: 9, y: 4}, {x: 9, y: 5}, {x: 9, y: 6}, {x: 9, y: 7}, {x: 9, y: 8}, {x: 9, y: 9}],
    [{x: 8, y: 0}, {x: 7, y: 0}, {x: 6, y: 0}, {x: 5, y: 0}, {x: 4, y: 0}, {x: 3, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}, {x: 0, y: 0}]

  ];

  // Assign a random path to each truck
const assignRandomPath = () => {
  return paths[Math.floor(Math.random() * paths.length)];
};

const initialTruckStates = Array(5).fill().map((_, id) => ({
  id,
  path: assignRandomPath(),
  pathIndex: 0,
  position: { x: 0, y: 0 }, // Initial position for each truck
  battery: Math.floor(Math.random() * 100)
}));

const [truck, setTrucks] = useState(initialTruckStates);

const updateTruckPosition = (truckId, newPosition, newBattery) => {
  setTrucks(prevTrucks => prevTrucks.map(truck => 
    truck.id === truckId ? { ...truck, position: newPosition, battery: newBattery } : truck
  ));
};

const moveTruck = (truck) => {
  if (truck.pathIndex < truck.path.length - 1) {
    const nextPosition = truck.path[truck.pathIndex + 1];
    const newBattery = Math.max(truck.battery - 1, 0); // Decrease battery but not below 0
    updateTruckPosition(truck.id, nextPosition, newBattery);
    truck.pathIndex += 1;
  } else {
    truck.pathIndex = 0;
    truck.path = assignRandomPath();
    updateTruckPosition(truck.id, truck.path[0]);
  }
};

const handleTruckClick = (truck) => {
  setSelectedTruck(truck);
};
  
  

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
  
    ws.onmessage = (event) => {
      setStatusMessage(event.data);
    };
  
    return () => {
      ws.close();
    };
  }, []);

  // Random movement logic
  useEffect(() => {
    // Move each truck at an interval
    const intervalId = setInterval(() => {
      truck.forEach(truck => moveTruck(truck));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [truck]);


    // Set an interval to move the truck every second
    //const intervalId = setInterval(moveTruck, 1000);

    // Clear the interval when the component is unmounted
    //return () => clearInterval(intervalId)

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
    {truck.map(truck => (
        <Truck 
        key={`truck-${truck.id}`} 
        position={truck.position} 
        onClick={() => handleTruckClick(truck)}
        isSelected={selectedTruck && selectedTruck.id === truck.id}
        details={truck}
        />
      ))}
      {selectedTruck && (
        <div className="chat-bubble">
          Node ID: {selectedTruck.id}
          Battery: {selectedTruck.battery}%
          Position: ({selectedTruck.position.x}, {selectedTruck.position.y})
          Destination: {selectedTruck.destination}
        </div>
      )}
  </div>
  );
};


export default Grid;