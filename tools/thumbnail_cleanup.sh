#!/bin/bash
photo_dir='.'
if test $# -gt 0; then
photo_dir=$1
fi
thumbnail_dir='_thumbnail'

find $photo_dir -type d -name $thumbnail_dir |xargs rm -rf
