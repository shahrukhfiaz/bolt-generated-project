// This script runs before the React app loads to prevent theme flashing
(function() {
  // Check for stored preference
  const storedTheme = localStorage.getItem('theme');
  
  if (storedTheme) {
    document.documentElement.classList.add(storedTheme);
    // Set the appropriate favicon based on theme
    updateFavicon(storedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';
    document.documentElement.classList.add(theme);
    updateFavicon(theme);
  }
  
  // Function to update favicon based on theme
  function updateFavicon(theme) {
    const faviconLink = document.querySelector('link[rel="icon"]');
    if (faviconLink) {
      faviconLink.href = theme === 'dark' ? '/favicon-dark.svg' : '/favicon.svg';
    }
  }
  
  // Listen for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(newTheme);
      updateFavicon(newTheme);
    }
  });
})();
