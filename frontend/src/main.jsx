import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ColorSchemeScript />
    <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme='dark'
      theme={{
        colorScheme: "dark",
      }}
    >
      <App />
    </MantineProvider>
  </StrictMode>,
);
