app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
var _dlg = app.dialogs.add();
_dlg.name = "Objektformat der Auswahl zuweisen";
var _dlgCol = _dlg.dialogColumns.add();
var _sText = _dlgCol.staticTexts.add();
_sText.staticLabel = "Wählen Sie ein Objektformat aus:";
var _dropDown = _dlgCol.dropdowns.add();
_dropDown.stringList = app.activeDocument.objectStyles.everyItem().name;
var _res = _dlg.show(); 
if (_res) {
	var _objectStyle = app.activeDocument.objectStyles[_dropDown.selectedIndex];
	app.selection[0].appliedObjectStyle = _objectStyle;
}
_dlg.destroy();