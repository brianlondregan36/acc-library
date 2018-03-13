# acc-library

This is a Javascript module developed to make Responsive Rendering layouts accessible. The goal is to allow our clients to quickly and easily implement this into their Responsive Rendering projects so the scripting can modify the survey pages and make them more accessible, specifically for users who rely on screen reader software.  

Phase 1 is to support Open Text, Single and Multi questions. 
Phase 2 is to support Grid and Multi Grid questions. 

USEAGE
---------------------------------------
Every active theme in the project will need to reference two external JS files:
	This module can be found in our File Library at /isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/BrianL/aria-tagging.js
	JQuery will also need to be referenced

Then for every theme in the project, in the JavaScript tab, invoke the appropriate methods. 

EXAMPLE...  

acclib.SetUpPage();
acclib.SetUpQuestions(); 


SetUpPage()
	This will set up the page...
		create a better title
		assign "banner", "main" and "navigation" roles"
		give the screen reader a label to read containing the progress
		alert the designer if they forgot alt attributes in their images
                fix the navigation buttons (tabindex and presentation role)

SetUpQuestions()
	This will set up each question on the page... 
		label all elements of the question (text, form, answers, error, etc) 
		set aria required attributes
		handle error alerts with aria live attributes
		provide the code to handle keyboard operations

