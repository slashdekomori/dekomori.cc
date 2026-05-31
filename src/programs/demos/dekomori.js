import { mergeText } from '/src/modules/buffer.js'
import { background } from './dekomori/bg-time.js'
// import { glow } from '/src/modules/cursor-effects/glow.js'
import { ripple, addRipple } from '/src/modules/cursor-effects/ripple.js'

export const settings = {
  backgroundColor : 'black',
  color           : '#ccc',
  fps             : 30,
}

const { floor } = Math

export function main(coord, context, cursor, buffer) {
  const a = context.metrics.aspect
  const t = context.time * 0.0005

  const bg = background(coord, context, cursor, buffer)

  // const g = glow(coord, cursor, a)
  const r = ripple(coord, context, a)

  const b = 22 + r * 50

  return {
    char  : bg.char,
    color : `hsl(0, 0%, ${b}%)`,
  }
}

const links = [
  { text : 'github',  url : 'https://github.com/slashdekomori',              x : 0  },
  { text : 'youtube', url : 'https://www.youtube.com/@slashdekomori/shorts', x : 10 },
  { text : 'twitter', url : 'https://x.com/slashdekomori',                   x : 21 },
]

export function pointerDown(context, cursor, buffer) {
  const cy = floor(context.rows / 2)
  const linkRow = cy + 4
  if (floor(cursor.y) === linkRow) {
    const cx = floor(cursor.x)
    const linkStart = floor(context.cols / 2) - 14
    for (const link of links) {
      const x1 = linkStart + link.x
      const x2 = x1 + link.text.length
      if (cx >= x1 && cx < x2) {
        window.open(link.url, '_blank')
        return
      }
    }
  }
  addRipple(cursor.x, cursor.y, context.time)
}

export function post(context, cursor, buffer) {
  const cols = context.cols
  const rows = context.rows
  const cx = floor(cols / 2)
  const cy = floor(rows / 2)

  mergeText({
    text  : 'slashdekomori',
    color : '#fff',
  }, cx - 7, cy - 1, buffer, cols, rows)

  mergeText({
    text  : 'developer & artist',
    color : '#666',
  }, cx - 10, cy + 1, buffer, cols, rows)

  const linkRow = cy + 4
  const linkStart = cx - 14
  const hx = floor(cursor.x)
  const hy = floor(cursor.y)

  for (const link of links) {
    const x1 = linkStart + link.x
    const over = hy === linkRow && hx >= x1 && hx < x1 + link.text.length
    mergeText({
      text  : link.text,
      color : over ? '#aaa' : '#777',
    }, x1, linkRow, buffer, cols, rows)
  }
}
