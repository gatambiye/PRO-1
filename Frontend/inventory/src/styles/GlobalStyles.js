import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #1F2937;
    background: #F8FAFC;
  }

  h1, h2, h3, h4 {
    font-weight: 600;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  button, input, select, textarea {
    font-family: 'Inter', sans-serif;
  }

  a {
    color: #1E3A8A;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
    h2 {
      font-size: 20px;
    }
  }
`;

export default GlobalStyles;