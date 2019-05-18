/* JACoW SetDot v20181202.0
   by Ivan Andrian (C) ivan.andrian@elettra.eu 2013-18
   Sets the file(paperID) name, editor's name, timestamp 
   and a red/yellow/green dot on the top right corner of the
   first page of the document (in JACoW page size)
   See http://www.JACoW.org for more information
   
   History:
   v20181202   - Added changes to CropBox and TrimBox as well due to problems with some "Save As" in Acrobat
   v20160507   - Added Cols Guides
   v20160506   - To overcome a security issue on Windows 10 that prevents getting the user's name
   v20151123   - Barcode new font
   v20150504.0 - Check filename and show alert if contain AUTODISTILL
   v20150501.0 - Added Brown Dot
   v20150430.0 - Added BarCode
   v20140613.x - Automatic Checks on MediaSize & Cropping (and it's Friday 13!)
   v20140612   - Added some additional stripping to the filename to be used as PaperCode
   v20130522.1 - First production release, used in IPAC13
   
   see http://partners.adobe.com/public/developer/en/acrobat/sdk/AcroJS.pdf for JS Reference
   and http://acrobatusers.com/tutorials/how-save-pdf-acrobat-javascript for save as etc.
   
 */

var Version = "v20181202";
var PrintBarcode =true;
var JACoWMediaBox = [0, 792, 595, 0];

var ColsGuidesBox =[291, 792, 305, 0];

app.addMenuItem({ cName: "---------- " + Version + " ---------", cParent: "File", nPos: 1, cExec: "{}"});
//app.addMenuItem({ cName: "Get Page MediaBox", cUser: "Get Page MediaBox", cParent: "File", nPos: 1, cExec: "AlertMS()"});
//app.addMenuItem({ cName: "Separator", cUser: " ", cParent: "File", nPos: 1, cExec: "{}"});
app.addMenuItem({ cName: "Save as Cropped PS", cUser: "Save as Cropped PS", cParent: "File", nPos: 1, cExec: "PrintPS()"});
app.addMenuItem({ cName: "Crop MediaBox", cUser: "Crop", cParent: "File", nPos: 1, cExec: "CropAll()"});
app.addMenuItem({ cName: "Cols Guides", cUser: "Cols Guides On/Off", cParent: "File", nPos: 1, cExec: "ColsGuidesShow()"});
app.addMenuItem({ cName: "BROWN dot", cUser: "BROWN dot", cParent: "File", nPos: 1, cExec: "SetDot('brown')"});
app.addMenuItem({ cName: "RED dot", cUser: "RED dot", cParent: "File", nPos: 1, cExec: "SetDot('red')"});
app.addMenuItem({ cName: "YELLOW dot", cUser: "YELLOW dot", cParent: "File", nPos: 1, cExec: "SetDot('yellow')"});
app.addMenuItem({ cName: "GREEN dot", cUser: "GREEN dot", cParent: "File", nPos: 1, cExec: "SetDot('green')"});
app.addMenuItem({ cName: "----------JACoW utils ---------", cParent: "File", nPos: 1, cExec: "{}"});


// Identity name privileged function
// this fixes an issue with the apparently increased security context in Windowd 10
// see https://acrobatusers.com/tutorials/using_trusted_functions
var get_identity_name = app.trustedFunction( function() {
	app.beginPriv();
		return identity.name; 
	app.endPriv();
});


//-----------------------------------------------------------------------------
function ColsGuidesHide( _this ) {
	var ann =false;

	for (var p =0; p <_this.numPages; p ++) {
		ann= _this.getAnnot( p, "JACoWColsGuides" );
		if (ann != null) ann.destroy();
	}
}


//-----------------------------------------------------------------------------
function ColsGuidesShow() {
	var ann= this.getAnnot( 0, "JACoWColsGuides" );

	if (ann != null) {
		ColsGuidesHide( this );
		return;
	}

	for (var p =0; p <this.numPages; p ++) {
		ann = this.addAnnot({
			page: p,
			name: "JACoWColsGuides",
			popupOpen: false,
			type: "Square",
			rect: ColsGuidesBox,
			strokeColor: color.blue,
			fillColor: color.transparent,
			width: 0.1
			});
	}
}


//-----------------------------------------------------------------------------
function SetDot(_arg) {
	var author = get_identity_name();
	var re = /.*\/|\.pdf$/ig;
	var FileNM = this.path.replace(re,"");
	var Path = this.path;
	var AcDate = new Date();
	var AcDateFormat = "yyyy-mmm-dd HH:MM";
	var aRect = this.getPageBox("Crop",0);
	var TotWidth = aRect[2] - aRect[0];
	var dotSize =30;
	var x =545; 
	var y =750;
	var dcoords =[x, y, x +dotSize, y +dotSize];
	var qcoords =[x +dotSize/4-2, y-dotSize/2 -16, x +(3/4)*dotSize+3, y -11];
	var dtype;
	var QAarea = false;
	var proceed = false;
	var docNumPages = this.numPages;

	ColsGuidesHide( this );
	
	// check filename
	if (this.path.indexOf( 'AUTODISTILL' ) != -1) {
		app.alert( "Bad FileName please cut off AUTODISTILL!" , 0, 0, "Bad FileName");
		return;
	}
	
	
	// create the dot
	var dot = this.addAnnot( {
		page: 0,
		author: author,
		name: "JACoWdot",
		popupOpen: false,
		rect: dcoords
		});
		
	switch (_arg) {
		case 'brown':
			proceed = true;
			dot.type = "Circle";
			dot.strokeColor =dot.fillColor =['RGB', 117/255, 71/255, 25/255];

			var dot2 = this.addAnnot( {
				page: 0,
				author: author,
				name: "JACoWdot2",
				popupOpen: false,
				rect: [x+Math.random()*5, y+Math.random()*5, x +dotSize-5, y +dotSize-5]
			});	
			dot2.type = "Circle";
			dot2.strokeColor =dot2.fillColor =['RGB', 155/255, 125/255, 92/255];
			break;
		case 'red':
			proceed = true;
			dot.type = "Square";
			dot.strokeColor =dot.fillColor =color.red;
			break;
		case 'yellow':
			proceed = checkMediaBox(this, 0, docNumPages);
			dot.type = "Circle";
			dot.strokeColor =dot.fillColor =['RGB',1,.88,0];
			QAarea= true;
			break;
		case 'green':
			proceed = checkMediaBox(this, 0, docNumPages);
			dot.type = "Polygon";
			dot.vertices = [[x, y], [x, y +dotSize], [x +dotSize, y +dotSize/2]];
			dot.strokeColor =dot.fillColor =color.green;
			QAarea= true;
			break;
	}
	
	if (proceed) {
		if (QAarea) {
			// create the QA square for future checkmark
			// also for yellow since they can become green w/o printing
			var qdot = this.addAnnot(
				{
				page: 0,
				author: author,
				name: "JACoWdot",
				popupOpen: false,
				type: "Square",
				rect: qcoords,
				strokeColor: color.black,
				fillColor: color.transparent
				});
			var fd3 =this.addField("QAd", "text", 0, 
				[ x +dotSize/4 -7, y-3/2*dotSize-4, x + dotSize, y-dotSize+6]);
			fd3.value="QA";
			fd3.textSize =8; 
			fd3.readonly =true;
			fd3.alignment ="center";
		}
		
		// file name
		x =60; y =780;
		var fd =this.addField("PaperCode", "text", 0, [ x, y, TotWidth -x, y -15 ]);
		fd.value =FileNM;
		fd.textSize =14; 
		fd.readonly =true;
		fd.alignment ="right";
		
		// date
		x =60; y =765;
		var fd2 =this.addField("AuthorDate", "text", 0, [ x, y, TotWidth -x, y -15 ]);
		fd2.value =author + "  " + util.printd(AcDateFormat, AcDate);
		fd2.textSize =8; 
		fd2.readonly =true;
		fd2.alignment ="right";		

		// barcode
		if (PrintBarcode) {
			var PathArr = this.path.split("/");
			var fname =PathArr.pop();
			var FnameArr =fname.split(".");
			var barcode ="*" +FnameArr.shift() +"*";

			x =60; y =780;
			var fd3 =this.addField("BarCode", "text", 0, [ x, y, TotWidth -x, y -30 ]);
			fd3.value =barcode;
			fd3.textFont ="Free3of9Extended";
//			fd3.textFont ="3of9Barcode";
//			fd3.textFont ="CCode39";
			fd3.textSize =28; 
			fd3.readonly =true;
			fd3.alignment ="left";
		}


		app.execMenuItem("Print");
		
		this.removeField("PaperCode");
		this.removeField("AuthorDate");
		if (PrintBarcode) this.removeField("BarCode");
		
		if (QAarea) {
			qdot.destroy();
			this.removeField("QAd");
		} 
	} else {
		app.alert("Bad MediaBox for at least one page.\rUse the \"Save as Cropped PS\" function,\rdistill and try again!" , 0, 0, "Bad MediaBox");
	}
	dot.destroy();
	
	if (_arg == 'brown') dot2.destroy();
		
		/*
		var fdd = this.addAnnot(
			{
				type: "FreeText",
				page: 0,
				rect: [60,740,535,780],
				author: author,
				contents: author + "\n" + util.printd(AcDateFormat, AcDate),
				name: "JACoWauthDate",
				textSize: 8,
				readonly : true,
				popupOpen: false,
				alignment: "right", // right
				borderEffectStyle: "",
				strokeColor: color.transparent, 
				fillColor: color.transparent,
				color: color.black
			}
		);
		fdd.alignment="right";
		*/
		
}



function PrintPS(_arg) {
	ColsGuidesHide( this );
	
	// crop the MediaBox first!
	CropObj(this);
	// OK, now let's save it to PS
	var re1 = /.*\/|\_AUTHOR.*\.pdf|\.pdf$/ig;
	var re2 = /\.PDF\.AUTODISTILL/ig;
	var PathArr = this.path.split("/");
	PathArr.pop();
	PathArr.push(this.path.replace(re1,"").replace(re2,"") +".ps");
	this.saveAs(PathArr.join("/"), "com.adobe.acrobat.ps");
}

function AlertMS(_arg) {
	var thisMediaSize = this.getPageBox("Media",this.pageNum);
	ShowMS("Media Box should be [(0,0),(595,792)]", thisMediaSize[0], thisMediaSize[3], thisMediaSize[2], thisMediaSize[1]);
}

function ShowMS(_text, _a ,_b ,_c ,_d) {
	app.alert(_text + "\r" + "Current MediaBox is [("
		+ _a + "," + _b + "),(" + _c + "," + _d + ")]" , 3, 0, "MediaBox Information");
}

function CropAll(_arg) {
	CropObj(this);
}

function CropObj(_obj) {
	// Resize Mediabox to JACoW standard and remove CropBox
	_obj.setPageBoxes("Media",0,_obj.numPages - 1,JACoWMediaBox);
	_obj.setPageBoxes("Crop" ,0,_obj.numPages - 1);
}

function checkMediaBox(_obj, _pstart, _pend) {
	var retval = true;
	for(var i=_pstart ; i<_pend; i+=1) {	
		var thisMediaSize = _obj.getPageBox("Media",i);
		if (!(thisMediaSize[0] == 0 && thisMediaSize[1] == 792 && thisMediaSize[2] == 595 && thisMediaSize[3] == 0)) {
			retval = false;
		}
	}
	return retval;
}

