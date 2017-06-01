function imgdye(e,t,l){var o=document.createElement("canvas");o.width=e.width,o.height=e.height;var a=o.getContext("2d");return t&&(a.fillStyle=t),l!=null&&(a.globalAlpha=l),a.fillRect(0,0,o.width,o.height),a.globalCompositeOperation="destination-atop",a.globalAlpha=1,a.drawImage(e,0,0),o}"object"==typeof module&&(module.exports=imgdye);

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')

window.onresize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
window.onresize()

const OFFSET = 12
const rings = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET },
    { x: 0, y: OFFSET }
]

const RING_SPACING = 50

function LightenDarkenColor(col, amt) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}

const RADIUS = Math.min(window.innerWidth, window.innerHeight) / 2 - 50
const ringTexture = document.createElement('canvas')
ringTexture.width = 4 * RADIUS
ringTexture.height = 4 * RADIUS
const ringTextureCtx = ringTexture.getContext('2d')
ringTextureCtx.fillStyle = 'white'
ringTextureCtx.fillRect(0, 0, ringTexture.width, ringTexture.height)
ringTextureCtx.globalCompositeOperation = 'destination-out'
ringTextureCtx.arc(2 * RADIUS, 2 * RADIUS, RADIUS, 0, 2 * Math.PI)
ringTextureCtx.fill()

const memoizeCache = {}
function memoizedImgDye (source, color, opacity) {
    const cached = memoizeCache[opacity]
    if (cached) return cached
    const result = imgdye(source, color, opacity)
    memoizeCache[opacity] = result
    return result
}

function renderRing(i, xt = 0, yt = 0) {
    const ring = rings[i]
    if (!ring) return

    ctx.save()
    ctx.translate(xt + ring.x, yt + ring.y)
    ctx.scale(0.8, 0.8)
    renderRing(i + 1, xt + ring.x, yt + ring.y)
    ctx.restore()
    
    // render the actual ring
    // ctx.beginPath()
    ctx.drawImage(
        memoizedImgDye(
            ringTexture,
            '#ff00ff',
            Math.min(1, Math.max(0, i / 20))
        ),
        -2 * RADIUS,
        -2 * RADIUS
    )
    /*
    ctx.rect(0 - RADIUS, 0 - RADIUS, 2 * RADIUS, 2 * RADIUS)
    ctx.moveTo(RADIUS, 0)
    ctx.arc(0, 0, 450, 0, 2 * Math.PI)
    ctx.strokeStyle = LightenDarkenColor('#ff00ff', - i * 10)
    ctx.lineWidth = 50
    ctx.stroke()
    */
}

let last = Date.now()
let adv = 0
function render () {
    ctx.save()
    
    // clear screen
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    ctx.translate(window.innerWidth / 2, window.innerHeight / 2)

    adv++
    if (adv > 200) {
        adv = 0
        rings.shift()
    }
    const proximityScale = 0.8 + 0.2 * adv / 200
    // ctx.scale(proximityScale, proximityScale)
    renderRing(0)

    ctx.restore()

    const now = Date.now()
    const delta = now - last
    const fps = Math.floor(1000 / delta)
    ctx.fillStyle = 'magenta'
    ctx.font = '30px monospace'
    ctx.fillText(`${fps} FPS`, 50, 50)
    last = now
}

function mainloop () {
    requestAnimationFrame(mainloop)
    render()
}
mainloop()