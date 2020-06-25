const {ipcRenderer} = require('electron')

var $ = require('jquery');
var target_file = [];

function traverseFileTree(item, path) {
  path = path || "";
  if (item.isFile) {
    // Get file
    item.file(function(file) {
	  if (file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase() == 'mkv') {
		target_file.push(file.path);
		$("#table-files").append('<tr><td>' + file.name + '</td></tr>');
	  }
    });
  } else if (item.isDirectory) {
    // Get folder contents
    var dirReader = item.createReader();
    dirReader.readEntries(function(entries) {
      for (var i=0; i<entries.length; i++) {
        traverseFileTree(entries[i], path + item.name + "/");
      }
    });
  }
}

$(function() {
	
var obj = $("#drag-drop");
	
$("#crf-range").on("input change", function() {
	this.setAttribute('value',this.value);
	$("#label-crf").text(this.value);
});

$("#btnClean").click(function() {
	target_file = [];
	$("#table-files").html('');
});


$("#btnRender").click(function() {
	ipcRenderer.send('setvideocodec', $("#video-select").val());
	ipcRenderer.send('setaudiocodec', $("#audio-select").val());
	ipcRenderer.send('setpresent', $("#present-select").val());
	ipcRenderer.send('setprefix', $("#prefix-input").val());
	ipcRenderer.send('setcrf', $("#crf-range").val());
	ipcRenderer.send('ondragstart', target_file);
});

$(document).on('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
});
$(document).on('dragover', function (e) {
  e.stopPropagation();
  e.preventDefault();
  obj.addClass('drag-over');
});

$(document).on('dragleave', function (e) {
  e.stopPropagation();
  e.preventDefault();
  obj.removeClass('drag-over');
});

$(document).on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
	
	var items = e.originalEvent.dataTransfer.items;
	for (var i=0; i<items.length; i++) {
		var item = items[i].webkitGetAsEntry();
		if (item) {
			traverseFileTree(item);
		}
	}
});

});
