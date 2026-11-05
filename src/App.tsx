import React, { Suspense, lazy } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/theme';
import { FloatingAssistantProvider } from './contexts/floating-assistant';
import { ENABLE_FLOATING_ASSISTANT } from './config';
import Layout from './components/layout/index';
import HomePage from './components/home/index';
const UiGalleryPage = lazy(() => import('./components/ui-gallery/index')); 
import { businessPages } from './pages/routes';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="gallery" element={<Suspense fallback={<div className="p-8">加载中…</div>}><UiGalleryPage /></Suspense>} />
        {businessPages.map(({ path, Component }) => <Route key={path} path={path.slice(1)} element={<Component />} />)}
        <Route path="*" element={<div role="alert" className="p-8">页面不存在</div>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const routes = (
    <HashRouter>
      {ENABLE_FLOATING_ASSISTANT ? (
        <FloatingAssistantProvider>
          <AppRoutes />
        </FloatingAssistantProvider>
      ) : (
        <AppRoutes />
      )}
    </HashRouter>
  );

  return <ThemeProvider>{routes}</ThemeProvider>;
}
