var _page = app.activeDocument.pages[0];
var _seite;
if (_page.side == PageSideOptions.LEFT_HAND) _seite = "linke";
else if (_page.side == PageSideOptions.RIGHT_HAND) _seite = "rechte";
else _seite = "einzelne";
alert ("Position: " + _page.documentOffset + " , Name (Seitenzahl): " + _page.name + ",Typ: "+_seite + " Seite");
