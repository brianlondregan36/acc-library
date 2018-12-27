
var returnFocus;
var ctx = api()
  .invite('Invite Example 1') //not treating this as a modal or non-modal dialog because it's present from the start
  .container('Container Example 1') //but this is a modal dialog!
  .survey('p3085068453')
  .show();

ctx.events.showInvite.on(function() {

  returnFocus = document.body; //if the invite is popped up this should be document.activeElement

  var x = document.getElementsByClassName("cf-invite-wrapper");
  if (x.length == 1) {
    AccessibleKeys(x[0]); //handles keyboard support
  }
});

ctx.events.showContainer.on(function() {

  //create a container to target aria-hidden for inert website content (in case modal aria role isn't working)
  var hiddenUnderlay = document.createElement("div");
  hiddenUnderlay.setAttribute("aria-hidden", "true");
  hiddenUnderlay.classList.add("cf-underlay");
  var node = document.createTextNode("");
  hiddenUnderlay.appendChild(node);
  while(document.body.childNodes.length > 1) {
    hiddenUnderlay.appendChild(document.body.childNodes[0]);
  }
  document.body.insertBefore(hiddenUnderlay, document.body.childNodes[0]);

  var x = document.getElementsByClassName("cf-container-wrapper");
  if (x.length == 1) {
    AccessibleKeys(x[0]); //handles keyboard support
  }
});

ctx.events.closeInvite.on(function() {
    returnFocus.focus();
});

ctx.events.declineInvite.on(function() {
    returnFocus.focus();
});

ctx.events.closeContainer.on(function() {
    returnFocus.focus();
    document.getElementsByClassName("cf-underlay")[0].setAttribute("aria-hidden", "false"); //show website content again!
});



function AccessibleKeys(elem) {

  var iframes = elem.getElementsByTagName("iframe");
  if (iframes.length == 1) {
    var iframe = iframes[0]; //we were given a container, not an invite
    window.addEventListener("message", receiveMessage, false); //need to keep the loop closed, listen to survey...
  }

  elem.addEventListener("keydown", function(e) {
    if (e.key === 'Escape' || e.key === 'Esc') { //escape key functionality
      if (!iframe) {
        document.getElementsByClassName("cf-invite__close")[0].click();
      }
      else if (iframe) {
        document.getElementsByClassName("cf-container__close")[0].click();
      }
    }
    else if (e.key === 'Enter' || e.key === 'Spacebar' || e.key === ' ') { //space and enter functionality
      if (e.target.classList.contains("cf-invite__button") || e.target.classList.contains("cf-invite__close") || e.target.classList.contains("cf-container__close")) {
        e.preventDefault();
        e.target.click();
      }
    }
    else if (!e.shiftKey && e.key === 'Tab') { //tabbing forward
      if (e.target.classList.contains("cf-container__close")) {
        iframe.contentWindow.postMessage("MIF", iframe.src); //tell survey to Move focus Into the Frame so first focusable elem in survey
        e.preventDefault();
      }
    }
    else if (e.shiftKey && e.key === 'Tab') { //tabbing backward
      if (e.target.classList.contains("cf-container__close")) {
        iframe.contentWindow.postMessage("MTB", iframe.src); //tell survey to Move focus To the Bottom of the survey so last focusable elem
        e.preventDefault();
      }
    }
  });

  function receiveMessage(event)
  {
    if (event.origin !== "https://survey.us.confirmit.com") { //change this if EURO
      return 0;
    }
    if (event.data === "OPEN") {
      iframe.contentWindow.postMessage("MIF", iframe.src); //start with focus inside container
    }
    if (event.data === "MTT") { //received a message to Move focus To the Top of container so the (x) button
      document.getElementsByClassName("cf-container__close")[0].focus();
    }
  }
} //END AccessibleKeys
