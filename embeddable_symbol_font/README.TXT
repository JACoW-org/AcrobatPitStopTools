This is a solution for a problem which often annoys editors when checking the state of embedded fonts: "symbol font missing". This is because the font still has the "fsType" status set to "Restricted License embedding" (fsType=2) which reads: »the font must not be modified, embedded or exchanged in any manner without first obtaining explicit permission of the legal owner.«

As in the meantime "symbol.ttf" glyphs have been completely replaced by a Unicode-aware TimesNewRoman, Symbol is only shipped with Windows for compatibility reasons.

Therefore it does not hurt to modify the "fsType" status to "Preview & Print embedding"  (fsType=4) for our editorial work. Because the solution some editors have chosen was to save the PDF to PostScript with the setting "emit Embedded and Referenced Fonts" and re-distill the PS. This breaks in >80% of the cases the encoding which leaves the PDF not full text searchable.

The font used here (to change the fsType bit) has the following "License":
License: Microsoft supplied font. You may use this font to create, display, and print content as permitted by the license terms or terms of use, of the Microsoft product, service, or content in which this font was included. You may only (i) embed this font in content as permitted by the embedding restrictions included in this font; and (ii) temporarily download this font to a printer or other output device to help print content. Any other use is prohibited.

This means that it _can be embeded_, which happens e.g. when you 'save as PS' + 'distill'. 

