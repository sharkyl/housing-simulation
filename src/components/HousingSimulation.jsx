import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const HousingSimulation = () => {
  const [housingCost, setHousingCost] = useState(40000);
  const [monthlyInflow, setMonthlyInflow] = useState(70);
  const [stayLength, setStayLength] = useState(10);
  const [annualGrowthRate, setAnnualGrowthRate] = useState(0);
  const initialUnits = 9070;
  const initialOccupied = Math.round(initialUnits * 0.93);
  const years = 10;

  const calculateAvailability = (currentOccupied, targetOccupancy, monthlyTurnover) => {
    const turnover = Math.round(currentOccupied * monthlyTurnover);
    let cumulativeAvailable = 0;
    let currentUnits = initialUnits;
    let occupiedUnits = currentOccupied;
    const monthlyGrowthRate = annualGrowthRate / (100 * 12);

    // Calculate first month availability
    const month1Turnover = turnover;
    const month1Units = currentUnits;
    const month1TargetOccupied = Math.round(month1Units * targetOccupancy);
    const month1AvailableUnits = month1TargetOccupied - currentOccupied;

    // Calculate cumulative availability over 10 years
    for (let month = 0; month <= years * 12; month++) {
      const newUnits = Math.floor(currentUnits * monthlyGrowthRate);
      currentUnits += newUnits;
      
      const monthlyTurnover = Math.round(occupiedUnits * (1 / (stayLength * 12)));
      occupiedUnits = occupiedUnits - monthlyTurnover + monthlyInflow;
      occupiedUnits = Math.min(occupiedUnits, currentUnits);
      
      cumulativeAvailable += monthlyTurnover;
    }

    const year10Units = currentUnits;
    const year10TargetOccupied = Math.round(year10Units * targetOccupancy);
    const year10AvailableUnits = year10TargetOccupied - occupiedUnits;

    return {
      month1AvailableUnits,
      month1AnnualAvailable: month1AvailableUnits * 12,
      year10AvailableUnits,
      year10AnnualAvailable: year10AvailableUnits * 12,
      cumulativeAvailable
    };
  };

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

  // Calculate budgets
  const year1Units = occupancyData[12].units;
  const year10Units = occupancyData[occupancyData.length - 1].units;
  const year1Budget = year1Units * housingCost;
  const year10Budget = year10Units * housingCost;

  // Calculate availability
  const monthlyTurnover = 1 / (stayLength * 12);
  const availability = calculateAvailability(initialOccupied, 0.93, monthlyTurnover);

  const getOccupancyStyles = (rate) => {
    const numRate = Number(rate);
    if (numRate >= 92 && numRate <= 94) {
      return {
        color: '#16a34a',
        fontWeight: 700,
        transition: 'all 0.3s'
      };
    }
    return {
      transition: 'all 0.3s'
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Previous code remains the same until the availability rows */}
      
      <h1 className="text-2xl font-bold mb-6">10-Year Housing Occupancy Simulation</h1>
      <h2>SF Homeless Oversight Commission - Data Officer Report, December 2024</h2>
      This model simulates the effect of changes to the number of units, the number of residents, and average length of stay on Permanent Supportive Housing (PSH) occupancy rates, and budget.<br></br>
      HSH's target vacancy rate is 7%, so occupancy rate numbers (for both Year 1, and Year 10) will turn green when occupancy is between 92% and 94%. <br></br>
      Hitting refresh on your browser will restore all values to default.<br></br><br></br>
      Feedback? Please email: <a href='mailto:sharky@bandago.com'>sharky@bandago.com</a><br></br>

      <h3>Housing Simulation</h3>
      <table className="w-full mb-8">
        <tbody>
          <tr className="h-16">
            <td className="w-48 text-sm font-medium">
              Housing Cost per Unit
            </td>
            <td className="w-96 px-4">
              <input 
                type="range" 
                value={housingCost}
                onChange={(e) => setHousingCost(Number(e.target.value))}
                min={20000}
                max={70000}
                step={1000}
                className="w-full"
              />
            </td>
            <td className="text-sm">
              ${housingCost.toLocaleString()}
            </td>
          </tr>

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
              {annualGrowthRate}% = {Math.abs(yearOneChange).toLocaleString()} units {yearOneChange >= 0 ? 'added' : 'removed'} in Year 1
            </td>
          </tr>

          <tr className="h-16">
            <td className="text-sm font-medium">
              Monthly Inflow New People
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
              {monthlyInflow} Residents/month ({monthlyInflow * 12} annually)
            </td>
          </tr>

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
              {stayLength} years = {Math.round((1 / (stayLength * 12)) * 1000) / 10}% monthly churn ({Math.round((1 / stayLength) * 1000) / 10}% annual)
            </td>
          </tr>

          <tr>
            <td colSpan="3">
              <hr></hr>
            </td>
          </tr>

          <tr className="h-16">
            <td colSpan="2" className="text-sm">
              Month 1 Occupancy rate: <span style={getOccupancyStyles(month1Occupancy)}>{month1Occupancy}%</span> 
            </td>
            <td className="text-sm">
              Year 10 Occupancy rate: <span style={getOccupancyStyles(endingOccupancy)}>{endingOccupancy}%</span>
            </td>
          </tr>

          <tr className="h-16">
            <td colSpan="2" className="text-sm">
              Year 1 Budget: ${year1Budget.toLocaleString()}
            </td>
            <td className="text-sm">
              Year 10 Budget: ${year10Budget.toLocaleString()}
            </td>
          </tr>

{/*           <tr className="h-16">
            <td colSpan="3" className="text-sm">
              Month 1 capacity available to reach 93%: {availability.month1AvailableUnits.toLocaleString()} units/month ({availability.month1AnnualAvailable.toLocaleString()} annually)
            </td>
          </tr>

          <tr className="h-16">
            <td colSpan="3" className="text-sm">
              Year 10 capacity available to reach 93%: {availability.year10AvailableUnits.toLocaleString()} units/month ({availability.year10AnnualAvailable.toLocaleString()} annually)
            </td>
          </tr> */}

          <tr className="h-16">
            <td colSpan="3" className="text-sm">
              <b>Cumulative available units over 10 years: {availability.cumulativeAvailable.toLocaleString()} units</b>
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
