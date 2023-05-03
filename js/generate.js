
var global_list_of_point = [];
var global_list_of_point_keep = [];
var global_F = [];
var global_R = [];
var maxnode = 0;

function getRandomInt(max) {
    return Math.floor(Math.random() * (max+1));
}

function getRandomInt2(min,max) {
    return Math.floor(min + Math.random() * (max-min+1));
}

function generate(maxx,maxy,nb,minl,maxl) {
    var l = [];
    var lo = [];
    while (l.length<nb) {
        var x = getRandomInt2(maxl,maxx);
        var y = getRandomInt2(maxl,maxy);

        if (lo.indexOf(x+"-"+y) == -1) {
            l.push([x,y]);
            lo.push(x+"-"+y);
        }
    }
    return l;
}


function initsvg() {
    var m = "";
    m += '<line x1="30" y1="0" x2="30" y2="500" style="stroke:gray;stroke-width:4" />'
    m += '<text x="10" y="10" font-family="Verdana" font-size="20" transform="rotate(90,10,10)" fill="gray"> Reference </text>'

    m += '<line x1="30" y1="500" x2="1030" y2="500" style="stroke:gray;stroke-width:4" />'
    m += '<text x="980" y="520" font-family="Verdana" font-size="20" fill="gray"> Read </text>'

    return m;
}

function gapLenth(xi,xj) {
    return Math.abs((xi[1]-xj[1])-(xi[0]-xj[0]));
}

function smallerDistance(xi,xj) {
    return Math.min((xi[1]-xj[1]),(xi[0]-xj[0]));
}

function gamma(xi,xj,w,a,b) {
    var g = gapLenth(xi,xj);
    return a*w*g + b*Math.max(Math.log2(g),0);

}

function argmaxPosition(G,F,L,i,w,a,b) {
    var j = 0;
    var v = 0;
    var xi = L[i];
    for (var k = 0;k < i;k++) {
        var xj = L[k];
        if (xi[0]-xj[0] < G && xi[1]-xj[1] < G && xi[1] > xj[1]) {
            var newv = F[k]+Math.min(smallerDistance(xi,xj),w) - gamma(xi,xj,w,a,b);
            if (v < newv) {
                v = newv;
                j = k;
            }
        }
    }
    return [j,v];
}



function genPoint(nb, w, G,a,b) {
    global_list_of_point = generate(1000,500,nb,w,w);
    global_list_of_point.sort(
        function (a,b) {
            if (a[0] == b[0]) {
                return a[1] - b[1];
            } else {
                return a[0] - b[0];
            }
        }
    );
    for (var x of global_list_of_point) {
        x.push(getRandomInt2(w,w));
    }
}

function getRoot(i) {
    var y = i;
    var z = global_R[y];
    while (z != -1) {
        y = z;
        z = global_R[y];
    }
    return y;
}

function getLength(i) {
    var y = i;
    var z = global_R[y];
    var i = 0;
    while (z != -1) {
        i+= 1
        y = z;
        z = global_R[y];
    }
    return i;
}

function computePoint(nb,w,G,a,b) {
    global_R = [];
    global_F = [];

    for (var i in global_list_of_point) {
        var j = parseInt(i)
        out = argmaxPosition(G,global_F,global_list_of_point,j,w,a,b);
        if (out[1] < w) {
            global_F.push(w);
            global_R.push(-1);
        } else {
            global_F.push(out[1]);
            global_R.push(out[0]);
        }
    }

    var F = [];
    for(var i = 0;i<global_F.length;i++) {
        F.push([i,global_F[i],getRoot(i)]);
    }
    F.sort(function (a,b) {
        return b[1]-a[1];
    });

    maxnode = [];
    var y = F[0][0];
    while (y != -1) {
        maxnode.push(y);
        y = global_R[y];
    }


}

function filter(nb,w,G,a,b) {

    var F = [];
    for(var i = 0;i<global_F.length;i++) {
        F.push([i,global_F[i],getRoot(i)]);
    }
    F.sort(function (a,b) {
        return b[1]-a[1];
    });

    maxnode = [];
    var y = F[0][0];
    while (y != -1) {
        maxnode.push(y);
        y = global_R[y];
    }


    var m = getRandomInt2(2,4);

    global_list_of_point_keep = [];
    var i = 0;
    var N = [];
    while (N.length < m) {
        if (N.indexOf(F[i][2]) == -1) {
            N.push(F[i][2])
            global_list_of_point_keep.push(F[i][0]);
        }
        i++;
    }

    F.sort(function (a,b) {
        return a[1]-b[1];
    });

    var mm = getRandomInt2(1,4);

    var i = 0;
    while (N.length < m+mm) {
        if (N.indexOf(F[i][2]) == -1 && getLength(F[i][0]) >= 1) {
            console.log(F[i],getLength(F[i][0]));
            N.push(F[i][2])
            global_list_of_point_keep.push(F[i][0]);
        }
        i++;
    }

    var mmm = getRandomInt2(1,4);

    while (N.length < m+mm+mmm) {
        if (N.indexOf(F[i][2]) == -1 && getLength(F[i][0]) >= 2) {
            console.log(F[i],getLength(F[i][0]));
            N.push(F[i][2])
            global_list_of_point_keep.push(F[i][0]);
        }
        i++;
    }

    var m = getRandomInt2(2,4);


    var i = 0;
    while (i < global_list_of_point_keep.length) {
        x = global_list_of_point_keep[i];
        y = global_R[x];
        if (y != -1 && global_list_of_point_keep.indexOf(y) == -1) {
            global_list_of_point_keep.push(y);
        }
        i += 1;
    }

    global_list_of_point_keep.sort((a,b) => a-b);

    var L = [];
    for (var i = 0;i<global_list_of_point_keep.length;i++) {
        L.push(global_list_of_point[global_list_of_point_keep[i]]);
    }
    global_list_of_point = L;

    for (var i in global_list_of_point) {
        if (global_list_of_point[i] === undefined) {
            console.log("problem",i,global_list_of_point_keep);
        }
    }
}

function show_all() {
    var m = initsvg();
    for (var i=0;i<global_list_of_point.length;i++) {
        if (global_R[i] >= 0) {
            x = global_list_of_point[i];
            y = global_list_of_point[global_R[i]];
            m += '<line x1="'+(x[0]+20)+'" y1="'+(510-x[1])+'" x2="'+(y[0]+20)+'" y2="'+(510-y[1])+'" style="stroke: #9379b0 ;stroke-width:2" />'
        }
    }
    for (var i=0;i<global_list_of_point.length;i++) {
        x = global_list_of_point[i];
        if (document.getElementById('linemers').checked) {
            m += '<line x1="'+(x[0]+20)+'" y1="'+(510-x[1])+'" x2="'+(x[0]-x[2]+20)+'" y2="'+(510-x[1]+x[2])+'" style="stroke:gray;stroke-width:4" id="line_'+x[0]+'_'+x[1]+'" />'
        }
        if (document.getElementById('seevalue').checked) {
            m += '<text x="'+(x[0]+25)+'" y="'+(510-x[1]+3)+'" font-family="Verdana" font-size="10"> '+parseInt(global_F[i])+' </text>'
        }
        if (maxnode.indexOf(i) != -1) {
            m += '<circle cx="'+(x[0]+20)+'" cy="'+(510-x[1])+'" r="2" stroke="orange" stroke-width="3" fill="orange" id="circle_'+x[0]+'_'+x[1]+'" style="cursor:pointer" />'
        } else {
            m += '<circle cx="'+(x[0]+20)+'" cy="'+(510-x[1])+'" r="2" stroke="black" stroke-width="3" fill="black" id="circle_'+x[0]+'_'+x[1]+'" style="cursor:pointer" />'
        }
    }
    document.getElementById('mysvg').innerHTML = m;
}


function show(ii) {
    var m = initsvg();
    G = parseInt(document.getElementById('windows').value);
    var x = global_list_of_point[ii];

    m += '<rect x="'+(x[0]+20-G)+'" y="'+(510-x[1])+'" width="'+G+'" height="'+G+'" style="fill:#74992e;opacity:0.4"/>';

    N = [];
    for (var k = 0;k < ii;k++) {
        var xj = global_list_of_point[k];
        if (x[0]-xj[0] < G && x[1]-xj[1] < G && x[1] > xj[1]) {
            N.push(k);
        }
    }
    for (var i=0;i<global_list_of_point.length;i++) {
        if (global_R[i+1] > 0) {
            x = global_list_of_point[i];
            y = global_list_of_point[global_R[i+1]];
            m += '<line x1="'+(x[0]+20)+'" y1="'+(510-x[1])+'" x2="'+(y[0]+20)+'" y2="'+(510-y[1])+'" style="stroke: #9379b0 ;stroke-width:2" />'
        }
    }
    for (var i=0;i<global_list_of_point.length;i++) {
        x = global_list_of_point[i];
        if (document.getElementById('linemers').checked) {
            m += '<line x1="'+(x[0]+20)+'" y1="'+(510-x[1])+'" x2="'+(x[0]-x[2]+20)+'" y2="'+(510-x[1]+x[2])+'" style="stroke:gray;stroke-width:4" id="line_'+x[0]+'_'+x[1]+'" />'
        }
        if (ii ==i) {
            m += '<circle cx="'+(x[0]+20)+'" cy="'+(510-x[1])+'" r="2" stroke="blue" stroke-width="3" fill="blue" id="circle_'+x[0]+'_'+x[1]+'" style="cursor:pointer" onclick="show('+i+')"/>'
        } else {
            if (N.indexOf(i) >= 0) {
                m += '<circle cx="'+(x[0]+20)+'" cy="'+(510-x[1])+'" r="2" stroke="#9c6314" stroke-width="3" fill="#9c6314" id="circle_'+x[0]+'_'+x[1]+'" style="cursor:pointer" onclick="show('+i+')"/>'
            } else {
                m += '<circle cx="'+(x[0]+20)+'" cy="'+(510-x[1])+'" r="2" stroke="black" stroke-width="3" fill="black" id="circle_'+x[0]+'_'+x[1]+'" style="cursor:pointer" onclick="show('+i+')"/>'
            }
        }
    }
    document.getElementById('mysvg').innerHTML = m;

}


function run() {
    nb = 500;
    w = parseInt(document.getElementById('sizemers').value);
    G = parseInt(document.getElementById('windows').value);
    a = parseFloat(document.getElementById('param1').value);
    b = parseFloat(document.getElementById('param2').value);
    genPoint(nb,w,G,a,b);
    computePoint(nb,w,G,a,b);
    filter(200,w,G,a,b);
    computePoint(nb,w,G,a,b);
    show_all();
}

function compute() {
    nb = 500;
    w = parseInt(document.getElementById('sizemers').value);
    G = parseInt(document.getElementById('windows').value);
    a = parseFloat(document.getElementById('param1').value);
    b = parseFloat(document.getElementById('param2').value);
    computePoint(nb,w,G,a,b);
    show_all();
}


run();
