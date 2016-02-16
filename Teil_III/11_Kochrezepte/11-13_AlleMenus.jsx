var _txtFile = File.saveDialog("Namen speichern unter...", undefined);

if(_txtFile != null){ 
	_txtFile.open("w");
	for (var i =0 ; i < app.menus.length; i++) {
		var _menu = app.menus[i];
		_txtFile.writeln (app.menus[i].name + "\t" + formatKeyString(app.menus[i].title) );

		analyseMenu(_menu, _txtFile, "");
	}
	//var _menu = app.menus.itemByName("$ID/Main");
	analyseMenu(_menu, _txtFile, "");
	_txtFile.close();
	_txtFile.execute();
}

function analyseMenu(_menu, _txtFile, _indent) {
	for (var i = 0; i < _menu.submenus.length; i++) {		
		try {
			if (_menu.title != "Apple") {
				_txtFile.writeln (_indent + _menu.submenus[i].name + "\t" + formatKeyString(_menu.submenus[i].title) );
				analyseMenu( _menu.submenus[i], _txtFile, _indent + "\t");
			}
		} catch (e) {}
	}
	for (var i = 0; i < _menu.menuItems.length; i++) {
		_txtFile.writeln (_indent + "ID [" +_menu.menuItems[i].id+ "]\t" + _menu.menuItems[i].name + "\t" + formatKeyString(_menu.menuItems[i].title) );
	}
}

function formatKeyString (_title) {
	var _keys = app.findKeyStrings (_title);
	if (_keys.constructor.name == "Array") _keys = _keys.join(" | ");
	if (_keys.length > 0 ) return _keys;
	else return "Keinen locale-independent String gefunden";
}
