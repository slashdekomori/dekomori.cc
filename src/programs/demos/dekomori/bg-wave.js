// @%#*+=-:.
// .:-=+*#%@
const density = ' .:-=+*#%@%#*+=-:. '

const { sin, cos, floor } = Math

export function background(coord, context, cursor, buffer) {
  const t = context.time * 0.0005
  const m = Math.min(context.cols, context.rows)
  const a = context.metrics.aspect

  const x = 2.0 * (coord.x - context.cols / 2) / m * a
  const y = 2.0 * (coord.y - context.rows / 2) / m

  const dx = coord.x - cursor.x
  const dy = (coord.y - cursor.y) / a
  const dist = Math.sqrt(dx * dx + dy * dy)

  const warp = Math.max(0, 1 - dist / 5) * 0.4
  const phase = sin(dx * 0.8 + t * 3) * cos(dy * 0.6) * warp

  const v1 = sin(x * 3 + t * 1.1 + phase) * cos(y * 2 + t * 0.7)
  const v2 = sin((x + y) * 2 + t * 0.9 + phase)
  const v = (v1 + v2) * 0.5 + 0.5

  const idx = floor(v * (density.length - 1))

  return { char: density[idx] }
}
