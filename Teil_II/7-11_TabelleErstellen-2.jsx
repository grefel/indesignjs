#target InDesign
var _tf = app.activeDocument.textFrames[0];
var _tabelle = _tf.tables.add();
_tabelle.columnCount =3;
_tabelle.bodyRowCount = 5;
_tabelle.headerRowCount = 1;
_tabelle.footerRowCount =1;