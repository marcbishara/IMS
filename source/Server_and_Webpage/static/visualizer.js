
function getValue(data,key){
    //console.log("iside ParseData -1 " + data);
    var parsed = parseJSON(data);
    //console.log("inside ParseData "+ parsed.data);
    var parsed2 = parseJSON(parsed.data);
    //console.log("inside ParseData2" + parsed2.x);


    if (key == 'x')
        return parsed2.x;
    else if (key == 'y')
        return parsed2.y;
    else if (key == 'tag')
        return parsed2.tag;
    else if (key == 'yaw')
        return parsed2.yaw;
    else
        return 0;

}

function degToRad(deg){
    return deg*(Math.PI/180);
}

function svg_vehicle(coord_x,coord_y,yaw){
    //var yaw = -yaw;
    $('#vehicle').empty();
    var body =  makeSVG('circle', {cx:coord_x , cy:coord_y, r:3, stroke: 'purple', fill:'purple' });
    var direction  =  makeSVG('line', {x1:coord_x , y1:coord_y,x2:coord_x+(7*(Math.cos(degToRad(yaw-90)))) ,y2:coord_y+(7*(Math.sin(degToRad(yaw-90)))), stroke: 'purple' });

    $('#vehicle').append(body);
    $('#vehicle').append(direction);
}


function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
      el.setAttribute(k, attrs[k]);
      //console.log(el);
    return el;
}

function svg_marker(coord_x,coord_y,color ){
    return makeSVG('circle', {cx:coord_x , cy:coord_y, r:1, stroke: 'black', 'stroke-width': .5, fill:color });
}


var marker ="";
var coord_x,coord_y ="";
eventSource_objects["viz_feed"].onmessage = function(message){
        if(message.data == 1){
            $('#output').append("server online - Visualizer Stream"+"<br>");
        }else{
        //console.log(message.data);
        coord_x = getValue(message.data,'x');
        coord_y = getValue(message.data,'y');
        tag = getValue(message.data,'tag');
        coord_x = coord_x/5.0;
        coord_y = -1*coord_y/5.0;
        //console.log(coord_x + ' '+ coord_y);
        if(tag == "door"){
            color = 'blue'
        }else if(tag == 'left'){
            color = 'red'
        }else{
            color = 'green'
        }
        marker =  svg_marker(coord_x,coord_y,color );
        $('#viewport').append(marker);
        $('#output').append("x: "+coord_x+"\ty: "+coord_y+"<br>");
        }
        $('#cc_panel').scrollTop($('#output').height());

}

eventSource_objects["pose_feed"].onmessage = function(message){
        if(message.data == 1){
            $('#output').append("server online - Position Feed"+"<br>");
        }else{
        //console.log(message.data);
        coord_x = getValue(message.data,'x');
        coord_y = getValue(message.data,'y');
        yaw = getValue(message.data,'yaw');
        tag = getValue(message.data,'tag');
        coord_x = coord_x/5.0;
        coord_y = -1*coord_y/5.0;
        //console.log(coord_x + ' '+ coord_y);
        svg_vehicle(coord_x,coord_y,yaw);
        }
};

