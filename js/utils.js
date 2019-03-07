'use strict';

function scrollToRate(x, lMax, lMin, gMax, gMin) {
  return x * (lMax - lMin) / (gMax - gMin) + lMin;
}
function rateToScroll(x, lMax, lMin, gMax, gMin) {
  return ((x - lMin) * (gMax - gMin)) / (lMax - lMin);
}