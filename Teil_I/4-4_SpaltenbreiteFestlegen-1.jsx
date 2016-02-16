var _table = app.selection[0];
_table.columns[0].width = 25;
var _spAnzahl = _table.columns.length;
var _textRahmenBreite = 100;
var _breite = (_textRahmenBreite - 25)/ (_spAnzahl - 1);
_table.columns.itemByRange(1, _spAnzahl - 1).width = _breite;
