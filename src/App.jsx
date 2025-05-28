import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import Dashboard from './components/Dashboard/Dashboard';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  background: var(--secondary);
`;

const ContentContainer = styled.main`
  flex: 1;
  width: 100vw;
  max-width: 100vw;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
`;

function App() {
  const [activeView, setActiveView] = useState('table');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AppContainer>
      <GlobalStyles />
      <Header 
        onRefresh={handleRefresh} 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      <ContentContainer>
        <Dashboard 
          key={refreshTrigger} 
          activeView={activeView} 
        />
      </ContentContainer>
    </AppContainer>
  );
}

export default App;
