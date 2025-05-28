import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDatabase, FiDollarSign, FiActivity } from 'react-icons/fi';

const CardContainer = styled(motion.div)`
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--card-border);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--highlight);
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
    border-color: var(--highlight);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--highlight);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--highlight-secondary);
    font-size: 0.9rem;
  }
`;

const CardBody = styled.div`
  flex: 1;
`;

const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const TrendText = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const StatIcon = ({ type }) => {
  switch (type) {
    case 'token':
      return <FiDatabase />;
    case 'baseToken':
      return <FiDollarSign />;
    case 'time':
      return <FiActivity />;
    default:
      return <FiDatabase />;
  }
};

const getIconForTitle = (title) => {
  if (title.toLowerCase().includes('token') && title.toLowerCase().includes('base')) return 'baseToken';
  if (title.toLowerCase().includes('token')) return 'token';
  if (title.toLowerCase().includes('updated') || title.toLowerCase().includes('time')) return 'time';
  return 'token';
};

const formatValue = (value, prefix = '') => {
  if (value === null || value === undefined) return '-';
  
  if (typeof value === 'string') {
    return value;
  }
  
  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${prefix}${formattedValue}`;
};

const StatsCard = ({ title, value, trendText, prefix = '', delay = 0 }) => {
  const iconType = getIconForTitle(title);
  
  return (
    <CardContainer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <CardHeader>
        <CardTitle>
          <StatIcon type={iconType} />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardBody>
        <Value>{formatValue(value, prefix)}</Value>
        {trendText && <TrendText>{trendText}</TrendText>}
      </CardBody>
    </CardContainer>
  );
};

export default StatsCard; 