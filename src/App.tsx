import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/theme';
import { FloatingAssistantProvider } from './contexts/floating-assistant';
import Layout from './components/layout/index';
import HomePage from './components/home/index';

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <FloatingAssistantProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </FloatingAssistantProvider>
      </HashRouter>
    </ThemeProvider>
  );
}
