app.documents.add();
app.documents.add();
app.documents.add();
var _specifier = app.documents.itemByName("DokumentName.indd");
alert (_specifier.toSpecifier());
var _dreiSpecifier = app.documents.itemByRange(0,2);
alert (_dreiSpecifier.toSpecifier());
var _dreiReferenzen = _dreiSpecifier.getElements();
for (var i = 0; i < _dreiReferenzen.length; i++) {
	alert(_dreiReferenzen[i].name);
}