export function glow(coord, cursor, a) {
  const dx = coord.x - cursor.x
  const dy = (coord.y - cursor.y) / a
  const dist = Math.sqrt(dx * dx + dy * dy)
  return Math.max(0, 1 - dist / 10)
}
