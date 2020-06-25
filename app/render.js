const {ipcRenderer} = require('electron')

var $ = require('jquery');

function traverseFileTree(item, path) {
  path = path || "";
  if (item.isFile) {
    // Get file
    item.file(function(file) {
      console.log("File:", path + file.name);
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
	$("#label-crf").html($(this).value);
});

$("#btnRender").click(function() {
  console.log('Hello');
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