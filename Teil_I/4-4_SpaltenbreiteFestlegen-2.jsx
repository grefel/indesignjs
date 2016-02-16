if (app.documents.length > 0 && app.selection.length == 1 && app.selection[0].parent.parent.constructor.name == "Table") {
	var _table = app.selection[0].parent.parent;
	_table.columns[0].width = 25;
	var _textRahmenBreite = 100;
	var _spAnzahl = _table.columns.length;
	var _breite = (_textRahmenBreite - 25)/ (_spAnzahl - 1);
	_table.columns.itemByRange(1, _spAnzahl - 1).width = _breite;
}
else {
	alert ("Platzieren Sie die Einfügemarke in der Tabelle!");
}