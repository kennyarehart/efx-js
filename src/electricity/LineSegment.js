import { MathUtils } from '@ff0000-ad-tech/ad-utils'
import Point from '../Point'

export default class LineSegment {
	constructor(ctx, from, angle, dist, lineage) {
		const T = this
		T.ctx = ctx
		T.total = MathUtils.random(6, 12)
		T.lineage = lineage || 0
		//
		T.angle = angle
		T._angle = MathUtils.toRadians(angle)
		// relative random length based on lineage
		var factor = MathUtils.random(MathUtils.rel(1, 0.5, -2, 2, lineage), 1, 0.1)
		T.dist = dist * factor
		T._range = 120
		//
		T.points = []
		for (var i = 0; i < T.total; i++) {
			const perc = (T.dist / T.total) * i

			let extra = 0
			if (i > 0 && i < T.total - 1) {
				extra = MathUtils.toRadians(MathUtils.random(0, 20))
				if (T.points[i - 1] > 0) extra = -extra
			}

			const pt = MathUtils.getAnglePoint(from.x, from.y, perc, T._angle + extra)
			T.points.push(new Point(pt[0], pt[1]))
		}
		T.last = T.points[T.total - 1]
		//
		var min = lineage < 3 ? 1 : 0
		var max = lineage < 3 ? 3 : 0
		T.wanted = MathUtils.random(min, max)
		T.children = []
		//
		T.color = 'rgba(255,255,255,0.03)' // `rgb(${MathUtils.random(0, 255)},${MathUtils.random(0, 255)},0)`
		//
		T.tickIndex = 0
	}

	get range() {
		const half = this._range / 2
		return MathUtils.random(-half, half)
	}

	reset() {
		this.complete = false
		this.tickIndex = 0
		this.children.map(c => c.reset())
	}

	update() {
		const T = this

		T.tickIndex++
		const val = Math.min(T.tickIndex, T.points.length)

		let isComplete = false

		if (T.tickIndex < T.points.length * 3) {
			T.ctx.beginPath()

			for (var i = 0; i < val; i += 2) {
				const p = T.points[i]
				const p1 = T.points[i + 1]
				if (i == 0) {
					T.ctx.moveTo(p.x, p.y)
				}
				if (i > 0) {
					T.ctx.lineTo(p.x, p.y)
					if (p1) {
						T.ctx.lineTo(p1.x, p1.y)
					}
				}
			}
			T.ctx.lineWidth = MathUtils.rel(5, 1, 0, 2, T.lineage)
			T.ctx.strokeStyle = T.color
			T.ctx.lineJoin = 'round'
			T.ctx.stroke()
		} else {
			isComplete = true
		}
		if (T.tickIndex > T.points.length) {
			var allChildrenComplete = true
			T.children.forEach(c => {
				allChildrenComplete = c.update()
			})
		}

		return isComplete && allChildrenComplete
	}
}
