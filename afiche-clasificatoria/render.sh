#!/bin/zsh
# Exporta el afiche con Chrome sin interfaz, a 2x.
#   ./render.sh                      -> export/sansicup-2026-clasificatoria-feed.png      (2160x2700, 4:5)
#   ./render.sh historia             -> export/sansicup-2026-clasificatoria-historia.png  (2160x3840, 9:16)
#   ./render.sh feed otra/ruta.png   -> ruta de salida a elección
cd "${0:A:h}"
FMT=${1:-feed}
if [[ $FMT == historia ]]; then H=1920; Q='?formato=historia'; else H=1350; Q=''; fi
OUT=${2:-export/sansicup-2026-clasificatoria-$FMT.png}
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --allow-file-access-from-files --force-device-scale-factor=2 --window-size=1080,$H \
  --virtual-time-budget=4000 --screenshot="$PWD/$OUT" "file://$PWD/afiche.html$Q" 2>/dev/null
echo "$OUT"
