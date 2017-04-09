

;
(function ($) {


    var passwdValid= function (element, options) {
        this.$element	= $(element);
        this.options	= options;
        var that=this,validAgain=false,
        oText=$("#notice .text"),
        oldPass;
        this.pr=options.pointRadii; //选中的小圆半径
        this.rr=options.roundRadii; //大圆半径
        this.o=options.space;       //大圆间隙
        this.color=options.color;
                                    
        this.$element.css({         //设置样式
            "position":"relation",
            "width":this.options.width,
            "height":this.options.height,
            "background-color":options.backgroundColor,
            "overflow":"hidden",
            "cursor":"default"
        });


        //设置元素ID
        if(! $(element).attr("id"))
            $(element).attr("id",(Math.random()*65535).toString());
        this.id="#"+$(element).attr("id");



        var Point = function (x,y){
            this.x  =x;this.y=y
        };

        this.result="";
        this.pList=[];
        this.sList=[];
        this.tP=new Point(0,0);


        this.$element.append('<canvas class="main-c" width="'+options.width+'" height="'+options.height+'" >');
        
        this.$c= $(this.id+" .main-c")[0];//$("#id .main-c") 选择canvas元素 
        this.$ctx=this.$c.getContext('2d');//绘图对象

        if(localStorage.passwd) localStorage.passwd='';


        this.initDraw=function(){
            this.$ctx.strokeStyle=this.color;
            this.$ctx.fillStyle=this.color;
            this.$ctx.lineWidth=2;
            for(var j=0; j<3;j++ ){
                for(var i =0;i<3;i++){
                    //移动画笔起点 与 定义 绘制图形的 坐标与半径
                    this.$ctx.moveTo(this.o/2+this.rr*2+i*(this.o+2*this.rr),this.o/2+this.rr+j*(this.o+2*this.rr));
                    this.$ctx.arc(this.o/2+this.rr+i*(this.o+2*this.rr),this.o/2+this.rr+j*(this.o+2*this.rr),this.rr,0,2*Math.PI);
                    //圆心坐标
                    var tem=new Point(this.o/2+this.rr+i*(this.o+2*this.rr),this.o/2+this.rr+j*(this.o+2*this.rr));

                    if (that.pList.length < 9)
                        this.pList.push(tem);
                }
            }
            that.$ctx.lineWidth=2;
            this.$ctx.fill();
            this.$ctx.stroke();

            //拷贝图像数据
            this.initImg=this.$ctx.getImageData(0,0,this.options.width,this.options.height);
        };

        this.initDraw();

        this.isIn=function(x,y){

            for (var p in that.pList){

                //判断此时鼠标滑动的点 是否在圆内
               if(( Math.pow((x-that.pList[p]["x"]),2)+Math.pow((y-that.pList[p]["y"]),2) ) < Math.pow(this.rr,2)){
                    return that.pList[p];
                }
            }
            return 0;
        };

        //画中心圆
        this.pointDraw =function(c){
            if (arguments.length>0){
                that.$ctx.strokeStyle=c;
                that.$ctx.fillStyle=c;
            }
            for (var p in that.sList){
                that.$ctx.moveTo(that.sList[p]["x"]+that.pr,that.sList[p]["y"]);
                that.$ctx.arc(that.sList[p]["x"],that.sList[p]["y"],that.rr,0,2*Math.PI);
                that.$ctx.fill();
            }
        };

        //画 两个圆之间的连线、、并 定位 画图的初始位置为 新圆的圆心
        this.lineDraw=function (c){
            if (arguments.length>0){
                that.$ctx.strokeStyle=c;
                that.$ctx.fillStyle=c;
            }
            if(that.sList.length > 0){
                for( var p in that.sList){
                    if(p == 0){
                        console.log(that.sList[p]["x"],that.sList[p]["y"]);
                        that.$ctx.moveTo(that.sList[p]["x"],that.sList[p]["y"]);
                        continue;
                    }
                    that.$ctx.lineTo(that.sList[p]["x"],that.sList[p]["y"]);
                    console.log(that.sList[p]["x"],that.sList[p]["y"]);
                }

            }
        };

        this.allDraw =function(c){
            if (arguments.length>0){
                this.pointDraw(c);
                this.lineDraw(c);
                that.$ctx.stroke();
            }
            else {
                this.pointDraw();
                this.lineDraw();
            }

        };

        //每一次绘制时、、清除绘图数据、、只剩下 9个圆,这样 在前面不设置
        //moveTo的时候 或者 lineTo的时候 只有 一个lineTo是没用的
        //有圆选中时、、才会绘制线
        //看起来的跟随效果 实际上是不停地刷新画布,每一次touchmove 都去刷新一次lineTo
        this.draw=function(x,y){
            that.$ctx.clearRect(0,0,that.options.width,that.options.height);
            that.$ctx.beginPath();
            //that.initDraw();
            that.$ctx.putImageData(this.initImg,0,0);
            that.$ctx.lineWidth=4;
            that.pointDraw(that.options.lineColor);
            that.lineDraw(that.options.lineColor);
            that.$ctx.lineTo(x,y);
            that.$ctx.stroke();
        };


        //有几个圆已经选中
        //使用 for in 同时 返回的 序号要 比索引 +1
        this.pointInList=function(poi,list){
            for (var p in list){
                if( poi["x"] == list[p]["x"] && poi["y"] == list[p]["y"]){
                    return ++p;
                }
            }
            return false;
        };

        this.touched=false;
        $(this.id).on ("mousedown touchstart",{that:that},function(e){
            e.data.that.touched=true;
        });
        $(this.id).on ("mouseup touchend",{that:that},function(e){
            e.data.that.result=[];
            e.data.that.touched=false;
            that.$ctx.clearRect(0,0,that.options.width,that.options.height);
            that.$ctx.beginPath();
            that.$ctx.putImageData(e.data.that.initImg,0,0);
            that.allDraw(that.options.lineColor);
         
            //that.sList选中圆的坐标、、pointInList得到的结果就是 圆的序号
           
            for(var p in that.sList){
                if(e.data.that.pointInList(that.sList[p], e.data.that.pList)){
                    e.data.that.result.push(e.data.that.pointInList(that.sList[p], e.data.that.pList));
                }
            }

            //将结果设置到缓存中
            var operate=$("#operate input:checked").attr('operate'),
                result=e.data.that.result;
            if(operate=='set')
            {
                if(validAgain==false)
                {
                    if(result.length<5)
                    {
                        oText.text("密码太短,至少需要5个点");
                        setTimeout(function()
                            {
                                oText.text("请输入手势密码");
                            },800);
                        //localStorage.passwd='';
                        that.clear();
                        validAgain=false;
                    }else{
                        oldPass=result.join('');
                        validAgain=true;
                        oText.text("请再次输入手势密码");
                    }
                    that.clear();
                }else{
                    if(result.join('')==oldPass)
                    {
                        localStorage.passwd=oldPass;
                        oldPass='';
                        oText.text("密码设置成功");
                        that.clear();
                        validAgain=false;
                    }else{
                        oText.text("两次输入的不一致,请重新输入");
                        setTimeout(function()
                            {
                                oText.text("请输入手势密码");
                            },800);
                        //localStorage.passwd='';
                        that.clear();
                        validAgain=false;
                    }
                }
                //判断是否符合条件、
            }else if(operate=='valid')
            {
                var passwd=localStorage.passwd || '';
                if(!passwd)
                {
                    oText.text("您还没有设置过密码");
                    that.clear();
                }else{
                    if(result.join('')==passwd)
                    {
                      oText.text("密码输入正确");  
                      that.clear();
                    }else{
                      oText.text("密码输入错误"); 
                      that.clear();
                    }
                }
            }
        });

        var setLabel=$("#operate label").eq(0);

        setLabel.click(function()
        {
             var passwd=localStorage.passwd || '';
             if(passwd)
            {
                oText.text("您设置过密码，如需重置请继续");
                validAgain=false;
            }else{
                oText.text("请输入手势密码");
                //localStorage.passwd='';
                validAgain=false;
            }
        })

        var validLabel=$("#operate label").eq(1);

        validLabel.click(function()
        {
             var passwd=localStorage.passwd || '';
             if(!passwd)
              {
                oText.text("您还没有设置过密码");
                that.clear();
              }
              else {
                oText.text("请输入您设置的密码");
              }
        })


        $(this.id).on('touchmove mousemove',{that:that}, function(e) {
            
            if(e.data.that.touched){
                //pageX与pageY是获取
                var x= e.pageX || e.originalEvent.targetTouches[0].pageX ;
                var y = e.pageY || e.originalEvent.targetTouches[0].pageY;
                x=x-that.$element.offset().left;
                y=y-that.$element.offset().top;
               
                var p = e.data.that.isIn(x, y);
                //console.log(x)
                if(p != 0 ){
                //确定已选择的圆、、
                //这里用一个对象 来存储坐标对的、、
                    if ( !e.data.that.pointInList(p,e.data.that.sList)){
                        e.data.that.sList.push(p);
                    }
                }
                e.data.that.draw(x, y);
            }

        });

        this.clear=function()
            {
                that.$ctx.clearRect(0,0,that.options.width,that.options.height);
                that.$ctx.beginPath();
                that.$ctx.putImageData(that.initImg,0,0);
                that.result="";
                that.sList=[];
            }
    };


    passwdValid.DEFAULTS = {
        zindex :100,
        roundRadii:25,
        pointRadii:6,
        space:30,
        width:240,
        height:240,
        lineColor:"#00aec7",
        backgroundColor:"#252736",
        color:"#FFFFFF"
    };


    function jQplugin(option,arg) {
        return this.each(function () {
            var $this   = $(this);
            var options = $.extend({}, passwdValid.DEFAULTS, typeof option == 'object' && option);
            var data    = $this.data('passwdValid');
            var action  = typeof option == 'string' ? option : NaN;
            if (!data) $this.data('danmu', (data = new passwdValid(this, options)));
            if (action)	data[action](arg);
        })
    }


    $.fn.passwdValid             = jQplugin;
    $.fn.passwdValid.Constructor = passwdValid;



})(jQuery);
