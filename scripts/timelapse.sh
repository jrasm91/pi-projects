
#!/bin/bash
python3 timelapse.py "14 Oct 2020"
ffmpeg -r 30 -i "C:\#ras-pie\Camera\14 Oct 2020-timestamp\IMG_%04d.jpg" -s hd1080 -vcodec libx264 -crf 18 -preset slow -y ../videos/timelapse-2020-10-14.mp4
