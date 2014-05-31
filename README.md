express-gallary
===============

An Express photo gallary plugin.

1. public/photo is the base directory for gallary, can include multilevel sub directory, put your photos and videos here.
2. tools/thumbnailer.sh is used for create thumbnails for photos and video, and tools/thumbnail_cleanup.sh is used for cleanup thumbnails (depends on [epeg](https://github.com/mattes/epeg) and [ffmpeg](http://www.ffmpeg.org/)).   Example:
   <pre><code>
   tools/thumbnailer.sh public/photo
   tools/thumbnail_cleanup.sh public/photo
   </code></pre>
