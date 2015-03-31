var _hm = app.menus.itemByName("$ID/Main");
var _afb = _hm.submenus.item("$ID/&Window").submenus.item("$ID/StylesSubmenu").menuItems.item("$ID/ParaStyles_Menu");
if (_afb.checked == false) _afb.associatedMenuAction.invoke();
app.menuActions.itemByID(8505).invoke();