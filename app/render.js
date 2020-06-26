const {ipcRenderer} = require('electron')

var $ = require('jquery')
var target_file = []

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
	target_file.push(fpath)
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

$("#folder-select").on("input change", function(e) {
	var theFiles = e.target.files
	for (var i=0; i<theFiles.length; i++) {
		if (theFiles[i].name.substr(theFiles[i].name.lastIndexOf('.') + 1).toLowerCase() == 'mkv') {
			addItem(theFiles[i].name, theFiles[i].path)
		}
	}
})
	
$("#crf-range").on("input change", function() {
	this.setAttribute('value',this.value)
	$("#label-crf").text(this.value)
})

$("#btnClean").click(function() {
	target_file = []
	$("#table-files").html('')
})


$("#btnRender").click(function() {
	ipcRenderer.send('setvideocodec', $("#video-select").val())
	ipcRenderer.send('setaudiocodec', $("#audio-select").val())
	ipcRenderer.send('setpresent', $("#present-select").val())
	ipcRenderer.send('setprefix', $("#prefix-input").val())
	ipcRenderer.send('setcrf', $("#crf-range").val())
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
