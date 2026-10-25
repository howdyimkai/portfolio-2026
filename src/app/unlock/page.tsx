import type { Metadata } from 'next'
import Image from 'next/image'
import UnlockForm from './UnlockForm'
import { safeNext } from '@/lib/unlock'

export const metadata: Metadata = {
  title: 'Come on in',
  robots: { index: false, follow: false },
}

// Where src/proxy.ts sends anyone without the case study cookie. White grid paper, no shelf nav:
// reviewers arrive here from a direct link and only need the one field.
export default async function UnlockPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-[360px] rounded-2xl border border-hairline bg-page p-8 shadow-[0_1px_2px_rgba(61,50,38,0.08),0_8px_24px_rgba(61,50,38,0.08)]">
        <Image
          src="/about/cassette.webp"
          alt=""
          width={361}
          height={272}
          draggable={false}
          priority
          className="mx-auto mb-5 h-auto w-[120px]"
        />
        <h1 className="mb-2 text-center text-[18px] text-ink-primary">This one&apos;s private for now</h1>
        <p className="mb-6 text-center text-[13px] leading-relaxed text-ink-body">
          Pop in the password Kai sent you.
        </p>
        <UnlockForm next={safeNext(next)} />
      </div>
    </div>
  )
}
