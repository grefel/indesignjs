app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
var _dlg = app.dialogs.add();
with (_dlg) {
	name = "Objektformat der Auswahl zuweisen";
	var _dlgCol = dialogColumns.add();
	with (_dlgCol) {
		var _sText = staticTexts.add()
		with (_sText) {
			staticLabel = "Wählen Sie ein Objektformat aus:";
		}
		var _dropDown = dropdowns.add();
		with (_dropDown) { 
			stringList = app.activeDocument.objectStyles.everyItem().name;
		}
	}
}
var _res = _dlg.show() 
if (_res) {
	var _objectStyle = app.activeDocument.objectStyles[_dropDown.selectedIndex];
	app.selection[0].appliedObjectStyle = _objectStyle;
}
_dlg.destroy();
