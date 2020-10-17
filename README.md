# Pi Projects

## Install Node on Pi Zero
https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp

#### Tutorial - node.js on RPi 
https://hassancorrigan.com/blog/install-nodejs-on-a-raspberry-pi-zero/

Make sure you're in the same directory as the binary you just download. You can use the ls command to list all files. Extract the binary from the tarball file using the following command.

```bash
wget https://unofficial-builds.nodejs.org/download/release/v14.13.0/node-v14.13.0-linux-armv6l.tar.xz
tar xvfJ node-v14.13.0-linux-armv6l.tar.xz
sudo cp -R node-v14.13.0-linux-armv6l/* /usr/local
# clean up and remove 
rm -rf node-*
```

Reboot your Pi and log back in to make sure everything worked correctly.

You can now run the following command which will check what version of NPM and NodeJS are currently installed on your Pi Zero.

```bash
node -v && npm -v
```

### w1 support
```bash
npm install w1temp --global
```