# acc-library

This is a Javascript module developed to make our Responsive Rendering layouts accessible. The goal is to allow our clients to quickly and easily implement this into their Responsive Rendering projects so the scripting can modify the survey pages and make them more accessible, specifically for users who rely on screen reader software.  

1. Phase 1 is to support Open Text, Single and Multi questions. 
2. Phase 2 is to support Grid and Multi Grid questions.
3. Phase 3 is to support Digital Feedback popup programs. 

## USEAGE
--------------------------------------------------
1. Every active theme in the project will need to reference two external JS files:
   - Reference the module (and specify the version you want) via https://cdn.jsdelivr.net/gh/brianlondregan36/acc-library@X.X/aria-tagging.js
   - JQuery will also need to be referenced
2. Then for every theme in the project, in the JavaScript tab, invoke the appropriate methods: 

EXAMPLE...  

'''
acclib.SetUpPage();
acclib.SetUpQuestions(); 
acclib.PopUpSupport("https://my.domain.com"); 
'''

SetUpPage()
  - This will set up the page...
    - create a better title
    - assign "banner", "main" and "navigation" roles"
    - give the screen reader a label to read containing the progress
    - alert the designer if they forgot alt attributes in their images
    - fix the navigation buttons (tabindex and presentation role)

SetUpQuestions()
  - This will set up each question on the page... 
    - label all elements of the question (text, form, answers, error, etc) 
    - set aria required attributes
    - handle error alerts with aria live attributes
    - provide the code to handle keyboard operations

PopUpSupport() 
 - This will send messages to the webpage that triggered this survey to help...
   - keep the focus in the popup window 
   - keep the tab order correct
 - As a parameter, pass in the domain of your webpage that's triggering this survey!
 - Only use this if this survey is part of a Digital Feedback program! For this to work you also need...
   - digital-feedback.js has the "Scenario" code for your Digital Feedback program
   - the invite and container need changes to the markup, see Program ID 20 for an example
