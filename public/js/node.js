

class Node {
  
  constructor(lb, sn, vn) {
    this.label = lb;
    this.setNumber = [];
    this.setNumber.push(sn);
    
    this.videoNumber = [];
    this.videoNumber.push(vn);
    
    this.videoOrder = createNumberDict(sn, vn);
    
    this.linkURL = visual.links[this.setNumber[0]][this.videoNumber[0]];
    this.description = visual.descriptions[this.setNumber[0]][this.videoNumber[0]];
    this.category = visual.categories[this.setNumber[0]][this.videoNumber[0]];
    
    this.count = 1; //노드의 크기 결정하는 변수. incement에서 하나씩 커짐.
   
    this.radius = 2*sqrt((this.videoNumber[0]+2))*2*scale - 3/2*scale; //노드들이 배치될 좌표의 반지름 크기    
    this.percentage = this.setNumber[this.setNumber.length]*2/visual.setVolume; //전체 세트수만큰 원주를 나누고, i번째에 배치

    this.radian_xCor = cos(this.percentage *2*PI + PI/(1.61803)*((this.videoNumber[0]+1)/PI)); //노드가 배치될 좌표의 x각도
    this.radian_yCor = sin(this.percentage *2*PI + PI/(1.61803)*((this.videoNumber[0]+1)/PI)); //노드가 배치될 좌표의 y각도

    this.startPoint = startPoint;
    
    this.curPos = createVector(this.radian_xCor,this.radian_yCor).normalize().mult(this.radius).add(startPoint);
    this.angle = atan2(this.curPos.y - this.startPoint.y,this.curPos.x - this.startPoint.x)+5/4*PI;
    
    this.opacity = 100; // 투명도
    
    this.isFocused = false;
    this.isSetting = false;
    
    this.colorset = [];
    this.colorset.push(setColorSN(sn));
    
    this.mouseSetOrder = [];
    
  }
  
  initPos() {
    this.startPoint = startPoint;
    this.radius = 2*sqrt((this.videoNumber[0]+2))*2*scale - scale;

    this.curPos = createVector(this.radian_xCor,this.radian_yCor).normalize().mult(this.radius).add(startPoint);
    this.angle = atan2(this.curPos.y - this.startPoint.y,this.curPos.x - this.startPoint.x)+5/4*PI;
    
  }
    
    
  
  setPos() {
    this.isSetting= false;
    
    for(let j=0; j < nodeCount; j++) {
      let n = visual.nodes[j];
      
      if(n != this) { //자기 자신이 아니면
        let angleSub = abs(this.angle - n.angle);
        if(angleSub >= 3*PI/5) { //전체 노드를 그만큼에 재한 시킴
          if(n.angle > this.angle) {
            this.angle += angleSub/300 ;
          } else {
            this.angle -= angleSub/300 ;
          }
          
        }
        if(n.videoNumber[0] == this.videoNumber[0]) {
          if(this.curPos.dist(n.curPos) > 150*4) {
            this.angle -= random(-0.08, 0.08);
            this.isSetting = true;
          }
        } 
          if(this.curPos.dist(n.curPos) < 150/16 ){
            this.angle += random(-0.12, 0.12);
            this.isSetting = true;
        }
        
      }
    }
  }
  
  increment() {
    this.count++;
  }
  
  displayOn(setNum, numDisplayOn = true) {
    
    let wid,hei;
    let numberText;
    let labelText;
    let numberWidth;
  
    let borderRadius = 3;
    
    this.opacity = 100;
    this.isFocused = true;
    
    if(this.label.length >= 33) {
      labelText = this.label.substr(0,32) + "...";
    } else {
      labelText = this.label;
    }



    if(numDisplayOn) {
      for(let i=visual.nodeIndex[setNum].length-1; i >= 0; i--){
        if(this.label == visual.nodeIndex[setNum][i].label){
          numberText = i + 1 + '.';
        }
      }
    } else {
      numberText = '';
    }
  
    push();
    
    
    noFill();
    stroke(0,0,100,10);
    ellipse(this.startPoint.x, this.startPoint.y, this.radius*2, this.radius*2);
    
    noStroke();
    if(selection == this){
      stroke(0,0,100);
      strokeWeight(1.5);
      //textStyle(BOLD);
    }
    
  
    //숫자 크기 설정
    textAlign(LEFT,CENTER);
    textSize(textScale);
    numberWidth = textWidth(numberText);
    
    //위치
    translate(this.curPos.x, this.curPos.y); 
    rotate(11/6*PI);//각도만큼 텍스트를 돌림
 
    
    //텍스트 박스
    textSize(fontScale);
    rectMode(CORNER);
    
    fill(setColorSN(setNum), this.opacity);
    
    wid = textWidth(labelText) + 4*textScale/5;
    hei = textAscent() + textDescent() + 2*textScale/5;
    rect(this.setNumber.length*5 + textScale, 0-hei/2 - textScale/36, wid, hei, borderRadius);
    
    //타이틀 텍스트
    noStroke();
    fill(0,0,100,100);
    text(labelText, this.setNumber.length*5 + textScale + 2*textScale/5, 0);
    
            ////숫자
    
    fill(setColorSN(setNum, this.opacity));
    textSize(textScale*4/5);
    //fill(0,0,100,100);
    textStyle(BOLD);
    text(numberText, this.setNumber.length*5 + textScale*0.2, textScale*0.05);
    
    pop();
        
  }

  
  setMouseSetOrder(){
    let closet = 20; 
    let mouseSetOrder = [];
        let d = dist(mouseX, mouseY, this.curPos.x, this.curPos.y);
        
        for(let i= this.setOrder.length; i>0; i--){
          if(d < closet*i){
            mouseSetOrder.push(this.setOrder[i]);
            this.mouseSetOrder = mouseSetOrder;
            return mouseSetOrder;
          } 
        }
        mouseSetOrder = this.setOrder;
         this.mouseSetOrder = this.setOrder;
         return mouseSetOrder;
  
  }
    
   


  
  draw() {
    this.curPos = createVector(cos(this.angle + PI),sin(this.angle + PI)).normalize().mult(this.radius).add(this.startPoint);
    
    
    push();
    
    if(this == selection) {
      fill(0,0,100);
      ellipse(this.curPos.x, this.curPos.y, (this.setNumber.length-1)*5+14, (this.setNumber.length-1)*5+14);
    }
    
      for(let i= this.setNumber.length-1; i>=0; i--){
        noStroke();
        fill(visual.hueArr[this.setNumber[i]], visual.staurationArr[this.setNumber[i]], visual.brightnessArr[this.setNumber[i]], this.opacity);
        ellipse(this.curPos.x, this.curPos.y, i*5 + 10,i*5 + 10);
      }
      
    fill(0,0,5);
    ellipse(this.startPoint.x, this.startPoint.y,40,40)
    pop();
    

 }
}

