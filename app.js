const fs = require('fs')
const os = require('os')
const path = require('path')
const child_process = require('child_process')

const {app,BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const { EOL } = os

let tempy = ''

let path_config = path.join(process.cwd(), 'config.json')

//let config = require(path_config)
let vcodec = "x264"
let acodec = "opus"
let prefix = "-mkvripa"
let present = "ultrafast"
let crf = "23"


let ffmpegloc = path.join(process.cwd(), 'bin/ffmpeg')
if (os.platform().substring(0,3) == 'win') {
    ffmpegloc = ffmpegloc + '.exe'
}

let win

function createWindow() {
	win = new BrowserWindow({
		width: 920,
		height: 800,
		webPreferences: {
			nodeIntegration: true
		}
	})
	win.setMenuBarVisibility(false)
	win.loadFile('app/index.html')
	
	// win.openDevTools()
}

app.on('ready', createWindow)

ipcMain.on('ondragstart',(event, filePath) => {
	processVideo(filePath)
})

ipcMain.on('setvideocodec',(event, res) => {
	vcodec = res
})

ipcMain.on('setaudiocodec',(event, res) => {
	acodec = res
})

ipcMain.on('setprefix',(event, res) => {
	prefix = res
})

ipcMain.on('setpresent',(event, res) => {
	present = res
})

ipcMain.on('setcrf',(event, res) => {
	crf = res
})


async function processVideo(array) {
	for (const item of array) {
		// First Approach
		//let escaped_path_output = item.split('/').join('\\')
		//escaped_path_output = process.cwd() + '\\output\\' + escaped_path_output.split(process.cwd() + '\\input\\').join('')
		// Second Appoarch
		let escaped_path_output = item.slice(0, item.length - path.basename(item).length)
		escaped_path_output = item.split('\\').join('/')
		let output_escaped = path.basename(escaped_path_output)
		output_escaped = item.slice(0, item.length - path.basename(item).length) + output_escaped.split(path.extname(output_escaped)).join('')
		//console.log('DEBUG : ' + item)
		//console.log('DEBUG : ' + output_escaped)
		tempy = tempy + '"' + ffmpegloc + '" -crf ' + crf + ' -preset ' + present + ' -i ' + '"' + item + '"' + ' -y -filter_complex "subtitles=' + "'" + escaped_path_output.split(':/').join('\\:/') + "'" + '" ' + '-acodec lib' + acodec + ' -vcodec lib' + vcodec + ' "' + output_escaped + prefix + '.mp4' + '"' + EOL
	}
	fs.writeFile('batch.bat', tempy, (err) => {
		if (err) throw err;
		const subprocess = child_process.spawn('batch.bat',[], {
			detached: true
		});
		subprocess.unref();
		process.exit();
	})
}
