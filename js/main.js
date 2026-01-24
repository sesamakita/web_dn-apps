/**
 * Main JavaScript Entry Point
 * IT Company Profile Website
 */

// Import modules
import { initNavigation } from './navigation.js';
import { initTheme } from './theme.js';
import { initAnimations } from './animations.js';
import { initForms } from './form.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTheme();
  initAnimations();
  initAnimations();
  window.initializeAnimations = initAnimations;

  console.log('🚀 Website initialized successfully!');
});
