#target InDesign
if (app.selection.length == 1) {
	if (app.selection[0].parent.parent.constructor.name == "Table"){
		var _table = app.selection[0].parent.parent;
		_table.columns[0].width = 25;
		var _textRahmenBreite = 100;
		var _spAnzahl = _table.columns.length;
		var _breite = (_textRahmenBreite - 25)/ (_spAnzahl - 1);
		_table.columns.itemByRange(1, _spAnzahl - 1).width = _breite;
	}
}