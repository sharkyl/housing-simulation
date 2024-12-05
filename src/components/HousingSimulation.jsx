import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const HousingSimulation = () => {
  const [initialUnits, setInitialUnits] = useState(9070);
  const [monthlyInflow, setMonthlyInflow] = useState(151);
  const [stayLength, setStayLength] = useState(10);
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

  const occupancyData = calculateOccupancy();
  const yearOneChange = Math.round(initialUnits * (annualGrowthRate/100));
  const month1Occupancy = Math.round(occupancyData[0].occupancyRate * 10) / 10;
  const endingOccupancy = Math.round(occupancyData[occupancyData.length - 1].occupancyRate * 10) / 10;

  // Debug logging
  useEffect(() => {
    console.log('Month 1 Occupancy:', month1Occupancy);
    console.log('Year 10 Occupancy:', endingOccupancy);
    console.log('Month 1 in target range:', month1Occupancy >= 92.5 && month1Occupancy <= 93.5);
    console.log('Year 10 in target range:', endingOccupancy >= 92.5 && endingOccupancy <= 93.5);
  }, [month1Occupancy, endingOccupancy]);

  const getOccupancyStyles = (rate) => {
    const numRate = Number(rate);
    if (numRate >= 92.5 && numRate <= 93.5) {
      return {
        color: '#16a34a', // text-green-600 equivalent
        fontWeight: 700,  // font-bold equivalent
        transition: 'all 0.3s'
      };
    }
    return {
      transition: 'all 0.3s'
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">10-Year Housing Occupancy Projection (Simulation)</h1>
      <h2>San Francisco Homeless Oversight Commission Data Officer Report, December 2024</h2>
      This model simulates the effect of changes to the number of units, the number of residents, and average length of stay on Permanent Supportive Housing (PSH) occupancy rates. HSH's target vacancy rate is 7%, so the occupancy rate numbers (for both Year 1, and Year 10) will turn green when that rate is hit. <br>
        The default values are set to roughly approximate current conditions. You can return to default values at any time by hitting refresh on your browser<br>
        Please direct any feedback and suggestions to the Commission's Data Officer, Sharky Laguana: sharky@bandago.com.
          <br></br>
      <table className="w-full mb-8">
        <tbody>
          {/* Row 1 */}
          <tr className="h-16">
            <td className="w-64 text-sm font-medium">
              Total Housing Units at Start
            </td>
            <td className="w-64 px-4">
              <input 
                type="range" 
                value={initialUnits}
                onChange={(e) => setInitialUnits(Number(e.target.value))}
                min={8000}
                max={20000}
                step={100}
                className="w-full"
              />
            </td>
            <td className="text-sm">
              {initialUnits.toLocaleString()} units
            </td>
          </tr>

          {/* Row 2 */}
          <tr className="h-16">
            <td className="text-sm font-medium">
              Annual Housing Growth Rate
            </td>
            <td className="px-4">
              <input 
                type="range"
                value={annualGrowthRate}
                onChange={(e) => setAnnualGrowthRate(Number(e.target.value))}
                min={-10}
                max={10}
                step={0.1}
                className="w-full"
              />
            </td>
            <td className="text-sm">
              {annualGrowthRate}% • {Math.abs(yearOneChange).toLocaleString()} units {yearOneChange >= 0 ? 'added' : 'removed'} in Year 1
            </td>
          </tr>

          {/* Row 3 */}
          <tr className="h-16">
            <td className="text-sm font-medium">
              Monthly New Residents
            </td>
            <td className="px-4">
              <input 
                type="range"
                value={monthlyInflow}
                onChange={(e) => setMonthlyInflow(Number(e.target.value))}
                min={0}
                max={500}
                step={5}
                className="w-full"
              />
            </td>
            <td className="text-sm">
              {monthlyInflow} residents/month • Month 1 Occupancy: <span style={getOccupancyStyles(month1Occupancy)}>{month1Occupancy}%</span> • Year 10 Occupancy: <span style={getOccupancyStyles(endingOccupancy)}>{endingOccupancy}%</span>
            </td>
          </tr>

          {/* Row 4 */}
          <tr className="h-16">
            <td className="text-sm font-medium">
              Average Length of Stay
            </td>
            <td className="px-4">
              <input 
                type="range"
                value={stayLength}
                onChange={(e) => setStayLength(Number(e.target.value))}
                min={1}
                max={20}
                step={0.5}
                className="w-full"
              />
            </td>
            <td className="text-sm">
              {stayLength} years • {Math.round((1 / (stayLength * 12)) * 1000) / 10}% monthly turnover • {Math.round((1 / stayLength) * 1000) / 10}% annual turnover
            </td>
          </tr>
        </tbody>
      </table>

      <div className="h-96">
        <LineChart
          width={700}
          height={350}
          data={occupancyData}
          margin={{ top: 25, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Years', position: 'bottom', dy: 5 }}
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
            labelFormatter={(label) => `Year ${label}`}
            formatter={(value, name) => {
              if (name === 'occupancyRate') return `${value}%`;
              return value.toLocaleString();
            }}
          />
          <Legend 
            verticalAlign="top"
            height={36}
          />
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
  );
};

export default HousingSimulation;
