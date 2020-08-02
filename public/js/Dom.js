


function refreshVid() {
  if(selection != null) {
    player.loadVideoById({videoId:str(selection.linkURL)});
    player.mute()

    document.getElementById("label").innerHTML = selection.label;
    document.getElementById("description").innerHTML = selection.description;
    document.getElementById("category").innerHTML = selection.category;
    
  }
}

function doDisplay(){
  let v = document.getElementById("video");
  let h = document.getElementById("video-holder");
  let i = document.getElementById("info-holder");
  if(h.style.display = 'none') {
     v.style.display = 'block'; 
     h.style.display = 'block';
     i.style.display = 'block';
  }


}

function offDisplay() {
  let v = document.getElementById("video");
  let h = document.getElementById("video-holder");
  let i = document.getElementById("info-holder");


    if(h.style.display = 'block') {
      v.style.display = 'none';
      h.style.display = 'none'; 
      i.style.display = 'none';
    }
    

}


