#!/bin/bash
photo_dir='.'
if test $# -gt 0; then
photo_dir=$1
fi
thumbnail_dir='_thumbnail'

# Create thumbnail for Images by epeg
for file in `find $photo_dir -type f -name "*.jpg"`
do
    if [[ "$file" == *thumbnail* ]]; then continue; fi
    thumbnail_file="${file%/*}/${thumbnail_dir}/${file##*/}"
    if [ -e $thumbnail_file ]; then continue; fi
    if [ ! -e "${file%/*}/${thumbnail_dir}" ]; then mkdir -p "${file%/*}/${thumbnail_dir}"; fi
    echo "Create thumbnail for image $file"
    `epeg -w 30% -h 30% -q 80 $file $thumbnail_file > /dev/null 2>&1`
done

# Create thumbnail for Videos by ffmpeg
for file in `find $photo_dir -type f -name "*.mp4"`
do
    if [[ "$file" == *thumbnail* ]]; then continue; fi
    thumbnail_file="${file%/*}/${thumbnail_dir}/${file##*/}.jpg"
    if [ -e $thumbnail_file ]; then continue; fi
    if [ ! -e "${file%/*}/${thumbnail_dir}" ]; then mkdir -p "${file%/*}/${thumbnail_dir}"; fi
    echo "Create thumbnail for video $file"
    `ffmpeg -i $file -ss 00:00:01.000 -f image2 -vframes 1 $thumbnail_file > /dev/null 2>&1`
done
