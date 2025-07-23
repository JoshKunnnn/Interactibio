// Force refresh subjects list - Run this in browser console
// This will trigger a refresh of the subjects list

// Method 1: Trigger a manual refresh
if (window.location.pathname.includes('/teacher/dashboard')) {
  // Find the SubjectsList component and force a refresh
  const event = new Event('refresh');
  window.dispatchEvent(event);
  
  // Also try to trigger the refresh trigger
  if (window.forceRefreshSubjects) {
    window.forceRefreshSubjects();
  }
  
  console.log('Forced refresh triggered');
}

// Method 2: Reload the page
// window.location.reload();

// Method 3: Check if the subject exists in localStorage or session
console.log('Current teacher data:', localStorage.getItem('teacherData'));
console.log('Current session data:', sessionStorage.getItem('sessionData')); 