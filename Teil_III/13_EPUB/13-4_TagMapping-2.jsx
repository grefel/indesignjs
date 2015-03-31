// Tragen Sie hier weitere Formatzuordnungen ein:
mappingTable = {
	paragraphStyles : [
		{name:"Absatz", exportTag:"p", exportClass:"paragraph", emitCss:false, splitDocument:false},
		{name:"Titel", exportTag:"h1", exportClass:"main_title", emitCss:false, splitDocument:true}
	],
	characterStyles : [
		{name:"fett", exportTag:"span", exportClass:"bold", emitCss:false},
	],
	objectStyles : [
		{name:"Rahmen", exportTag:"div", exportClass:"frame", emitCss:false},
	]
}

tagsExport()

function tagsExport() {
	if (app.scriptPreferences.version < 10) {
		alert ("Für Diese Skript wird InDesign CC 2014 benötigt");
		return;
	}
	if (app.documents.length == 0 && app.activeDocument.layoutWindows.length > 0) { 
		alert ("Kein Dokuemnt geöffnet!");
		return;
	}
	var _dok = app.documents[0];
	for (var i = 1; i < _dok.allParagraphStyles.length; i++) {
		var _pStyle = _dok.allParagraphStyles[i];
		removeExportMap(_pStyle.styleExportTagMaps);
		var _mappingObject = getMapping(_pStyle);
		_pStyle.styleExportTagMaps.add("EPUB", _mappingObject.exportTag, _mappingObject.exportClass, "");
		_pStyle.emitCss = _mappingObject.emitCss;
		_pStyle.splitDocument = _mappingObject.splitDocument
	}
	for (var i = 1; i < _dok.allCharacterStyles.length; i++) {
		var _cStyle = _dok.allCharacterStyles[i];
		removeExportMap(_cStyle.styleExportTagMaps);
		var _mappingObject = getMapping(_cStyle);
		_cStyle.styleExportTagMaps.add("EPUB", _mappingObject.exportTag, _mappingObject.exportClass, "");
		_cStyle.emitCss = _mappingObject.emitCss;
	}
	for (var i = 1; i < _dok.allObjectStyles.length; i++) {
		var _oStyle = _dok.allObjectStyles[i];
		removeExportMap(_oStyle.objectStyleExportTagMaps);
		var _mappingObject = getMapping(_oStyle);
		_oStyle.objectStyleExportTagMaps.add("EPUB", _mappingObject.exportTag, _mappingObject.exportClass, "");
		_oStyle.emitCss = _mappingObject.emitCss;
	}
}

function getMapping(_style) {
	var _styleName = _style.name;
	var _styleType = _style.constructor.name;
	var _mappingArray = mappingTable[_styleType.substring(0,1).toLowerCase() + _styleType.substring(1)+ "s"];
	for (var i = 0; i < _mappingArray.length; i++) {
		if (_mappingArray[i].name == _styleName) return _mappingArray[i];
	}
	// Defaults 
	var _exportClass = cleanStyleName(_styleName);
	var _exportTag, _emitCss,  _splitDocument;
	if (_styleType == "ParagraphStyle") {
		_exportTag = "p";
		_emitCss = true;
		_splitDocument = false;
	}
	else if (_styleType == "CharacterStyle")  {
		_exportTag = "span";
		_emitCss = true;
	}
	else if (_styleType == "ObjectStyle")  {
		_exportTag = "div";
		_emitCss = true;
	}
	return {name:_styleName, exportTag:_exportTag, exportClass:_exportClass, emitCss:_emitCss, splitDocument:_splitDocument}
}

function cleanStyleName(_styleName) {
	_styleName = _styleName.replace(/ä/gi, "ae");
	_styleName = _styleName.replace(/ö/gi, "oe");
	_styleName = _styleName.replace(/ü/gi, "ue");
	_styleName = _styleName.replace(/[^\w\d-]/g, "_");
	return _styleName;
}

function removeExportMap (_styleExportTagMaps) {
	for (var j = _styleExportTagMaps.length - 1; j >= 0; j--) {
		var _exportMap = _styleExportTagMaps[j];
		if (_exportMap.exportType == "EPUB") _exportMap.remove();
	}	
}