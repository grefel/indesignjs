var _auswahl = app.selection[0];
var _url = "http://www.indesignjs.de";
var _swatch = app.activeDocument.swatches[3];
_auswahl.createHyperlinkQRCode( _url, _swatch);