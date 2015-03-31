#target InDesign
var _dok = app.activeDocument;
var _tabelle = app.selection[0];
_tabelle.appliedTableStyle = _dok.tableStyles.itemByName("Tabellenformat");
_tabelle.columns[0].cells.everyItem().appliedCellStyle = _dok.cellStyles.itemByName("Zellenformat");
_tabelle.cells[3].appliedCellStyle = _dok.cellStyles.itemByName("Zellenformat");
