import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement scrollIntoView; Radix Select calls it when its
// content opens.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}
