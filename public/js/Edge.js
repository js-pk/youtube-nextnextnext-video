class Edge {
  constructor(f, t, s) {
    
    this.count = 0;
    this.order = [];
    
    this.from = f;
    this.to = t;
    this.opacity;
    this.setNumber = s;
    

    }

  
  
  /*
setEdgeFocus(setOrder) {

      
      for(let i=0; i<visual.edgeIndex.length; i++){ //우선 모두 opacity를 5로 설정
        let e = visual.edgeIndex[i];
        for(let item in e){
          item.opacity = 5;
          print("setOpacity");
        }
      }
    
      
      for(let i=0; i<setOrder.length; i++) {
        for(let item in visual.edgeIndex[setOrder[i]]) {
          item.opacity = 100;
        }
      }
    
    
  }
  */
  
  /*
  setFocus(setOrder) {
    this.opacity = 5;
    
      for(let i=0; i<setOrder.length; i++){

          if(visual.edgeIndex[setOrder[i]].includes(this)){
            print("edge includes" + i);
            this.opacity = 100;
            } else {
              this.opacity = 5;
            }

        }
  }
  */
    
  setFocus() {
    if(selection){
      this.opacity = 5;
        if(this.from.isFocused && this.to.isFocused) {
          for(let i=0; i<selection.mouseSetOrder; i++) {
            //if(this.from.setNumber.includes(selection.mouseSetOrder) || this.to.setNumber.includes(selection.mouseSetOrder)) {
            print(visual.edgeIndex);

            
             visual.edgeIndex[0].forEach(function(e) {
              print(e);
              e.opacity = 100;
             });
           }
       // }
        
      } else {
        this.opacity = 5;
      }

    } else {
      this.opacity = 100;
    }
  
  }
  
  onFocus(s){
    if(s = this.setNumber){
      this.opacity = 100;
    } else{
      this.opacity = 5;
    }
  }
  

  
  setCount() {
    for(let i=0; i<edgeCount; i++){
      let item = visual.edges[i];
        if(item.from == this.from && item.to == this.to){
          this.count++;
        }
      }  
  }
  
  draw(setNum) {
    let arcCor; //arc의 중심
    let radius; //arc의 반지름
    let radian; //this.from좌표에서 arc중심까지의 각도
    
    let nCor; ////radius가 같은 새로운 원의 중심점. this.from과 this.to의 거리가 지름이다.
    let newRadius; //새로운 지름
    let toRadian; //this.to에서 새로운 원까지의 각도
    let fromRadian; //this.from에서 새로운 원까지의 각도

    let midRadian, arrowCor;    
    let arrowACor, arrowBCor, arrowCCor;
    let arrowSize = scale/14;
    let arrowAngle;
    let fixedTo, fixedFrom;
    
    arcCor = createVector((this.from.curPos.x + this.to.curPos.x)/2,(this.from.curPos.y + this.to.curPos.y)/2);
    radius = createVector(this.from.curPos.dist(this.to.curPos));
    radius = mag(radius.x,radius.y);
    
    radian = atan((this.from.curPos.y - arcCor.y) / (this.from.curPos.x - arcCor.x));

    arrowAngle = this.from.curPos.angleBetween(this.to.curPos);
    nCor = createVector((this.from.curPos.x + this.to.curPos.x + -sqrt(3)*(this.from.curPos.y - this.to.curPos.y))/2,(this.from.curPos.y + this.to.curPos.y + -sqrt(3)*(this.to.curPos.x - this.from.curPos.x))/2);
    newRadius = radius*2;
 
    toRadian = atan2((nCor.y-this.to.curPos.y),(nCor.x-this.to.curPos.x)) + PI;
    fromRadian = atan2((nCor.y-this.from.curPos.y),(nCor.x-this.from.curPos.x))+ PI;
     
    arrowCor = createVector(nCor.x + (newRadius)*cos(midRadian)/2, nCor.y +(newRadius)*sin(midRadian)/2);

    
      /////node 연결하는 arc 그리기
      if((toRadian - fromRadian) > (fromRadian - toRadian)) {
        
        if(toRadian - fromRadian > PI) {
          fixedFrom = toRadian;
          fixedTo = 2*PI + fromRadian;
          //arc(nCor.x, nCor.y, newRadius, newRadius, toRadian, 2*PI + fromRadian); //타원이 반원보다 크면 반대타원으로 바꿈
          
        } else { 
          fixedFrom = fromRadian;
          fixedTo = toRadian;
          //arc(nCor.x, nCor.y, newRadius, newRadius, fromRadian, toRadian);
        }
      }else if((toRadian - fromRadian) <= (fromRadian - toRadian)) {
   
        if(fromRadian - toRadian > PI) {
          fixedFrom = fromRadian;
          fixedTo = 2*PI + toRadian;
          //arc(nCor.x, nCor.y, newRadius, newRadius, fromRadian, 2*PI + toRadian); //타원이 반원보다 크면 반대타원으로 바꿈//타원이 반원보다 크면 반대타원으로 바꿈
        } else {
          fixedFrom = toRadian;
          fixedTo = fromRadian;
          //arc(nCor.x, nCor.y, newRadius, newRadius, toRadian, fromRadian);
        }
        
      }
      midRadian = (fixedFrom + fixedTo)/2;
      arrowCor = createVector(nCor.x + (newRadius)*cos(midRadian)/2,nCor.y + (newRadius)*sin(midRadian)/2);
  
  //arc(nCor.x, nCor.y, newRadius, newRadius, fixedFrom, fixedTo);
      
 //////////////////////////////////////////////////////////////////////////// 

      let calcAngle = createVector(this.to.curPos.x - this.from.curPos.x, this.to.curPos.y - this.from.curPos.y);
      let curveAngle = calcAngle.heading() + PI/2;//from->to의각도와 수직
      let orderVar = this.count-1; //edge의 굴곡정도.
      
      let angleVectorFrom = createVector(cos(curveAngle+PI/10*(orderVar)),sin(curveAngle+PI/10*(orderVar))).mult(newRadius/12+this.count*8);
      let angleVectorTo = createVector(cos(curveAngle-PI/10*(orderVar)),sin(curveAngle-PI/10*(orderVar))).mult(newRadius/12+this.count*8);
     
      let cpFrom = createVector(angleVectorFrom.x + this.from.curPos.x, angleVectorFrom.y + this.from.curPos.y);
      let cpTo = createVector(angleVectorTo.x + this.to.curPos.x, angleVectorTo.y + this.to.curPos.y);

      push();
      noFill();
      strokeWeight(1.5);
      ///edge 그리기
      if(this.from.videoNumber.includes(1)){ //첫번쨰것일때
         stroke(setColorSN(setNum, this.opacity)); 
      } else {
        stroke(setColorSN(setNum, this.opacity));
      }
      
      bezier(this.from.curPos.x, this.from.curPos.y, cpFrom.x, cpFrom.y, cpTo.x, cpTo.y, this.to.curPos.x, this.to.curPos.y);
      
      //// 화살표 그리기
      
      let edgeSize = this.from.curPos.dist(this.to.curPos);
      let arrowVector = createVector(cos(curveAngle+PI/10*(orderVar)),sin(curveAngle+PI/10*(orderVar))).mult(edgeSize/8+6+(orderVar)*6);

      translate(arcCor.x+ arrowVector.x, arcCor.y + arrowVector.y);
      rotate(midRadian+PI);
          
      line(-4,0,0,4); //arrow
      line(4,0,0,4); //arrow
      
      pop();

  }
}