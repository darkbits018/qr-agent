// src/shared/utils/delay.js

/**
 * Simulates a delay using a Promise and setTimeout.
 * Useful for mocking network latency or delaying execution in async functions.
 *
 * @param {number} ms - The duration of the delay in milliseconds.
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));