main();

function main () {
	if (app.documents.length > 0) {
		var _dok = app.activeDocument;
		var _rulerOrigin = _dok.viewPreferences.rulerOrigin;
		_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
		var _zeroPoint = _dok.zeroPoint;
		_dok.zeroPoint = [0,0];
		xmlImport(_dok);
		_dok.viewPreferences.rulerOrigin =_rulerOrigin;		
		_dok.zeroPoint = _zeroPoint;
	} else {
		alert ("Kein Dokument geöffnet!")
	}
}

function xmlImport (_dok) {
	var xmlStyleMap = {
		blockArray : [
			{xpath:"//rezept[@art='hauptgericht']/titel", style:"titel-haupt", text:"\r"},
			{xpath:"//rezept[@art='dessert']/titel", style:"titel-dessert", text:"\r"},
			{xpath:"//u-zwischen", style:"u-zwischen", text:"\r"},
			{xpath:"//schritt", style:"schritt", text:"\r"},
			{xpath:"//zutat/name", style:"zutat", text:"\r"},
			{xpath:"//bild-container", style:"bild-container", text:"\r"},
		], 
		inlineArray : [
			{xpath:"//fett", style:"fett", text:""},
			{xpath:"//kursiv", style:"kursiv", text:""},
			{xpath:"//menge", style:"fett", text:"\t"},
		]
	};	
	//Load XML File 
	var _xmlFile = File.openDialog ("Bitte wählen Sie die zu verarbeitende XML-Datei aus");
	if (_xmlFile == null) {
		alert ("Fehler bei Dateiauswahl!")
		return;
	}
	with (_dok.xmlImportPreferences)	{
		importStyle = XMLImportStyles.MERGE_IMPORT;
		createLinkToXML = false;		
		allowTransform = false;
		repeatTextElements = false;
		importTextIntoTables = false;
		ignoreWhitespace = true;
		removeUnmatchedExisting = false;
		importCALSTables = false;
	}		
	_dok.importXML(_xmlFile);	
	var _rootXML = _dok.xmlElements[0];
	for (i = 0; i < xmlStyleMap.blockArray.length; i++) {
		var _mapObject = xmlStyleMap.blockArray[i];
		var _pStyle = getParagraphStyle (_dok, _mapObject.style);
		var _xmls = _rootXML.evaluateXPathExpression(_mapObject.xpath);
		for (var x  = 0; x < _xmls.length; x++) {
			var _xml = _xmls[x];
			_xml.insertTextAsContent (_mapObject.text, XMLElementPosition.AFTER_ELEMENT);
			_xml.applyParagraphStyle(_pStyle);
		}
	}
	for (i = 0; i < xmlStyleMap.inlineArray.length; i++) {
		var _mapObject = xmlStyleMap.inlineArray[i];
		var _cStyle = getCharacterStyle (_dok, _mapObject.style);
		var _xmls = _rootXML.evaluateXPathExpression(_mapObject.xpath);
		for (var x  = 0; x < _xmls.length; x++) {
			var _xml = _xmls[x];
			_xml.insertTextAsContent (_mapObject.text, XMLElementPosition.AFTER_ELEMENT);
			_xml.applyCharacterStyle(_cStyle);
		}
	}

	// Bereinigung von Absätzen am Ende der Story
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.findWhat = "\\r\\Z";
	app.changeGrepPreferences.changeTo = "";
	_dok.changeGrep();
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
}




// Liefert das 
function getParagraphStyle (_dok, _styleName) {
	for (var i = 0; i < _dok.allParagraphStyles.length; i++) {
		if (_dok.allParagraphStyles[i].name == _styleName) {
			return _dok.allParagraphStyles[i];
		}
	}
	// Style muss erstellt werden 
	return app.activeDocument.paragraphStyles.add({name:_styleName});
}
function getCharacterStyle (_dok, _styleName) {
	for (var i = 0; i < _dok.characterStyles.length; i++) {
		if (_dok.characterStyles[i].name == _styleName) {
			return _dok.characterStyles[i];
		}
	}
	// Style muss erstellt werden 
	return app.activeDocument.characterStyles.add({name:_styleName});
}
