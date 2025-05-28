import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

const TableContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  border: 1px solid var(--card-border);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
`;

const TableHeader = styled.thead`
  background: var(--card-header);
  border-bottom: 1px solid var(--card-border);
  position: sticky;
  top: 0;
  z-index: 10;
  
  th {
    padding: 0.8rem 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.85rem;
    white-space: nowrap;
    border-bottom: 1px solid var(--card-border);
    
    &:not(:last-child) {
      border-right: 1px dotted var(--card-border);
    }
  }
`;

const MainHeader = styled.tr`
  th {
    text-align: center;
    padding: 1rem 0.5rem 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
  }
`;

const SubHeader = styled.tr`
  th {
    padding: 0.5rem 1rem;
    text-align: left;
    font-weight: 500;
    color: var(--text-secondary);
    font-size: 0.75rem;
    border-top: 1px dotted var(--card-border);
    border-bottom: 1px solid var(--card-border);
    
    &:not(:last-child) {
      border-right: 1px dotted var(--card-border);
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px dotted var(--card-border);
    transition: background 0.2s ease;
    
    &:hover {
      background: var(--card-hover);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 1px dotted var(--card-border);
    
    &:not(:last-child) {
      border-right: 1px dotted var(--card-border);
    }
    
    &:first-child {
      padding-left: 1.5rem;
      font-weight: 500;
    }
    
    &:last-child {
      padding-right: 1.5rem;
    }
  }
`;

const SortHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  
  svg {
    font-size: 1rem;
    opacity: ${props => props.active ? 1 : 0.3};
    transition: opacity 0.2s ease;
  }
  
  &:hover svg {
    opacity: 0.7;
  }
`;

const ChangeValue = styled.span`
  color: ${props => {
    if (props.value > 0) return 'var(--success)';
    if (props.value < 0) return 'var(--error)';
    return 'var(--text-secondary)';
  }};
  font-weight: ${props => props.value !== 0 ? '500' : '400'};
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;

  .pair {
    font-weight: 600;
    color: var(--text-primary);
  }

  .base-token {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
  }
`;

const SORT_TYPES = {
  PAIR: 'pair',
  EXCHANGE: 'exchange',
  CURRENT_TOKEN: 'currentToken',
  CURRENT_STABLE: 'currentStable',
  CHANGE_30M_TOKEN: 'change30mToken',
  CHANGE_30M_STABLE: 'change30mStable',
  CHANGE_1H_TOKEN: 'change1hToken',
  CHANGE_1H_STABLE: 'change1hStable',
  CHANGE_4H_TOKEN: 'change4hToken',
  CHANGE_4H_STABLE: 'change4hStable',
};

const InventoryTable = ({ data, filterPair }) => {
  const [sortBy, setSortBy] = useState(SORT_TYPES.PAIR);
  const [sortDirection, setSortDirection] = useState('asc');
  
  const handleSort = (type) => {
    if (type === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortDirection('asc');
    }
  };
  
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    let filtered = [...data];
    
    // Apply pair filter
    if (filterPair) {
      filtered = filtered.filter(item => item.pair_exchange === "BITMART_FTRB_USDT");
    }
    
    // Limit to 5 entries
    filtered = filtered.slice(0, 5);
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case SORT_TYPES.PAIR:
          valueA = a.pair || '';
          valueB = b.pair || '';
          break;
        case SORT_TYPES.EXCHANGE:
          valueA = a.exchange || '';
          valueB = b.exchange || '';
          break;
        case SORT_TYPES.CURRENT_TOKEN:
          valueA = a.live?.tokenBalance || 0;
          valueB = b.live?.tokenBalance || 0;
          break;
        case SORT_TYPES.CURRENT_STABLE:
          valueA = a.live?.baseTokenBalance || 0;
          valueB = b.live?.baseTokenBalance || 0;
          break;
        case SORT_TYPES.CHANGE_30M_TOKEN:
          valueA = a.change?.['30m']?.tokenChange || 0;
          valueB = b.change?.['30m']?.tokenChange || 0;
          break;
        case SORT_TYPES.CHANGE_30M_STABLE:
          valueA = a.change?.['30m']?.baseTokenChange || 0;
          valueB = b.change?.['30m']?.baseTokenChange || 0;
          break;
        case SORT_TYPES.CHANGE_1H_TOKEN:
          valueA = a.change?.['8h']?.tokenChange || 0;
          valueB = b.change?.['8h']?.tokenChange || 0;
          break;
        case SORT_TYPES.CHANGE_1H_STABLE:
          valueA = a.change?.['8h']?.baseTokenChange || 0;
          valueB = b.change?.['8h']?.baseTokenChange || 0;
          break;
        case SORT_TYPES.CHANGE_4H_TOKEN:
          valueA = a.change?.['24h']?.tokenChange || 0;
          valueB = b.change?.['24h']?.tokenChange || 0;
          break;
        case SORT_TYPES.CHANGE_4H_STABLE:
          valueA = a.change?.['24h']?.baseTokenChange || 0;
          valueB = b.change?.['24h']?.baseTokenChange || 0;
          break;
        default:
          valueA = a.pair || '';
          valueB = b.pair || '';
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      }
    });
    
    return filtered;
  }, [data, filterPair, sortBy, sortDirection]);
  
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '-';
    
    // Abbreviate large numbers
    if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };
  
  const formatChange = (num) => {
    if (num === undefined || num === null) return '-';
    
    return (num >= 0 ? '+' : '') + formatNumber(num);
  };
  
  if (!data || data.length === 0) {
    return <TableContainer>No data available</TableContainer>;
  }
  
  return (
    <TableContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledTable>
        <TableHeader>
          <MainHeader>
            <th colSpan="2">
              <SortHeader 
                active={sortBy === SORT_TYPES.PAIR || sortBy === SORT_TYPES.EXCHANGE} 
                onClick={() => handleSort(SORT_TYPES.PAIR)}
              >
                Pair / Exchange
                {(sortBy === SORT_TYPES.PAIR || sortBy === SORT_TYPES.EXCHANGE) && (
                  sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                )}
              </SortHeader>
            </th>
            <th colSpan="2">
              <SortHeader 
                active={sortBy === SORT_TYPES.CURRENT_TOKEN || sortBy === SORT_TYPES.CURRENT_STABLE} 
                onClick={() => handleSort(SORT_TYPES.CURRENT_TOKEN)}
              >
                Current Inventory
                {(sortBy === SORT_TYPES.CURRENT_TOKEN || sortBy === SORT_TYPES.CURRENT_STABLE) && (
                  sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                )}
              </SortHeader>
            </th>
            <th colSpan="2">
              <SortHeader 
                active={sortBy === SORT_TYPES.CHANGE_30M_TOKEN || sortBy === SORT_TYPES.CHANGE_30M_STABLE} 
                onClick={() => handleSort(SORT_TYPES.CHANGE_30M_TOKEN)}
              >
                30min Change
                {(sortBy === SORT_TYPES.CHANGE_30M_TOKEN || sortBy === SORT_TYPES.CHANGE_30M_STABLE) && (
                  sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                )}
              </SortHeader>
            </th>
            <th colSpan="2">
              <SortHeader 
                active={sortBy === SORT_TYPES.CHANGE_1H_TOKEN || sortBy === SORT_TYPES.CHANGE_1H_STABLE} 
                onClick={() => handleSort(SORT_TYPES.CHANGE_1H_TOKEN)}
              >
                1hr Change
                {(sortBy === SORT_TYPES.CHANGE_1H_TOKEN || sortBy === SORT_TYPES.CHANGE_1H_STABLE) && (
                  sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                )}
              </SortHeader>
            </th>
            <th colSpan="2">
              <SortHeader 
                active={sortBy === SORT_TYPES.CHANGE_4H_TOKEN || sortBy === SORT_TYPES.CHANGE_4H_STABLE} 
                onClick={() => handleSort(SORT_TYPES.CHANGE_4H_TOKEN)}
              >
                4hr Change
                {(sortBy === SORT_TYPES.CHANGE_4H_TOKEN || sortBy === SORT_TYPES.CHANGE_4H_STABLE) && (
                  sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                )}
              </SortHeader>
            </th>
          </MainHeader>
          <SubHeader>
            <th>Token</th>
            <th>Exchange</th>
            <th>Token</th>
            <th>Stable</th>
            <th>Token</th>
            <th>Stable</th>
            <th>Token</th>
            <th>Stable</th>
            <th>Token</th>
            <th>Stable</th>
          </SubHeader>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>
                <TokenInfo>
                  <span className="pair">{item.pair}</span>
                  <span className="base-token">{item.baseToken}</span>
                </TokenInfo>
              </td>
              <td>{item.exchange}</td>
              <td>{formatNumber(item.live?.tokenBalance || 0)}</td>
              <td>{formatNumber(item.live?.baseTokenBalance || 0)}</td>
              <td>
                <ChangeValue value={item.change?.['30m']?.tokenChange || 0}>
                  {formatChange(item.change?.['30m']?.tokenChange || 0)}
                </ChangeValue>
              </td>
              <td>
                <ChangeValue value={item.change?.['30m']?.baseTokenChange || 0}>
                  {formatChange(item.change?.['30m']?.baseTokenChange || 0)}
                </ChangeValue>
              </td>
              <td>
                <ChangeValue value={item.change?.['8h']?.tokenChange || 0}>
                  {formatChange(item.change?.['8h']?.tokenChange || 0)}
                </ChangeValue>
              </td>
              <td>
                <ChangeValue value={item.change?.['8h']?.baseTokenChange || 0}>
                  {formatChange(item.change?.['8h']?.baseTokenChange || 0)}
                </ChangeValue>
              </td>
              <td>
                <ChangeValue value={item.change?.['24h']?.tokenChange || 0}>
                  {formatChange(item.change?.['24h']?.tokenChange || 0)}
                </ChangeValue>
              </td>
              <td>
                <ChangeValue value={item.change?.['24h']?.baseTokenChange || 0}>
                  {formatChange(item.change?.['24h']?.baseTokenChange || 0)}
                </ChangeValue>
              </td>
            </tr>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default InventoryTable; 