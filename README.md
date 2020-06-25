# MKVRipa
Silly-way to batch hardsub video for MKV Video Container on Windows.

## Why this matter?
Batch script is have some limitation, so for making this extensible. I making this program for convience way to me and other people for using it.

## To-do
- [ ] Drag and Drop functionality
- [ ] GUI Application (electron-based)

## How to use?
Simply start `app.exe` and program will generate batch file named `batch.bat` and run it.

## Build from source
Make sure package pkg was installed, if not you can run command `npm i -g pkg` to install it.

Compile from node12 is recommended
`pkg index.js --targets node12-win-x64`
After that, copy config.json to your compiled app folder.

## License
MIT
