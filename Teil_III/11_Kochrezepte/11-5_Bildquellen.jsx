#target InDesign
if (app.documents.length > 0) {
	var _dok = app.activeDocument;
	var _rulerOrigin = _dok.viewPreferences.rulerOrigin;
	_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	var _zeroPoint = _dok.zeroPoint;
	_dok.zeroPoint = [0,0];
	if (app.scriptPreferences.version >= 6 ) { // Ab CS4 Undo bereitstellen
		app.doScript(bildQuellen, ScriptLanguage.JAVASCRIPT, _dok, UndoModes.ENTIRE_SCRIPT, "Marginalie erstellen"); 		
	} 
	else {
		bildQuellen(_dok);
	}
	_dok.viewPreferences.rulerOrigin =_rulerOrigin;		
	_dok.zeroPoint = _zeroPoint;
} else {
	alert ("Kein Dokument geöffnet!")
}

// Das Bildquellenverzeichnis erstellen
function bildQuellen (_dok) {
	var _master = _dok.masterSpreads.itemByName("Q-Bildquellen");
	var _tf = addPageTextFrame(_dok.pages[-1], _master);
	_tf.contents = "Bildquellenverzeichnis";
	var _bildQuellen = [];		
	for (var i =0 ; i < _dok.links.length; i++) {
		var _link = _dok.links[i];
		var _page = getPageByObject (_link);			
		if (_page != null ) {			
			try {
				 var _author = _link.linkXmp.author;
				 var _bq = [_author, _page.name];
			} 
			catch (e) {
				var _bq = ["Kein Autor", _page.name];
			}
			_bildQuellen.push(_bq);
		}
	}
	_bildQuellen.sort(sort_DE_Special);	
	_tf.insertionPoints[-1].contents = "\r";
	_tf.insertionPoints[-1].contents = _bildQuellen[0][0] + "\t"+ _bildQuellen[0][1];
	for (var i =1; i <_bildQuellen.length; i++) {
		if (_bildQuellen[i][0] == _bildQuellen[i-1][0]) _tf.contents = _tf.contents + ", " + _bildQuellen[i][1];
		else _tf.contents = _tf.contents + "\r" + _bildQuellen[i][0] + "\t"+ _bildQuellen[i][1];
	}	
}

//~ $.writeln(_link.linkXmp.getProperty("http://ns.adobe.com/photoshop/1.0/", "Country"));			


// Funktionen ... 
// getPageByObject() Findet die Seite, auf der sich das Objekt, das im ersten Parameter übergeben wird, befindet.
// Wenn sich das Objekt nicht auf einer Seite befindet, liefert die Funktion null zurück.
function getPageByObject (_objekt){ 
	if (_objekt.hasOwnProperty("baseline")) {
		_objekt = _objekt.parentTextFrames[0];
	}
	while (_objekt != null) {
		if (_objekt.hasOwnProperty ("parentPage")) return _objekt.parentPage;
		var whatIsIt = _objekt.constructor;
		switch (whatIsIt) {
			case Page : return _objekt;
			case Character : _objekt = _objekt.parentTextFrames[0]; break;
			case Footnote :; // drop through
			case Cell : _objekt = _objekt.insertionPoints[0].parentTextFrames[0]; break;
			case Note : _objekt = _objekt.storyOffset.parentTextFrames[0]; break;
			case XMLElement : if (_objekt.insertionPoints[0] != null) { _objekt = _objekt.insertionPoints[0].parentTextFrames[0]; break; }
			case Application : return null;
			default: _objekt = _objekt.parent;
		}
		if (_objekt == null) return null;
	}
	return _objekt
}
/** Deutsche Umlaute ersetzen */ 
// Die Hilfsfunktion dU wird für die Ausführung benötigt 
function sort_DE (a, b) {
	a =dU (a);
	b = dU (b);
	if (a==b) return 0;
	if (a > b) return 1;
	else return -1;
}
// Diese Funktion berücksichtigt, dass die Elemente des Arrays wiederum Arrays mit zwei Elementen sind, es wird nach dem erseten Element sortiert
function sort_DE_Special(a,b) {
	var x = dU(a[0]) + a[1];
	var y = dU(b[0]) + b[1];
	if (x==y) return 0;
	if (x > y) return 1;
	else return -1;
}
function dU (a) {
	a = a.toLowerCase();
	a = a.replace(/ä/g,"a");
	a = a.replace(/ö/g,"o");
	a = a.replace(/ü/g,"u");
	a = a.replace(/ß/g,"s");	
	return a;
}
// Fügt eine neue Seite mit einen Textrahmen in der Größe des Satzspiegels hinzu
function addPageTextFrame(_page, _master) {
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
	_tf.geometricBounds = [_y1 , _x1 , _y2 , _x2];
	return _tf;
}