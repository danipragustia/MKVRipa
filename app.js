const {app,BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')
const {ipcMain} = require('electron')
let win

function createWindow() {
	win = new BrowserWindow({
		width: 540,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	})
	win.setMenuBarVisibility(false)
	win.loadFile('app/index.html')
	
	win.openDevTools()
}

app.on('ready', createWindow)

ipcMain.on('ondragstart',(event, filePath) => {
	console.log(filePath)
})
