import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Kai Tran, designer and tinkerer'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: '#f4f4f4',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <h1 style={{ fontSize: 72, color: '#333333' }}>Kai Tran</h1>
          <p style={{ fontSize: 36, color: '#666666' }}>
            Designer and tinkerer. I make learning feel like play.
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}