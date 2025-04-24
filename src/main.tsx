import { createRoot } from 'react-dom/client';
import './index.css';
import { StrictMode } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import Demo from './Demo';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <Demo />
    </StyledEngineProvider>
  </StrictMode>
);
