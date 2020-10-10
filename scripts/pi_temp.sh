TEMPERATURE=$(/opt/vc/bin/vcgencmd measure_temp | awk -F "[=\']" '{printf("%0.2f\n", ($2 * 1.8)+32)}')
DATE=$(date +"%m-%d-%y,%H:%M:%S")
echo "$TEMPERATURE,$DATE" > ~/history/pi_temp.txt