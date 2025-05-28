import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Color Palette based on shared image */
    --primary: #ffffff;
    --secondary: #f7f9fc;
    
    /* Primary Colors */
    --primary-dark-blue: #003D4C;
    --primary-mint: #40E0AD;
    --primary-teal: #017989;
    --primary-white: #FFFFFF;
    
    /* Secondary Colors */
    --secondary-dark-green: #1F3C21;
    --secondary-green: #517F59;
    --secondary-peach: #E28A76;
    --secondary-beige: #E4B872;
    --secondary-olive: #8A9A56;
    --secondary-coral: #F58D79;
    --secondary-sage: #A7C27F;
    
    /* UI Colors */
    --accent: #017989;
    --highlight: #40E0AD;
    --highlight-secondary: #017989;
    
    --text-primary: #2d3748;
    --text-secondary: #718096;
    
    --success: #40E0AD;
    --warning: #E4B872;
    --error: #E28A76;
    
    --card-bg: #ffffff;
    --card-header: #f7f9fc;
    --card-border: #e2e8f0;
    --card-hover: #f7fafc;
    --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    --table-header: #f7f9fc;
    --table-border: #e2e8f0;
    --table-row-odd: #ffffff;
    --table-row-even: #f7f9fc;
    
    --blue-gradient: linear-gradient(90deg, #017989 0%, #40E0AD 100%);
    
    /* Dimensions */
    --border-radius: 8px;
    --sidebar-width: 240px;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    max-width: 100%;
  }
  
  html, body, #root {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  
  body {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--secondary);
    color: var(--text-primary);
    line-height: 1.5;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.01em;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  a {
    color: var(--accent);
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--highlight);
    }
  }
  
  button {
    cursor: pointer;
    font-family: inherit;
    
    &:focus {
      outline: none;
    }
  }
  
  input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    
    &:focus {
      outline: none;
      border-color: var(--accent);
    }
  }
  
  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--secondary);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--accent);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--highlight);
  }
  
  table {
    width: 100%;
    table-layout: fixed;
  }
`;

export default GlobalStyles; 