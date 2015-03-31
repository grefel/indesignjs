var _dok = app.activeDocument;
var _page = app.activeDocument.pages[0]; 
var _musterVorlage = _dok.masterSpreads.itemByName("A-Mustervorlage");
_page.appliedMaster = _musterVorlage;
_page.masterPageItems[0].override(_page);