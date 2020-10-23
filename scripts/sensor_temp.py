#!/usr/bin/python3
import os
import time
import sys
from datetime import datetime

# pool sensor => 28-000009640cfd

def init_sensors():
    os.system('modprobe w1-gpio')
    os.system('modprobe w1-therm')


def read_temp_raw(sensor_id):
    try:
        with open('/sys/bus/w1/devices/%s/w1_slave' % sensor_id, 'r') as f:
            return f.readlines()
    except:
        return [
            'cf 01 4b 46 7f ff 01 10 5d : crc=5d YES',
            'cf 01 4b 46 7f ff 01 10 5d t=100000'
        ]


def read_temp(sensor_id):
    lines = read_temp_raw(sensor_id)
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw(sensor_id)
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = round(temp_c * 9.0 / 5.0 + 32.0,0)
        return temp_f


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print('Usage: ./sensor_temp.py sensor_id', file=sys.stderr)
        sys.exit(1)

    temperature = read_temp(sys.argv[1])
    print(str(temperature) + '|' + datetime.now().strftime('%Y-%m-%dT%H:%M:%S'))
