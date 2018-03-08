
document.body.onkeydown = function(e) { 

  var a = document.activeElement; 
  if(a) {

    var role = a.getAttribute("role"); 
    if( role && role == "radio" ) {

      var group = a.parentNode;
      var children = group.children;
      var qid = a.getAttribute("id").split("_")[0];

      var k = e.keyCode;
      if( k == 38 || k == 40 ) {
        
	var ans = Confirmit.page.getQuestion(qid).value; 
        var selected = document.getElementById(qid + "_" + ans); 

        //scan answers
        var curr; 
        for(var i = 0; i < children.length; i++) {
          if(a == children[i]) {
            curr = i; 
          }
          if(children[i] == selected) {
            selected.setAttribute("aria-checked", "true");
          }
          else if(children[i] != selected) { 
            selected.setAttribute("aria-checked", "false");
          }
        }
 
        //move focus
        if(k == 38) {
          if(curr - 1 >= 0) {
            children[curr - 1].focus(); 
          }
        }
        if(k == 40) {
          if(curr + 1 < children.length) {
            children[curr + 1].focus(); 
          }
        }
      }


      //set question
      if(k == 32) {
        code = a.getAttribute("id").split("_")[1]; 
        Confirmit.page.getQuestion(qid).setValue(code);
        a.setAttribute("aria-checked", "true");
      }
    }
  }
};
