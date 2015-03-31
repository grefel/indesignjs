#target InDesign
while (app.documents.length > 0) {
	app.documents[0].close (SaveOptions.NO);
	$.sleep(100);
}