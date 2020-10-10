
#!/bin/bash
python3 timelapse.py "4 Oct 2020 - 1m"
ffmpeg -r 30 -i "C:\___Raspberry PI\Camera\4 Oct 2020 - 1m-timestamp\IMG_%04d.jpg" -s hd1080 -vcodec libx264 -crf 18 -preset slow -y ../videos/timelapse-2020-10-04.mp4
