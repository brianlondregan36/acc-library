SetUpPage();

//FOR EACH QUESTION ON PAGE
Confirmit.page.questions.forEach(function(q,i) {

  $("div#" + q.id + " div.cf-question__text").attr("id", q.id + "_txt");
  $("div#" + q.id + " div.cf-question__instruction").attr("id", q.id + "_ins");
  $("div#" + q.id + " div.cf-question__error").attr("id", q.id + "_err");

  AssignFormLabels(q.id, q.title);

  //SPECIFIC TO OPEN TEXT QUESTIONS---------------------------------------------
  if(q.type == "OpenText") {
    var input = document.getElementById(q.id + "_input");
    input.setAttribute("aria-labelledby", q.instruction == "" ? q.id + "_txt" : q.id + "_ins");
    input.setAttribute("aria-errormessage", q.id + "_err");
    if(q.required) {
      input.setAttribute("aria-required", "true");
    }
    var errorArea = document.getElementById(q.id + "_err");
    RunErrorHandling(input, errorArea)
  } //---------------------------------------------------------------OPEN-------

  //SPECIFIC TO SINGLE QUESTIONS------------------------------------------------
  if(q.type == "Single") {
    /*
    * on click, check answer and change aria-checked
    * handle tabbing and moving around
    */
    var group = $(".cf-question#" + q.id + " .cf-list")[0];
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-labelledby", q.instruction == "" ? q.id + "_txt" : q.id + "_ins");
    group.setAttribute("aria-errormessage", q.id + "_err");
    if(q.required) {
      group.setAttribute("aria-required", "true");
    }

    var inputs = group.children;
    for(var i = 0; i < inputs.length; i++) {
      inputs[i].setAttribute("role", "radio");
      if(i == 0) {
        inputs[i].setAttribute("tabindex", "0");
      }
      else {
        inputs[i].setAttribute("tabindex", "-1");
      }
      if(q.value) {
        var arr = inputs[i].id.split("_")
        if( q.value == arr[arr.length -1]) {
          inputs[i].setAttribute("aria-checked", "true");
        }
        else{
          inputs[i].setAttribute("aria-checked", "false");
        }
      }
    }

    var errorArea = document.getElementById(q.id + "_err");
    RunErrorHandling(group, errorArea)
  }//--------------------------------------------------------SINGLE-------------

});//-----------------------------------EACH QUESTION ON PAGE-------------------



function SetUpPage() {
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
}

function AssignFormLabels(id, title) {
  document.getElementById(id).setAttribute("role", "form");
  document.getElementById(id).setAttribute("aria-label", title);
}

function RunErrorHandling(formControl, itsErrorArea){
  var config = { attributes: true, subtree: true };
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.attributeName == "class") {
        //set and unset alert roles on error areas and invalid attribute on the form input
        var mutationNode = mutation.target;
        var toast = document.getElementsByClassName("cf-toast")[0]
        ToggleAlert(mutationNode, formControl);
        ToggleAlert(toast, formControl);
      }
    });
  });
  //listening to the question's error area
  observer.observe(itsErrorArea, config);
}

function ToggleAlert(x, y) {
  var cl = x.classList.value;
  if( cl.indexOf("--hidden") !== -1 ) {
    //if element is hidden
    if( x.hasAttribute("role") ) {
      x.removeAttribute("role");
      y.removeAttribute("aria-invalid");
    }
  }
  else {
    //if element is not hidden (error state)
    if( !x.hasAttribute("role") ) {
      x.setAttribute("role", "alert");
      y.setAttribute("aria-invalid", "true");
    }
  }
}
