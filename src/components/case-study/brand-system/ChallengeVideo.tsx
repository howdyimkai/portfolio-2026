import YouTube from '../YouTube'

// Visual 8, an example challenge episode (Ch 5), in place of the four-week arc diagram (Kai,
// 2026-10-24). Cal's click-to-load player: nothing from YouTube loads until the reader taps, and it
// plays through youtube-nocookie.com. The episode is 16:9, so the poster fills the column. Poster is
// the video's own YouTube thumbnail, saved locally (challenge-poster.webp), never hotlinked.
export default function ChallengeVideo() {
  return (
    <YouTube
      youtubeId="S6Sy1F0Z-Es"
      title="Ep. 1 | Would You Actually Want to Be Your Own Boss? ft. Real Founders"
      poster="/works/brand-system/challenge-poster.webp"
      chip="Watch the episode"
      wide
      className="relative aspect-video w-full overflow-hidden rounded-[14px] border border-hairline bg-[#211e1a]"
    />
  )
}
