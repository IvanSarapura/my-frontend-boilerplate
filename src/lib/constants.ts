/**
 * Origin of the demo API consumed by the example `posts` feature.
 *
 * Single source of truth: it is used both as the fetch base in the feature
 * services and as the `connect-src` entry in the CSP (src/proxy.ts). When you
 * wire a real backend, replace this value (or make it env-driven) and the CSP
 * updates with it — no need to touch the policy string by hand.
 */
export const DEMO_API_ORIGIN = 'https://jsonplaceholder.typicode.com';
