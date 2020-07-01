const fs = require('fs')
const os = require('os')
const path = require('path')
const child_process = require('child_process')

const {app,BrowserWindow,ipcMain,dialog} = require('electron')
const { EOL } = os

let tempy = ''
let win

let output_folder = path.join(process.cwd(), 'output')
let config_path = path.join(process.cwd(), 'config.json')

let debug = false
let vcodec = "x264"
let acodec = "opus"
let prefix = "-mkvripa"
let present = "ultrafast"
let crf = "23"

let ffmpegloc = path.join(process.cwd(), 'bin/ffmpeg')
if (os.platform().substring(0,3) == 'win') {
    ffmpegloc = ffmpegloc + '.exe'
}

function saveConfig() {
	let config_array = [{
		'debug': debug,
		'vcodec': vcodec,
		'acodec': acodec,
		'prefix': prefix,
		'present': present,
		'crf': crf
	}]
	fs.writeFileSync(config_path, JSON.stringify(config_array).split('[').join('').split(']').join(''));
}

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
	
	if (debug) {
		win.openDevTools()
	}
	
}

function check_folder(fpath) {
	if (fs.existsSync(fpath) && fs.lstatSync(fpath).isDirectory()) {
		console.log('[+] Target output : ' + fpath)
	} else {
		console.log('[+] Making folder : ' + fpath)
		fs.mkdirSync(fpath, { recursive: true })
	}
}

app.on('ready', createWindow)

ipcMain.on('ondragstart',(event, res) => processVideo(res))
ipcMain.on('setvideocodec',(event, res) => vcodec = res)
ipcMain.on('setaudiocodec',(event, res) => acodec = res)
ipcMain.on('setprefix',(event, res) => prefix = res)
ipcMain.on('setpresent',(event, res) => present = res)
ipcMain.on('setcrf',(event, res) => crf = res)
ipcMain.on('setoutput',(event, res) => output_folder = res)

async function processVideo(array) {
	saveConfig()
	for (const item of array) {
		let escaped_path_output = item[1].split('\\').join('/')
		let output_escaped = path.basename(escaped_path_output)
		output_escaped = item[1].slice(0, item[1].length - path.basename(item[1]).length) + output_escaped.split(path.extname(output_escaped)).join('')
		let outputloc = output_folder + '\\' + item[0] + '\\' + item[2].split(path.extname(item[2])).join('') + prefix + '.mp4'
		check_folder(output_folder + '\\' + item[0])
		if (debug) {
			console.log(item)
			console.log('DEBUG : ' + outputloc)
			console.log('DEBUG : ' + output_escaped)
			console.log('Output Folder : ' + output_folder)
		}
		tempy = tempy + '"' + ffmpegloc + '" -crf ' + crf + ' -preset ' + present + ' -i ' + '"' + item[1] + '"' + ' -y -filter_complex "subtitles=' + "'" + escaped_path_output.split(':/').join('\\:/') + "'" + '" ' + '-c:a lib' + acodec + ' -c:v lib' + vcodec + ' "' + outputloc + '"' + EOL
	}
	fs.writeFile(path.join(process.cwd(), 'batch.bat'), tempy, (err) => {
		if (err) throw err;
		const subprocess = child_process.spawn(path.join(process.cwd(), 'batch.bat'),[], {
			detached: true
		});
		subprocess.unref();
		process.exit();
	})
}
