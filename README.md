# Acrobat/PitStop/PowerPoint scripts and tools

* `JACoW.joboptions`       - Latest JobOptions for Acrobat Distiller
* `JACoW-09.joboptions`    - JACoW 2009 JobOptions for Acrobat Distiller
* `JACoW-10.joboptions`    - JACoW 2010 JobOptions for Acrobat Distiller
* `JACoW-11.joboptions`    - JACoW v11  JobOptions for Acrobat Distiller
* `JACoW-12.joboptions`    - JACoW v12  JobOptions for Acrobat Distiller (2023)
* `JACoW Media Box.eal`    - JACoW Crop Media Box Action List for Enfocus PitStop
* `JACoWSetDot.js`         - JACoW Acrobat extension to assign dots+ on paper
* `SplitAnimations.ppa`    - PowerPoint add-in to split animation when creating PDF
* `SplitAnimations.ppt`    - "Workspace" for developing the SplitAnimations.ppa PowerPoint add-in
* `barcode_font`           - TrueType font needed by JACoWSetDot.js to create the barcode onto papers
* `embeddable_symbol_font` - A modified Symbol.ttf font for the editors that can be embedded
* `ISO4_abbreviations_for_journal_titles.txsMacro` - TeXstudio macro to shorten Journal Titles

## Instructions on how to use these files.

### JobOptions

copy the file into the Acrobat | Settings folder (or import via Distiller
via the "Settings | Add Adobe PDF Settings..." menu entry.

### Media Box Action List

Import from PitStop "Run Action List" menu item by right-clicking on the "Local"
folder and then choosing "Import/Export..."

### JACoWSetDot.js

First, install the `fre3of9x.ttf` font into the computer. The exact procedure
may vary from platform to platform. On OSX a warning could be given - just ignore 
it and proceed with the installation.
Copy `JACoWSetDot.js` into the Acrobat JavaScript extensions folder. 
Also this path could change for different operating system and Acrobat versions.
For *Windows 7 and Acrobat 9* it defaults to 
  `C:\Program Files\Adobe\Acrobat 9.0\Acrobat\Javascripts`
and for *Mac OS X 10.9 and Acrobat 11* it defaults to 
  `~/Library/Application Support/Adobe/Acrobat/11.0/JavaScripts`
(the directory may not exist - create it manually).

To find the actual directory for your system/Acrobat version run these two
JavaScript commands in the Acrobat JS Console:

```
  app.getPath("user","javascript")
  app.getPath("app","javascript")
```

e.g., for Acrobat 2020 on MacOS the path is:
`/Applications/Adobe Acrobat 2020/Adobe Acrobat.app/Contents/Resources/JavaScripts`
with no user JS folder.

Also, remember to set the security option in Acrobat's preferences, otherwise
the script won't work. Go under *Edit->Preferences->General->JavaScript*
and check the "**Enable menu items JavaScript execution privileges**" option.
Moreover, in the "**Identity**" tab be sure to have your (editor) name set,
REFERENCES:

- https://helpx.adobe.com/acrobat/kb/user-javascript-changes-10-1.html
- http://www.pdfscripting.com/public/111.cfm
- https://opensource.adobe.com/dc-acrobat-sdk-docs/acrobatsdk/pdfs/acrobatsdk_jsdevguide.pdf

### SplitAnimations.ppa

Put it into the` \Microsoft\Addins` folder.

### embeddable_symbol_font

Install this TrueType font on the workstations of the proceedings office


## Changelog

### 20250918 `JACoWSetDot.js` 
Added compatibility with PDF-XChange. 
See source file for more details.

### 20231117 `JACoW-12.joboptions` 
Restored a number of options for image settings that got lost in v11

### 20230306 `embeddable_symbol_font` 
Modified symbol TrueType font to be used by editors in case
"save as PS + distill" is needed.

### 20221020 `JACoW-11.joboptions` 
Some problems with version 10 of the joboptions were experienced while using 
Acrobat Pro DC (newest versions) at LINAC'22, IBIC'22 and PCaPAC'22. 
The PDF print process hang. When killed you realise a PDF has been produced, 
but it doesn't open in Acrobat automatically. With the next print the message
reappears and an error message window is left open.

A new job option file has been created from one of the Adobe ones 
(High Quality Print) and added all JACoW specifics.
