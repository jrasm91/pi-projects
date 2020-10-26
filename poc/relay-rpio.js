var rpio = require('rpio')

/*
 * Set the initial state to HIGH.  The state is set prior to the pin
 * being actived, so is safe for devices which require a stable setup.
 */
rpio.open(40, rpio.OUTPUT, rpio.HIGH)
rpio.open(38, rpio.OUTPUT, rpio.HIGH)
rpio.open(37, rpio.OUTPUT, rpio.HIGH)

/*
 * The sleep functions block, but rarely in these simple programs does
 * one care about that.  Use a setInterval()/setTimeout() loop instead
 * if it matters.
 */
for (var i = 0; i < 5; i++) {
  /* On for 1 second */
  rpio.write(37, rpio.LOW)
  rpio.sleep(1)
  rpio.write(38, rpio.LOW)
  rpio.sleep(1)
  rpio.write(40, rpio.LOW)
  rpio.sleep(1)

  /* Off for half a second (500ms) */
  rpio.write(37, rpio.HIGH)
  rpio.sleep(1)
  rpio.write(38, rpio.HIGH)
  rpio.sleep(1)
  rpio.write(40, rpio.HIGH)
  rpio.sleep(1)

  rpio.msleep(500)
}

// wave 3 relay board - Channel 1 RPi Pin 37 (Wave P25) BCM 26
// wave 3 relay board - Channel 2 RPi Pin 38 (Wave P28) BCM 20
// wave 3 relay board - Channel 3 RPi Pin 40 (Wave P29) BCM 21

/* var options = {
 /*   gpiomem: true,          /* Use /dev/gpiomem */
/*   mapping: 'physical',    /* Use the P1-P40 numbering scheme */
/*   mock: undefined,        /* Emulate specific hardware in mock mode */
/*   close_on_exit: true,    /* On node process exit automatically close rpio */
/* }

/* If running a newer Raspbian release, you will need to add the following line to */
/*  /boot/config.txt and reboot: */

/* dtoverlay=gpio-no-irq */
