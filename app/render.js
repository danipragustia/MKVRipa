const {ipcRenderer} = require('electron')
const path = require('path')
const fs = require('fs')

var target_file = []

if (fs.existsSync(path.join(process.cwd(), 'config.json'))) {
	let config = require(path.join(process.cwd(), 'config.json'))
	$("#video-select").val(config.vcodec)
	$("#audio-select").val(config.acodec)
	$("#prefix-input").val(config.prefix)
	$("#present-select").val(config.present)
	$("#threads-input").val(config.threads)
	document.getElementById("crf-range").setAttribute('value', config.crf)
	$("#label-crf").text(config.crf)
}

function traverseFileTree(item, path) {
  path = path || ""
  if (item.isFile) {
    item.file(function(file) {
	  if (file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase() == 'mkv') {
		  addItem(file.name, file.path)
	  }
    })
  } else if (item.isDirectory) {
    var dirReader = item.createReader()
    dirReader.readEntries(function(entries) {
      for (var i=0; i<entries.length; i++) {
        traverseFileTree(entries[i], path + item.name + "/")
      }
    })
  }
}

function addItem(fname, fpath) {
	var temp_path = fpath.replace(fpath.substr(0,fpath.indexOf('\\',fpath.length - fpath.lastIndexOf('\\'))),'').replace(fname,'')
	target_file.push([ temp_path, fpath, fname ])
	$("#table-files").append('<tr id="item' + (target_file.length - 1) + '"><td><div class="input-group"><div class="input-group-prepend"><button class="btn btn-danger btn-sm" type="button" onclick="removeItem(' + (target_file.length - 1) + ')"><svg class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/></svg></button></div><input type="text" class="form-control" value="' + fname + '" disabled></div></td></tr>')
}

function removeItem(i) {
	target_file.splice(i, 1)
	$("#item" + i).hide('fast', function(){
		$("#item" + i).remove()
	})
}

$(function() {
	
var obj = $("#drag-drop");
$('#output-folder').val(path.join(process.cwd(), 'output'))

$("#folder-select").on("input", function(e) {
	var theFiles = e.target.files
	for (var i=0; i<theFiles.length; i++) {
		if (theFiles[i].name.substr(theFiles[i].name.lastIndexOf('.') + 1).toLowerCase() == 'mkv') {
			addItem(theFiles[i].name, theFiles[i].path)
		}
	}
})
	
$("#crf-range").on("change", function() {
	this.setAttribute('value',this.value)
	$("#label-crf").text(this.value)
})

$("#output-select").on("input change", function(e) {
	var fpath = e.target.files[0].path
	$('#output-folder').val(fpath.substr(0, fpath.lastIndexOf('\\')))
	ipcRenderer.send('setoutput', fpath.substr(0, fpath.lastIndexOf('\\')))
})

$("#btnClean").click(function() {
	target_file = []
	$("#table-files").html('')
})


$("#btnRender").click(function() {
	$("#btnRender").prop("disabled",true);
	$("#btnClean").prop("disabled",true);
	ipcRenderer.send('setcustominput', $("#custom-input").val())
	ipcRenderer.send('setvideocodec', $("#video-select").val())
	ipcRenderer.send('setaudiocodec', $("#audio-select").val())
	ipcRenderer.send('setpresent', $("#present-select").val())
	ipcRenderer.send('setprefix', $("#prefix-input").val())
	ipcRenderer.send('setcrf', $("#crf-range").val())
	ipcRenderer.send('setthreads', $("#threads-input").val())
	ipcRenderer.send('ondragstart', target_file)
})

$(document).on('dragenter', function (e) {
    e.stopPropagation()
    e.preventDefault()
})

$(document).on('dragover', function (e) {
  e.stopPropagation()
  e.preventDefault()
  obj.addClass('drag-over')
})

$(document).on('dragleave', function (e) {
  e.stopPropagation()
  e.preventDefault()
  obj.removeClass('drag-over')
})

$(document).on('drop', function (e) {
    e.stopPropagation()
    e.preventDefault()
	obj.removeClass('drag-over')
	var items = e.originalEvent.dataTransfer.items
	for (var i=0; i<items.length; i++) {
		var item = items[i].webkitGetAsEntry()
		if (item) {
			traverseFileTree(item)
		}
	}
})

})
