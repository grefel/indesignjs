if (app.documents.length > 0 && app.activeDocument.layoutWindows.length > 0) {
	var _ial = app.scriptPreferences.userInteractionLevel;
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
	exportFormatList();
	app.scriptPreferences.userInteractionLevel = _ial;
}
else {
	alert("Kein Dokuemnt geöffnet", "Hinweis");
}

function exportFormatList () {
	var _dok = app.documents[0];
	var _formatArray = [];
	app.findChangeGrepOptions.includeFootnotes = true;
	app.findGrepPreferences = NothingEnum.NOTHING;
	if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
		app.findChangeGrepOptions.searchBackwards = false;
	}
	app.findGrepPreferences.findWhat = ".+";
	var _results = _dok.findGrep();
	for (var s = 0; s < _results.length; s++) {
		var _style = _results[s].appliedParagraphStyle;
		var _formatName = _style.name;
		var _tf = _results[s].parentTextFrames[0];
		if (_tf && _tf.parentPage != null) {
			var _pagePosition = _tf.parentPage.documentOffset;
			var _pageName = _tf.parentPage.name;
		}
		else {
			var _pagePosition = "999999";
			var _pageName = "Übersatz";
		}
		_formatArray.push({name:_formatName, style:_style, pageName:_pageName, pagePosition:_pagePosition, textPosition:s});
	}
	_formatArray.sort(sortIndex);
	_formatArray = uniqueParagraphStyles(_formatArray);

	app.findGrepPreferences = NothingEnum.NOTHING;
	
	var _formatListe = "";
	
	for (var i = 0; i < _formatArray.length; i++) {
		_formatListe += _formatArray[i].name +"\tSeite: "+ _formatArray[i].pageName + "\r";
	}

	var _newDok = app.documents.add();
	var _tf = addPageTextFrame(_newDok.pages[0]);
	_tf.contents = _formatListe;
	_tf.parentStory.characters[-1].remove();
	_tf.parentStory.texts[0].convertToTable("\t", "\r");
}

// Filtert einen Array auf eindeutige Elemente, angepasst auf das im Array gespeicherte Objekt mit der Eigenschaft name
function uniqueParagraphStyles (arr) {
	var hash = {}, result = [];
	for ( var i = 0, l = arr.length; i < l; ++i ) {
		if ( !hash.hasOwnProperty(arr[i].name) ) {
			hash[ arr[i].name ] = true;
			result.push(arr[i]);
		}
	}
	return result;
}
function sortIndex (a,b) {
	if (a.pagePosition == b.pagePosition) {
		return a.textPosition - b.textPosition;
	}
	return a.pagePosition - b.pagePosition;
}
// Schreibt eine Textdatei 
function writeTextFile (_file, _string) {
	if (_file.constructor.name == "String") {
		_file = new File(_file);
	}
	if (_file.constructor.name == "File") {
		try {
			_file.encoding = "UTF-8";
			_file.open( "w" );
			_file.write (_string);
			_file.close ();
			return true;
		} catch (e) {return e}
	} 
	else {
		return Error ("This is not a File");
	}
}
/* Führende '0' hinzufügen */
function pad(number, length) {  
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }   
    return str;
}

function addPageTextFrame (_page, _master) {
	var _dok = _page.parent.parent;
	var _newPage = _dok.pages.add(LocationOptions.AFTER, _page);
	if (_master == undefined) _newPage.appliedMaster = _page.appliedMaster;
	else _newPage.appliedMaster = _master;
	var _y1 = _newPage.marginPreferences.top;
	var _y2 = _dok.documentPreferences.pageHeight - _newPage.marginPreferences.bottom;
	if (_newPage.side == PageSideOptions.LEFT_HAND) {
		var _x1 = _newPage.marginPreferences.right;
		var _x2 = _dok.documentPreferences.pageWidth - _newPage.marginPreferences.left;
	} 
	else {
		var _x1 = _newPage.marginPreferences.left;
		var _x2 = _dok.documentPreferences.pageWidth - _newPage.marginPreferences.right;
	}
	var _tf = _newPage.textFrames.add();	
	
	var _breite = _x2 -_x1;
	_breiteInPunkt = new UnitValue(  _breite+ "mm").as("pt");
	var _hoehe = _y2 -_y1;
	_hoeheInPunkt = new UnitValue( _hoehe + "mm").as("pt");	
	_tf.resize(BoundingBoxLimits.GEOMETRIC_PATH_BOUNDS, AnchorPoint.TOP_LEFT_ANCHOR , ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [_breiteInPunkt, _hoeheInPunkt ]) ;
	_tf.move([_tf.geometricBounds[1] + _x1, _tf.geometricBounds[0] + _y1])				
	return _tf;
}