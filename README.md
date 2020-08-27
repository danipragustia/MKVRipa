# MKVRipa

![MKVRipa Logo](https://raw.githubusercontent.com/danipragustia/MKVRipa/master/banner.png)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/danipragustia/MKVRipa/LICENSE)

Silly-way to batch hardsub video for MKV Video Container on Windows.

## Why this matter?
Batch script is have some limitation, so for making this extensible. I making this program for convience way to me and other people for using it.

## To-do
- [ ] Progress status
- [ ] Watermark support (Check Issue #11)

## How to use?
Simply start `mkvripa.exe`

## Build from source
Make sure package electron-packager was installed, if not you can run command `npm i -g electron-packager` to install it.

1. Compile program by using `build.sh` script or run `electron-packager .`
2. Donwnload [FFMPEG](https://ffmpeg.zeranoe.com/builds/) and copy it on compiled program directory `bin` folder (case-sensitive).

## License
MIT
