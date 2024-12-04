import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const HousingSimulation = () => {
  const [initialUnits, setInitialUnits] = useState(9070);
  const [monthlyInflow, setMonthlyInflow] = useState(151);
  const [stayLength, setStayLength] = useState(5);
  const [annualGrowthRate, setAnnualGrowthRate] = useState(0);
  const initialOccupied = Math.round(9070 * 0.93);
  const years = 10;

  const calculateOccupancy = () => {
    const data = [];
    let currentOccupied = initialOccupied;
    let currentUnits = initialUnits;
    const monthlyTurnover = 1 / (stayLength * 12);
    const monthlyGrowthRate = annualGrowthRate / (100 * 12);

    for (let month = 0; month <= years * 12; month++) {
      const newUnits = Math.floor(currentUnits * monthlyGrowthRate);
      currentUnits += newUnits;
      
      const turnover = Math.round(currentOccupied * monthlyTurnover);
      currentOccupied = currentOccupied - turnover + monthlyInflow;
      currentOccupied = Math.min(currentOccupied, currentUnits);
      const occupancyRate = (currentOccupied / currentUnits) * 100;
      
      data.push({
        month,
        units: Math.round(currentUnits),
        occupied: currentOccupied,
        occupancyRate: Math.round(occupancyRate * 10) / 10,
        turnover,
        inflow: monthlyInflow,
        year: Math.floor(month/12)
      });
    }
    return data;
  };

  const yearOneChange = Math.round(initialUnits * (annualGrowthRate/100));
  const changeDescription = yearOneChange >= 0 ? `Added` : `Removed`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">10-Year Housing Occupancy Projection</h1>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Total Housing Units at Start: {initialUnits}
          </label>
          <input 
            type="range" 
            value={initialUnits}
            onChange={(e) => setInitialUnits(Number(e.target.value))}
            min={8000}
            max={20000}
            step={100}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Annual Housing Growth Rate: {annualGrowthRate}%
            (Units {changeDescription} Year 1: {Math.abs(yearOneChange)})
          </label>
          <input 
            type="range"
            value={annualGrowthRate}
            onChange={(e) => setAnnualGrowthRate(Number(e.target.value))}
            min={-10}
            max={10}
            step={0.1}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Monthly New Residents: {monthlyInflow} 
            (Current Occupancy Rate: {Math.round((calculateOccupancy()[0].occupancyRate) * 10) / 10}%)
          </label>
          <input 
            type="range"
            value={monthlyInflow}
            onChange={(e) => setMonthlyInflow(Number(e.target.value))}
            min={0}
            max={500}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Average Length of Stay: {stayLength} years
            (Monthly Turnover: {Math.round((1 / (stayLength * 12)) * 1000) / 10}%)
          </label>
          <input 
            type="range"
            value={stayLength}
            onChange={(e) => setStayLength(Number(e.target.value))}
            min={1}
            max={10}
            step={0.5}
            className="w-full"
          />
        </div>

        <div className="h-96 mt-6">
          <LineChart
            width={700}
            height={350}
            data={calculateOccupancy()}
            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              label={{ value: 'Years', position: 'bottom', dy: 35 }}
            />
            <YAxis 
              yAxisId="left"
              label={{ value: 'Units', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              label={{ value: 'Occupancy %', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'occupancyRate') return `${value}%`;
                return value;
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="units" 
              stroke="#2563eb" 
              name="Total Units"
              yAxisId="left"
            />
            <Line 
              type="monotone" 
              dataKey="occupied" 
              stroke="#16a34a" 
              name="Occupied Units"
              yAxisId="left"
            />
            <Line 
              type="monotone" 
              dataKey="occupancyRate" 
              stroke="#dc2626" 
              name="Occupancy Rate"
              yAxisId="right"
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default HousingSimulation;
