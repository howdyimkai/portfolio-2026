# Rake groove look — decided from /proto/groove (2026-10-24)

Reference: `design-intent/zenvideorake-example.mp4`, a digital zen garden where a
7-tine rake follows a tiled path. Sampled across its grooves, each groove is a soft
valley about half the tine gap wide, roughly 15% darker than the sand, fading out
gradually instead of ending in a crisp edge.

- Direction: soft valley, not the crisp dark pinstripe
- Valley core width 1.6px, depth 0.24 (peak alpha of rgba(70,55,38))
- Softness 0.8px: a faint halo either side, drawn as a wider stroke at 0.45 × depth under
  a core at 0.6 × depth. Two plain strokes, no blur filter
- Light lip kept, at alpha 0.21 (was 0.5), 1.2px wide, 1px toward the top-left
- Rake and eraser cursors 20% larger (40px → 48px), so tine pitch 4.4 → 5.28px and
  erase radius 28 → 33.6px; blossom unchanged at 40px
- Hold 10s then fade 3s is unchanged; the reference keeps marks forever, and we don't

Rejected:
- Today's pinstripe (1.5px dark at 0.32 plus a 0.5 light line): reads as drawn lines,
  not shapes pressed into sand
- Softness via `ctx.filter = blur()`: looked right, but re-blurring every live chunk
  every frame made the rake lag behind the pointer, and dropped frames made turns
  look angular. The stacked halo + core gives the same falloff at 60fps
- The reference's 7 tines and wide spacing: the 4-prong rake asset sets our groove scale
