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

const calculateAvailability = () => {
    let cumulativeAvailable = 0;
    let currentUnits = initialUnits;
    let occupiedUnits = initialOccupied;
    const monthlyGrowthRate = annualGrowthRate / (100 * 12);
    let previousOccupied = occupiedUnits;

    // Calculate first month values
    const month1Units = currentUnits;
    const month1TargetOccupied = Math.round(month1Units * 0.93);
    const month1AvailableUnits = month1TargetOccupied - occupiedUnits;

    // Calculate cumulative availability over 10 years
    for (let month = 0; month <= years * 12; month++) {
        // Store previous month's occupied units for turnover calculation
        previousOccupied = occupiedUnits;
        
        // Calculate unit growth for this month
        const newUnits = Math.floor(currentUnits * monthlyGrowthRate);
        
        // Add new units to cumulative availability (they represent new housing opportunities)
        if (newUnits > 0) {
            cumulativeAvailable += newUnits;
        }
        
        // Update total units
        currentUnits += newUnits;
        
        // Calculate turnover based on occupied units
        const monthlyTurnoverRate = 1 / (stayLength * 12);
        const thisMonthTurnover = Math.round(previousOccupied * monthlyTurnoverRate);
        
        // Update occupied units for next month, accounting for growth
        occupiedUnits = Math.min(
            occupiedUnits - thisMonthTurnover + monthlyInflow,
            currentUnits // Limit occupancy to available units
        );
        
        // Add turnover to cumulative
        cumulativeAvailable += thisMonthTurnover;
    }

    // Store final values
    const year10Units = currentUnits;
    const year10TargetOccupied = Math.round(currentUnits * 0.93);
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
  const availability = calculateAvailability();

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
      
      <h1 className="text-2xl font-bold mb-6">SF Homeless Oversight Commission</h1>
<div class="video-container">
<iframe class="video" src="https://www.youtube.com/embed/yachetMaSwE?si=tbtIUSTAjGVI5CIl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

            <h2>Permanent Supportive Housing Simulation Model</h2>
      When you are done watching the video, play with this permanent supportive housing model! This model simulates the impact of changing permanent supportive housing inventory supply, the number of people flowing into housing, and the average length of stay of people in housing.<br></br>
      The Homeless and Supportive Housing Department's target vacancy rate is 7%, so when occupancy rate numbers (for both Year 1, and Year 10)are between 92% and 94% they will turn green. Another way to think about this is you want the red line to stay near the top of the graph as you make adjustments. That's the "goal" you are shooting for.<br></br> A few qestions you might want to ask yourself as you play with this:
<ul>
<li>The cost of providing PSH units has only gone up over time. <b>What approaches or policies might decrease this cost?</b></li>
  <li>Increasing the growth rate of housing supply is obviously attractive, but remember the budget is *annual*, so it needs to be paid every year. <b>In an environment where tax revenue is declining where would the additional money come from?</b></li>
  <li>Reducing inflow obviously helps the system avoid overflowing. <b>What policies might help people avoid becoming homeless in the first place?</b></li>
<li>Decreasing length of stay allows the system to absorb more inflow, but only if people who leave the system aren't simply returning to the street. Some people cannot return to the workforce due to age, illness, or disability. <b>So what policies might sustainably decrease the length of stay over the long run?</b></li>
</ul><br></br>
      Feedback? I'd love to hear from you! <a href='mailto:sharky@bandago.com'>sharky@bandago.com</a><br></br>
<hr></hr>

      <h3>Housing Simulation</h3>
Hitting refresh on your browser will restore all values to default.<br></br>
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
              Monthly Inflow 
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
              {monthlyInflow} Occupied units/month ({monthlyInflow * 12} annually)
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
