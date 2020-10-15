import random

base = [
    69,
    69,
    69,
    68,
    68,
    67,
    67,
    69,
    71,
    75,
    79,
    82,
    83,
    84,
    84,
    83,
    82,
    81,
    80,
    80,
    79,
    75,
    73,
    71,
]
temp = 70
with open('../data/pool_temp_history.csv', 'w') as f:
    for hour in range(24):
        for minute in [0, 15, 30, 45]:
            temp = base[hour]
            f.write('%s,2020-10-10T%02d:%02d:00\n' % (temp, hour, minute))
