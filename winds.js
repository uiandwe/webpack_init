// m/sec
wind_speed_0 = 0.5
wind_speed_1 = 2
wind_speed_2 = 4
wind_speed_3 = 6.5
wind_speed_4 = 9
wind_speed_5 = 11
wind_speed_6 = 15
wind_speed_7 = 19

// m
earth_radius = 6371000



//바람 요소들
var particles = new maptalks.ParticleLayer('c', {
  'forceRenderOnMoving' : true
});

var center = map.getCenter();

for_loop_count = 2000;

wind_infos = [];

var point = map.coordinateToContainerPoint({x: 0, y: 0});
// console.log(point)

particles_pointers = [];
var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;

// console.log(innerWidth, innerHeight)

// 바람 측정소 (세기/방향)
for(var i=0; i<100; i++){
  x = makeRandom(-100, 100);
  y = makeRandom(-50, 50);

  wind_point = map.coordinateToContainerPoint({x: x, y: y});

  var wind = {
    x: wind_point.x,
    y: wind_point.y,
    map_x: x,
    map_y: y,
    direction: makeRandom(0, 360),
    wind: makeRandom(10, 50),
    size: 50
  }
  wind_infos.push(wind);
}


var c = map.getCenter();

// 바람 측정소 표기
// var symbol = {
//   'markerType': 'ellipse',
//   'markerFill': 'rgb(216,115,149)',
//   'markerFillOpacity': {
//     'property': 'heat',
//     'type' : 'identity'
//   },
//   'markerLineWidth': 0,
//   'markerLineOpacity': 1,
//   'markerWidth': 100,
//   'markerHeight': 100
// };


// var markLayer = new maptalks.VectorLayer('v').addTo(map);

// for(var i=0; i<wind_infos.length; i++){
//     var marker1 = new maptalks.Marker(
//       {x:wind_infos[i].map_x, y:wind_infos[i].map_y},
//       {
//         'symbol' : symbol,
//         'properties' : {
//           'heat' : 0.5
//         }
//       }
//     ).addTo(markLayer);
// }




// 바람 표기 포인터 init

for(var i=0; i<for_loop_count; i++){
  var x = Math.floor((Math.random() * innerWidth) + 1);
  var y = Math.floor((Math.random() * innerHeight) + 1);
  var wind_speed = y < innerHeight/2 ? 0 : 180;
  particles_pointers.push({
    init_x:  x,
    init_y: y,
    x : x, 
    y: y,
    next_x: wind_speed_0,
    next_y: 0,
    direction: wind_speed,
    wind: wind_speed_7
  })
}

animation_loop = 0;
animation_loop_max = 200;

particles.getParticles = function (t) {
  ret_list = [];

  for(var i=0; i<for_loop_count; i++){

    // var point = map.coordinateToContainerPoint({x: 0, y: 0});
    var x = particles_pointers[i].x;
    var y = particles_pointers[i].y;
  
    if(animation_loop >= animation_loop_max){
      x = particles_pointers[i].init_x;
      y = particles_pointers[i].init_y;
    }
    
    //바람세기에 따른 이동 변화

    for(var i_wind=0; i_wind<wind_infos.length; i_wind++){
      if(check_circle(x, y, wind_infos[i_wind].x, wind_infos[i_wind].y, wind_infos[i_wind].size)){
        
        particles_pointers[i].wind = wind_infos[i_wind].wind;
        particles_pointers[i].direction = wind_infos[i_wind].direction;
        particles_pointers[i].next_x = next_x_position(particles_pointers[i].wind, particles_pointers[i].direction);
        particles_pointers[i].next_y = next_y_position(particles_pointers[i].wind, particles_pointers[i].direction);
      }  
    }
    
    x = x + particles_pointers[i].next_x;
    y = y + particles_pointers[i].next_y; 

    if(x > innerWidth){
      x = 0;
    }
    if(x < 0){
      x = innerWidth;
    }

    if(y > innerHeight){
      y = 0;
    }
    if(y < 0){
      y = innerHeight;
    }

    particles_pointers[i].x = x;
    particles_pointers[i].y = y;
      
    result = {
        point : {x: x, y: y},
        r : 4,
        color : 'rgb(135,196,240)'
      }
    ret_list.push(result);
  }

  if(animation_loop >= animation_loop_max){
    animation_loop = 0;
  }
  
  animation_loop++;

  return ret_list;
};


function check_circle(x, y, circle_x, circle_y, radius){
  if ( Math.pow(x-circle_x, 2) + Math.pow(y-circle_y, 2) < radius*radius )
        return true;
    else
        return false;
}


function next_x_position(wind, direction){
  // 빗변 * sin각도
  return (innerWidth*wind)/earth_radius * Math.sin(direction) * 100
}

function next_y_position(wind, direction){
  // 빗변 * cos각도
  return (innerWidth*wind)/earth_radius * Math.cos(direction) * 100
}

function makeRandom(min, max){
    var RandVal = Math.floor(Math.random()*(max-min+1)) + min;
    return RandVal;
}


map.addLayer(particles);
