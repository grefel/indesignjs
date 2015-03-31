#target InDesign
var _dok = app.activeDocument;
var _tabelle = app.selection[0];
_tabelle.rows[2].fillColor = _dok.colors.itemByName("Magenta");
_tabelle.columns[0].fillColor = _dok.colors.itemByName("Cyan");
_tabelle.cells[3].fillColor = _dok.colors.itemByName("Yellow");