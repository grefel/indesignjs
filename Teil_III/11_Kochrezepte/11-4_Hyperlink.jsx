var _dok = app.activeDocument;
var _text = _dok.hyperlinkTextSources.add(app.selection[0]);
var _ziel = _dok.hyperlinkURLDestinations.add("http://www.publishingx.de/");
_dok.hyperlinks.add(_text, _ziel);
