#targetengine "saveWithBackupSession" 
var _hm = app.menus.itemByName("$ID/Main");
var _dm = _hm.submenus.itemByName("$ID/FileDestinationPanel");
var _eintrag = _dm.menuItems.itemByName("Mit Backup speichern");
if (_eintrag != null) {
	_eintrag.remove();
}