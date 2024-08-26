
rm icon.png
rm icon.icns

mkdir icon.iconset

sharp -f png -i ./icon.svg -o ./icon.iconset/icon_16x16.png resize 16 16
sharp -f png -i ./icon.svg -o ./icon.iconset/icon_16x16@2x.png resize 32 32
sharp -f png -i ./icon.svg -o ./icon.iconset/icon_32x32.png resize 32 32
sharp -f png -i ./icon.svg -o ./icon.iconset/icon_32x32@2x.png resize 64 64
sharp -f png -i ./icon.svg -o ./icon.iconset/icon_128x128.png resize 128 128
sharp -f png -i ./icon.svg -o ./icon.iconset/icon_128x128@2x.png resize 256 256
sharp -f png -i ./icon.svg -o ./icon.iconset/icon_256x256.png resize 256 256
sharp -f png -i ./icon.svg -o ./icon.iconset/icon_256x256@2x.png resize 512 512
sharp -f png -i ./icon.svg -o ./icon.iconset/icon_512x512.png resize 512 512
sharp -f png -i ./icon.svg -o ./icon.iconset/icon_512x512@2x.png resize 1024 1024


sharp -f png -i ./icon.svg -o ./icon.png resize 512 512

iconutil -c icns "icon.iconset"

rm -rf icon.iconset