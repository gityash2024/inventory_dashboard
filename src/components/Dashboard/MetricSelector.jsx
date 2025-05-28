import React, { useState } from 'react';
import styled from 'styled-components';
import { FiChevronDown, FiBarChart2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SelectorContainer = styled.div`
  position: relative;
  margin-bottom: 0;
  width: 100%;
  max-width: 250px;
  z-index: 10;
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  cursor: pointer;
  user-select: none;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--highlight);
    box-shadow: 0 4px 20px rgba(0, 180, 216, 0.2);
  }
  
  svg.chevron {
    transition: transform 0.3s ease;
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const HeaderText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--highlight);
    font-size: 0.9rem;
  }
  
  span {
    font-weight: 500;
    font-size: 0.9rem;
  }
`;

const DropdownList = styled(motion.div)`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 5;
`;

const DropdownItem = styled(motion.div)`
  padding: 0.7rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--table-border);
  font-size: 0.9rem;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: var(--accent);
    color: var(--highlight);
  }
  
  &.selected {
    background: var(--accent);
    color: var(--highlight);
    font-weight: 500;
  }
`;

const dropdownVariants = {
  hidden: { 
    opacity: 0,
    y: -5,
    height: 0
  },
  visible: { 
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: {
      duration: 0.3,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -5,
    height: 0,
    transition: {
      duration: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

const MetricSelector = ({ onMetricChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('Token Balance');
  
  const metrics = [
    'Token Balance',
    'Base Token Balance',
    'Total Token Value',
    'Total Base Token Value',
    '24h Change',
    '8h Change',
    '30m Change',
    '5m Change'
  ];
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (metric) => {
    setSelectedMetric(metric);
    setIsOpen(false);
    if (onMetricChange) {
      onMetricChange(metric);
    }
  };
  
  return (
    <SelectorContainer>
      <DropdownHeader isOpen={isOpen} onClick={toggleDropdown}>
        <HeaderText>
          <FiBarChart2 />
          <span>{selectedMetric}</span>
        </HeaderText>
        <FiChevronDown className="chevron" />
      </DropdownHeader>
      
      <AnimatePresence>
        {isOpen && (
          <DropdownList
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {metrics.map((metric) => (
              <DropdownItem
                key={metric}
                className={selectedMetric === metric ? 'selected' : ''}
                onClick={() => handleSelect(metric)}
                variants={itemVariants}
              >
                {metric}
              </DropdownItem>
            ))}
          </DropdownList>
        )}
      </AnimatePresence>
    </SelectorContainer>
  );
};

export default MetricSelector; 