main();

function main () {
	if (app.documents.length > 0) {
		var _dok = app.activeDocument;
		if (!_dok.objectStyles.itemByName("bild").isValid || !_dok.objectStyles.itemByName("legende").isValid || !_dok.objectStyles.itemByName("qr-code").isValid) {
			alert ("Fehlendes Objektformat [bild], [legende] oder [qr-code]");
			return;
		}
		var _rulerOrigin = _dok.viewPreferences.rulerOrigin;
		_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
		var _zeroPoint = _dok.zeroPoint;
		_dok.zeroPoint = [0,0];
		xmlImport (_dok);	
		_dok.viewPreferences.rulerOrigin =_rulerOrigin;		
		_dok.zeroPoint = _zeroPoint;
	} else {
		alert ("Kein Dokument geöffnet!")
	}
}

function xmlImport (_dok) {
	with (_dok.xmlImportPreferences)	{
		importStyle = XMLImportStyles.MERGE_IMPORT;
		createLinkToXML = false;		
		allowTransform = false;
		repeatTextElements = false;
		importTextIntoTables = false;
		ignoreWhitespace = false;		
		removeUnmatchedExisting = false;
		importCALSTables = false;
	}
	var _xmlFile = File.openDialog ("Bitte XML-Datei auswählen");
	_dok.importXML(_xmlFile);
	var _rootXML = _dok.xmlElements[0];
	for (var i = 0; i < _rootXML.xmlElements.length; i++) {
		var _rezeptXML = _rootXML.xmlElements[i];
		var _master = _dok.masterSpreads[0];
		if (_rezeptXML.xmlAttributes.itemByName("art").value == "hauptgericht") {
			_master = _dok.masterSpreads.itemByName ("h-hauptgericht");
		}
		else if (_rezeptXML.xmlAttributes.itemByName("art").value == "vorspeise") {
			_master = _dok.masterSpreads.itemByName ("v-vorspeise");
		}
		else if (_rezeptXML.xmlAttributes.itemByName("art").value == "dessert") {
			_master = _dok.masterSpreads.itemByName ("d-dessert");
		}
		var _page = _dok.pages.add(LocationOptions.AT_END, undefined, {appliedMaster:_master});
		var _tf = getMasterPageItem("tf", _page);
		_page = _dok.pages.add(LocationOptions.AT_END, undefined, {appliedMaster:_master});
		_nextTf = getMasterPageItem("tf", _page);
		_tf.nextTextFrame = _nextTf;
		_rezeptXML.placeXML (_tf);
		var _bcXML = _rezeptXML.xmlElements.itemByName ("bild-container");
		if (_bcXML.isValid ) {
			var _gbPage = getBounds(_page);
			var _bildXML = _bcXML.xmlElements.itemByName ("bild");
			var _rect = _bildXML.placeIntoFrame(_page, _gbPage);
			_rect.appliedObjectStyle = _dok.objectStyles.itemByName("bild");
			_rect.fit(FitOptions.FRAME_TO_CONTENT);			
			_gbBild = _rect.geometricBounds;
			var _legXML = _bcXML.xmlElements.itemByName ("legende");
			if (_legXML.isValid) {
				_gbLeg = [ _gbBild[2], _gbBild[1], _gbBild[2] + 4.5, _gbBild[3]];
				var _tf = _legXML.placeIntoFrame (_page, _gbLeg);
				_tf.appliedObjectStyle = _dok.objectStyles.itemByName("legende");
			}
		}
		var _wlXML = _rezeptXML.xmlElements.itemByName("weblink");
		if (_wlXML.isValid) {
			var _qr = _wlXML.placeIntoInlineFrame([20,20]);
			_qr.appliedObjectStyle = _dok.objectStyles.itemByName("qr-code");
			var _url = _wlXML.xmlAttributes.itemByName("url").value;
			var _swatch = _dok.swatches.itemByName("gruen");
			if (_qr.hasOwnProperty ("createHyperlinkQRCode")) {
				_qr.createHyperlinkQRCode(_url, _swatch);
			}
		}
	}
}


// Liefert ein benanntes Seitenobjekt zurück. Unabhängig, ob es sich noch auf der Musterseite befindet oder bereits gelöst wurde // Achtung: Ab CS5 muss sichergestellt sein, dass der Name in der Eigenschaft name enthalten ist (vs. label CS3/CS4)
function getMasterPageItem(_label, _page) {
	if (_page.appliedMaster == null ) return null; // No MasterPage applied 
	var _pi = _page.pageItems.itemByName(_label);
	if (_pi == null ) {
		if (_page.side == PageSideOptions.RIGHT_HAND) {
			var _mPage = _page.appliedMaster.pages[1];
			var _mpi = _mPage.pageItems.itemByName(_label);
			while (_mpi == null && _mPage.appliedMaster != null) {
				_mpi = _mPage.appliedMaster.pages[1].pageItems.itemByName(_label);
				_mPage = _mPage.appliedMaster.pages[1];
			}
			try { // Try to release the object
				var pageItem = _mpi.override(_page);
				var piBounds = pageItem.geometricBounds;
				var mpiBounds = _mpi.geometricBounds;
				if (piBounds[0]  != mpiBounds[0] ||  piBounds[1]  != mpiBounds[1] ) {
					pageItem.geometricBounds = mpiBounds;
				} 						
				return pageItem;
			} catch (e) { // Object was already released but was deleted as it is also included in _pi!
				return null;
			}
		} else { // Left or Single
			var _mPage = _page.appliedMaster.pages[0];
			var _mpi = _mPage.pageItems.itemByName(_label);
			while (_mpi == null && _mPage.appliedMaster != null) {
				_mpi = _mPage.appliedMaster.pages[0].pageItems.itemByName(_label);
				_mPage = _mPage.appliedMaster.pages[0];
			}					
			try {
				var pageItem = _mpi.override(_page);
				var piBounds = pageItem.geometricBounds;
				var mpiBounds = _mpi.geometricBounds;
				if (piBounds[0]  != mpiBounds[0] ||  piBounds[1]  != mpiBounds[1] ) {
					pageItem.geometricBounds = mpiBounds;
				} 						
				return pageItem;
			} catch (e) {
				return null;
			}
		}
	}
	else { // Object has already been released ...
		return _pi;
	}
}
// Liefert den Satzspiegel der Seite
function getBounds(_page) {
	var _dok = app.activeDocument;
	var _y1 = _page.marginPreferences.top;
	var _y2 = _dok.documentPreferences.pageHeight - _page.marginPreferences.bottom;
	if (_page.side == PageSideOptions.LEFT_HAND) {
		var _x1 = _page.marginPreferences.right;
		var _x2 = _dok.documentPreferences.pageWidth - _page.marginPreferences.left;
	} 
	else {
		var _x1 = _page.marginPreferences.left;
		var _x2 = _dok.documentPreferences.pageWidth - _page.marginPreferences.right;
	}
	return [_y1 , _x1 , _y2 , _x2];
}