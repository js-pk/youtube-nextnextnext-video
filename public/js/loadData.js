class DataConstructor {
    constructor(json) {
        this.data = json;
        
        this.title;
        this.edges = [];
        this.nodes = [];
        
        this.nodeIndex = [];
        this.edgeIndex = [];
        
        this.setVolume;
        this.videoVolumes = [];
        
        this.titles = [];
        this.descriptions = [];
        this.categories = [];
        this.links = [];
        
        this.mainColor;
        this.staurationArr = [];
        this.hueArr = [];
        this.brightnessArr = [];
    }
    
    loadData(data) {
          this.setVolume = Object.keys(data).length - 1; //검색어의 개수. -1는 마지막 타이틀
          this.title = data[this.setVolume];
          
          for(let i=0; i <this.setVolume-1; i++) {
            this.titles[i] = []; //2차원 배열을 위해 nested array 생성
            this.links[i] = [];
            this.descriptions[i] = [];
            this.categories[i] = [];
            
            this.nodeIndex[i] = [];
            this.edgeIndex[i] = [];
            
            let searchData;
            searchData = data[i];
            this.videoVolumes[i] = Object.keys(searchData).length;
            
            
            for(let j=0; j<this.videoVolumes[i]; j++) {
              let video = searchData[j];
              
              this.titles[i][j] = video.title;
              this.descriptions[i][j] = video.description;
              this.categories[i][j] = video.category;
              
              this.nodeIndex[i][j] = 0;
              
              //links[i][j] = video.link;
              //let onlyId = /(?=\=).+/;
              let link = /(?=\=).+/.exec(video.link);
              
              this.links[i][j] = link.toString().replace(/\=/,'');
            
            }
          }
          
          
        ///setColor
          colorMode(HSB,100);
          this.mainColor = random(0,100);
          
          //print(setVolume + "setVoulume");
          for(let i=0; i<this.setVolume; i++) {
            
            let stauration = ceil(map(i,0,this.setVolume,70,90));
            let brightness = ceil(map(i,0,this.setVolume,20,20));
            let hue = this.mainColor + i*6;
            
              if(hue > 90) { //hue의 변화간격이 좁아지지 않게.
                hue -= 90;
              }
            this.staurationArr[i] = stauration;
            this.hueArr[i] = hue;
            this.brightnessArr[i] = 100 - brightness;
            
            
            
            this.edgeCount = 0;
            this.nodeCount = 0;
          }
    }
    
  drawTitle() {
      let middlePoint;
      //titlePos = scale;
      
      push();
      textAlign(LEFT,LEFT);
      //middlePoint = ceil(setVolume/2);
      //fill(hueArr[middlePoint],staurationArr[middlePoint],brightnessArr[middlePoint]);
      fill(0,0,90);
      noStroke();
      textSize(scale/10);

      rect()
      //translate(titlePos.x,titlePos.y);
      //rotate(11/6*PI);//각도만큼 텍스트를 돌림
      text( this.title+ "\"의 다음 동영상들", scale/4, scale/4);
      pop();
    }

    
  addEdge(fromNode, toNode, setNum, vidNum) { //to Node 기준으로
      let from = fromNode;
      let to = toNode;
      
      from.increment();
      to.increment();
    
    let e = new Edge(from, to, setNum);
    e.setCount();
    
    this.edges[edgeCount++] = e;
    this.edgeIndex[setNum].push(e);
    
  }

  
  findNode(label, setNum, vidNum) {

    for(let i=0; i < nodeCount; i++) {
      if (this.nodes[i].label == label) { //이미 있는 라벨값이라면
        if(!this.nodes[i].setNumber.includes(setNum)) { //그리고 setNumber가 다르다면

          this.nodes[i].setNumber.push(setNum);
          this.nodes[i].videoNumber.push(vidNum);
          
          this.nodeIndex[setNum][vidNum] = this.nodes[i];
        }
  
        if(this.nodes[i].setNumber == setNum){ //이미있는 라벨값에 setnumber가 같다면
        
          this.nodeIndex[setNum][vidNum] = this.nodes[i];
          return this.nodes[i];
        }
        
        this.nodeIndex[setNum][vidNum] = this.nodes[i];
        return this.nodes[i];
      }

    }

    return this.addNode(label, setNum, vidNum);
  
  }


  addNode(label, setNum, vidNum) {
    let n = new Node(label, setNum, vidNum);
    this.nodeIndex[setNum][vidNum] = n;
    this.nodes[nodeCount++] = n;
    return n;
  }
  
  findNodeSetNumber(node){
  let setNums = [];
  for(let i=0; i< this.nodeIndex.length; i++) {
    if(this.nodeIndex.length[i].includes(node)){
      setNums.push(i);
    }
  }
  return setNums;
}
  
  
  
  
  
  

}




function loadDataConstructor(data) { //새로운 데이터가 로딩될시 데이터 값 새로고침

  edgeCount = 0;
  nodeCount = 0;
  
  let v = new DataConstructor(data);
  visual = v;
  visual.loadData(data);
  setInit();
  
  
  for(let i=0; i < visual.nodeIndex.length; i++) {
    for(let j=0; j < visual.nodeIndex[i].length; j++) {
            visual.findNode(visual.titles[i][j],i,j);
    }
  }
  
  for(let i=0; i < visual.nodeIndex.length; i++) {
    for(let j=0; j < visual.nodeIndex[i].length; j++) {
      if(j>0){
          visual.addEdge(visual.nodeIndex[i][j-1],visual.nodeIndex[i][j],i,j);
      }
    }
  }
}