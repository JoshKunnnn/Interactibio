// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      componentRenders: {},
      apiCalls: {},
      pageLoads: {},
      userInteractions: {},
      memoryUsage: []
    };
    this.startTime = performance.now();
    this.observers = new Set();
  }

  // Track component render
  trackComponentRender(componentName) {
    if (!this.metrics.componentRenders[componentName]) {
      this.metrics.componentRenders[componentName] = 0;
    }
    this.metrics.componentRenders[componentName]++;
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${componentName} rendered (${this.metrics.componentRenders[componentName]} times)`);
    }
    
    this.notifyObservers('componentRender', { componentName, count: this.metrics.componentRenders[componentName] });
  }

  // Track API call
  trackApiCall(endpoint, duration, success = true) {
    if (!this.metrics.apiCalls[endpoint]) {
      this.metrics.apiCalls[endpoint] = {
        count: 0,
        totalDuration: 0,
        averageDuration: 0,
        successCount: 0,
        failureCount: 0
      };
    }
    
    const apiMetric = this.metrics.apiCalls[endpoint];
    apiMetric.count++;
    apiMetric.totalDuration += duration;
    apiMetric.averageDuration = apiMetric.totalDuration / apiMetric.count;
    
    if (success) {
      apiMetric.successCount++;
    } else {
      apiMetric.failureCount++;
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 API Call: ${endpoint} (${duration.toFixed(2)}ms) - ${success ? '✅' : '❌'}`);
    }
    
    this.notifyObservers('apiCall', { endpoint, duration, success });
  }

  // Track page load
  trackPageLoad(pageName, loadTime) {
    if (!this.metrics.pageLoads[pageName]) {
      this.metrics.pageLoads[pageName] = {
        count: 0,
        totalLoadTime: 0,
        averageLoadTime: 0,
        fastestLoad: Infinity,
        slowestLoad: 0
      };
    }
    
    const pageMetric = this.metrics.pageLoads[pageName];
    pageMetric.count++;
    pageMetric.totalLoadTime += loadTime;
    pageMetric.averageLoadTime = pageMetric.totalLoadTime / pageMetric.count;
    pageMetric.fastestLoad = Math.min(pageMetric.fastestLoad, loadTime);
    pageMetric.slowestLoad = Math.max(pageMetric.slowestLoad, loadTime);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📄 Page Load: ${pageName} (${loadTime.toFixed(2)}ms)`);
    }
    
    this.notifyObservers('pageLoad', { pageName, loadTime });
  }

  // Track user interaction
  trackUserInteraction(interactionType, target, duration = 0) {
    if (!this.metrics.userInteractions[interactionType]) {
      this.metrics.userInteractions[interactionType] = {
        count: 0,
        totalDuration: 0,
        averageDuration: 0
      };
    }
    
    const interactionMetric = this.metrics.userInteractions[interactionType];
    interactionMetric.count++;
    interactionMetric.totalDuration += duration;
    interactionMetric.averageDuration = interactionMetric.totalDuration / interactionMetric.count;
    
    this.notifyObservers('userInteraction', { interactionType, target, duration });
  }

  // Track memory usage
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memoryInfo = performance.memory;
      this.metrics.memoryUsage.push({
        timestamp: Date.now(),
        usedJSHeapSize: memoryInfo.usedJSHeapSize,
        totalJSHeapSize: memoryInfo.totalJSHeapSize,
        jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit
      });
      
      // Keep only last 100 entries
      if (this.metrics.memoryUsage.length > 100) {
        this.metrics.memoryUsage.shift();
      }
    }
  }

  // Get performance summary
  getPerformanceSummary() {
    const totalRenderCount = Object.values(this.metrics.componentRenders).reduce((sum, count) => sum + count, 0);
    const totalApiCalls = Object.values(this.metrics.apiCalls).reduce((sum, metric) => sum + metric.count, 0);
    const averageApiDuration = totalApiCalls > 0 
      ? Object.values(this.metrics.apiCalls).reduce((sum, metric) => sum + metric.totalDuration, 0) / totalApiCalls
      : 0;
    
    return {
      totalRenderCount,
      totalApiCalls,
      averageApiDuration,
      uptime: performance.now() - this.startTime,
      memoryUsage: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1] || null
    };
  }

  // Get detailed metrics
  getDetailedMetrics() {
    return this.metrics;
  }

  // Subscribe to performance events
  subscribe(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  // Notify observers
  notifyObservers(eventType, data) {
    this.observers.forEach(callback => {
      try {
        callback(eventType, data);
      } catch (error) {
        console.error('Performance observer error:', error);
      }
    });
  }

  // Export metrics for analysis
  exportMetrics() {
    return {
      timestamp: Date.now(),
      uptime: performance.now() - this.startTime,
      metrics: this.metrics,
      summary: this.getPerformanceSummary()
    };
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = {
      componentRenders: {},
      apiCalls: {},
      pageLoads: {},
      userInteractions: {},
      memoryUsage: []
    };
    this.startTime = performance.now();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Start memory tracking
setInterval(() => {
  performanceMonitor.trackMemoryUsage();
}, 30000); // Track every 30 seconds

// Export the singleton
export default performanceMonitor;

// Performance hooks for React components
export const usePerformanceTracking = (componentName) => {
  const trackRender = () => {
    performanceMonitor.trackComponentRender(componentName);
  };
  
  const trackApiCall = (endpoint, duration, success) => {
    performanceMonitor.trackApiCall(endpoint, duration, success);
  };
  
  const trackInteraction = (interactionType, target, duration) => {
    performanceMonitor.trackUserInteraction(interactionType, target, duration);
  };
  
  return {
    trackRender,
    trackApiCall,
    trackInteraction
  };
};

// Performance decorator for class components
export const withPerformanceTracking = (WrappedComponent, componentName) => {
  return class extends React.Component {
    componentDidMount() {
      performanceMonitor.trackComponentRender(componentName);
    }
    
    componentDidUpdate() {
      performanceMonitor.trackComponentRender(componentName);
    }
    
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Performance monitoring for async operations
export const trackAsyncOperation = async (operationName, operation) => {
  const startTime = performance.now();
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    performanceMonitor.trackApiCall(operationName, duration, true);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    performanceMonitor.trackApiCall(operationName, duration, false);
    throw error;
  }
};

// Performance monitoring for synchronous operations
export const trackSyncOperation = (operationName, operation) => {
  const startTime = performance.now();
  try {
    const result = operation();
    const duration = performance.now() - startTime;
    performanceMonitor.trackApiCall(operationName, duration, true);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    performanceMonitor.trackApiCall(operationName, duration, false);
    throw error;
  }
}; 