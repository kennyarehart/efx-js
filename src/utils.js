export const random = (a, b, increment) => {
	b = b || 0
	increment = increment != undefined && increment > 0 ? increment : 1

	var min = Math.min(a, b)
	var max = Math.max(a, b)

	min = Math.ceil(min / increment) * increment
	max = Math.floor(max / increment) * increment

	return min + Math.floor(Math.random() * ((max - min + increment) / increment)) / (1 / increment)
}

export const randomToggleOne = () => (Math.random() < 0.5 ? -1 : 1)

// map(0, 1, 10, 20, 15) // 0.5
// map(100, 300, 3, 5, 3.5) // 150
export function map(a0, a1, b0, b1, bX) {
	return ((bX - b0) / (b1 - b0)) * (a1 - a0) + a0
}

export function toRadians(degree) {
	return (Math.PI / 180.0) * degree
}

export function toDegrees(radian) {
	return (180.0 / Math.PI) * radian
}

export function getAnglePoint(x, y, distance, angle) {
	var x = x + Math.cos(angle) * distance
	var y = y + Math.sin(angle) * distance

	return [x, y]
}

export function getAngle(x1, y1, x2, y2) {
	x2 = x2 || 0
	y2 = y2 || 0
	return Math.atan2(y2 - y1, x2 - x1)
}

export function getDistance(x1, y1, x2, y2) {
	x2 = x2 || 0
	y2 = y2 || 0
	return Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1))
}

export const shuffle = array => array.sort(() => (Math.random() < 0.5 ? 1 : -1))
