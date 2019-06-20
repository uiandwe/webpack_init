var addressPoints = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


for(var i=0; i<500; i++){
	addressPoints.push([getRandomInt(-90, 90), getRandomInt(-180, 180), getRandomInt(0.1, 1)])
}

// console.log(addressPoints)

var data = addressPoints.map(function (p) { return [p[1], p[0], p[2]]; });

var heatlayer = new maptalks.HeatLayer('heat', data, {
    'heatValueScale': 1,
    'forceRenderOnRotating' : true,
    'forceRenderOnMoving' : true,
    'radius' : 100,
    'blur' : 30,
    'gradient' : {0.1: 'blue', 0.5: 'lime', 1: 'red'},
    'max': 1
}).addTo(map);
