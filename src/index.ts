class Promise2{
  state = "pending";
  callbacks = [];

  resolve(result){
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    nextTick(()=>{
      // 遍历 callbacks，调用所有的 handle[0]
      this.callbacks.forEach(handle=>{
        if(typeof handle[0] === "function"){
          handle[0].call(undefined,result);
        }
      })
    })
  }

  reject(reason){
    if (this.state !== "pending") return;
    this.state = "reject";
    nextTick(()=>{
      // 遍历 callbacks，调用所有的 handle[1]
      this.callbacks.forEach(handle=>{
        if(typeof handle[1] === "function"){
          handle[1].call(undefined,reason);
        }
      })
    })
  }

  constructor(fn) {
    if(typeof fn !== "function"){
      throw new Error("我只接受函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  then(succeed?,fail?){
    const handle = [];
    if(typeof succeed === "function"){
      handle[0] = succeed;
    }
    if(typeof fail === "function"){
      handle[1] = fail;
    }
    this.callbacks.push(handle);
    return undefined;
  }
}

function nextTick(fn){
  //node.js支持方式
  if (process !== undefined && typeof process.nextTick === "function") {
    return process.nextTick(fn);
  }else{
    //浏览器支持方式
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));

    observer.observe(textNode,{
      characterData:true
    });

    counter = counter + 1;
    textNode.data = String(counter);
  }
}

export  default Promise2;