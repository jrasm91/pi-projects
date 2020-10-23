@REM timelapse.bat 16 Oct 2020
SET FOLDER_NAME=%1 %2 %3
python3 timelapse.py "%FOLDER_NAME%"
ffmpeg -r 30 -i "C:\#ras-pie\Camera\%FOLDER_NAME%-timestamp\IMG_%%04d.jpg" -s hd1080 -vcodec libx264 -crf 18 -preset slow -y "C:\#ras-pie\videos\timelapse-%FOLDER_NAME%.mp4"
