import YouTube from '../YouTube'

// The page's hero (visual media case study): the reel, click to load like Brand System's episode, so
// nothing from YouTube loads until someone presses play. The 150 MB master stays on YouTube. The
// poster is Kai's cover with the artwork moved up (Paper, "Claude Sessions") so the play button
// doesn't sit on the logo.
export default function ReelPlayer() {
  return (
    <YouTube
      youtubeId="WmFTtWURjnA"
      title="Kai Tran's motion reel: storytelling, video, motion"
      poster="/works/visual-media/reel-poster.webp"
      chip="Watch the reel"
      wide
      className="relative aspect-video w-full overflow-hidden rounded-[14px] border border-hairline bg-[#211e1a]"
    />
  )
}
