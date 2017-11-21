Confirmit.page.questions.forEach(function(q) {

  //give each question's container a form role and a label
  if( q.title && q.title != "" ) {
    var sel = "#" + q.id + " div.cf-question__content";
    $(sel).each(function() {
      $(this).attr({"role":"form", "aria-labelledby":q.title});
    });
  }

  //OPEN TEXT QUESTIONS
  if(q.type == "OpenText") {
    var inputSel = "#" + q.id + "_input";

    //assign a label to each Open Text questions' input
    var textSel = "div#" + q.id + " div.cf-question__text";
    var insSel = "div#" + q.id + " div.cf-question__instruction";
    var tID = q.id + "_txt"
    var iID = q.id + "_ins"
    $(textSel).attr("id", tID);
    $(insSel).attr("id", iID);
    var val = tID + " " + iID;
    $(inputSel).attr("aria-labelledby", val);

    //if required, add required property
    if(q.required){
      $(inputSel).attr("aria-required", "true");
    }

    //if an error is detected...
      //1) input gets aria-invalid = true,
      //2) input gets aria-errormessage that should point to this div.cf-question__error
      //3) alert roles should be set on every thrown error area on the page
  }
});


/*
//code to set alert role on every thrown error area on the page
var config = { attributes: true, subtree: true };
var targets = document.getElementsByClassName("cf-question__error");

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var mutationNode = mutation.target;
    var ul = mutationNode.childNodes[1];
    var li = ul.childNodes[0];
    li.setAttribute("role", "alert");
  });
});

Array.prototype.forEach.call(targets, function(t) {
  observer.observe(t, config);
});
*/
