#!/usr/bin/python3
import os
import time
from datetime import datetime
 
def init_sensors():
    os.system('modprobe w1-gpio')
    os.system('modprobe w1-therm')

def read_temp_raw():
    try:
        with open('/sys/bus/w1/devices/28-0000095cd386/w1_slave', 'r') as f:
            return f.readlines()
    except:
        return [
            'cf 01 4b 46 7f ff 01 10 5d : crc=5d YES', 
            'cf 01 4b 46 7f ff 01 10 5d t=100000'
        ]
 
def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = round(temp_c * 9.0 / 5.0 + 32.0,2)
        return temp_f

if __name__ == "__main__":
    temperature = read_temp()
    print(str(temperature) + ',' + datetime.now().strftime("%Y-%m-%d,%H:%M:%S"))