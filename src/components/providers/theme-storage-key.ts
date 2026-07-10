// Single source of truth for the theme localStorage key, shared by the React
// provider and the anti-FOUC head script so they can never drift.
// Namespaced + versioned: avoids collisions with a host app's storage and
// allows a future format change. LEGACY is the pre-namespace key we still read
// from and migrate (P3-02). Forks should rename the namespace.
export const THEME_STORAGE_KEY = 'my-frontend-boilerplate:theme:v1';
export const LEGACY_THEME_STORAGE_KEY = 'theme';
