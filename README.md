# acc-library

Building a reusable Javascript module that our clients can use and implement into their projects which will modify survey pages to make them more accessible. 


USEAGE
---------------------------------------
For every theme in the project, add a reference to this external JS file
I loaded the file into the File Library. Here's the URL it can be found at: /isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/BrianL/acclib.js

For every theme in the project, in the Layout tab, in HTML mode, add a script to the bottom of the page. Inside that script, depending on which accessibility requirements you're looking to satisfy, invoke the appropriate methods. 

EXAMPLE...  

<script>
acclib.MakeFocusVisible();
acclib.BuildBetterTitle('^CurrentForm()^');
</script>



AssignRoles()
	Will add aria "main" and "form" role attributes to the appropriate area of the page.

BuildBetterTitle(string Title)
	Can be used to change the browser tab title. 

CheckAltTags()
	Will alert you (in the console) if any images' alt tags are too long or are completely missing.

CheckLabels()
	Will alert you (in the console) if any input is missing a label. 
	
MakeFocusVisible()
	Will add a visible outline around any element (that can by default be given focus) when it is given focus. 





