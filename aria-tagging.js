var acclib = (function AccModule() {




  function SetUpQuestions() {

    //FOR EACH QUESTION ON PAGE
    Confirmit.page.questions.forEach(function(q,i) {

      var thisQElem = document.getElementById(q.id);
      thisQElem.getElementsByClassName("cf-question__text")[0].setAttribute("id", q.id + "_txt");
      thisQElem.getElementsByClassName("cf-question__instruction")[0].setAttribute("id", q.id + "_ins");
      thisQElem.getElementsByClassName("cf-question__error")[0].setAttribute("id", q.id + "_err");

      AssignFormLabels(q.id, q.title);

      //SPECIFIC TO OPEN TEXT QUESTIONS---------------------------------------------
      if( q.type == "OpenText" ) {

        var input = document.getElementById(q.id + "_input");
    
        input.setAttribute("aria-labelledby", q.instruction == "" ? q.id + "_txt" : q.id + "_ins");
        input.setAttribute("aria-errormessage", q.id + "_err");
        if(q.required) {
          input.setAttribute("aria-required", "true");
        }
	

	q.validationEvent.on(function(qResult) {
	  ErrorLabels(input, null, qResult);
	});
      } //-----------------------------------------------------------END-OPEN-------

      //SPECIFIC TO SINGLE AND MULTI QUESTIONS--------------------------------------
      else if( q.type == "Single" || q.type == "Multi" ) {
    
        var group = thisQElem.getElementsByClassName("cf-list")[0];
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
        SetAriaChecked(inputs); 

	var others = [];
	Array.prototype.forEach.call(q.answers, function(a) {
	  if(a.isOther) {
	    var other = document.getElementById(a.otherFieldName);
	    others.push(other);
	    other.setAttribute("aria-label", a.text);
	    other.onkeyup = function() {
              SetAriaChecked(inputs);
            };
	  }
	});
	
        group.onclick = function() {
          SetAriaChecked(inputs);
        };
        group.onkeydown = function(e) {
          KeyboardSupport(e, q, inputs, SetAriaChecked);
        }; 
	q.validationCompleteEvent.on(function(qResult) {
	  ErrorLabels(group, others, qResult);  
	});
      }//-------------------------------------------------END-SINGLE-MULTI----------

      //SPECIFIC TO GRID AND MULTI GRID QUESTIONS-----------------------------------
      else if( q.type == "Grid" || q.type == "Grid3d" ) {
         
        var group = thisQElem.getElementsByClassName("cf-grid")[0];
	q.type == "Grid" ? (role1 = "radiogroup", role2 = "radio") : (role1 = "group", role2 = "checkbox");

        group.setAttribute("aria-labelledby", q.instruction == "" ? q.id + "_txt" : q.id + "_ins");
        group.setAttribute("aria-errormessage", q.id + "_err");
        if(q.required) {
          group.setAttribute("aria-required", "true");
        }

	var scaleLabels = [], inputs = []; 
	Array.prototype.forEach.call(thisQElem.getElementsByClassName("cf-grid-answer__label"), function(label, index) {
          var id = q.id + "scaleLabel" + (index + 1);
          label.setAttribute("id", id);
	  scaleLabels.push(id);
	});
	Array.prototype.forEach.call(thisQElem.getElementsByClassName("cf-grid-answer__text"), function(label, index) {
          if( index != 0 ) {
	    var thisRow = label.parentElement.parentElement; 
	    thisRow.setAttribute("role", role1);
            thisRow.setAttribute("aria-labelledby", label.id);
	  }
        });
	Array.prototype.forEach.call(thisQElem.getElementsByClassName("cf-grid-answer__scale-item"), function(input, index) {
          if( input.hasAttribute("id") ) {
            inputs.push(input);
          }
        });

	var ptr = 0;
	inputs.forEach(function(input, index) {
          input.setAttribute("role", role2);
          input.setAttribute("aria-labelledby", scaleLabels[ptr]);
	  if( ptr == 0 ) {
	    input.setAttribute("tabindex", "0");
	  }
	  else {
	    input.setAttribute("tabindex", "-1");
	  }

          (index + 1) % scaleLabels.length == 0 ? ptr = 0 : ptr++;
        });
	
        SetAriaChecked(inputs);
        group.onclick = function() {
          SetAriaChecked(inputs);
        };
        group.onkeydown = function(e) {
          KeyboardSupport(e, q, inputs, SetAriaChecked);
        };

	// run "other" check code
	// test and call KeyboardSupport function
	// test and call ErrorLabels function
      }//----------------------------------------------END-GRID-MULTIGRID-----------

    });//---------------------------------------------------END-EACH-QUESTION-------



    function AssignFormLabels(id, title) {
      /*
      * label the form
      */
      document.getElementById(id).setAttribute("role", "form");
      document.getElementById(id).setAttribute("aria-label", title);
    }

    function SetAriaChecked(inputs) {
      /*
      * go through inputs and see what's checked and unchecked and set aria accordingly
      */
      for(var i = 0; i < inputs.length; i++) {
        if( inputs[i].className.indexOf("--selected") != -1 ) {
          inputs[i].setAttribute("aria-checked", "true");
        }
        else {
          inputs[i].setAttribute("aria-checked", "false");
        }
      }
    }

    function ErrorLabels(input, others, qResult) {
      /*
      * adding and removing all error message related aria tags to the question
      * this function does not touch the toast message
      * possible types are OtherRequired, MultiCount, Required
      */
      var errorArea = document.getElementById(qResult.questionId + "_err");

      if(qResult.errors.length > 0) {
        qResult.errors.forEach(function(err) {
          errorArea.setAttribute("role", "alert");
          input.setAttribute("aria-invalid", "true");
          input.setAttribute("aria-errormessage", qResult.questionId + "_err");
        });
      }
      else if(errorArea.firstElementChild.children.length == 0) {
        errorArea.removeAttribute("role");
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-errormessage")
      }

      if(qResult.answerValidationResults.length > 0) {
        qResult.answerValidationResults.forEach(function(aResult) {
          aResult.errors.forEach(function(err) {
            if(err.type == "OtherRequired" && others) {
              var matchThis = qResult.questionId + "_" + aResult.answerCode + "_other";

              for(var i = 0; i < others.length; i++) {
                if( others[i].id == matchThis ) {
                  errorArea = others[i].nextElementSibling;
                  errorArea.setAttribute("id", matchThis + "_err");

                  errorArea.setAttribute("role", "alert");
                  others[i].setAttribute("aria-invalid", "true");
                  others[i].setAttribute("aria-errormessage", matchThis + "_err");
                }
              }
            }
          });
        });
      }
      else if(qResult.answerValidationResults.length == 0 && others) {
        for(var i = 0; i < others.length; i++) {
          others[i].removeAttribute("aria-invalid");
          others[i].removeAttribute("aria-errormessage");
        }
      }
    }

    function KeyboardSupport(e, q, i, cbck) {
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
              q.setValue(code); //must change this for grids!
            } 
            else if( role == "checkbox" ) {
              if( q.values.indexOf(code) > -1 ) {
                q.setValue(code); 
              }
              else {
                q.setValue(code, "1");
              }
            }
            cbck(i);
          }
        }
      }
    }
  }//--------------------------------------------------END-QUESTION-FUNCTION--------




  function SetUpPage() {
 
    //better page title
    document.title = Confirmit.page.questions[0].title;

    //unique query string
    var rndm = Math.floor(Math.random() * 10000);
    var action = Confirmit._pageView._pageForm[0].action
    var action = document.getElementById("page_form").getAttribute("action");
    action = action + "?acc=" + rndm; 
    document.getElementById("page_form").setAttribute("action", action);

    //layout roles
    document.getElementsByClassName("cf-page__hidden-fields")[0].setAttribute("aria-hidden", "true");
    document.getElementsByClassName("cf-page__header")[0].setAttribute("role", "banner");
    document.getElementsByClassName("cf-page__main")[0].setAttribute("role", "main");

    //progress bar 
    var progBar = document.getElementsByClassName("cf-progress__indicator");
    if(progBar[0]) {
      var accProgress = document.createElement("div");
      var accProgressTxt = document.createTextNode("Current survey progress is " + progBar[0].style.width);
      accProgress.style.textIndent = "-9999px";
      accProgress.appendChild(accProgressTxt);
      progBar[0].parentNode.parentNode.appendChild(accProgress);
    }

    //navigation buttons
    document.getElementsByClassName("cf-page__navigation")[0].setAttribute("role", "navigation");
    var navButtons = document.getElementsByClassName("cf-navigation__button");
    for(var i = 0; i < navButtons.length; i++) {
      navButtons[i].setAttribute("tabindex", "0");
    }

    //outline to show focus    
    var css='div[tabindex^="0"]:focus, div[tabindex^="-1"]:focus, input:focus, textarea:focus, button:focus{outline:2px solid #42bdd1;outline-offset:1px;}';
    head = document.head || document.getElementsByTagName('head')[0],
    style=document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } 
    else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);

    //alert designer about images without alt attribute
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
    
    //handling toast error modal's alert role 
    var toast = document.getElementsByClassName("cf-toast")[0];
    var config = { attributes: true, subtree: true };
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.attributeName == "class") {
                ToggleAlert();
            }
        });
    });
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

  }//---------------------------------------------------END-PAGE-FUNCTION-----------

  


  return {
    SetUpPage: SetUpPage, 
    SetUpQuestions: SetUpQuestions
  }; 

})();
