#!/usr/bin/env bash
# Скачивает все Unsplash-картинки в public/images/ и кладёт их
# с понятными именами. Безопасно для повторного запуска: уже скачанные
# файлы пропускаются.
#
# Требования: curl. VPN должен быть включён, если images.unsplash.com
# недоступен из вашей сети.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMG_DIR="$ROOT_DIR/public/images"

UNSPLASH_PARAMS="crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"

download() {
  local photo_id="$1"
  local target="$2"

  if [ -f "$target" ] && [ -s "$target" ]; then
    echo "  [skip] $(basename "$target") — уже скачан"
    return 0
  fi

  local url="https://images.unsplash.com/${photo_id}?${UNSPLASH_PARAMS}"
  echo "  [get ] $(basename "$target")"

  if curl --fail --silent --show-error --location --max-time 30 \
       --retry 2 --retry-delay 2 \
       -o "$target" "$url"; then
    echo "         ok ($(wc -c <"$target" | tr -d ' ') bytes)"
  else
    rm -f "$target"
    echo "         FAIL — проверьте VPN и повторите"
    return 1
  fi
}

echo "Скачивание курсов в $IMG_DIR/courses"
mkdir -p "$IMG_DIR/courses"
download "photo-1749746766518-7d52a30c87cb" "$IMG_DIR/courses/01.jpg"
download "photo-1657584905470-ac4ef76ee2b4" "$IMG_DIR/courses/02.jpg"
download "photo-1662845114342-256fdc45981d" "$IMG_DIR/courses/03.jpg"
download "photo-1765978856539-b9247f2e0d5f" "$IMG_DIR/courses/04.jpg"
download "photo-1532272278764-53cd1fe53f72" "$IMG_DIR/courses/05.jpg"
download "photo-1681239063386-fc4a373c927b" "$IMG_DIR/courses/06.jpg"
download "photo-1760764541302-e3955fbc6b2b" "$IMG_DIR/courses/07.jpg"
download "photo-1705254613735-1abb457f8a60" "$IMG_DIR/courses/08.jpg"
download "photo-1720248090619-95d555f01bfb" "$IMG_DIR/courses/09.jpg"
download "photo-1649954049118-1c213fcdeadc" "$IMG_DIR/courses/10.jpg"
download "photo-1720217260759-cafa6de4e46b" "$IMG_DIR/courses/11.jpg"
download "photo-1757085242652-f8cd4d3de889" "$IMG_DIR/courses/12.jpg"

echo
echo "Скачивание товаров в $IMG_DIR/products"
mkdir -p "$IMG_DIR/products"
download "photo-1740251536721-544b0fde73b2" "$IMG_DIR/products/01.jpg"
download "photo-1761145275111-e62cbdba6f57" "$IMG_DIR/products/02.jpg"
download "photo-1757546049629-2391be154fb7" "$IMG_DIR/products/03.jpg"
download "photo-1690288958542-c9c8bade3153" "$IMG_DIR/products/04.jpg"
download "photo-1742130847739-f7728ae50176" "$IMG_DIR/products/05.jpg"
download "photo-1758522277384-cd1af73f271f" "$IMG_DIR/products/06.jpg"
download "photo-1764122755835-b3ba3cc6c82a" "$IMG_DIR/products/07.jpg"
download "photo-1677064730930-1f1c4ad06276" "$IMG_DIR/products/08.jpg"
download "photo-1605641987825-c1664626d79f" "$IMG_DIR/products/09.jpg"
download "photo-1510936994138-07e06c7c5add" "$IMG_DIR/products/10.jpg"
download "photo-1753164725767-0b3da6f50a9f" "$IMG_DIR/products/11.jpg"
download "photo-1759910546841-526487211a19" "$IMG_DIR/products/12.jpg"

echo
echo "Скачивание блога в $IMG_DIR/blog"
mkdir -p "$IMG_DIR/blog"
download "photo-1764096535068-0e9f652e03f6" "$IMG_DIR/blog/01.jpg"
download "photo-1628586431263-44040b966252" "$IMG_DIR/blog/02.jpg"
download "photo-1677001459109-fe850d6c48bf" "$IMG_DIR/blog/03.jpg"

echo
echo "Скачивание 'о школе' в $IMG_DIR/about"
mkdir -p "$IMG_DIR/about"
download "photo-1761818645943-a3689c34ca03" "$IMG_DIR/about/studio.jpg"

echo
echo "Готово. Картинки лежат в $IMG_DIR"
