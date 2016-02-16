var _userLevel = app.scriptPreferences.userInteractionLevel;
var _version = app.scriptPreferences.version;
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
app.scriptPreferences.version = 8;

// Das Skript läuft mit den oben gewählten Einstellungen 

app.scriptPreferences.userInteractionLevel = _userLevel
app.scriptPreferences.version = _version