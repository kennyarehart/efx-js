// Point3d Transformations

// cache pre-calculated angles
var cCos = {}
var cSin = {}
var x, y, z, a, c, s

export function rotatePointX(point3d, prevAngle, newAngle) {
	if (prevAngle === newAngle) return
	rotate(point3d, prevAngle, newAngle, 0)
}

export function rotatePointY(point3d, prevAngle, newAngle) {
	if (prevAngle === newAngle) return
	rotate(point3d, prevAngle, newAngle, 1)
}

export function rotatePointZ(point3d, prevAngle, newAngle) {
	if (prevAngle === newAngle) return
	rotate(point3d, prevAngle, newAngle, 2)
}

/* p : point3d, o : oldPoint, n : newPoint, v : vector plane */
function rotate(p, o, n, v) {
	//if ( o === n ) return;
	a = n - o
	c = cCos[a] || Math.cos(a)
	s = cSin[a] || Math.sin(a)
	cCos[a] = c
	cSin[a] = s
	x = p.x //p[0]
	y = p.y //p[1]
	z = p.z //p[2]

	switch (v) {
		case 0: // X
			p.y /*p[1]*/ = y * c + z * s
			p.z /*p[2]*/ = y * -s + z * c
			break
		case 1: // Y
			p.x /*p[0]*/ = x * c + z * s
			p.z /*p[2]*/ = x * -s + z * c
			break
		case 2: // Z
			p.x /*p[0]*/ = x * c + y * s
			p.y /*p[1]*/ = x * -s + y * c
			break
	}
}

/* p : point3d, o : oldPoint, n : newPoint */
export function scale(p, o, n) {
	if (o === n) return
	x = p.x // p[0]
	y = p.y //p[1]
	z = p.z //p[2]
	/*p[0]*/ p.x = (x * n) / o
	/*p[1]*/ p.y = (y * n) / o
	/*p[2]*/ p.z = (z * n) / o
}
