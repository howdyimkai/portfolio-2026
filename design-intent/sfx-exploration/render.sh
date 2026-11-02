#!/bin/zsh
# Renders the /proto/sfx candidates from earshot's sound bank (sounds made in code, MIT).
# earshot lives at ~/Desktop/Claude-Workspace/tools/earshot (Python 3.12 venv, installed without
# torch: the bank needs no models). WAVs go to a temp folder, mono MP3s to public/proto/sfx/.
set -e
ES=~/Desktop/Claude-Workspace/tools/earshot/.venv/bin/python
OUT=${0:A:h}/../../public/proto/sfx
WAV=$(mktemp -d)
mkdir -p $OUT

r() { # name, sound id, extra earshot flags...
  local name=$1 id=$2; shift 2
  $ES -m earshot sfx render $id -o $WAV/$name.wav "$@" >/dev/null
  ffmpeg -loglevel error -y -i $WAV/$name.wav -ac 1 -ar 44100 -b:a 96k $OUT/$name.mp3
}

# Picking up a tool (putting it down plays the same take lower, in the browser)
r pickup-knock knock/wood
r pickup-finger fit/land.light/finger_wood
r pickup-bamboo fit/hit/bamboo_tok

# Blossom stamp: C pentatonic, one note per stamp
for n in C5 D5 E5 G5 A5; do
  r blossom-kalimba-$n pluck/kalimba_soft --pitch $n --dur 1.2
  r blossom-celesta-$n mallet/celesta --pitch $n
  r blossom-pop-$n ui_pop/soft --pitch $n
done

# A principle writes on after the erase
r reveal-flourish mallet/flourish
r reveal-up4 mallet/up4
r reveal-shimmer pro_shimmer/m1

# Broom across the shelf (528ms)
r broom-soft swish/soft --dur 0.6 --apex 0.3
r broom-cloth swipe/cloth --dur 0.6 --apex 0.3
r broom-bamboo fit/whoosh.short/bamboo_swish --dur 0.6

# Résumé bookmark tug
r bookmark-paper swipe/paper
r bookmark-glide swipe/glide
r bookmark-flip fit/snap/switch_flip

# Copy email
r copy-wood notify/mid_wood
r copy-ding pro_notify/ding_1822
r copy-kalimba pluck/kalimba_soft --pitch C6 --dur 0.9

rm -rf $WAV
ls -la $OUT | awk '{s+=$5} END {print NR-3 " files, " int(s/1024) " KB"}'
