#target InDesign
var _ial = app.scriptPreferences.userInteractionLevel;
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
if (app.documents.length > 0 && app.activeDocument.layoutWindows.length > 0) tabellenSuchen();
else alert("Kein Dokuemnt geöffnet","Hinweis");  
app.scriptPreferences.userInteractionLevel = _ial;

function tabellenSuchen() {
	var _dlg = app.dialogs.add({name:"Tabellen Suchen/Ersetzen"});
	// Dialog bauen ...
	var _width = 150;	
	with (_dlg) {
		with (dialogColumns.add()) {
			with (borderPanels.add()) {
				with (dialogColumns.add()) {
					staticTexts.add( {staticLabel: "Tabellenformat:", minWidth:_width} );
				} 
				with (dialogColumns.add()) {
					var _tsDropDown = dropdowns.add();
					_tsDropDown.stringList = app.activeDocument.tableStyles.everyItem().name;
				} 
			}
			with (borderPanels.add()) {
				with (dialogColumns.add()) {
					staticTexts.add( {staticLabel: "Zellenformat von Spalte:", minWidth:_width} );
				} 
				with (dialogColumns.add()) {
					var _colIndexDrop = integerComboboxes.add({editContents:"1"});
				}
				with (dialogColumns.add()) {
					var _colDropDown = dropdowns.add();
					_colDropDown.stringList = app.activeDocument.cellStyles.everyItem().name;
				}
			}
			with (borderPanels.add()) {
				with (dialogColumns.add()) {
					staticTexts.add( {staticLabel: "Zellenformat von Zeile:", minWidth:_width} );
				}
				with (dialogColumns.add()) {
					var _rowIndexDrop = integerComboboxes.add({editContents:"1"});
				} 
				with (dialogColumns.add()) {
					var _rowDropDown = dropdowns.add();
					_rowDropDown.stringList = app.activeDocument.cellStyles.everyItem().name;
				}
			}
			with (dialogRows.add()) {
				var _ende = checkboxControls.add({staticLabel: "Skriptausführung beenden", checkedState: false});
			}	
		}
	}
	// Das eigentliche Skript	... 
	var _dok = app.activeDocument;
	// Alle Objekte die Tabellen beinhalten können einsammeln...
	var _as = _dok.stories.everyItem().getElements();
	if (_dok.stories.everyItem().footnotes.length > 0) {
		_as = _as.concat(_dok.stories.everyItem().footnotes.everyItem().texts.everyItem().getElements());
	}
	if (_dok.stories.everyItem().tables.length > 0 ) { 
		_as = _as.concat(_dok.stories.everyItem().tables.everyItem().cells.everyItem().getElements());	
	}
	// Schleife über Objekte die Tabellen beinhalten können 
	for (var i =0; i < _as.length ; i++) {
		for (var k = 0; k < _as[i].tables.length; k++) {
			var _table = _as[i].tables[k];
			showIt(_table)
			// Dialog verändern, Zeilen und Spalten der aktuellen Tabelle ermitteln
			var _list = [];			
			for (var m =0; m < _table.rows.everyItem().index.length; m++) {
				_list.push ((_table.rows.everyItem().index[m] + 1) + "");
			}
			_rowIndexDrop.stringList = _list;
			_rowIndexDrop.editContents = "1";
			_list = [];
			for (var m =0; m < _table.columns.everyItem().index.length; m++) {
				_list.push ((_table.columns.everyItem().index[m]+ 1)+ "");
			}
			_colIndexDrop.stringList = _list;
			_colIndexDrop.editContents = "1";		 
			if (_dlg.show() == true) {
				if (_tsDropDown.selectedIndex > -1) {
					var _tstyle = _dok.tableStyles[_tsDropDown.selectedIndex];
					_table.appliedTableStyle = _tstyle;
					_table.clearTableStyleOverrides ();
				}
				if (_colDropDown.selectedIndex > -1) {
					var _cellStyle = _dok.cellStyles[_colDropDown.selectedIndex];
					var _col = _table.columns[_colIndexDrop.editValue -1];
					_col.cells.everyItem().appliedCellStyle	= _cellStyle;
					_col.cells.everyItem().clearCellStyleOverrides ();
				}
				if (_rowDropDown.selectedIndex > -1) {
					var _cellStyle = _dok.cellStyles[_rowDropDown.selectedIndex];
					var _row = _table.rows[_rowIndexDrop.editValue -1];
					_row.cells.everyItem().appliedCellStyle = _cellStyle;
					_row.cells.everyItem().clearCellStyleOverrides ();
				}
			}
			if (_ende.checkedState) {
				_dlg.destroy();
				return;
			}
		}
	}
	_dlg.destroy();
}

// Funktionen
// showIt() Zeigt das mit dem Parameter _object übergebene Objekt an!
function showIt (_object) {
	if (_object != null && app.documents.length > 0 && app.layoutWindows.length > 0 ) {
		app.activeWindow.activeSpread = getSpreadByObject (_object);
		app.select(_object);
		var myZoom = app.activeWindow.zoomPercentage; 
		app.activeWindow.zoom(ZoomOptions.showPasteboard); 
		app.activeWindow.zoomPercentage = myZoom;
		return true;
	}
	else {
		return false;
	}
}


// Liefert den Druckbogen, auf dem sich das Objekt _object befindet, zurück
function  getSpreadByObject (_object) {
	if (_object != null) {
		_object = _object.getElements ()[0]; // Problems with Baseclass Objects like PageItem in  CS5!
		if (_object.hasOwnProperty("baseline")) {
			_object = _object.parentTextFrames[0];
		}
		while (_object != null) {
			var whatIsIt = _object.constructor;
			switch (whatIsIt) {
				case Spread : return _object;
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
	else {
		return null;
	}
}