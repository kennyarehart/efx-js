import { FrameRate } from '@ff0000-ad-tech/ad-events'
import Path3d from './Path3d'
import colors from './colors'
import { randomToggleOne, random, map } from './utils'

const _pathRadial = [
	[[44, 0]],
	[[44, 16], [35, 21], [32, 27]],
	[[23, 41], [-18, 59], [-30, 26]],
	[[-36, 12], [-59, -7], [-30, -32]],
	[[-17, -43], [-17, -46], [1, -44]],
	[[12, -44], [21, -44], [29, -31]],
	[[37, -18], [44, -18], [44, 0]]
]

function Vapor(target, arg) {
	const T = this

	T.canvas = target
	T.ctx = T.canvas.getContext('2d')
	arg = arg || {}

	T.w = arg.width || T.canvas.width
	T.h = arg.height || T.canvas.height

	arg.origin = arg.origin || {}
	const x = arg.origin.x || random(0, T.w)
	const y = arg.origin.y || random(0, T.h)
	T.outer = 30

	var colorSubSet = colors.blue.rgb.slice(1, 4)
	var rev = colorSubSet.slice().reverse()
	var _colors = colorSubSet.concat(rev)

	T._paths = []
	var _count = 300
	var _size = [3, 10, 3]
	var _scales = [0.01, 2.3, 0.01]

	const startDirX = random(0.8, 1.1, 0.1) * (x < T.w / 2 ? 1 : -1)
	const startDirY = random(0.9, 1.1, 0.1) * (y < T.h / 2 ? 1 : -1)
	const startDirZ = randomToggleOne() * random(0.5, 1, 0.1)

	for (var i = 0; i < _count; i++) {
		var s = new Path3d(_pathRadial, { x: x, y: y })
		s.scale = getInRange(i, _scales, Circ)
		s.rx = 3.6
		s.ry = 0
		s.rz = 0.5
		// anim speeds
		s.dirX = startDirX
		s.dirY = startDirY
		s.dirZ = startDirZ
		//
		s.alpha = 0 //0.4 //
		s.size = getInRange(i, _size)
		s.color = getInColorRange(i, _colors).join(',')
		T._paths.push(s)
	}

	function getInRange(index, arr) {
		const [f, c, p] = getEaseSubPercent(index, arr)
		return map(arr[f], arr[c], 0, 1, p)
	}

	function getEaseSubPercent(index, arr, ease) {
		const pos = getAtIndex(index, arr)
		const f = Math.floor(pos)
		let c = Math.ceil(pos)
		if (index == 0 && arr.length > 1) c = 1
		const subPerc = pos % 1
		var easeClass = ease || Sine
		var easeType = f % 2 ? easeClass.easeIn : easeClass.easeOut
		const p = easeType.getRatio(subPerc)
		return [f, c, p]
	}

	function getAtIndex(index, arr) {
		return index / (_count / (arr.length - 1))
	}

	function getInColorRange(index, arr) {
		const [f, c, p] = getEaseSubPercent(index, arr)

		let newColor = []
		for (var i = 0; i < 3; i++) {
			newColor.push(~~map(arr[f][i], arr[c][i], 0, 1, p))
		}
		return newColor
	}

	T.current = 0
	T.fadeIn = true
}

Vapor.prototype = {
	play: function() {
		const T = this
		T.current = 0
		FrameRate.register(T, T.tick, 60)
	},

	finish: function() {
		const T = this
		T.fadeIn = false
		TweenLite.to(T._paths, 1, {
			alpha: 0,
			onComplete: () => {
				FrameRate.unregister(T, T.tick, 60)
			}
		})
	},

	tick: function() {
		const T = this
		T.ctx.clearRect(0, 0, T.w, T.h)
		for (var i = 0; i < T._paths.length; i++) {
			if (i < T.current) {
				const item = T._paths[i]
				if (item.x > T.w + T.outer || item.x < -T.outer) {
					// reverse it
					item.dirX *= -1
				}
				if (item.y > T.h + T.outer || item.y < -T.outer) {
					// reverse
					item.dirY *= -1
				}
				if (item.z > 100 || item.z < -100) item.dirZ *= -1

				item.x += item.dirX
				item.y += item.dirY
				item.z += item.dirZ
				item.rx += 0.01
				item.ry -= 0.005
				item.rz += 0.01

				// fade in
				if (T.fadeIn && item.alpha < 0.2) {
					item.alpha += 0.008
				}

				item.render(T.ctx)
			}
		}
		T.current += 0.5
	}
}

export default Vapor
