import '@testing-library/jest-dom'

// jsdom implements neither the Pointer Capture nor `scrollIntoView` APIs — Radix UI's interactive
// primitives (Select's trigger/viewport, and anything else built on `@radix-ui/react-*` that
// tracks pointer capture for press-and-drag selection) call these unconditionally, so any test
// exercising one throws `TypeError: ... is not a function` with no polyfill. Real browsers all
// implement both; these are no-op stand-ins for the test environment only, not implementations of
// the actual behavior.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {}
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}
