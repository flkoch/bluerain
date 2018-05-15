"use strict";

var toggleButtons = document.getElementsByClassName('toggle-btn');

for (var i = 0; i < toggleButtons.length; i++) {
    var toggleButton = toggleButtons[i];
    toggleButton.addEventListener('click', function(event) {
        var targets = document.querySelectorAll(toggleButton.getAttribute('data-target'));
        for (var j = 0; j < targets.length; j++) {
            var target = targets[j];            
            if (target.classList) {
                target.classList.toggle("opened");
            } else {
                // For IE9
                var classes = target.className.split(" ");
                var i = classes.indexOf("opened");
            
                if (i >= 0)
                    classes.splice(i, 1);
                else
                    classes.push("opened");
                    target.className = classes.join(" ");
            }
        }
    });    
}

/* window.addEventListener('resize', function(event) {
    
}); */