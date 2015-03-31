#target InDesign
var _file = File("~/Desktop/test.indd");
var _dok = app.open(_file, false);
_tf = _dok.pages.add();
var _newFile = File(_dok.filePath + "/neu_" + _dok.name);
_dok = _dok.save(_newFile);
_dok.close(SaveOptions.NO);