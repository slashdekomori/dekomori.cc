// Expanding ring brightness on click (0–1)

const ripples = []

export function ripple(coord, context, a) {
  let val = 0
  for (const r of ripples) {
    const age = context.time - r.t
    if (age > 1500) continue
    const dx = coord.x - r.x
    const dy = (coord.y - r.y) / a
    const dist = Math.sqrt(dx * dx + dy * dy)
    const radius = age * 0.08
    const ring = Math.abs(dist - radius)
    const rw = 0.5 + age * 0.002
    const ripp = Math.max(0, 1 - ring / rw) * (1 - age / 1500)
    val = Math.max(val, ripp)
  }
  return val
}

export function addRipple(x, y, time) {
  if (ripples.length > 10) ripples.shift()
  ripples.push({ x, y, t: time })
}
