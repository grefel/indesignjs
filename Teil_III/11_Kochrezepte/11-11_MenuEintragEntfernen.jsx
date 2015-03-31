#target InDesign
#targetengine "saveWithBackupSession" 
var _hm = app.menus.itemByName("$ID/Main");
if (app.scriptPreferences.version >= 7) var _dm = _hm.submenus.itemByName("$ID/FileDestinationPanel"); // CS5
else var _dm = _hm.submenus.itemByName("$ID/&File"); // CS3/CS4 
var _eintrag = _dm.menuItems.itemByName("Mit Backup speichern");
if (_eintrag != null) {
	_eintrag.remove();
}