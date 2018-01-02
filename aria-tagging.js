//FOR EACH QUESTION ON PAGE
Confirmit.page.questions.forEach(function(q) {

  //GENERAL TO ALL QUESTIONS----------------------------------------------------
  if( q.title && q.title != "" ) {

    //give each question's container a form role and a label
    var sel = "div#" + q.id;
    $(sel).each(function() {
      $(this).attr({"role":"form", "aria-label":q.title});
    });

    //give the browser tab a better title
    var onlyOnce = 1;
    if(onlyOnce) {
      document.title = q.title;
      onlyOnce = 0;
    }
  } //------------------------------------------------------------------ALL-----

  //SPECIFIC TO OPEN TEXT QUESTIONS---------------------------------------------
  if(q.type == "OpenText") {
    var inputSel = "#" + q.id + "_input";

    //assign a collective label to each Open Text questions' input
    $("div#" + q.id + " div.cf-question__text").attr("id", q.id + "_txt");
    $("div#" + q.id + " div.cf-question__instruction").attr("id", q.id + "_ins");
    $(inputSel).attr("aria-labelledby", q.id + "_txt" + " " + q.id + "_ins");

    //if required, add required property
    if(q.required) {
      $(inputSel).attr("aria-required", "true");
    }
  } //---------------------------------------------------------------OPEN-------

  //SPECIFIC TO SINGLE QUESTIONS------------------------------------------------
  else if(q.type == "Single") {


  } //-------------------------------------------------------------SINGLE-------
});

//FOR ERROR HANDLING
var config = { attributes: true };
var targets = document.getElementsByClassName("cf-toast");

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var mutationNode = mutation.target;
    if( mutationNode.className.indexOf("cf-toast--hidden") !== -1 ){
      mutationNode.removeAttribute("role");
    }
    else {
      mutationNode.setAttribute("role", "alert");
    }
  });
});

observer.observe(targets[0], config);
