var _pItems = app.activeDocument.pageItems;
for (var i = 0; i < _pItems.length; i++) {
	var _pItem = _pItems[i];
	if (_pItem.getElements()[0].constructor.name == "Group") {
		_pItem.select();
		alert ("Gruppe ausgewählt");
	}
	if (_pItem.getElements()[0].constructor.name == "TextFrame") {
		_pItem.select();
		alert ("Textrahmen ausgewählt");
	}
} 
//~ var _selection = app.selection[0];
//~ alert ("Sie haben ein " + _selection.constructor.name + " ausgewählt!");