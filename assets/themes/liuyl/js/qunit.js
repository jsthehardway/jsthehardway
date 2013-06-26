(function(root){
  var logger = document.getElementById("logger");

  root.Test = function(name, testFunc, userFunc){
    this.name = name;
    this.testFunc = testFunc;
    this.userFunc = userFunc;

    return this;
  }

  Test.prototype = {
    constructor: Test,

    run: function(){
      var node = document.getElementById("logger"),
          childNode = node.childNodes,
          i = 0,
          len = childNode.length;
      this.succ = 0;
      this.fail = 0;

      for (; i != len; i++){
        node.removeChild(childNode[0]);
      }

      var stime = new Date();
      //handle exception throwed by userFunc
      try{
        this.testFunc.call(this, this.userFunc);
      }catch(e){
        var li = document.createElement("li");
        li.className = "error";
        li.innerText = "Runtime Error: " + e.toString();
        if (e.description){
          li.innerText += "\nError description: " + e.description; 
        }
        node.appendChild(li);
      }

      var etime = new Date();
      var li = document.createElement("li");
      li.textContent = "Test finished in " + (etime.getTime() - stime.getTime()) + " ms";
      node.appendChild(li);
    },

  }

  appendLi = function(res, message){
    if (typeof message === "undefined"){
      return ;
    }

    var li = document.createElement("li");
    li.className = "res " + (res ? "success" : "error");
    li.innerText = message;
    logger.appendChild(li);
  }

  equal = function(var1, var2, message){
    var res = var1 === var2,
        li;
    if (!res){
      message = message + '    \nexcept ' + String(var1) + '    \n received ' + String(var2);
    }
    appendLi(res, message);
    return res;
  }

  deepEqual = function(var1, var2, message){
    var res,
        deepEqual = function(var1, var2, message){
          var i;
          if (typeof var1 !== 'object')
            return var1 === var2;

          for (i in var1){
            //skip build in properties
            if (!var1.hasOwnProperty(i) && !var2.hasOwnProperty(i)){
              continue;
            }
            if (!(var1.hasOwnProperty(i) && var2.hasOwnProperty(i) && deepEqual(var1[i], var2[i]))){
              return false;
            }
          }
          return true;
        };
    res = deepEqual(var1, var2, message);
    if (!res){
      message = message + '    \nexcept ' + String(var1) + '    \n received ' + String(var2);
    }
    appendLi(res, message);
    return res;
  }


})( (function(){ return this; }.call()) );