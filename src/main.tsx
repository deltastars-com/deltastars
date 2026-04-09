import React from 'react';
import { createRoot } from 'react-dom/client';
import DeltaStarsSovereignApp from '../index';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Critical Mount Failure.');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <DeltaStarsSovereignApp />
  </React.StrictMode>
);
