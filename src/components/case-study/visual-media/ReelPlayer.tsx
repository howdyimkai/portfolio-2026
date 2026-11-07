import YouTube from '../YouTube'

// The page's hero (visual media case study): the reel, click to load like Brand System's episode, so
// nothing from YouTube loads until someone presses play. The 150 MB master stays on YouTube. The
// still is the teaser's first frame, and the teaser plays muted on hover or focus (HoverTeaser). Its
// type is centered, so the play button sits bottom right instead.
export default function ReelPlayer() {
  return (
    <YouTube
      youtubeId="WmFTtWURjnA"
      title="Kai Tran's motion reel: storytelling, video, motion"
      poster="/works/visual-media/reel-teaser-still.webp"
      teaser={{ webm: '/works/visual-media/reel-teaser.webm', mp4: '/works/visual-media/reel-teaser.mp4' }}
      corner
      chip="Watch the reel"
      wide
      className="relative aspect-video w-full overflow-hidden rounded-[14px] border border-hairline bg-[#211e1a]"
    />
  )
}
