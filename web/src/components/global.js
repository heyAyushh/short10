import { createGlobalStyle } from 'styled-components';
import React from 'react';

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};

    justify-content: center;
    font-family: 'Segoe UI';
    transition: all 0.25s linear;
  }
`