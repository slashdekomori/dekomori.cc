/**
@author ertdfgcvb
@title  Dyna
@desc   A remix of Paul Haeberli’s Dynadraw

The original from 1989:
http://www.graficaobscura.com/dyna/
*/

import { copy, length, vec2, add, sub, divN, mulN } from '/src/modules/vec2.js'
import { smoothstep } from '/src/modules/num.js'


export const settings = { fps : 60 }

const MASS = 20   // Pencil mass
const DAMP = 0.95 // Pencil damping
const RADIUS = 15 // Pencil radius

let cols, rows

// -----------------------------------------------------------------------------
// BACKGROUND / DYNA LOGIC
// -----------------------------------------------------------------------------

export function pre(context, cursor, buffer) {

	// Detect window resize
	if (cols != context.cols || rows != context.rows) {
		cols = context.cols
		rows = context.rows
		for (let i = 0; i < cols * rows; i++) {
			buffer[i].value = 0
		}
	}

	const a = context.metrics.aspect

	dyna.update(cursor)

	// Line between current and previous position
	const points = line(dyna.pos, dyna.pre)

	for (const p of points) {
		const sx = Math.max(0, p.x - RADIUS)
		const ex = Math.min(cols, p.x + RADIUS)
		const sy = Math.floor(Math.max(0, p.y - RADIUS * a))
		const ey = Math.floor(Math.min(rows, p.y + RADIUS * a))

		for (let j = sy; j < ey; j++) {
			for (let i = sx; i < ex; i++) {
				const x = (p.x - i)
				const y = (p.y - j) / a
				const l = 1 - length({ x, y }) / RADIUS
				const idx = i + cols * j
				buffer[idx].value = Math.max(buffer[idx].value, l)
			}
		}
	}
}

// -----------------------------------------------------------------------------
// RENDER
// -----------------------------------------------------------------------------

const density = ' .:░▒▓█Ñ#+-'.split('')

export function main(coord, context, cursor, buffer) {
	const i = coord.index
	const v = smoothstep(0, 0.9, buffer[i].value)
	buffer[i].value *= 0.99
	const idx = Math.floor(v * (density.length - 1))
	return density[idx]
}

// -----------------------------------------------------------------------------
// STATIC TEXT OVERLAY (TOP LAYER)
// -----------------------------------------------------------------------------

function drawText(buffer, context, x, y, text) {
	const cols = context.cols
	const rows = context.rows

	for (let i = 0; i < text.length; i++) {
		const cx = Math.floor(x + i)
		if (cx < 0 || cx >= cols || y < 0 || y >= rows) continue
		const idx = cx + cols * y
		buffer[idx].char = text[i]
		buffer[idx].value = 1
	}
}

export function post(context, cursor, buffer) {

	// Optional info box

	// Centered static text
	const cx = Math.floor(context.cols / 2)
	const cy = Math.floor(context.rows / 2)
  drawText(buffer, context, 5, 1, 'DYNA')
	const title = 'DYNA'
	const subtitle = 'move your mouse'

	drawText(buffer, context, cx - title.length / 2, cy - 1, title)
	drawText(buffer, context, cx - subtitle.length / 2, cy + 1, subtitle)
}

// -----------------------------------------------------------------------------
// DYNA CLASS
// -----------------------------------------------------------------------------

class Dyna {
	constructor(mass, damp) {
		this.pos = vec2(0, 0)
		this.vel = vec2(0, 0)
		this.pre = vec2(0, 0)
		this.mass = mass
		this.damp = damp
	}
	update(cursor) {
		const force = sub(cursor, this.pos)
		const acc = divN(force, this.mass)
		this.vel = mulN(add(this.vel, acc), this.damp)
		this.pre = copy(this.pos)
		this.pos = add(this.pos, this.vel)
	}
}

const dyna = new Dyna(MASS, DAMP)

// -----------------------------------------------------------------------------
// BRESENHAM LINE
// -----------------------------------------------------------------------------

function line(a, b) {
	let x0 = Math.floor(a.x)
	let y0 = Math.floor(a.y)
	const x1 = Math.floor(b.x)
	const y1 = Math.floor(b.y)
	const dx = Math.abs(x1 - x0)
	const dy = -Math.abs(y1 - y0)
	const sx = x0 < x1 ? 1 : -1
	const sy = y0 < y1 ? 1 : -1
	let err = dx + dy

	const points = []

	while (true) {
		points.push({ x: x0, y: y0 })
		if (x0 === x1 && y0 === y1) break
		const e2 = 2 * err
		if (e2 >= dy) {
			err += dy
			x0 += sx
		}
		if (e2 <= dx) {
			err += dx
			y0 += sy
		}
	}
	return points
}
