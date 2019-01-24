import { CanvasDrawer, CanvasImage } from '@ff0000-ad-tech/ad-canvas'
import { UICanvas } from '@ff0000-ad-tech/ad-ui'
import colors from '../colors'

export default class Composer {
	constructor(target) {
		const T = this
		T.target = target
		T.boltCanvases = []

		T.cd_pre = new CanvasDrawer({
			id: 'bolts-precomp',
			// target: target,
			css: {
				width: target.width,
				height: target.height
			}
		})
		T.cd = new CanvasDrawer({
			id: 'bolts-CD',
			target: target,
			css: {
				width: target.width,
				height: target.height
			}
		})

		new CanvasImage({
			target: T.cd,
			source: T.cd_pre,
			params: {
				alpha: 1
			},
			dropShadow: {
				color: colors.bolt[0],
				blur: 5
			}
		})
		new CanvasImage({
			target: T.cd,
			source: T.cd_pre,
			dropShadow: {
				color: colors.bolt[1],
				blur: 20
			}
		})
		new CanvasImage({
			target: T.cd,
			source: T.cd_pre,
			dropShadow: {
				color: colors.bolt[2],
				blur: 10
			}
		})
	}

	update() {
		const T = this
		T.cd_pre.update()
		T.cd.update()
	}

	add() {
		const T = this
		const c = new UICanvas({
			// target: T.target,
			id: 'bolt-canvas-' + T.boltCanvases.length,
			css: {
				width: T.target.width,
				height: T.target.height
			}
		})
		T.boltCanvases.push(c)
		new CanvasImage({
			target: T.cd_pre,
			source: c
		})
		return c
	}
}
