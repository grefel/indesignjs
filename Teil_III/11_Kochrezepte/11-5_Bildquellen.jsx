if (app.documents.length > 0) {
	var _dok = app.activeDocument;
	var _rulerOrigin = _dok.viewPreferences.rulerOrigin;
	_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	var _zeroPoint = _dok.zeroPoint;
	_dok.zeroPoint = [0,0];
	app.doScript(bildQuellen, ScriptLanguage.JAVASCRIPT, _dok, UndoModes.ENTIRE_SCRIPT, "Marginalie erstellen"); 		
	_dok.viewPreferences.rulerOrigin =_rulerOrigin;		
	_dok.zeroPoint = _zeroPoint;
} else {
	alert ("Kein Dokument geöffnet!")
}

// Das Bildquellenverzeichnis erstellen
function bildQuellen (_dok) {
	var _master = _dok.masterSpreads.itemByName("Q-Bildquellen");
	var _tf = addPageTextFrame(_dok.pages[-1], _master);
	_tf.contents = "Bildquellenverzeichnis\r";
	var _bildQuellen = [];		
	for (var i =0 ; i < _dok.links.length; i++) {
		var _link = _dok.links[i];
		if (_link.parent.hasOwnProperty("parentPage") && _link.parent.parentPage != null ) {			
			var _page = _link.parent.parentPage;
			try {
				 var _author = _link.linkXmp.author;
				 var _bq = {autor:_author, seite:_page.name};
			} 
			catch (e) {
				var _bq = {autor:"Kein Autor", seite:_page.name};
			}
			_bildQuellen.push(_bq);
		}
	}
	_bildQuellen.sort(sort_DE_Special);
	_tf.insertionPoints[-1].contents = _bildQuellen[0].autor + "\t"+ _bildQuellen[0].seite;
	for (var i =1; i <_bildQuellen.length; i++) {
		if (_bildQuellen[i].autor == _bildQuellen[i-1].autor) _tf.contents = _tf.contents + ", " + _bildQuellen[i].seite;
		else _tf.contents = _tf.contents + "\r" + _bildQuellen[i].autor + "\t"+ _bildQuellen[i].seite;
	}	
}

//~ $.writeln(_link.linkXmp.getProperty("http://ns.adobe.com/photoshop/1.0/", "Country"));

// Funktionen ... 

/** Deutsche Umlaute ersetzen */ 
// Die Hilfsfunktion dU wird für die Ausführung benötigt 
function sort_DE (a, b) {
	a =dU (a);
	b = dU (b);
	if (a==b) return 0;
	if (a > b) return 1;
	else return -1;
}
// Diese Funktion berücksichtigt, dass die Elemente des Arrays Objekte enthalten
function sort_DE_Special(a,b) {
	var x = dU(a.autor) + a.seite;
	var y = dU(b.autor) + b.seite;
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
function addPageTextFrame (_page, _master, _newPage) {
	if (_newPage == undefined)  _newPage = true;
	var _dok = _page.parent.parent;
	if (_newPage ) {
		var _newPage = _dok.pages.add(LocationOptions.AFTER, _page);
		if (_master == undefined) _newPage.appliedMaster = _page.appliedMaster;
		else _newPage.appliedMaster = _master;
	}
	else {
		var _newPage = _page;
	}
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
	_tf.textFramePreferences.textColumnCount = _newPage.marginPreferences.columnCount;
	_tf.textFramePreferences.textColumnGutter =  _newPage.marginPreferences.columnGutter	
	return _tf;
}