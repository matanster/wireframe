# gets browser viewport dimensions
exports.getViewport = () -> { width: window.innerWidth, height: window.innerHeight }

# calculates the interval between two numbers
exports.calcLength = (i1, i2) -> i2 - i1 + 1
