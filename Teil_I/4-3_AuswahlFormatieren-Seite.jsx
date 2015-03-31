var _auswahl = app.selection[0];
var _objektStilLinks = app.activeDocument.objectStyles.itemByName("infokasten_links");
var _objektStilRechts = app.activeDocument.objectStyles.itemByName("infokasten_rechts");
var _page = _auswahl.parentPage;
if (_page.side == PageSideOptions.LEFT_HAND) {
	_auswahl.appliedObjectStyle = _objektStilLinks;	
}
if (_page.side == PageSideOptions.RIGHT_HAND) {
	_auswahl.appliedObjectStyle = _objektStilRechts;
}