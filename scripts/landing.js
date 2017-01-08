  var animatePoints = function() {
 
            var points = document.getElementsByClassName('point');
 
            
            var revealPoint = function(indexOfPoint){  //replaces var revealFirstPoint = function() for all three points 
                
                points[indexOfPoint].style.opacity = 1;
                points[indexOfPoint].style.transform = "scaleX(1) translateY(0)";
                points[indexOfPoint].style.msTransform = "scaleX(1) translateY(0)";
                points[indexOfPoint].style.WebkitTransform = "scaleX(1) translateY(0)";
            };
            
            for(var i=0; i<points.length; i++){ //replaces revealFirstPoint();...etc. 
                revealPoint(i);
            }
      
  };
            
                
      
       