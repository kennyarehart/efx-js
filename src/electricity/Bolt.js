import { FrameRate } from '@ff0000-ad-tech/ad-events'
import LineSegment from './LineSegment'

export default class Bolt {
	constructor(canvas, from, angle, dist) {
		const T = this
		T.canvas = canvas
		T.ctx = canvas.context2d
		T.clearW = canvas.width
		T.clearH = canvas.height
		T.totalDist = dist
		T.angle = angle
		T.origin = from
		T.first = T.createSegment(T.ctx, from, angle, T.totalDist / 3, 0)
		T.isPlaying = false
		T.update()

		T._completeCallback = null
	}

	createSegment(...args) {
		var seg = new LineSegment(...args)
		var children = []
		for (var i = 0; i < seg.wanted; i++) {
			const newAngle = seg.angle + seg.range
			children.push(this.createSegment(this.ctx, seg.last, newAngle, seg.dist, seg.lineage + 1))
		}
		seg.children = children
		return seg
	}

	update() {
		const T = this
		const allComplete = T.first.update()

		if (allComplete) {
			T._completeCallback.call(T)
			T.reset()
			T.stop()
		}
	}

	play(callback) {
		const T = this
		T._completeCallback = callback
		if (!T.isPlaying) {
			T.isPlaying = true
			FrameRate.register(T, T.update, 60)
		}
	}

	stop() {
		console.log('Bolt.stop()')
		const T = this
		T._completeCallback = null
		if (T.isPlaying) {
			T.isPlaying = false
			FrameRate.unregister(T, T.update, 60)
		}
	}

	reset() {
		const T = this
		T.ctx.setTransform(1, 0, 0, 1, 0, 0)
		T.ctx.clearRect(0, 0, T.clearW, T.clearH)
		this.first.reset()
		// T.cd.clear()
	}
}
