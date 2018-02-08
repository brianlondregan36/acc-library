//FOR THE PAGE
document.getElementsByClassName("cf-page__hidden-fields")[0].setAttribute("aria-hidden", "true");
document.getElementsByClassName("cf-page__header")[0].setAttribute("role", "banner");
document.getElementsByClassName("cf-page__main")[0].setAttribute("role", "main");
var progBar = document.getElementsByClassName("cf-progress__indicator");
if(progBar[0]) {
  var accProgress = document.createEle5ddment("div");
  var accProgressTxt = document.createTextNode("Current survey progress is " + progBar[0].style.width);
  accProgress.style.textIndent = "-9999px";
  accProgress.appendChild(accProgressTxt);
  progBar[0].parentNode.parentNode.appendChild(accProgress);
}
document.getElementsByClassName("cf-page__navigation")[0].setAttribute("role", "navigation");
var navButtons = document.getElementsByClassName("cf-navigation__button");
for(var i = 0; i < navButtons.length; i++) {
  navButtons[i].setAttribute("tabindex", "0");
  navButtons[i].setAttribute("role", "presentation");
}

//FOR EACH QUESTION ON PAGE
Confirmit.page.questions.forEach(function(q,i) {


  //GENERAL TO ALL QUESTIONS----------------------------------------------------
  document.title = (i == 0) ? q.title : document.title;
  //give each question's container a form role with a label
  document.getElementById(q.id).setAttribute("role", "form");
  document.getElementById(q.id).setAttribute("aria-label", q.title);
  //assign ids for labelling
  $("div#" + q.id + " div.cf-question__text").attr("id", q.id + "_txt");
  $("div#" + q.id + " div.cf-question__instruction").attr("id", q.id + "_ins");
  $("div#" + q.id + " div.cf-question__error").attr("id", q.id + "_err");


  //SPECIFIC TO OPEN TEXT QUESTIONS---------------------------------------------
  if(q.type == "OpenText") {
    var input = document.getElementById(q.id + "_input");
    //assign labels to the Open Text input
    input.setAttribute("aria-labelledby", q.id + "_txt" + " " + q.id + "_ins");
    input.setAttribute("aria-errormessage", q.id + "_err");
    if(q.required) {
      //if required, add required property
      input.setAttribute("aria-required", "true");
    }
  } //---------------------------------------------------------------OPEN-------


  //GENERAL TO ALL QUESTIONS----------------------------------------------------
  var config = { attributes: true, subtree: true };
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.attributeName == "class") {
        var mutationNode = mutation.target;
        //alert roles should be set and unset on every thrown error area on the page
        //also set and unset invalid attribute on the input accordingly
        ToggleAlert(mutationNode, input);
        ToggleAlert(document.getElementsByClassName("cf-toast")[0], input);
      }
    });
  });

  var errorArea = document.getElementsByClassName("cf-question__error")[0]; //must be this current question error area!
  observer.observe(errorArea, config);
});



function ToggleAlert(x, y) {
  var cl = x.classList.value;
  if( cl.indexOf("--hidden") !== -1 ) {
    //if element is hidden...
    if( x.hasAttribute("role") ) {
      x.removeAttribute("role");
      y.removeAttribute("aria-invalid");
    }
  }
  else {
    //if element is not hidden... (error state)
    if( !x.hasAttribute("role") ) {
      x.setAttribute("role", "alert");
      y.setAttribute("aria-invalid", "true");
    }
  }
}


/*var sel = $("#" + q.id + " div.cf-error-block").each( function() { //bug! for grids the selector is not getting all the error areas
//does not exist at the time this runs! for the grid only. label seems to be added later. make this selector more general
  observer.observe(this, config);
});
*/
