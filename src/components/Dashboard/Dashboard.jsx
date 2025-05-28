import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InventoryTable from './InventoryTable';
import GraphView from './GraphView';
import { inventoryData } from '../../data/mockData';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: calc(100vh - 60px);
  padding: 0;
  position: relative;
  overflow-x: hidden;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid var(--card-bg);
  border-top: 5px solid var(--highlight);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TableWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow: auto;
  display: ${props => props.activeView === 'table' ? 'block' : 'none'};
`;

const GraphWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow: auto;
  display: ${props => props.activeView === 'graph' ? 'block' : 'none'};
`;

const Dashboard = ({ activeView }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPair, setFilterPair] = useState(false);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set inventory data
        setData(inventoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <DashboardContainer>
      {loading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}
      
      <TableWrapper activeView={activeView}>
        <InventoryTable data={data} filterPair={filterPair} />
      </TableWrapper>
      
      <GraphWrapper activeView={activeView}>
        <GraphView data={data} />
      </GraphWrapper>
    </DashboardContainer>
  );
};

export default Dashboard; 