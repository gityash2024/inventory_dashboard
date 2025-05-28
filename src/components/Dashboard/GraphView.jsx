import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar,
  Sector, ScatterChart, Scatter, Brush
} from 'recharts';

const GraphViewContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: minmax(400px, auto) minmax(350px, auto) minmax(350px, auto);
  gap: 1.5rem;
  padding: 1rem;
  overflow-y: auto;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 31, 63, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 300px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 31, 63, 0.12);
  }
  
  &.full-width {
    grid-column: 1 / 3;
  }
  
  &.highlight {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 255, 250, 0.95) 100%);
    border: 1px solid rgba(64, 224, 173, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(1, 121, 137, 0.03) 0%, rgba(64, 224, 173, 0.03) 100%);
    z-index: 0;
  }
`;

const ChartHeader = styled.div`
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--primary-teal);
  }
`;

const ChartSubtitle = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  gap: 1rem;
  
  span {
    display: flex;
    align-items: center;
    
    &:first-child {
      color: var(--primary-teal);
      font-weight: 600;
    }
    
    &:nth-child(2) {
      color: var(--highlight);
      font-weight: 500;
    }
  }
`;

const ChartContent = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
  height: calc(100% - 60px);
  min-height: 200px;
  
  .recharts-default-tooltip {
    background-color: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(64, 224, 173, 0.2) !important;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 10px 14px !important;
  }
  
  .recharts-tooltip-label {
    color: var(--text-primary) !important;
    font-weight: 600 !important;
    margin-bottom: 5px !important;
  }
  
  .recharts-tooltip-item {
    color: var(--text-secondary) !important;
    padding: 2px 0 !important;
  }
  
  .recharts-cartesian-axis-tick-value {
    font-size: 0.8rem;
    fill: var(--text-secondary);
  }
  
  .recharts-legend-item-text {
    color: var(--text-primary) !important;
  }
`;

const ChartControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ChartControlButton = styled.button`
  background: ${props => props.active ? 'var(--primary-teal)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.active ? 'var(--primary-teal)' : 'var(--card-border)'};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--primary-teal);
    color: ${props => props.active ? 'white' : 'var(--primary-teal)'};
  }
`;

const COLORS = ['#017989', '#40E0AD', '#148E9B', '#64E7BE', '#0D5D69', '#2BC395', '#1E9CAC', '#8DEFD0'];
const TIMEFRAMES = ['30m', '8h', '24h'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ fontSize: '0.8rem' }}>
        <p style={{ margin: '0 0 5px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ 
            margin: '2px 0', 
            color: entry.color || COLORS[index % COLORS.length],
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <span style={{ fontWeight: '500' }}>{entry.name}:</span> 
            <span style={{ fontWeight: '600' }}>{typeof entry.value === 'number' ? entry.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) : entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const GraphView = ({ data }) => {
  const [timeframe, setTimeframe] = useState('24h');
  
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Filter valid data
  const validData = data.filter(item => 
    item && item.historicalData && item.historicalData.length > 0
  );

  if (validData.length === 0) {
    return <div>No historical data available for charts</div>;
  }
  
  // Prepare data for overview chart
  const overviewData = validData.map(item => {
    const latestData = item.historicalData[item.historicalData.length - 1];
    return {
      name: item.pair,
      exchange: item.exchange,
      token: item.live.tokenBalance,
      stable: item.live.baseTokenBalance,
      tokenSymbol: item.pair,
      stableSymbol: item.baseToken,
      tokenChange: item.change[timeframe]?.tokenChange || 0,
      stableChange: item.change[timeframe]?.baseTokenChange || 0,
      fullName: `${item.exchange} - ${item.pair}/${item.baseToken}`
    };
  });
  
  // Prepare data for token distribution pie chart
  const tokenDistributionData = validData.map(item => ({
    name: `${item.pair} (${item.exchange})`,
    value: item.live.tokenBalance
  }));
  
  // Prepare data for stable distribution pie chart
  const stableDistributionData = validData.map(item => ({
    name: `${item.baseToken} (${item.exchange})`,
    value: item.live.baseTokenBalance
  }));
  
  // Prepare data for change comparison
  const changeComparisonData = validData.map(item => ({
    name: item.pair,
    exchange: item.exchange,
    tokenChange: item.change[timeframe]?.tokenChange || 0,
    stableChange: item.change[timeframe]?.baseTokenChange || 0
  }));
  
  // Prepare data for historical trends
  const historicalTrendsData = [];
  validData.forEach(item => {
    if (item.historicalData) {
      item.historicalData.forEach(histData => {
        historicalTrendsData.push({
          date: histData.timestamp,
          [item.pair]: histData.tokenBalance,
          [`${item.pair}_stable`]: histData.baseTokenBalance
        });
      });
    }
  });
  
  return (
    <GraphViewContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Overview Chart - First Row, Full Width */}
      <ChartCard className="full-width highlight">
        <ChartHeader>
          <div>
            <ChartTitle>Portfolio Performance</ChartTitle>
            <ChartSubtitle>
              <span>Current Balance Comparison</span>
            </ChartSubtitle>
          </div>
          <ChartControls>
            {TIMEFRAMES.map(tf => (
              <ChartControlButton 
                key={tf}
                active={timeframe === tf}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </ChartControlButton>
            ))}
          </ChartControls>
        </ChartHeader>
        <ChartContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#017989" />
              <YAxis yAxisId="right" orientation="right" stroke="#40E0AD" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="token" 
                name="Token Balance" 
                fill="#017989" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar 
                yAxisId="right" 
                dataKey="stable" 
                name="Stable Balance" 
                fill="#40E0AD" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="tokenChange" 
                name={`${timeframe} Token Change`}
                stroke="#0D5D69" 
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContent>
      </ChartCard>

      {/* Token Distribution - Second Row, Left */}
      <ChartCard>
        <ChartHeader>
          <div>
            <ChartTitle>Token Distribution</ChartTitle>
            <ChartSubtitle>
              <span>Allocation across pairs</span>
            </ChartSubtitle>
          </div>
        </ChartHeader>
        <ChartContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={tokenDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({
                  cx, cy, midAngle, innerRadius, outerRadius, percent, name
                }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                
                  return percent > 0.05 ? (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight="bold"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  ) : null;
                }}
              >
                {tokenDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </ChartContent>
      </ChartCard>

      {/* Stable Distribution - Second Row, Right */}
      <ChartCard>
        <ChartHeader>
          <div>
            <ChartTitle>Stable Asset Distribution</ChartTitle>
            <ChartSubtitle>
              <span>Allocation across exchanges</span>
            </ChartSubtitle>
          </div>
        </ChartHeader>
        <ChartContent>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="15%" 
              outerRadius="70%" 
              barSize={15} 
              data={stableDistributionData}
            >
              <RadialBar
                background
                dataKey="value"
                angleAxisId={0}
                label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
              >
                {stableDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RadialBar>
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartContent>
      </ChartCard>

      {/* Change Comparison - Third Row, Left */}
      <ChartCard>
        <ChartHeader>
          <div>
            <ChartTitle>{timeframe} Change Comparison</ChartTitle>
            <ChartSubtitle>
              <span>Token vs Stable changes</span>
            </ChartSubtitle>
          </div>
        </ChartHeader>
        <ChartContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={changeComparisonData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" scale="band" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="tokenChange" name="Token Change" fill="#017989" radius={[0, 4, 4, 0]}>
                {changeComparisonData.map((entry, index) => (
                  <Cell 
                    key={`cell-token-${index}`} 
                    fill={entry.tokenChange >= 0 ? '#017989' : '#e74c3c'} 
                  />
                ))}
              </Bar>
              <Bar dataKey="stableChange" name="Stable Change" fill="#40E0AD" radius={[0, 4, 4, 0]}>
                {changeComparisonData.map((entry, index) => (
                  <Cell 
                    key={`cell-stable-${index}`} 
                    fill={entry.stableChange >= 0 ? '#40E0AD' : '#e74c3c'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContent>
      </ChartCard>

      {/* Historical Performance - Third Row, Right */}
      <ChartCard>
        <ChartHeader>
          <div>
            <ChartTitle>Balance Radar Analysis</ChartTitle>
            <ChartSubtitle>
              <span>Multi-dimensional view</span>
            </ChartSubtitle>
          </div>
        </ChartHeader>
        <ChartContent>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={overviewData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
              <Radar name="Token Balance" dataKey="token" stroke="#017989" fill="#017989" fillOpacity={0.5} />
              <Radar name="Stable Balance" dataKey="stable" stroke="#40E0AD" fill="#40E0AD" fillOpacity={0.5} />
              <Radar name={`${timeframe} Change`} dataKey="tokenChange" stroke="#0D5D69" fill="#0D5D69" fillOpacity={0.5} />
              <Legend />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContent>
      </ChartCard>

      {/* Individual Asset Charts */}
      {validData.map((item, index) => (
        <ChartCard key={index}>
          <ChartHeader>
            <div>
              <ChartTitle>{item.pair}/{item.baseToken}</ChartTitle>
              <ChartSubtitle>
                <span>Exchange: {item.exchange}</span>
                <span>Current: {item.live.tokenBalance.toFixed(2)} {item.pair}</span>
              </ChartSubtitle>
            </div>
          </ChartHeader>
          <ChartContent>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={item.historicalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id={`colorToken${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#017989" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#017989" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id={`colorStable${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40E0AD" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#40E0AD" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="tokenBalance" 
                  stroke="#017989" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#colorToken${index})`}
                  name={item.pair}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="baseTokenBalance" 
                  stroke="#40E0AD" 
                  strokeWidth={2}
                  fillOpacity={0.3} 
                  fill={`url(#colorStable${index})`}
                  name={item.baseToken}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContent>
        </ChartCard>
      ))}
    </GraphViewContainer>
  );
};

export default GraphView; 