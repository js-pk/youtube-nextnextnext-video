
function addEdge(fromLabel, toLabel, setNum, vidNum) { //to Node 기준으로
  let from = findNode(fromLabel, setNum, vidNum -1);
  let to = findNode(toLabel, setNum, vidNum);
  

  from.increment();
  to.increment();
  
  
  for(let i=0; i < edgeCount; i++) { //edge 전체의 카운트
    //print(i);
    if(edges[i].from.label == from.label && edges[i].to.label == to.label) { //이미 있는 edge라면
      edges[i].increment();

      let e = new Edge(from, to);
      edges[edgeCount++] = e;
      
      return; //여기서 종료
    }
    
    if(edges[i].to.label == from.label || edges[i].from.label == to.label) { //역방향????
      edges[i].increment();

      let e = new Edge(from, to);
      edges[edgeCount++] = e;

      return;
    }
  }
  
  let e = new Edge(from, to);
  e.increment();
  
  edges[edgeCount++] = e;
  
}


function findNode(label, setNum, vidNum) {
  for(let i=0; i < nodeCount; i++) {

    if (visual.nodes[i].label == label) { //이미 있는 라벨값이라면
      if(!visual.nodes[i].setNumber.includes(setNum)) { //그리고 setNumber가 다르다면
        visual.nodes[i].setNumber.push(setNum);
        visual.nodes[i].videoNumber.push(vidNum);        
      }

      
      if(visual.nodes[i].setNumber == setNum){ //이미있는 라벨값에 setnumber가 같다면
        return nodes[i];
      }
      return nodes[i];
    }
  }
  return addNode(label, setNum, vidNum);

}

function addNode(label, setNum, vidNum) {
  let n = new Node(label, setNum, vidNum);

  visual.nodes[nodeCount++] = n;
  return n;
}
