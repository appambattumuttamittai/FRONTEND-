/**
 * Smoothly scrolls to an element by ID without appending '#' to the browser URL
 */
export function scrollToSection(sectionId: string, e?: React.MouseEvent) {
  if (e) {
    e.preventDefault();
  }

  if (typeof window === 'undefined') return;

  const cleanId = sectionId.replace(/^#/, '');
  const target = document.getElementById(cleanId);

  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
    // Keep URL completely clean (no #hash)
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  } else {
    // If element is not on current page, navigate to home
    window.location.href = '/';
  }
}
