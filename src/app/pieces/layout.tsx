import { notFound } from 'next/navigation'

// /pieces/* show one part of the site on its own, for recordings. Reachable locally and on Vercel
// previews, and a 404 on the production deployment.
export default function PiecesLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === 'production') notFound()
  return children
}
