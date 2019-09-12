# efx-js

A single repository to store experimentations with computational animations. Current working experiments:

-   Lightning
-   Vapor: a smoke-like twisting vapor cloud effect

### Usage

```
import { Vapor, Lightning } from 'efx-js'
```

Create a canvas or simply target an existing one

```
const canvas = document.createElement('canvas')
canvas.setAttribute('width', 400)
canvas.setAttribute('height', 400)
`PARENT ELEMENT`.appendChild(canvas)
```

Vapor

```
const v = new Vapor(canvas, {
    width: 300,
    height: 250,
    origin: {
        x: 150,
        y: 125
    }
})
v.play()
```

Lightning

```
const l = new Lightning(`PARENT ELEMENT`)
l.play()
```
