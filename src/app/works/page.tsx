import WorkCard from '@/components/WorkCard'

const PROJECTS = [
  { title: 'Project Alpha', blurb: 'placeholder one-line description of the project', tags: ['product', 'lead design'], year: '2023' },
  { title: 'Project Beta', blurb: 'placeholder one-line description of the project', tags: ['0→1', 'systems'], year: '2024' },
  { title: 'Project Gamma', blurb: 'placeholder one-line description of the project', tags: ['research', 'ai'], year: '2024' },
  { title: 'Project Delta', blurb: 'placeholder one-line description of the project', tags: ['mobile'], year: '2023' },
]

export default function WorksPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      <h1 className="font-display text-3xl font-semibold text-ink-primary md:text-5xl">Selected Works</h1>
      <p className="mt-3 max-w-xl font-mono text-sm text-ink-muted md:text-base">
        a handful of shipped products and the systems behind them
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        {PROJECTS.map((project, i) => (
          <WorkCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </div>
  )
}
