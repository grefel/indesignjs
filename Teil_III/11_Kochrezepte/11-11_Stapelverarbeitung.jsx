processFolder();

function processFolder() {
	var _pdfPreset = app.pdfExportPresets.itemByName("[Druckausgabequalität]");
	if (!_pdfPreset.isValid) {
		alert ("Das Druck-PDF-Preset mit dem Namen [Druckausgabequalität] muss für den PDF-Export installiert werden!");
		return;
	}
	var _folder = Folder().selectDlg("Bitte wählen Sie den Ordner mit den InDesign-Dateien aus");
	if (_folder == null) {
		return;
	}
	var _fileArray = getFilesRecursively (_folder, "*.indd");
	if (_fileArray.length == 0) {
		alert ("Der Ordner " + _folder + " enthält keine InDesign-Dateien");
		return;
	}
	var _exportFolder = Folder().selectDlg("Bitte wählen Sie den Zielordner aus");
	if (_folder == null) {
		return;
	}
	var _ial = app.scriptPreferences.userInteractionLevel;
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
	var _redraw = app.scriptPreferences.enableRedraw;
	app.scriptPreferences.enableRedraw = true;
	var _progressBar = new ProgressBar("Dokumente exportieren... ", 350, 100);
	_progressBar.show("Verarbeite ... %1 /" + _fileArray.length, _fileArray.length);
	for (var i = 0; i < _fileArray.length; i++) {
		_progressBar.hit(i);
		var _file = _fileArray[i];
		var _dok = app.open(_file, true);
		var _dokName = _dok.name.replace(/\.indd$/, "");
		for (var p = 0; p < _dok.pages.length; p++) {
			var _pageName = _dok.pages[p].name;
			app.pdfExportPreferences.pageRange = _pageName;
			var _exportFile = File(_exportFolder + "/" + _dokName + "_" +_pageName + ".pdf");
			_dok.exportFile (ExportFormat.PDF_TYPE, _exportFile, false, _pdfPreset);
		}
		_dok.close(SaveOptions.NO);
	}
	_progressBar.close();
	app.scriptPreferences.enableRedraw = _redraw;
	app.scriptPreferences.userInteractionLevel = _ial;
}

function getFilesRecursively (folder, mask, fileArray) {
	if (fileArray == undefined) fileArray = [];
	var children = folder.getFiles();
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child instanceof Folder) {
			fileArray = getFilesRecursively (child, mask, fileArray);
		}
	}
	var children = folder.getFiles(mask);
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child instanceof File) {
			fileArray.push(child);
		}
	}
	return fileArray;
}

function ProgressBar(/*str*/title, /*uint*/width, /*uint*/height)  
// =========================================================  
// Version 2.beta | 12-Nov-2014  
// -- Keep the message centered --see below the new method this.msg()  
// -- Supports message patterns e.g: "Step %1/100" --see the sample code  
// -- Other minor improvements  
// =========================================================  
{  
    (60<=(width||0))||(width=340);  
    (40<=(height||0))||(height=60);  
  
    var H = 22,  
        Y = (3*height-2*H)>>2,  
        W = new Window('palette', ' '+title, [0,0,width,height]),  
        P = W.add('progressbar', { x:20, y:height>>2, width:width-40, height:12 }, 0,100),  
        T = W.add('statictext' , { x:0, y:Y, width:width, height:H }),  
        __ = function(a,b){ return localize.apply(null,a.concat(b)) };  
  
    this.pattern = ['%1'];  
  
    W.center();  
  
    // ---  
    // API  
    // ---  
     
    this.msg = function(/*str*/s)  
    // ---------------------------------  
    {  
        s && (T.location = [(width-T.graphics.measureString(s)[0])>>1, Y]);  
        T.text = s;  
    };  
  
    this.show = this.reset = function(/*str*/s, /*uint*/v)  
    // ---------------------------------  
    {  
        if( s && s != localize(s,1,2,3,4,5,6,7,8,9) )  
            {  
            this.pattern[0] = s;  
            s = __(this.pattern, [].slice.call(arguments,2));  
            }  
        else  
            {  
            this.pattern[0] = '%1';  
            }  
         
        P.value = 0;  
        P.maxvalue = v||0;  
        P.visible = !!v;  
  
        this.msg(s);  
        W.show();  
    };  
  
    this.hit = function(x)  
    // ---------------------------------  
    {  
        ++P.value;  
        ('undefined' != typeof x) && this.msg(__(this.pattern, [].slice.call(arguments,0)));  
    };  
  
    this.hide = function()  
    // ---------------------------------  
    {  
        W.hide();  
    };  
     
    this.close = function()  
    // ---------------------------------  
    {  
        W.close();  
    };  
};