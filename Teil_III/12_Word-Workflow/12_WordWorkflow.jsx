#target InDesign

// Die Dateien auswählen... Mit getFileFilter() bekommt man einen Filefilter um in Mac bzw. Windows die auszuwählenden Dateien im Dialog einzuschränken
var _filter = getFileFilter(".indt", "InDesign Template:");
var _templateFile = File.openDialog("Bitte Template auswählen!", _filter, false);
var _filter = getFileFilter(".doc", "Word Datei:");
var _wordFile = File.openDialog("Bite Word Datei auswählen!", _filter, false);


// Wenn etwas ausgewählt wurde, kann das Skript ausgeführt werden 
if (_templateFile != null && _wordFile != null) {
	var _userLevel = app.scriptPreferences.userInteractionLevel;
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
	var _bildFolder = Folder (_wordFile.parent + "/Bilder");
	if (!_bildFolder.exists) alert ("Das Verzeichnis für den automatischen Bildimport konnte nicht gefunden werden.");

	try {
			var _dok = app.open(_templateFile);	
	} catch (e) {
		alert ("Es ist ein Fehler beim Öffnen von\n" +_templateFile+ "\naufgetreten!\n\n" + e, "Fehler");
		app.scriptPreferences.userInteractionLevel = _userLevel;
		exit();
	}
	// Wen das Template die Prüfung in checkDok() besteht wird das Skript ausgeführt
	if (checkDok(_dok)) {
		var _hMUnits = _dok.viewPreferences.horizontalMeasurementUnits;
		_dok.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
		var _VMUnits = _dok.viewPreferences.verticalMeasurementUnits;
		_dok.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
		var _rulerOrigin = _dok.viewPreferences.rulerOrigin;
		_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
		var _zeroPoint = _dok.zeroPoint;
		_dok.zeroPoint = [0,0];
		try {
			var _story = wordImport (_wordFile, _dok);
			styleDoc(_story, _dok, _bildFolder);
			createRegister (_dok);
			try {
				_dok.paragraphStyles.itemByName("Bild").remove();
				_dok.paragraphStyles.itemByName("Kapitelstart").remove();
			} catch (e) {/*Absatzformatvorlage wurde nicht importiert*/}
		} catch (e) {
	 		alert ("Es ist ein Fehler aufgetreten: " + e);
		}
		_dok.viewPreferences.horizontalMeasurementUnits = _hMUnits;
		_dok.viewPreferences.verticalMeasurementUnits = _VMUnits;
		_dok.viewPreferences.rulerOrigin = _rulerOrigin;
		_dok.zeroPoint = _zeroPoint;
		app.scriptPreferences.userInteractionLevel = _userLevel;
	} else {
		alert ("Das ausgewählte Template entspricht nicht den Vorgaben!");
	}
} else {
	alert ("Bitte wählen Sie ein Dokument und ein Template aus!");
}

// Voraussetzungen prüfen ... 
function checkDok (_dok) {
	// Schriften prüfen 
	for (var f =0; f < _dok.fonts.length; f++ ) {
		if (_dok.fonts[f].status != FontStatus.INSTALLED) {
			alert("Bitte alle Schriften für das Template installieren!");
			return false;	
		}
	}
	// Prüfen ob alle Formate vorhanden sind
	if (_dok.objectStyles.itemByName ("icon") != null &&
		_dok.objectStyles.itemByName ("bild") != null &&
		_dok.paragraphStyles.itemByName ("abs") != null &&
		_dok.paragraphStyles.itemByName ("u1") != null &&
		_dok.paragraphStyles.itemByName ("u2") != null &&
		_dok.paragraphStyles.itemByName ("einschub") != null &&
		_dok.characterStyles.itemByName ("kursiv") != null &&
		_dok.masterSpreads.itemByName ("V-Vorlage") != null &&
		_dok.masterSpreads.itemByName ("R-Register") != null ) 
	{
		return true;
	} else {
		return false;
	}
}
	
// Word-Datei importieren, Formate löschen und Inhaltsseiten aufbauen
function wordImport (_wordFile, _dok) {	
	with (app.wordRTFImportPreferences) {
		importEndnotes = true;
		importFootnotes = true;
		importIndex = false;
		importTOC = false;	
		useTypographersQuotes = true;
		convertPageBreaks = ConvertPageBreaks.NONE;
		preserveGraphics = true;
		preserveTrackChanges = false;
		convertBulletsAndNumbersToText = false;
		removeFormatting = false;
		importUnusedStyles = false;
		resolveParagraphStyleClash = ResolveStyleClash.RESOLVE_CLASH_USE_EXISTING;
		resolveCharacterStyleClash = ResolveStyleClash.RESOLVE_CLASH_USE_EXISTING;
	}	
	var _storyArray = _dok.pages[0].place(_wordFile, [24,28], undefined, false, true);
	var _story = _storyArray[0];		
	try {
		_dok.paragraphStyles.itemByName("Standard").remove(_dok.paragraphStyles.itemByName("abs"));
	} catch (e) {/*Absatzformatvorlage wurde nicht importiert*/}
	try { _dok.paragraphStyles.itemByName("Überschrift 1").remove(_dok.paragraphStyles.itemByName("u1")); } catch (e) {/*Absatzformatvorlage wurde nicht importiert*/}
	try { _dok.paragraphStyles.itemByName("Überschrift 2").remove(_dok.paragraphStyles.itemByName("u2")); } catch (e) {/*Absatzformatvorlage wurde nicht importiert*/}
	try { _dok.paragraphStyles.itemByName("Hinweistext").remove(_dok.paragraphStyles.itemByName("einschub")); } catch (e) {/*Absatzformatvorlage wurde nicht importiert*/}
	try { _dok.characterStyles.itemByName("Fett").remove(_dok.characterStyles.itemByName("kursiv")); } catch (e) {/*Absatzformatvorlage wurde nicht importiert*/}
	checkOverflow(_story);
	return _story;
}

// Text formatieren und Bilder platzieren 
function styleDoc (_story, _dok, _bildFolder) {		
	var _farbe= _dok.swatches.itemByName("Black");
	var _master = _dok.masterSpreads[0];
	var _newMaster = _master;
	for (var i = 0; i < _story.textContainers.length; i++) {
		var _tc = _story.textContainers[i];
		var _page = getPageByObject(_tc);
		for (k= 0; k < _tc.paragraphs.length; k++) {
			var _par = _tc.paragraphs[k].getElements()[0];
			_par.clearOverrides ();
			var _pSName = _par.appliedParagraphStyle.name;
			// Kapitel und Musterseiten aufbauen
			if (_pSName == "Kapitelstart" ) {
				var _kapitelName = _par.words[0].contents;
				_farbe = _dok.swatches.itemByName(_kapitelName);
				if (_farbe == null ) _farbe = _dok.swatches.itemByName("Black"); // ab CS4 mit isValid prüfen 
				var _iconName = _kapitelName.toLowerCase() + "_icon.jpg";
				var _iconFile = File(_bildFolder + "/" + _iconName);
				if (_iconFile.exists) {
					var _newMaster = _dok.masterSpreads.add();
					_newMaster.appliedMaster = _dok.masterSpreads.itemByName ("V-Vorlage");
					_newMaster.baseName = _kapitelName;
					_newMaster.namePrefix = _kapitelName[0];
					var _kolIcon = getMasterPageItem ("kolumne-icon", _newMaster.pages[1]);
					if (_kolIcon != null) {
						_kolIcon.fillColor = _farbe
						_kolIcon.place(_iconFile);
					}
					var _kolTitel = getMasterPageItem ("koltitel", _newMaster.pages[0]);
					if (_kolTitel != null) _kolTitel.paragraphs[0].fillColor = _farbe;
					_kolTitel = getMasterPageItem ("koltitel", _newMaster.pages[1]);
					if (_kolTitel != null) _kolTitel.paragraphs[0].fillColor = _farbe;
				}
				_par.remove();
				k--;
				continue;
			}
			// Überschriften formatieren 
			if ( _pSName == "u1" || _pSName == "u2") {
				_par.fillColor = _farbe;
				_nextPar = nextParagraph(_par)
				_nextPar.appliedParagraphStyle = _dok.paragraphStyles.itemByName("abs_ohne_einzug");
				_master = _newMaster;
				continue;
			}
			// Bilder platzieren 
			if ( _pSName == "Bild" ) {
				var _bildFile = File(_bildFolder + "/" + _par.words[0].contents);
				if (_bildFile.exists) {
					var _rect = _page.rectangles.add();
					_rect.geometricBounds = _tc.geometricBounds;
					_rect.place(_bildFile);
					_rect.appliedObjectStyle = _dok.objectStyles.itemByName ("bild");
					_rect.fit(FitOptions.FRAME_TO_CONTENT);
					_par.remove();
					k--;					
				}
				continue;
			}	
			// Hinweistext mit Icon versehen
			if (_pSName == "einschub" ) {
				_par.fillColor = _farbe;
				if (_iconFile.exists) {
					var _capHeigt = getCapHeight (_par.characters[0]);
					var _y1 = _par.characters[0].baseline - _capHeigt;
					var _x1 = _tc.geometricBounds[1];
					var _rect = _page.rectangles.add();
					_rect.geometricBounds = [_y1, _x1, _y1 + 8.2, _x1 + 8.2];
					_rect.place(_iconFile);
					_rect.appliedObjectStyle = _dok.objectStyles.itemByName ("icon");
					_rect.fit(FitOptions.CONTENT_TO_FRAME);
					_rect.fit(FitOptions.CENTER_CONTENT);
				}
			}		
		} // end for paragraphs 
		_page.appliedMaster = _master;
		checkOverflow(_story);
	} // end for textContainers
} 
// Index erstellen 
function createRegister (_dok) {	
	if (_dok.indexes.length == 0 ) {
		var _dokIndex = _dok.indexes.add();
	} else {
		var _dokIndex = _dok.indexes[0];
	}
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.findGrepPreferences.appliedCharacterStyle = app.activeDocument.characterStyles.itemByName("kursiv");
	_ergebnisArray =_dok.findGrep(true);
	app.findGrepPreferences = NothingEnum.NOTHING;
	// Indexeinträge erstellen 
	for (var i = 0; i < _ergebnisArray.length; i++) {
		var _indexEintrag = _ergebnisArray[i];
		 var _topic = _dokIndex.topics.add(_indexEintrag.contents);	 
		 _topic.pageReferences.add(_indexEintrag);
	}
	var _regPage = _dok.pages.add();
	_regPage.appliedMaster = _dok.masterSpreads.itemByName ("R-Register");
	_dok.indexes[0].generate (_regPage, [24,28], undefined, true );		
}




// Allgemeine Funktionen 
// Prüft ob der letzte Textrahmen der Story _story einen Texüberlauf hat oder leer ist. Ggf. werden Textrahmen hinzugefügt oder gelöscht
function checkOverflow(_story) {
	var _lastTC = _story.textContainers[_story.textContainers.length - 1];
	var _run = true;
	while (_lastTC.overflows && _run) {
		var _last = _story.textContainers.length -1;
		if (_story.textContainers[_last].characters.length == 0 && _story.textContainers[_last -1].characters.length == 0 && _story.textContainers[_last -2].characters.length ==0 ) _run = false;
		var _page = getPageByObject(_lastTC);
		var _tf = addPageTextFrame(_page);
		_lastTC.nextTextFrame = _tf;
		_lastTC = _tf;
	}
	while (_lastTC.characters.length == 0) {
		var _page = getPageByObject(_lastTC);
		_page.remove();
		_lastTC = _story.textContainers[_story.textContainers.length - 1];
	}
}
// Fügt eine neue Seite mit einen Textrahmen in der Größe des Satzspiegels hinzu
function addPageTextFrame(_page) {
	var _dok = _page.parent.parent;
	var _newPage = _dok.pages.add(LocationOptions.AFTER, _page);
	_newPage.appliedMaster = _page.appliedMaster;
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


// Liefert ein benanntes Seitenobjekt zurück. Unabhängig, ob es sich noch auf der Musterseite befindet oder bereits gelöst wurde // Achtung: Ab CS5 muss sichergestellt sein, dass der Name in der Eigenschaft name enthalten ist (vs. label CS3/CS4)
function getMasterPageItem(_label, _page) {
	if (_page.appliedMaster == null ) return null; // Keine Musterseite angewendet 
	var _pi = _page.pageItems.itemByName(_label);
	if (_pi == null ) {
		if (_page.side == PageSideOptions.RIGHT_HAND) {
			var _mpi = _page.appliedMaster.pages[1].pageItems.itemByName(_label);
			try { // Versuche das Objekt zu lösen
				return _mpi.override(_page);
			} catch (e) { // Es war schon gelöst, da es aber auch in _pi ist, ist es gelöscht worden!
				return null;
			}
		} else { // Left oder Single
			var _mpi = _page.appliedMaster.pages[0].pageItems.itemByName(_label);
			try {
				return _mpi.override(_page);
			} catch (e) {
				return null;
			}
		}
	}
	else { // Object ist schon gelöst...
		return _pi;
	}
}

// Liefert die Versalhöhe von _char zurück
function getCapHeight (_char) {
	var _tf = app.activeDocument.textFrames.add();
	_tf.geometricBounds = [0,-100,100,-200];
	_tf.textFramePreferences.insetSpacing = [0,0,0,0];
	var _checkChar = _char.duplicate(LocationOptions.AT_BEGINNING, _tf);
	_checkChar.contents = "H";
	_checkChar.alignToBaseline = false;
	_tf.textFramePreferences.firstBaselineOffset = FirstBaseline.CAP_HEIGHT; 
	var _versalHoehe = _checkChar.baseline;
//~ 	$.writeln("Versahlhöhe ist: " + _versalHoehe);
	_tf.remove();
	return _versalHoehe;
}

// Liefert die Seite, auf der sich das Objekt _object befindet, zurück
function getPageByObject (_object){ 
	if (_object.hasOwnProperty("baseline")) {
		_object = _object.parentTextFrames[0];
	}
	while (_object != null) {
		if (_object.hasOwnProperty ("parentPage")) return _object.parentPage;
		var whatIsIt = _object.constructor;
		switch (whatIsIt) {
			case Page : return _object;
			case Character : _object = _object.parentTextFrames[0]; break;
			case Footnote :; // drop through
			case Cell : _object = _object.insertionPoints[0].parentTextFrames[0]; break;
			case Note : _object = _object.storyOffset.parentTextFrames[0]; break;
			case XMLElement : if (_object.insertionPoints[0] != null) { _object = _object.insertionPoints[0].parentTextFrames[0]; break; }
			case Application : return null;
			default: _object = _object.parent;
		}
		if (_object == null) return null;
	}
	return _object;
}

// Optimiert die Funktion nextItem() der Sammlung Paragraphs, Dieser Ansatz liefert bei großen Textmengen deutlich schneller den nächsten Absatz als nextItem()
function nextParagraph(_par) {
	var _lastCharLetzterIndex = _par.characters[-1].index;
	var _firstCharNaechster = _par.parentStory.characters[_lastCharLetzterIndex + 1];
	if (_firstCharNaechster != null ) return _firstCharNaechster.paragraphs[0]
	else return null;
}
// Filter für Dateiauswahl 
function getFileFilter (_ext, _string) {
	if (File.fs == "Windows") {
		var _filter = _string + "*"+ _ext;
	} 
	else {
		function _filterFilesMac(file) {
			while (file.alias) {
				file = file.resolve();
				if (file == null) { return false }
			}
			if (file.constructor.name == "Folder") return true;
			var _extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
			if (_extension.indexOf (_ext) > -1 ) return true;
			else return false
		}
		var _filter = _filterFilesMac;
	} 
	return _filter;
}
