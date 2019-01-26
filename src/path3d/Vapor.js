import { MathUtils, ArrayUtils } from '@ff0000-ad-tech/ad-utils'
import { UICanvas } from '@ff0000-ad-tech/ad-ui'
import { FrameRate } from '@ff0000-ad-tech/ad-events'
import Path3d from './Path3d'
import colors from '../colors'

export default class Vapor {
	constructor(target, arg) {
		const T = this

		T.canvas = new UICanvas({
			target: target,
			id: 'new-canvas',
			css: {
				width: target.width,
				height: target.height
			}
		})

		T.w = T.canvas.width
		T.h = T.canvas.height
		const x = 150 // MathUtils.random(0, T.w)
		const y = 300 //MathUtils.random(0, T.h)
		T.outer = 30

		var colorSubSet = colors.blue.rgb.slice(1, 4)
		var rev = ArrayUtils.copy(colorSubSet).reverse()
		var _colors = ArrayUtils.combine(colorSubSet, rev)

		var _pathRadial = [
			[[44, 0]],
			[[44, 16], [35, 21], [32, 27]],
			[[23, 41], [-18, 59], [-30, 26]],
			[[-36, 12], [-59, -7], [-30, -32]],
			[[-17, -43], [-17, -46], [1, -44]],
			[[12, -44], [21, -44], [29, -31]],
			[[37, -18], [44, -18], [44, 0]]
		]

		T._paths = []
		var _count = 300
		var _size = [3, 6, 3]
		var _scales = [0.01, 2.3, 0.01]

		const startDirX = MathUtils.random(0.8, 1.1, 0.1) * (x < T.w / 2 ? 1 : -1)
		const startDirY = MathUtils.random(0.9, 1.1, 0.1) * (y < T.h / 2 ? 1 : -1)
		const startDirZ = (MathUtils.randomBoolean() ? -1 : 1) * MathUtils.random(0.5, 1, 0.1)

		for (var i = 0; i < _count; i++) {
			var s = new Path3d(_pathRadial, { x: x, y: y })
			// s.x = x
			// s.y = y
			s.scale = getInRange(i, _scales, Circ) // MathUtils.rel(_scales[1], _scales[0], 0, _count, i) //0.1 + i * 0.4
			s.rx = 3.6
			s.ry = 0
			s.rz = 0.5
			// anim speeds
			s.dirX = startDirX
			s.dirY = startDirY
			s.dirZ = startDirZ
			//
			s.alpha = 0 //0.4 //
			s.size = getInRange(i, _size) // (i / (_count - 1)) * (_size[1] - _size[0]) + _size[0]
			s.color = getInColorRange(i, _colors).join(',')
			T._paths.push(s)
		}

		function getInRange(index, arr) {
			const [f, c, p] = getEaseSubPercent(index, arr)
			return MathUtils.rel(arr[f], arr[c], 0, 1, p)
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
			const subDivisions = _count / (arr.length - 1)
			const pos = index / subDivisions
			return pos
		}

		function getInColorRange(index, arr) {
			const [f, c, p] = getEaseSubPercent(index, arr)

			let newColor = []
			for (var i = 0; i < 3; i++) {
				newColor.push(~~MathUtils.rel(arr[f][i], arr[c][i], 0, 1, p))
			}
			// console.log(arr[f], arr[c], p, '|', newColor)
			return newColor
		}

		T.current = 0
		T.fadeIn = true
	}

	// -------------------------------------------------------------------------------
	play() {
		const T = this
		T.current = 0
		//
		FrameRate.register(T, T.tick, 60)
	}

	finish() {
		const T = this
		T.fadeIn = false
		TweenLite.to(T._paths, 1, {
			alpha: 0,
			onComplete: () => {
				FrameRate.unregister(T, T.tick, 60)
			}
		})
	}

	// -------------------------------------------------------------------------------
	tick() {
		const T = this
		T.canvas.context2d.clearRect(0, 0, T.canvas.width, T.canvas.height)
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
				// if (item.z > 100 || item.z < -100) item.dirZ *= -1

				item.x += item.dirX
				item.y += item.dirY
				// item.z += item.dirZ
				item.rx += 0.01
				item.ry -= 0.005
				item.rz += 0.01

				// fade in
				if (T.fadeIn && item.alpha < 0.2) {
					item.alpha += 0.008
				}

				item.render(T.canvas.context2d)
			}
		}
		T.current += 0.5
	}
}
