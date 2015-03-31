#target InDesign
var _auswahl = app.selection[0];
var _objektFormat = app.activeDocument.objectStyles.itemByName("infokasten");
_auswahl.appliedObjectStyle = _objektFormat;
_auswahl.fit (FitOptions.FRAME_TO_CONTENT);