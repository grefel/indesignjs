#target InDesign
var _ial = app.scriptPreferences.userInteractionLevel;
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
if (app.documents.length > 0 && app.activeDocument.layoutWindows.length > 0) tabellenSuchen();
else alert("Kein Dokuemnt geöffnet","Hinweis");  
app.scriptPreferences.userInteractionLevel = _ial;

function tabellenSuchen() {
	var _dok = app.activeDocument;
	// Alle Objekte die Tabellen beinhalten können einsammeln...
	var _as = _dok.stories.everyItem().getElements();
	if (_dok.stories.everyItem().footnotes.length > 0) {
		_as = _as.concat(_dok.stories.everyItem().footnotes.everyItem().texts.everyItem().getElements());
	}
	if (_dok.stories.everyItem().tables.length > 0 ) { 
		_as = _as.concat(_dok.stories.everyItem().tables.everyItem().cells.everyItem().getElements());	
	}


	var _replaceValues = {
		tableStyles:app.activeDocument.tableStyles.everyItem().name,
		tableStylesSelectedIndex:0,
		tableStylesIgnore:true,
		tableStylesCellIgnore:true,
		cellStyles:app.activeDocument.cellStyles.everyItem().name,
		colNumber:"1",
		colCellStylesSelectedIndex:0,
		colCellStylesIgnore:true,
		rowNumber:"1",
		rowCellStylesSelectedIndex:0,
		rowCellStylesIgnore:true
	}
	_replaceValues.tableStyles.unshift ("Ignorieren");
	_replaceValues.cellStyles.unshift ("Ignorieren");
	
	
	// Schleife über Objekte die Tabellen beinhalten können 
	for (var i =0; i < _as.length ; i++) {
		for (var k = 0; k < _as[i].tables.length; k++) {
			var _table = _as[i].tables[k];
			showIt(_table);
			// Dialog bauen ...
			var _dlg = app.dialogs.add({name:"Tabellen Suchen/Ersetzen"});
			var _width = 150;	
			with (_dlg) {
				with (dialogColumns.add()) {
					with (borderPanels.add()) {
						with (dialogColumns.add()) {
							staticTexts.add( {staticLabel: "Tabellenformat:", minWidth:_width} );
							staticTexts.add( {staticLabel: "Abweichungen löschen:", minWidth:_width} );
							staticTexts.add( {staticLabel: "Abweichungen aller Zellen löschen:", minWidth:_width} );
						} 
						with (dialogColumns.add()) {
							var _tsDropDown = dropdowns.add();
							_tsDropDown.stringList = _replaceValues.tableStyles;
							_tsDropDown.selectedIndex = _replaceValues.tableStylesSelectedIndex
							var _ignoreTS = checkboxControls.add({checkedState: _replaceValues.tableStylesIgnore});
							var _ignoreTCS = checkboxControls.add({checkedState: _replaceValues.tableStylesCellIgnore});
						} 
					}
					with (borderPanels.add()) {
						with (dialogColumns.add()) {
							staticTexts.add( {staticLabel: "Zellenformat von Spalte:", minWidth:_width} );
							staticTexts.add( {staticLabel: "Abweichungen löschen:", minWidth:_width} );
						} 
						with (dialogColumns.add()) {
							var _colIndexDrop = integerComboboxes.add({editContents:_replaceValues.colNumber});
							var _ignoreColS = checkboxControls.add({checkedState: _replaceValues.colCellStylesIgnore});
						}
						with (dialogColumns.add()) {
							var _colDropDown = dropdowns.add();
							_colDropDown.stringList = _replaceValues.cellStyles;
							_colDropDown.selectedIndex = _replaceValues.colCellStylesSelectedIndex;
						}
					}
					with (borderPanels.add()) {
						with (dialogColumns.add()) {
							staticTexts.add( {staticLabel: "Zellenformat von Zeile:", minWidth:_width} );
							staticTexts.add( {staticLabel: "Abweichungen löschen:", minWidth:_width} );
						}
						with (dialogColumns.add()) {
							var _rowIndexDrop = integerComboboxes.add({editContents:_replaceValues.rowNumber});
							var _ignoreRowS = checkboxControls.add({checkedState: _replaceValues.rowCellStylesIgnore});
						} 
						with (dialogColumns.add()) {
							var _rowDropDown = dropdowns.add();
							_rowDropDown.stringList = _replaceValues.cellStyles;
							_rowDropDown.selectedIndex = _replaceValues.rowCellStylesSelectedIndex;
						}
					}
					with (dialogRows.add()) {
						var _ende = checkboxControls.add({staticLabel: "Skriptausführung beenden", checkedState: false});
					}	
				}
			}
			// Dialog an die aktuelle Tabelle anpassen
			var _list = [];
			for (var m =0; m < _table.rows.everyItem().index.length; m++) {
				_list.push ((_table.rows.everyItem().index[m] + 1) + "");
			}
			_rowIndexDrop.stringList = _list;
			if (_replaceValues.rowNumber*1  > _list.length) _rowIndexDrop.editContents = "1";
			else _rowIndexDrop.editContents  = _replaceValues.rowNumber;
			_list = [];
			for (var m =0; m < _table.columns.everyItem().index.length; m++) {
				_list.push ((_table.columns.everyItem().index[m]+ 1)+ "");
			}
			_colIndexDrop.stringList = _list;
			if (_replaceValues.colNumber*1  > _list.length) _colIndexDrop.editContents = "1";
			else _colIndexDrop.editContents  = _replaceValues.colNumber;

			if (_dlg.show() == true) {
				// selectedIndex == -1 leer, ==0 => Ignorieren 
				_replaceValues.tableStylesIgnore = _ignoreTS.checkedState;
				_replaceValues.tableStylesCellIgnore = _ignoreTCS.checkedState;

				if (_tsDropDown.selectedIndex > 0) {
					_replaceValues.tableStylesSelectedIndex = _tsDropDown.selectedIndex;
					var _tableStyle = _dok.tableStyles[_tsDropDown.selectedIndex -1];
					_table.appliedTableStyle = _tableStyle;
					if(_ignoreTS.checkedState) _table.clearTableStyleOverrides ();
					if(_ignoreTCS.checkedState) _table.cells.everyItem().clearCellStyleOverrides ();
				}
				_replaceValues.colNumber = _colIndexDrop.editContents;
				_replaceValues.colCellStylesIgnore = _ignoreColS.checkedState;
				if (_colDropDown.selectedIndex > 0) {
					_replaceValues.colCellStylesSelectedIndex = _colDropDown.selectedIndex;
					var _cellStyle = _dok.cellStyles[_colDropDown.selectedIndex -1];
					var _col = _table.columns[_colIndexDrop.editValue -1];
					_col.cells.everyItem().appliedCellStyle = _cellStyle;
					if(_ignoreColS.checkedState) { 
						_col.cells.everyItem().clearCellStyleOverrides ();
					}
				}
				_replaceValues.rowNumber = _rowIndexDrop.editContents;
				_replaceValues.rowCellStylesIgnore = _ignoreRowS.checkedState;
				if (_rowDropDown.selectedIndex > 0) {
					_replaceValues.rowCellStylesSelectedIndex = _rowDropDown.selectedIndex;
					var _cellStyle = _dok.cellStyles[_rowDropDown.selectedIndex -1];
					var _row = _table.rows[_rowIndexDrop.editValue -1];
					_row.cells.everyItem().appliedCellStyle = _cellStyle;
					if(_ignoreRowS.checkedState) { 
						_row.cells.everyItem().clearCellStyleOverrides ();
					}
				}
			}
			if (_ende.checkedState) {
				_dlg.destroy();
				return;
			}
			_dlg.destroy();
		}
	}
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