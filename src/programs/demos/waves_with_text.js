// ===============================
// CONFIG
// ===============================
const pattern = 'ABCxyz01═|+:. '

// ===============================
// BACKGROUND LAYER
// ===============================
function background(coord, context) {
  const t = context.time * 0.0001
  const x = coord.x
  const y = coord.y
  const o = Math.sin(y * Math.sin(t) * 0.2 + x * 0.04 + t) * 20
  const i = Math.round(Math.abs(x + y + o)) % pattern.length

  return {
    char: pattern[i],
    color: '#555',
    fontWeight: '100',
  }
}

// ===============================
// TEXT SYSTEM
// ===============================
const textPixels = new Map()

function addText(text, x, y, options = {}) {
  for (let i = 0; i < text.length; i++) {
    textPixels.set(
      `${x + i},${y}`,
      {
        char: text[i],
        color: options.color || 'cyan',
        fontWeight: options.fontWeight || 'bold',
      }
    )
  }
}

// ===============================
// DEFINE YOUR TEXT HERE
// ===============================
addText("                ", 5, 1, { color: 'white' })
addText("                ", 5, 2, { color: 'white' })

// ===============================
// FOREGROUND TEXT LAYER
// ===============================
function textLayer(coord) {
  return textPixels.get(`${coord.x},${coord.y}`) || null
}

// ===============================
// MAIN (LAYER COMPOSITION)
// ===============================
export function main(coord, context) {
  const fg = textLayer(coord)
  if (fg) return fg

  return background(coord, context)
}
