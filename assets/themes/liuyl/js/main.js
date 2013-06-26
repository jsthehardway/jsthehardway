window.onload = function(){
  bindTitle();
}

function titlesClick(elem){
  return function(){
    window.location.href = elem.getAttribute('data-href');
  }
}

function bindTitle(){
  var titles = document.getElementsByClassName("blog-titles"),
      i = 0,
      len;
  for (len = titles.length; i < len; i++){
    titles[i].onclick = titlesClick(titles[i]);
  }
}