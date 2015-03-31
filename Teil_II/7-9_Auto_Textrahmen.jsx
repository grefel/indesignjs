var textFrame = app.selection[0]; 
with (textFrame.textFramePreferences) {
  autoSizingType = AutoSizingTypeEnum.HEIGHT_ONLY;
  autoSizingReferencePoint = AutoSizingReferenceEnum.TOP_CENTER_POINT;
  useMinimumHeightForAutoSizing = true;
  minimumHeightForAutoSizing  = 15;
}