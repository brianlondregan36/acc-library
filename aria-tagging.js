var acclib = (function AccModule() {



  function SetUpQuestions() {

    //FOR EACH QUESTION ON PAGE
    Confirmit.page.questions.forEach(function(q,i) {

      $("div#" + q.id + " div.cf-question__text").attr("id", q.id + "_txt");
      $("div#" + q.id + " div.cf-question__instruction").attr("id", q.id + "_ins");

      AssignFormLabels(q.id, q.title);

      //SPECIFIC TO OPEN TEXT QUESTIONS---------------------------------------------
      if( q.type == "OpenText" ) {

        var input = document.getElementById(q.id + "_input");
    
        input.setAttribute("aria-labelledby", q.instruction == "" ? q.id + "_txt" : q.id + "_ins");
        input.setAttribute("aria-errormessage", q.id + "_err");
        if(q.required) {
          input.setAttribute("aria-required", "true");
        }
	
	q.validationCompleteEvent.on(function(validationResult) {
	  ErrorLabels(null, input, validationResult);
	});
      } //---------------------------------------------------------------OPEN-------

      //SPECIFIC TO SINGLE AND MULTI QUESTIONS--------------------------------------
      else if( q.type == "Single" || q.type == "Multi" ) {
    
        var group = $(".cf-question#" + q.id + " .cf-list")[0];
        q.type == "Single" ? (role1 = "radiogroup", role2 = "radio") : (role1 = "group", role2 = "checkbox");
    
        group.setAttribute("role", role1);
        group.setAttribute("aria-labelledby", q.instruction == "" ? q.id + "_txt" : q.id + "_ins");
        group.setAttribute("aria-errormessage", q.id + "_err");
        if(q.required) {
          group.setAttribute("aria-required", "true");
        }

        var inputs = group.children;
        for(var i = 0; i < inputs.length; i++) {
          inputs[i].setAttribute("role", role2);
          if(i == 0) {
            inputs[i].setAttribute("tabindex", "0");
          }
          else {
            inputs[i].setAttribute("tabindex", "-1");
          }
        } 
        SetAriaChecked(); 

	q.answers.forEach(function(a) {
	  if(a.isOther) {
	    var other = document.getElementById(a.otherFieldName);
	    other.setAttribute("aria-label", a.text);
	    other.onkeyup = SetAriaChecked;
	  }
	});
	
        group.onclick = SetAriaChecked;
        group.onkeydown = function(e) {
          KeyboardSupport(e, q, SetAriaChecked);
        }; 

        function SetAriaChecked() {
          for(var i = 0; i < inputs.length; i++) {
            if( inputs[i].className.indexOf("--selected") != -1 ) {      
              inputs[i].setAttribute("aria-checked", "true"); 
            }
            else {
              inputs[i].setAttribute("aria-checked", "false");
            }
          }
        }

	q.validationCompleteEvent.on(function(validationResult) {
	  ErrorLabels(group, null, validationResult);  //inputs (2nd param) should eventually be an array of input (or others)
	});
      }//-----------------------------------------------------SINGLE-&-MULTI--------

    });//---------------------------------EACH QUESTION-----------------------------
  }



  function SetUpPage() {
    /*
    * set up the page i.e. title, roles, progress bar and navigation buttons
    */
    document.title = Confirmit.page.questions[0].title;

    document.getElementsByClassName("cf-page__hidden-fields")[0].setAttribute("aria-hidden", "true");
    document.getElementsByClassName("cf-page__header")[0].setAttribute("role", "banner");
    document.getElementsByClassName("cf-page__main")[0].setAttribute("role", "main");

    var progBar = document.getElementsByClassName("cf-progress__indicator");
    if(progBar[0]) {
      var accProgress = document.createElement("div");
      var accProgressTxt = document.createTextNode("Current survey progress is " + progBar[0].style.width);
      accProgress.style.textIndent = "-9999px";
      accProgress.appendChild(accProgressTxt);
      progBar[0].parentNode.parentNode.appendChild(accProgress);
    }

    document.getElementsByClassName("cf-page__navigation")[0].setAttribute("role", "navigation");
    var navButtons = document.getElementsByClassName("cf-navigation__button");
    for(var i = 0; i < navButtons.length; i++) {
      navButtons[i].setAttribute("role", "presentation");
      navButtons[i].setAttribute("tabindex", "0");
    }

    CheckAltTags();
    ToastAlert();
  }



  function CheckAltTags() {
    /*
    * alert designer if they've added images without alt attribute
    */
    var elems = document.getElementsByTagName('img'); 
    for(var i = 0; i < elems.length; i++) {
      var a = elems[i].getAttribute('alt');
      if( !a || a == "") {
        console.log(elems[i].outerHTML + " is missing an Alt attribute"); 
      }
      else if( a.toString().length > 125 ) {
        console.log(elems[i].outerHTML + " needs a shorter Alt attribute"); 
      }
    }
  }

  function ToastAlert() {
    /*
    * setting and unsetting the alert role for the "toast" modal window error popup
    */
    var toast = document.getElementsByClassName("cf-toast")[0];
    var config = { attributes: true, subtree: true };
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if(mutation.attributeName == "class") {
          ToggleAlert();
        }
      });
    });
    //listening to the page's toast area
    observer.observe(toast, config);

    function ToggleAlert() {
      var cl = toast.classList.value;
      if( cl.indexOf("--hidden") !== -1 ) {
        if( toast.hasAttribute("role") ) {  //if element is hidden
          toast.removeAttribute("role");
        }
      }
      else {
        if( !toast.hasAttribute("role") ) {  //if element is not hidden (error state)
          toast.setAttribute("role", "alert");
        }
      }
    }
  }

  function AssignFormLabels(id, title) {
    /*
    * label the form
    */
    document.getElementById(id).setAttribute("role", "form");
    document.getElementById(id).setAttribute("aria-label", title);
  }
  
  function ErrorLabels(group, inputs, result) {
    /*
    * adding and removing all error related aria tags to the question
    */

    if(result.errors.length > 0) {
      if(inputs) {
        inputs.setAttribute("aria-invalid", "true");
      }
    }

  }

  function KeyboardSupport(e, q, cbck) {
    /*
    * handler for up, down and space bar to move around question answers
    */
    var a = document.activeElement;
    if(a) {

      var role = a.getAttribute("role");
      if( role && (role == "radio" || role == "checkbox") ) {  

        var group = a.parentNode;
        var children = group.children;

        var k = e.keyCode;
        if( k == 38 || k == 40 ) {

          var curr; 
          for(var i = 0; i < children.length; i++) {  //scan through
            if( a == children[i] ) {
              curr = i;
            }
          }
      
          if( k == 38 ) {  //move focus
            if( curr - 1 >= 0 ) {
              children[curr - 1].focus();
            }
          }
          if( k == 40 ) {
            if( curr + 1 < children.length ) {
              children[curr + 1].focus();
            }
          }
        }

        if( k == 32 ) {  //set answer
        
          code = a.getAttribute("id").split("_")[1];
        
          if( role == "radio" ) {
            q.setValue(code); 
          }
          else if( role == "checkbox" ) {
            if( q.values.indexOf(code) > -1 ) {
              q.setValue(code);             
            }
            else {
              q.setValue(code, "1"); 
            }
          }
          cbck(); 
        }
      }
    }
  }



  return {
    SetUpPage: SetUpPage, 
    SetUpQuestions: SetUpQuestions
  }; 

})();
