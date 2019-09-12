import { rotatePointX, rotatePointY, rotatePointZ, scale } from './Transform'
import { Matrix3D } from 'ad-geom'
import Point from './Point'

// Single Path Object
export default class Path3d {
	constructor(og, props) {
		const T = this
		T.og = og
		T.live = []

		T.x = props.x || 0
		T.y = props.y || 0

		// currently doesn't do anything; perhaps scale replace with z?
		T.z = props.z || 0

		T.scale = 1
		T.rx = 0
		T.ry = 0
		T.rz = 0

		T.color = '255,255,255'
		T.alpha = 1
		T.size = 1

		T.dirY = 1
		T.dirX = 1
		T.dirZ = 1

		T.matrix = new Matrix3D()

		T.prev = {
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
				const [x, y] = T.og[i][k]
				T.live[i].push(new Point(x, y))
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
				// console.log(i, k, p.live[i][k], p.rx)
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
		if (j === 0) ctx.moveTo(p.live[0][0].x + p.x, p.live[0][0].y + p.y)
		else
			ctx.bezierCurveTo(
				p.live[j][0].x + p.x,
				p.live[j][0].y + p.y,
				p.live[j][1].x + p.x,
				p.live[j][1].y + p.y,
				p.live[j][2].x + p.x,
				p.live[j][2].y + p.y
			)
	}
}
