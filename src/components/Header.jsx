import React, { useState } from 'react';
import styled from 'styled-components';
import { FiRefreshCw, FiDatabase, FiGrid, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem;
  background: var(--blue-gradient);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: white;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const RefreshButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: var(--primary-teal);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 0;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: rotate(180deg);
  }
  
  &.loading {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ModeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.4rem;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const ModeLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 45px;
  height: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.active ? '24px' : '3px'};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.25)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const Header = ({ onRefresh, activeView, setActiveView }) => {
  const [isAuto, setIsAuto] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Call the refresh function passed as prop
    if (onRefresh) {
      onRefresh();
    }
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const toggleMode = () => {
    setIsAuto(!isAuto);
  };
  
  return (
    <HeaderContainer>
      <Logo
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FiDatabase />
        Inventory Dashboard
      </Logo>
      
      <TabsContainer>
        <Tab 
          active={activeView === 'table'} 
          onClick={() => setActiveView('table')}
        >
          <FiGrid />
          Table View
        </Tab>
        <Tab 
          active={activeView === 'graph'} 
          onClick={() => setActiveView('graph')}
        >
          <FiBarChart2 />
          Graph View
        </Tab>
      </TabsContainer>
      
      <Controls>
        <ModeToggle>
          <ModeLabel active={!isAuto}>Manual</ModeLabel>
          <ToggleSwitch active={isAuto} onClick={toggleMode} />
          <ModeLabel active={isAuto}>Auto</ModeLabel>
        </ModeToggle>
        
        <RefreshButton
          onClick={handleRefresh}
          className={isRefreshing ? 'loading' : ''}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiRefreshCw />
        </RefreshButton>
      </Controls>
    </HeaderContainer>
  );
};

export default Header; 