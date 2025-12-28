import React, { useMemo, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const YEARS = 10
const TARGET_OCCUPANCY = 0.93
const INITIAL_UNITS = 9070
const INITIAL_OCCUPIED = Math.round(INITIAL_UNITS * TARGET_OCCUPANCY)

const buildAvailability = ({ annualGrowthRate, stayLength, monthlyInflow }) => {
  let cumulativeAvailable = 0
  let currentUnits = INITIAL_UNITS
  let occupiedUnits = INITIAL_OCCUPIED
  const monthlyGrowthRate = annualGrowthRate / (100 * 12)
  const monthlyTurnoverRate = 1 / (stayLength * 12)

  const month1TargetOccupied = Math.round(currentUnits * TARGET_OCCUPANCY)
  const month1AvailableUnits = month1TargetOccupied - occupiedUnits

  for (let month = 0; month <= YEARS * 12; month += 1) {
    const newUnits = Math.floor(currentUnits * monthlyGrowthRate)
    if (newUnits > 0) {
      cumulativeAvailable += newUnits
    }

    currentUnits += newUnits

    const turnover = Math.round(occupiedUnits * monthlyTurnoverRate)
    occupiedUnits = Math.min(occupiedUnits - turnover + monthlyInflow, currentUnits)
    cumulativeAvailable += turnover
  }

  const year10TargetOccupied = Math.round(currentUnits * TARGET_OCCUPANCY)
  const year10AvailableUnits = year10TargetOccupied - occupiedUnits

  return {
    month1AvailableUnits,
    month1AnnualAvailable: month1AvailableUnits * 12,
    year10AvailableUnits,
    year10AnnualAvailable: year10AvailableUnits * 12,
    cumulativeAvailable,
  }
}

const buildOccupancyData = ({ annualGrowthRate, stayLength, monthlyInflow }) => {
  const data = []
  let currentOccupied = INITIAL_OCCUPIED
  let currentUnits = INITIAL_UNITS
  const monthlyTurnoverRate = 1 / (stayLength * 12)
  const monthlyGrowthRate = annualGrowthRate / (100 * 12)

  for (let month = 0; month <= YEARS * 12; month += 1) {
    const newUnits = Math.floor(currentUnits * monthlyGrowthRate)
    currentUnits += newUnits

    const turnover = Math.round(currentOccupied * monthlyTurnoverRate)
    currentOccupied = Math.min(currentOccupied - turnover + monthlyInflow, currentUnits)
    const occupancyRate = (currentOccupied / currentUnits) * 100

    data.push({
      month,
      units: Math.round(currentUnits),
      occupied: currentOccupied,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      turnover,
      inflow: monthlyInflow,
      year: Math.floor(month / 12),
    })
  }

  return data
}

const getOccupancyStyles = (rate) => {
  const numRate = Number(rate)
  if (numRate >= 92 && numRate <= 94) {
    return { color: '#6ee7b7', fontWeight: 700, transition: 'all 0.3s' }
  }
  return { transition: 'all 0.3s' }
}

const HousingSimulation = () => {
  const [housingCost, setHousingCost] = useState(40000)
  const [monthlyInflow, setMonthlyInflow] = useState(70)
  const [stayLength, setStayLength] = useState(10)
  const [annualGrowthRate, setAnnualGrowthRate] = useState(0)

  const occupancyData = useMemo(
    () => buildOccupancyData({ annualGrowthRate, stayLength, monthlyInflow }),
    [annualGrowthRate, stayLength, monthlyInflow],
  )

  const availability = useMemo(
    () => buildAvailability({ annualGrowthRate, stayLength, monthlyInflow }),
    [annualGrowthRate, stayLength, monthlyInflow],
  )

  const yearOneChange = Math.round(INITIAL_UNITS * (annualGrowthRate / 100))
  const month1Occupancy = Math.round((occupancyData[0]?.occupancyRate ?? 0) * 10) / 10
  const endingOccupancy =
    Math.round((occupancyData[occupancyData.length - 1]?.occupancyRate ?? 0) * 10) / 10

  const year1Units = occupancyData[12]?.units ?? INITIAL_UNITS
  const year10Units = occupancyData[occupancyData.length - 1]?.units ?? INITIAL_UNITS
  const year1Budget = year1Units * housingCost
  const year10Budget = year10Units * housingCost

  return (
    <div className="page-shell">
      <section className="panel">
        <div className="kicker">Interactive model</div>
        <h1 className="page-title">Permanent Supportive Housing Simulation</h1>
        <p className="page-subtitle">
          Explore how changing permanent supportive housing inventory, inflow, and average length of stay affect occupancy
          and budget needs over a decade. Target vacancy is 7%, so occupancy rates between 92% and 94% show in green.
        </p>
        <p className="helper">Prompts to consider as you adjust the sliders:</p>
        <ul className="helper-list">
          <li>
            The cost of providing PSH units has risen over time. <strong>What approaches or policies might decrease this cost?</strong>
          </li>
          <li>
            Increasing the growth rate of housing supply is attractive, but the budget is annual. <strong>Where would
            additional money come from if revenue declines?</strong>
          </li>
          <li>
            Reducing inflow helps prevent overflow. <strong>What policies might keep people from becoming homeless in the first place?</strong>
          </li>
          <li>
            Shorter stays expand capacity only if exits are stable. <strong>What durable supports could reduce length of stay without pushing people back to the street?</strong>
          </li>
        </ul>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Housing simulation controls</h2>
          <span className="helper">Refresh your browser to reset to defaults</span>
        </div>
        <table className="table-like">
          <tbody>
            <tr>
              <td className="w-48 text-sm font-medium">Housing cost per unit</td>
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
              <td className="text-sm">${housingCost.toLocaleString()}</td>
            </tr>

            <tr>
              <td className="text-sm font-medium">Annual housing growth rate</td>
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

            <tr>
              <td className="text-sm font-medium">Monthly inflow</td>
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
              <td className="text-sm">{monthlyInflow} occupied units/month ({monthlyInflow * 12} annually)</td>
            </tr>

            <tr>
              <td className="text-sm font-medium">Average length of stay</td>
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
                <hr />
              </td>
            </tr>

            <tr>
              <td colSpan="2" className="text-sm">
                Month 1 occupancy rate: <span style={getOccupancyStyles(month1Occupancy)}>{month1Occupancy}%</span>
              </td>
              <td className="text-sm">
                Year 10 occupancy rate: <span style={getOccupancyStyles(endingOccupancy)}>{endingOccupancy}%</span>
              </td>
            </tr>

            <tr>
              <td colSpan="2" className="text-sm">Year 1 budget: ${year1Budget.toLocaleString()}</td>
              <td className="text-sm">Year 10 budget: ${year10Budget.toLocaleString()}</td>
            </tr>

            <tr>
              <td colSpan="3" className="text-sm">
                <strong>Cumulative available units over 10 years: {availability.cumulativeAvailable.toLocaleString()} units</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={occupancyData} margin={{ top: 25, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2431" />
              <XAxis dataKey="year" tick={{ fill: '#cbd5e1' }} label={{ value: 'Years', position: 'bottom', dy: 5, fill: '#aab3c2' }} />
              <YAxis yAxisId="left" tick={{ fill: '#cbd5e1' }} label={{ value: 'Units', angle: -90, position: 'insideLeft', fill: '#aab3c2' }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fill: '#cbd5e1' }}
                label={{ value: 'Occupancy %', angle: 90, position: 'insideRight', fill: '#aab3c2' }}
              />
              <Tooltip
                contentStyle={{ background: '#0f1118', border: '1px solid var(--border)', color: '#e9eef7' }}
                labelFormatter={(label) => `Year ${label}`}
                formatter={(value, name) => {
                  if (name === 'occupancyRate') return `${value}%`
                  return value.toLocaleString()
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#aab3c2' }} />
              <Line type="monotone" dataKey="units" stroke="#3b82f6" name="Total units" yAxisId="left" strokeWidth={2} />
              <Line type="monotone" dataKey="occupied" stroke="#6ee7b7" name="Occupied units" yAxisId="left" strokeWidth={2} />
              <Line type="monotone" dataKey="occupancyRate" stroke="#f97316" name="Occupancy rate" yAxisId="right" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

export default HousingSimulation
