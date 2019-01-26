import { MathUtils, ArrayUtils } from '@ff0000-ad-tech/ad-utils'
import { FrameRate } from '@ff0000-ad-tech/ad-events'
import Composer from './Composer'
import Bolt from './Bolt'
import Point from '../Point'

export default class Electricity {
	constructor(target) {
		const T = this
		T.composer = new Composer(target)

		let points = []
		for (var i = 0; i < 9; i++) {
			if (i == 4) continue
			const x = (i % 3) * (target.width / 2)
			const y = Math.floor(i / 3) * (target.height / 2)

			var s = T.create(new Point(x, y))
			points.push(s)
		}
		T.total = points.length
		T.waiting = ArrayUtils.shuffle(points)
		T.isActive = false

		T.counter = 0
		T.targetCount = 0
	}

	play() {
		const T = this
		T.isActive = true
		FrameRate.register(T, T.tick, 50)
	}

	finish() {
		console.log('FINISH')
		this.isActive = false
	}

	stop() {
		const T = this
		T.composer.cd.clear()
		FrameRate.unregister(T, T.tick, 50)
	}

	// -------------------------------------------------------------------------------
	create(point, canvas) {
		const T = this
		const a = MathUtils.toDegrees(MathUtils.getAngle(point.x, point.y, T.width / 2, T.height / 2))
		const distanceToCenter = MathUtils.getDistance(point.x, point.y, T.width / 2, T.height / 2)

		let c = canvas || T.composer.add()

		return new Bolt(c, point, a, distanceToCenter)
	}

	tick() {
		const T = this
		if (T.counter >= T.targetCount) {
			if (T.isActive) {
				T.next()
			}
			T.counter = 0
			T.targetCount = MathUtils.random(5, 15)
		}
		T.counter++
		T.composer.update()
	}

	next() {
		const T = this
		// console.log('next()', T.waiting)
		if (T.waiting.length > 0) {
			var bolt = T.waiting.shift()
			if (bolt) {
				bolt.play(function() {
					T.waiting.push(T.create(this.origin, this.canvas))
					if (!T.isActive && T.waiting.length === T.total) {
						T.stop()
					}
				})
			}
		}
	}
}
