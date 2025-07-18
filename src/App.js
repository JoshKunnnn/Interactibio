import React, { Suspense, lazy, memo, createContext, useContext, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Lazy load all page components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const TeacherAuth = lazy(() => import('./pages/TeacherAuth'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const StudentAuth = lazy(() => import('./pages/StudentAuth'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StudentGameSelection = lazy(() => import('./pages/StudentGameSelection'));
const StudentGamePlay = lazy(() => import('./pages/StudentGamePlay'));

// Performance Context for monitoring and optimization
const PerformanceContext = createContext();

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

const PerformanceProvider = memo(({ children }) => {
  const [metrics, setMetrics] = useState({
    pageLoads: {},
    componentRenders: {},
    apiCalls: {}
  });

  const trackPageLoad = useCallback((pageName, loadTime) => {
    setMetrics(prev => ({
      ...prev,
      pageLoads: {
        ...prev.pageLoads,
        [pageName]: {
          loadTime,
          timestamp: Date.now(),
          count: (prev.pageLoads[pageName]?.count || 0) + 1
        }
      }
    }));
  }, []);

  const trackComponentRender = useCallback((componentName) => {
    setMetrics(prev => ({
      ...prev,
      componentRenders: {
        ...prev.componentRenders,
        [componentName]: (prev.componentRenders[componentName] || 0) + 1
      }
    }));
  }, []);

  const trackApiCall = useCallback((endpoint, duration) => {
    setMetrics(prev => ({
      ...prev,
      apiCalls: {
        ...prev.apiCalls,
        [endpoint]: {
          duration,
          timestamp: Date.now(),
          count: (prev.apiCalls[endpoint]?.count || 0) + 1
        }
      }
    }));
  }, []);

  const value = {
    metrics,
    trackPageLoad,
    trackComponentRender,
    trackApiCall
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
});

// Loading component for route transitions
const RouteLoading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '16px',
    color: '#666'
  }}>
    Loading...
  </div>
);

// Memoized App component
const App = memo(() => {
  return (
    <div className="App">
      <PerformanceProvider>
        <Router>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/teacher/auth" element={<TeacherAuth />} />
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/student/auth" element={<StudentAuth />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student" element={<Navigate to="/student/auth" replace />} />
              <Route path="/quiz/:subjectId" element={<StudentGameSelection />} />
              <Route path="/play-game/:gameId" element={<StudentGamePlay />} />
            </Routes>
          </Suspense>
        </Router>
      </PerformanceProvider>
    </div>
  );
});

App.displayName = 'App';

export default App; 