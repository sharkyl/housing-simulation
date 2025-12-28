import React, { useEffect, useRef } from 'react'

const MODEL = {
  laffer: { scale: 100, p: 1.0 },
  Nmin: 5,
  Nmax: 100,
  overheadBroad: 0.06,
  overheadNarrow: 0.02,
  utility: {
    scale: 1.2,
  },
}

const clamp01 = (x) => Math.max(0, Math.min(1, x))

const TradeoffsModel = () => {
  const breadthInputRef = useRef(null)
  const taxInputRef = useRef(null)
  const breadthLabelRef = useRef(null)
  const taxLabelRef = useRef(null)
  const revOutRef = useRef(null)
  const peopleOutRef = useRef(null)
  const helpOutRef = useRef(null)
  const impactOutRef = useRef(null)
  const lafferCanvasRef = useRef(null)
  const allocCanvasRef = useRef(null)

  useEffect(() => {
    const breadthEl = breadthInputRef.current
    const taxEl = taxInputRef.current
    const breadthLabel = breadthLabelRef.current
    const taxLabel = taxLabelRef.current
    const revOut = revOutRef.current
    const peopleOut = peopleOutRef.current
    const helpOut = helpOutRef.current
    const impactOut = impactOutRef.current
    const lafferCanvas = lafferCanvasRef.current
    const allocCanvas = allocCanvasRef.current
    const lafferCtx = lafferCanvas.getContext('2d')
    const allocCtx = allocCanvas.getContext('2d')

    const lafferRevenue = (t01) => {
      const t = clamp01(t01)
      const p = MODEL.laffer.p
      return MODEL.laffer.scale * (t * (1 - Math.pow(t, p)))
    }

    const peopleServed = (breadth01) => {
      const b = clamp01(breadth01)
      return MODEL.Nmin + (MODEL.Nmax - MODEL.Nmin) * b
    }

    const overheadFactor = (breadth01) => {
      const b = clamp01(breadth01)
      return 1 + MODEL.overheadBroad * b + MODEL.overheadNarrow * (1 - b)
    }

    const helpPerPerson = (revenue, breadth01) => {
      const N = peopleServed(breadth01)
      const overhead = overheadFactor(breadth01)
      const effectiveBudget = revenue / overhead
      return effectiveBudget / N
    }

    const utilityPerPerson = (help) => {
      const s = MODEL.utility.scale
      return 1 - Math.exp(-help / s)
    }

    const totalImpact = (revenue, breadth01) => {
      const N = peopleServed(breadth01)
      const h = helpPerPerson(revenue, breadth01)
      return N * utilityPerPerson(h)
    }

    const fitCanvas = (canvas, ctx, cssH = 330) => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const w = canvas.clientWidth || canvas.parentElement.clientWidth
      canvas.style.height = `${cssH}px`
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const clear = (ctx, w, h) => ctx.clearRect(0, 0, w, h)

    const drawAxes = (ctx, plot, xLabel, yLabel) => {
      const { x0, y0, w, h } = plot
      ctx.strokeStyle = '#202532'
      ctx.lineWidth = 1
      ctx.strokeRect(x0, y0, w, h)

      ctx.strokeStyle = '#2a2f3a'
      ctx.beginPath()
      const gridN = 5
      for (let i = 1; i < gridN; i++) {
        const gx = x0 + (w * i) / gridN
        const gy = y0 + (h * i) / gridN
        ctx.moveTo(gx, y0)
        ctx.lineTo(gx, y0 + h)
        ctx.moveTo(x0, gy)
        ctx.lineTo(x0 + w, gy)
      }
      ctx.stroke()

      ctx.fillStyle = '#aab3c2'
      ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(xLabel, x0 + 8, y0 + h + 22)

      ctx.save()
      ctx.translate(x0 - 30, y0 + h / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.textAlign = 'center'
      ctx.fillText(yLabel, 0, 0)
      ctx.restore()
    }

    const drawLine = (ctx, points, stroke = '#e9eef7', width = 2) => {
      if (!points.length) return
      ctx.strokeStyle = stroke
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
      ctx.stroke()
    }

    const drawDot = (ctx, x, y, r = 5, fill = '#e9eef7') => {
      ctx.fillStyle = fill
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawVGuide = (ctx, x, plot) => {
      ctx.strokeStyle = '#aab3c2'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, plot.y0)
      ctx.lineTo(x, plot.y0 + plot.h)
      ctx.stroke()
    }

    const drawText = (ctx, x, y, text, color = '#e9eef7', align = 'left') => {
      ctx.fillStyle = color
      ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif'
      ctx.textAlign = align
      ctx.fillText(text, x, y)
    }

    const render = () => {
      const breadth = Number(breadthEl.value)
      const tax = Number(taxEl.value)
      const breadth01 = breadth / 100
      const tax01 = tax / 100

      fitCanvas(lafferCanvas, lafferCtx, 360)
      fitCanvas(allocCanvas, allocCtx, 360)

      breadthLabel.textContent =
        breadth <= 10
          ? 'Concentrated (few people)'
          : breadth >= 90
          ? 'Broad (many people)'
          : `Mix (${breadth} / 100)`

      taxLabel.textContent = `${tax}%`

      const revenue = lafferRevenue(tax01)
      const N = peopleServed(breadth01)
      const h = helpPerPerson(revenue, breadth01)
      const impact = totalImpact(revenue, breadth01)

      revOut.textContent = `${revenue.toFixed(2)} units`
      peopleOut.textContent = `${N.toFixed(0)} people (relative)`
      helpOut.textContent = `${h.toFixed(3)} units/person`
      impactOut.textContent = `${impact.toFixed(1)} impact units`

      const W1 = lafferCanvas.clientWidth || lafferCanvas.parentElement.clientWidth
      const H1 = lafferCanvas.clientHeight || 360
      const plot1 = { x0: 46, y0: 16, w: W1 - 66, h: H1 - 54 }

      clear(lafferCtx, W1, H1)
      drawAxes(lafferCtx, plot1, 'Tax rate → (0% to 100%)', 'Tax revenue ↑')

      const steps = 220
      const Rs = new Array(steps + 1)
      let maxR = 0
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const r = lafferRevenue(t)
        Rs[i] = r
        if (r > maxR) maxR = r
      }

      const pts1 = []
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const r = Rs[i]
        const x = plot1.x0 + t * plot1.w
        const y = plot1.y0 + plot1.h - (r / (maxR || 1)) * plot1.h
        pts1.push({ x, y })
      }
      drawLine(lafferCtx, pts1, '#e9eef7', 2)

      const xTax = plot1.x0 + tax01 * plot1.w
      const yTax = plot1.y0 + plot1.h - (revenue / (maxR || 1)) * plot1.h
      drawVGuide(lafferCtx, xTax, plot1)
      drawDot(lafferCtx, xTax, yTax, 5, '#e9eef7')
      drawText(lafferCtx, xTax + 8, yTax - 8, `(${tax}%, ${revenue.toFixed(2)})`, '#e9eef7', 'left')

      let peakI = 0
      for (let i = 1; i < Rs.length; i++) if (Rs[i] > Rs[peakI]) peakI = i
      const peakT = peakI / steps
      const peakR = Rs[peakI]
      const xPeak = plot1.x0 + peakT * plot1.w
      const yPeak = plot1.y0 + plot1.h - (peakR / (maxR || 1)) * plot1.h
      drawDot(lafferCtx, xPeak, yPeak, 4, '#aab3c2')
      drawText(lafferCtx, xPeak, plot1.y0 + 12, 'Peak revenue', '#aab3c2', 'center')

      const W2 = allocCanvas.clientWidth || allocCanvas.parentElement.clientWidth
      const H2 = allocCanvas.clientHeight || 360
      const plot2 = { x0: 46, y0: 16, w: W2 - 66, h: H2 - 54 }

      clear(allocCtx, W2, H2)
      drawAxes(allocCtx, plot2, 'Service distribution breadth → (few → many)', 'Average help/person ↑')

      const steps2 = 240
      let maxH = 0
      const Hs = new Array(steps2 + 1)
      for (let i = 0; i <= steps2; i++) {
        const b = i / steps2
        const hh = helpPerPerson(revenue, b)
        Hs[i] = hh
        if (hh > maxH) maxH = hh
      }

      const pts2 = []
      for (let i = 0; i <= steps2; i++) {
        const b = i / steps2
        const hh = Hs[i]
        const x = plot2.x0 + b * plot2.w
        const y = plot2.y0 + plot2.h - (hh / (maxH || 1)) * plot2.h
        pts2.push({ x, y })
      }
      drawLine(allocCtx, pts2, '#e9eef7', 2)

      const xB = plot2.x0 + breadth01 * plot2.w
      const yB = plot2.y0 + plot2.h - (h / (maxH || 1)) * plot2.h
      drawVGuide(allocCtx, xB, plot2)
      drawDot(allocCtx, xB, yB, 5, '#e9eef7')
      drawText(allocCtx, xB + 8, yB - 8, `(${breadth}%, ${h.toFixed(3)})`, '#e9eef7', 'left')

      drawText(allocCtx, plot2.x0, plot2.y0 + plot2.h + 38, 'Concentrated: fewer people, deeper help', '#aab3c2', 'left')
      drawText(
        allocCtx,
        plot2.x0 + plot2.w,
        plot2.y0 + plot2.h + 38,
        'Broad: more people, shallower help',
        '#aab3c2',
        'right',
      )
    }

    breadthEl.addEventListener('input', render)
    taxEl.addEventListener('input', render)
    window.addEventListener('resize', render)
    render()

    return () => {
      breadthEl.removeEventListener('input', render)
      taxEl.removeEventListener('input', render)
      window.removeEventListener('resize', render)
    }
  }, [])

  return (
    <div className="tradeoffs-wrap page-shell">
      <div className="tradeoffs-header">
        <div className="kicker">Concept model</div>
        <h1 className="page-title">Public Health Allocation Tradeoffs</h1>
        <p className="page-subtitle">
          Adjust service breadth and tax rates to explore revenue, depth of help, and the optional impact score. Use this as a conversation aid, not a forecast.
        </p>
        <p className="page-subtitle">
        This is a conceptual toy model. It shows tradeoffs under scarcity: Tax rate → revenue (via a hump-shaped Laffer curve), and Breadth → help-per-person (more people served means less help per person, under a fixed budget). The “impact score” is an optional nonlinear utility measure (diminishing returns on help depth) so you can summarize breadth + depth into a single number without claiming an “objective” optimum.
        </p>
      </div>

      <div className="tradeoffs-card">
        <div className="controls-grid">
          <div className="control-row">
            <label>
              <span>Service distribution (breadth)</span>
              <span className="value" ref={breadthLabelRef}></span>
            </label>
            <input id="breadth" ref={breadthInputRef} type="range" min="0" max="100" defaultValue="55" />
          </div>

          <div className="control-row">
            <label>
              <span>Tax rate</span>
              <span className="value" ref={taxLabelRef}></span>
            </label>
            <input id="tax" ref={taxInputRef} type="range" min="0" max="100" defaultValue="35" />
          </div>

          <div className="divider"></div>

          <div className="tradeoffs-stats">
            <div className="stat-pill">
              <div className="k">Estimated tax revenue (Laffer)</div>
              <div className="v" ref={revOutRef}></div>
            </div>
            <div className="stat-pill">
              <div className="k">Estimated people served (relative units)</div>
              <div className="v" ref={peopleOutRef}></div>
            </div>
            <div className="stat-pill">
              <div className="k">Average help per person</div>
              <div className="v" ref={helpOutRef}></div>
            </div>
            <div className="stat-pill">
              <div className="k">Total “impact” score (optional utility)</div>
              <div className="v" ref={impactOutRef}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="tradeoffs-row">
        <div className="tradeoffs-card">
          <div className="tradeoffs-label">Laffer curve: Tax rate (x) vs tax revenue (y)</div>
          <canvas id="laffer" ref={lafferCanvasRef}></canvas>
        </div>

        <div className="tradeoffs-card">
          <div className="tradeoffs-label">Allocation frontier: Breadth (x) vs average help per person (y)</div>
          <canvas id="alloc" ref={allocCanvasRef}></canvas>
        </div>
      </div>
    </div>
  )
}

export default TradeoffsModel
