// /play: the playground title and the tile grid ("Gallery", picked from /proto/play on 2026-11-02;
// decision record design-intent/play-exploration/NOTES.md).
import { ITEMS } from './items'
import Piece from './Piece'
import './play.css'

// Kai's hand-drawn title (playground/artifacts/playground-header), a 7-drawing line boil shipped like
// the hero's: a sprite strip in 1-4-2-6-3-7-5 order that rests on its first drawing and boils only
// while hovered.
function Title() {
  return (
    <h1 className="pl-title">
      <span className="sr-only">playground</span>
      <span className="pl-title-art" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/play/playground-title-boil.webp" alt="" width={4200} height={198} draggable={false} className="pl-title-strip title-boil" />
      </span>
    </h1>
  )
}

export default function PlayGrid() {
  return (
    <>
      <Title />
      <div className="pl-grid">
        {ITEMS.map((it, i) => (
          <figure key={it.id} className={`pl-item ${it.wide ? 'pl-wide' : ''}`}>
            <div className={`pl-tile pl-m-${it.id}`} style={it.surface ? { backgroundColor: it.surface } : undefined}>
              {/* The first row loads right away; everything below waits until it's near. */}
              <Piece name={it.name} piece={it.piece} eager={i < 2} />
            </div>
            <figcaption className="pl-cap">
              <span className="pl-cap-row">
                <span className="pl-name">{it.name}</span>
                <span className="pl-meta">
                  {it.type} · {it.year}
                </span>
              </span>
              {it.line && <span className="pl-line">{it.line}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  )
}
