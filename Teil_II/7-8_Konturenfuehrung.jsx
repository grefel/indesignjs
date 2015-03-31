#target InDesign
var _auswahl = app.selection[0];
var _twp = _auswahl.textWrapPreferences;
if (app.scriptPreferences.version >= 6)_twp.textWrapMode = TextWrapModes.BOUNDING_BOX_TEXT_WRAP; 
else _twp.textWrapType = TextWrapTypes.BOUNDING_BOX_TEXT_WRAP; 
_twp.textWrapOffset = [3,3,0,3];
_twp.textWrapSide = TextWrapSideOptions.BOTH_SIDES;