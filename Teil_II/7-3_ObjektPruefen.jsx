#target InDesign
var _itemByName = app.activeDocument.pageItems.itemByName("NameNichtVorhanden");
if (_itemByName == null) {
	alert ("Das Seitenobjekt existiert nicht!");
}
if (_itemByName.isValid != true) { // Ab CS4 besser mit isVaild prüfen
	alert ("Das Seitenobjekt existiert nicht!");
}
