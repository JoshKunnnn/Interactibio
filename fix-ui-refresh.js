// Fix UI refresh to show copied template
// Run this in the browser console on the teacher dashboard

console.log('🔍 Checking for copied template...');

// Method 1: Force React component refresh
if (window.location.pathname.includes('/teacher/dashboard')) {
  // Trigger a custom event to refresh subjects
  const refreshEvent = new CustomEvent('refreshSubjects');
  window.dispatchEvent(refreshEvent);
  
  // Also try to reload the page after a short delay
  setTimeout(() => {
    console.log('🔄 Reloading page to show copied template...');
    window.location.reload();
  }, 1000);
}

// Method 2: Check if the subject exists in the current session
console.log('📊 Current URL:', window.location.href);
console.log('👤 User session:', sessionStorage.getItem('supabase.auth.token'));

// Method 3: Manual check - look for the subject in the DOM
setTimeout(() => {
  const subjectElements = document.querySelectorAll('[data-subject-title]');
  console.log('📚 Found subject elements:', subjectElements.length);
  
  subjectElements.forEach(el => {
    console.log('Subject:', el.getAttribute('data-subject-title'));
  });
  
  // Check if "Cell Division" is in the page
  const pageText = document.body.innerText;
  if (pageText.includes('Cell Division')) {
    console.log('✅ Cell Division subject found in page!');
  } else {
    console.log('❌ Cell Division subject not found in page');
  }
}, 2000); 