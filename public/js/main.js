let url;
url = 'data/test_p.json';

let visual; //전체 시각화 인스턴스들을 담음

let canvasDisplay;
let startPoint;
let scale; //전체 스케일
let textScale;
let fontScale;

let selection;
let titlePos;

let isSelected;
let sizeW, sizeH;

let edgeCount = 0;
let nodeCount = 0;

let beingDragged = false;

var headerHeight = 70;
var asideWidth = 300;

let i;
let initInt;

function setup() {
//    reset(url);
}

function setInit(){
  i=1;
  initInt = -sizeH*3/2;
}

function reset(u, callback, errorCallback) {
  
  offDisplay();
  isSelected = false;
  
  scale = 72;
  textScale = 150/4;
  fontScale = 150/10;
  
  sizeW = windowWidth - asideWidth;
  sizeH = windowHeight - headerHeight;
  
  windowRatio = sizeH/sizeW;
  

  canvasDisplay = createCanvas(sizeW, sizeH);
  canvasDisplay.parent('visual-holder');
  //canvasDisplay.class("visual");

  startPoint = createVector(sizeW/2-sizeW/3, sizeH/2-sizeH/3);// startPoint
  
  isSelected = false;
  isDisplayOn = false;
  
  loadJSON(u, data => (loadDataConstructor(data), callback && callback(data)), errorCallback);

  
  //textStyle(NORMAL);

  background(0,0,5);
  smooth();
  cursor('default');
}

function windowResized() {
  sizeW = windowWidth - asideWidth;
  sizeH = windowHeight - headerHeight;

  resizeCanvas(sizeW, sizeH);
}


function draw() {
  //background(0,0,95); //white mode
  background(0,0,5);
  
  if(visual && visual.nodeIndex && visual.edgeIndex) {
  
    for (let i = 0; i < nodeCount; i++) {
      if(visual.nodes[i].isSetting = true) {
        visual.nodes[i].setPos();
      }
    }
      
    for(let i = 0; i < visual.edgeIndex.length; i++){
        let e = visual.edgeIndex[i];
        e.forEach(function (item) {
          item.draw(i)
          });
      }
    
    
    for (let i = 0; i < nodeCount; i++) {
      visual.nodes[i].draw();
    }
    
    i++;

    initInt += (sizeW)*0.05;
    
    if(initInt < sizeH){
      //print("init");
      initLoading(initInt);
    }


    mouseOn();
  }

}

function initLoading(i) {
  push();
  fill(0,0,5);
  stroke(visual.mainColor,80,80);
  strokeWeight(10);
  rect(-20, i, sizeW+40,sizeH*5/2);
  pop();
}

function mouseOn() {
  let closet = 15; 
  let isDisplayOn = false; //두개가 display되는것 방지
  
  for(let i=0; i < nodeCount; i++) {
    let n = visual.nodes[i];
    let d = dist(mouseX, mouseY, n.curPos.x, n.curPos.y);
    
    if(!isSelected) { //선택된 상태가 아닐때만
      if(!isDisplayOn) { //이미 텍스트가 켜진 상태가 아닐때
          if(d < closet) { //클릭된 반경이 일정이하인경우
            n.displayOn(n.setNumber[0]); //그 클릭된 노드와 같은 세트넘버에게에게 displayOn 명령을 내림
            isDisplayOn = true;
          } else if(!mouseDragged){
          }
        d = closet;
      }
    } 
  }
    if(selection) {
      let setOrder = setMouseSetOrder(selection);
      if(!setOrder) {
        setOrder = selection.setNumber;
      }
      
      for(let i=0; i<edgeCount; i++){
       let e =  visual.edges[i];
       if(setOrder.length > 1){
        if(setOrder.includes(e.setNumber)){
          e.opacity = 100;
          e.from.displayOn(e.setNumber, false);
          e.to.displayOn(e.setNumber, false);
        } 
         
       } else if(setOrder == e.setNumber){
         e.opacity = 100;
         e.from.displayOn(e.setNumber);
         e.to.displayOn(e.setNumber);
       }else{
          e.opacity = 10;
        }
      }
    }
    cursor('grab');
    
    if(beingDragged){
      cursor('grabbing');
    } else if(isDisplayOn) {
      cursor('pointer');
    } else {
      cursor('grab');
    }
  
}

function mouseWheel(event) {
  if(mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0){
    if(abs(event.delta) > 6){
      if(scale >= 50 && scale <= 100) {
        scale += event.delta;
        for (let i = 0; i < nodeCount; i++) {
          visual.nodes[i].initPos();
        }
      } else if(scale < 50 && event.delta > 0) {
        scale += event.delta;
        for (let i = 0; i < nodeCount; i++) {
          visual.nodes[i].initPos();
        }
      } else if(scale > 100 && event.delta < 0) {
         scale += event.delta;
        for (let i = 0; i < nodeCount; i++) {
          visual.nodes[i].initPos();
        }
      }
    }
    return false;
  }
  
}

function setMouseSetOrder(node) { //마우스 댔을 떄 
  let closet = 30; 
  let mouseSetOrder = [];
  
      let d = dist(mouseX, mouseY, node.curPos.x, node.curPos.y);
      
      for(let i= node.setNumber.length; i>0; i--){
        if(closet*(i) > d && d > closet*(i-1)){
          mouseSetOrder = node.setNumber[i-1];
          return mouseSetOrder;
        } 
    }          
    return node.setNumber;

}



function mouseDragged() {
  if(mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0){
    

    startPoint.x += (mouseX - pmouseX);
    startPoint.y += (mouseY - pmouseY);
    
    let dragMin = createVector(mouseX - pmouseX, mouseY - pmouseY);
    
    if(dragMin.magSq() > 10) { //클릭했는데 드래그가 되지 않기 위해
      beingDragged = true;
    }
    
  }
}

function mouseReleased() {
  if(mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0){
    cursor('grab');
    if(!beingDragged) { //드래그되고있지않다면
      let closet = 30;
        if(isSelected == true) {
        isSelected = false;
      } else {
        isSelected = true;
      }
      
        for(let i=0; i<nodeCount; i++) {
          let n = visual.nodes[i];
          let d = dist(mouseX, mouseY, n.curPos.x, n.curPos.y);
          
          if(d < closet) {
              selection = n;
              refreshVid();
              
            closet = d;
          }
        }
        
        if(isSelected) {
          if(selection) {

            doDisplay(); //비디오 온오프
  
          }
        }
        
        if(!isSelected){
          offDisplay();
        }
        
        //셀랙상태일때 끄기. (node가 아닌 것 클릭했을 때)
      if(!isSelected) { //선택안됐을경우
          selection = null;
          for(let i=0; i<nodeCount; i++) {
            let n = visual.nodes[i];
            n.isFocused = false;
          }
          for(let i=0; i<edgeCount; i++){
            let e = visual.edges[i];
            e.opacity = 100;
          }
      }
    }

    beingDragged = false;
  }
}



$( document ).ready(() => {

  var history = new Set();
  
 
  
  $("input").keydown(function(objEvent) {
            if (objEvent.keyCode == 13) {  //clicked enter
                 $("div#form button#submit").click(); //do click
            }
        });
        
  
  $("div#form button#submit").on("click", function() {
    
    var ip = $("div#form input#ip").val()
    //var rn = $("div#form input#rn").val() 
    // var rt = $("div#form input#rt").val()
    var rn = 20;
    var rt = 9;
    var url = window.location.protocol + "//" + window.location.hostname + "/query?"
    
    if(!ip) {
      return;
    }
    
    $("#loading").css("display", "flex");

    
    if (!!ip && ip.length) {
      url += "ip=" + ip + "&";
    }

    //if (!!rn && rn.length) {
      url += "rn=" + rn + "&";
    //}

    //if (!!rt && rt.length) {
      url += "rt=" + rt + "&";
    //}
    
    $("#search-title").text(ip);
    $("button#submit").prop("disabled", true);
    $('iframe').css('display','none');
    
    reset(url, function() {
      history.add(ip);
      resetHistory();
      setScroll();
      $("button#submit").prop("disabled", false);
      $('#ip').val('');
    }, function () {
      alert("Sorry! crawling failed. Please try some other keyword.");
      $("button#submit").prop("disabled", false);
      $("#loading").css("display", "none");
    });
    
  })

  var listUrl = window.location.protocol + "//" + window.location.hostname + "/list";
  $.ajax(listUrl).then(function(res) {
    res.forEach(function(ip) {
      history.add(ip);
    })
    resetHistory();
  });
  
  
  $("#list").on("click", function(e) {
     $('iframe').css('display','none');
    var ip = $(e.target).data('ip');
    $("#list>li.selected").removeClass("selected");
    if (!!ip) {
      $(e.target).addClass('selected');
      var queryUrl = window.location.protocol + "//" + window.location.hostname + "/query?ip=" + ip 
      $("button#submit").prop("disabled", true);
      $("#search-title").text(ip);
      reset(queryUrl, function() {
        
        $("button#submit").prop("disabled", false);
      }, function () {
        alert("Sorry! Please try again.");
        $("button#submit").prop("disabled", false);
        $("#loading").css("display", "none");
      })
    }
  })


  function resetHistory() {
    $("#list").empty()
    history.forEach(function(ip) {
      $("#list").append(`<li data-ip="${ip}" style="cursor: pointer;">${ip}</li>`);
      $("#list").scrollTop(0);
    })
  }
  
  function setScroll() {
    $("#list>li:last-child").addClass('selected');
    //$("#list").scrollTop($("#list").scrollHeight);
    $("#list").scrollTop(0);
    $("#loading").css("display", "none");
  }
});


