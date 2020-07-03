const fs = require('fs')
const os = require('os')
const path = require('path')
const child_process = require('child_process')

const {app,BrowserWindow,ipcMain,dialog} = require('electron')

let debug = (process.argv[2] == '--debug' ? true : false)
let tempy = ''

let output_folder = path.join(process.cwd(), 'output')
let config_path = path.join(process.cwd(), 'config.json')

let win, custominput, vcodec, acodec, prefix, present, crf, threads

let ffmpegloc = () => (os.platform().substring(0,3) == 'win' ? path.join(process.cwd(), 'bin/ffmpeg.exe') : process.exit(1))

function saveConfig() {
	let config_array = [{
		'debug': debug,
		'vcodec': vcodec,
		'acodec': acodec,
		'prefix': prefix,
		'present': present,
		'crf': crf,
		'threads': threads
	}]
	fs.writeFileSync(config_path, JSON.stringify(config_array).split('[').join('').split(']').join(''))
}

function createWindow() {
	win = new BrowserWindow({
		width: 600,
		height: 800,
		webPreferences: {
			nodeIntegration: true
		}
	})
	win.setMenuBarVisibility(false)
	win.loadFile('app/index.html')
	
	debug && win.openDevTools()
	
}

function check_folder(fpath) {
	if (fs.existsSync(fpath) && fs.lstatSync(fpath).isDirectory()) {
		debug && console.log('[+] Target output : ' + fpath)
	} else {
		debug && console.log('[+] Making folder : ' + fpath)
		fs.mkdirSync(fpath, { recursive: true })
	}
}

app.on('ready', createWindow)

ipcMain.on('onstart',(event, res) => {
	if (res.length > 6) {
		custominput = res[0]
		vcodec = res[1]
		acodec = res[2]
		present = res[3]
		prefix = res[4]
		crf = res[5]
		threads = res[6]
		processVideo(res[7])
	}
})

async function processVideo(array) {
	saveConfig()
	check_folder(output_folder)
	for (const item of array) {
		let escaped_path_output = item[0].split('\\').join('/')
		let output_escaped = path.basename(escaped_path_output)
		output_escaped = item[0].slice(0, item[1].length - path.basename(item[0]).length) + output_escaped.split(path.extname(output_escaped)).join('')
		let outputloc = output_folder + '\\' + item[1].split(path.extname(item[1])).join('') + prefix + '.mp4'
		if (debug) {
			console.log(item)
			console.log('DEBUG : ' + outputloc)
			console.log('DEBUG : ' + output_escaped)
			console.log('Output Folder : ' + output_folder)
		}
		tempy = tempy + '"' + ffmpegloc() + '" -crf ' + crf + ' -preset ' + present + ' -i ' + '"' + item[0] + '" ' + (custominput !== '' ?custominput : '') + ' -y -filter_complex "subtitles=' + "'" + escaped_path_output.split(':/').join('\\:/') + "'" + '" ' + '-c:a lib' + acodec + ' -c:v lib' + vcodec + ' -threads ' + threads + ' "' + outputloc + '"' + os.EOL
	}
	fs.writeFile(path.join(process.cwd(), 'batch.bat'), tempy, (err) => {
		const subprocess = child_process.spawn(path.join(process.cwd(), 'batch.bat'),[], {
			detached: true
		});
		subprocess.unref();
		process.exit();
	})
}
