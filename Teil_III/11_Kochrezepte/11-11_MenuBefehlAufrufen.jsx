#target InDesign 
var _hm = app.menus.itemByName("$ID/Main");
if (app.scriptPreferences.version >= 7) var _afb = _hm.submenus.item("$ID/&Window").submenus.item("$ID/StylesSubmenu").menuItems.item("$ID/ParaStyles_Menu"); //CS5
else var _afb = _hm.submenus.item("$ID/&Window").submenus.item("$ID/TypeSubmenu").menuItems.item("$ID/ParaStyles_Menu"); // CS3/CS4 
if (_afb.checked == false) _afb.associatedMenuAction.invoke();
app.menuActions.itemByID(8505).invoke();