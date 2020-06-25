const fs = require('fs')
const path = require('path')
const glob = require('glob')
const os = require('os')
const { EOL } = os
let tempy = ''

let output_folder = path.join(process.cwd(), 'output/')
let path_config = path.join(process.cwd(), 'config.json')

let config = require(path_config)

let ffmpegloc = path.join(process.cwd(), 'bin/ffmpeg')
if (os.platform().substring(0,3) == 'win') {
    ffmpegloc = ffmpegloc + '.exe'
}

var getDirectories = (src, callback) => {
  glob(src + '/input/**/*.mkv', callback);
};

getDirectories(process.cwd(), (err, res) => {
  console.log(process.cwd())
  if (err) {
    console.log('Error', err)
  } else {
	current = 0
	if (res.length > 0) {
		last = res.length
		processVideo(res)
	} else {
		console.log('There no videos on input folder.')
		process.exit()
	}
  }
});

function check_folder(fpath) {
	if (fs.existsSync(fpath) && fs.lstatSync(fpath).isDirectory()) {
		console.log('[+] Target output : ' + fpath)
	} else {
		console.log('[+] Making folder : ' + fpath)
		fs.mkdirSync(fpath);
	}
}

async function processVideo(array) {
	check_folder(output_folder)
	for (const item of array) {
		// ffmpeg -crf 23 -preset ultrafast -i D:/Cmder/tastis/remtangan-cli/input/input.mkv -y -filter_complex "subtitles='D\:/Cmder/tastis/remtangan-cli/input/input.mkv'" -acodec libopus -vcodec libx265 D:\Cmder\tastis\remtangan-cli\output\input-uwu.mp4
		let escaped_path_output = item.split('/').join('\\')
		escaped_path_output = process.cwd() + '\\output\\' + escaped_path_output.split(process.cwd() + '\\input\\').join('')
		escaped_path_output = escaped_path_output.split(path.basename(escaped_path_output)).join('')
		console.log('DEBUG : ' + escaped_path_output)
		check_folder(escaped_path_output.slice(0, -1))
		tempy = tempy + ffmpegloc + ' -crf ' + config.crf + ' -preset ' + config.present + ' -i ' + '"' + item + '"' + ' -y -filter_complex "subtitles=' + "'" + item.split(':/').join('\\:/') + "'" + '" ' + '-acodec lib' + config.audioCodec + ' -vcodec lib' + config.videoCodec + ' "' + escaped_path_output + path.basename(item,path.extname(item)) + config.prefix + '.mp4' + '"' + EOL
	}
	fs.writeFile('batch.bat', tempy, (err) => {
		if (err) throw err;
		console.log('Batch File Created!');
	})
}