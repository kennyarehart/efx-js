import { rotatePointX, rotatePointY, rotatePointZ, scale } from './Transform'

// Single Path Object
export default class Path3d {
	constructor(og) {
		const T = this
		T.og = og
		T.live = []
		T.rx = 0
		T.ry = 0
		T.rz = 0
		T.scale = 1
		T.x = 0
		T.y = 0
		T.z = 0

		T.color = '255,255,255'
		T.alpha = 1
		T.size = 1

		//
		T.animIndex = 0
		T.dirY = 1
		T.dirX = 1
		T.dirZ = 1
		// T.dirRX = 1
		// T.dirRY = 1
		// T.dirRZ = 1
		//
		T.prev = {
			x: 0,
			y: 0,
			z: 0,
			scale: 1,
			rx: 0,
			ry: 0,
			rz: 0
		}
		T.init()
	}
	init() {
		const T = this
		for (var i = 0; i < T.og.length; i++) {
			T.live[i] = []
			for (var k = 0; k < T.og[i].length; k++) {
				T.live[i].push(T.og[i][k].slice())
			}
		}
	}

	render(ctx) {
		const p = this
		ctx.strokeStyle = 'rgba(' + p.color + ',' + p.alpha + ')'
		ctx.lineWidth = p.size
		ctx.beginPath()

		for (var i = 0; i < p.og.length; i++) {
			for (var k = 0; k < p.og[i].length; k++) {
				rotatePointX(p.live[i][k], p.prev.rx, p.rx)
				rotatePointY(p.live[i][k], p.prev.ry, p.ry)
				rotatePointZ(p.live[i][k], p.prev.rz, p.rz)
				scale(p.live[i][k], p.prev.scale, p.scale)
			}
			p.plotPoints(ctx, i)
		}

		p.prev.rx = p.rx
		p.prev.ry = p.ry
		p.prev.rz = p.rz
		p.prev.scale = p.scale

		ctx.stroke()
	}

	plotPoints(ctx, j) {
		const p = this
		if (j === 0) ctx.moveTo(p.live[0][0][0] + p.x, p.live[0][0][1] + p.y)
		else
			ctx.bezierCurveTo(
				p.live[j][0][0] + p.x,
				p.live[j][0][1] + p.y,
				p.live[j][1][0] + p.x,
				p.live[j][1][1] + p.y,
				p.live[j][2][0] + p.x,
				p.live[j][2][1] + p.y
			)
	}
}
