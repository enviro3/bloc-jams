//points is already an existing array

function forEach(points, callback){
    for(var i=0; i<points.length; i++){ 
        callback(points[i]);
    }
}