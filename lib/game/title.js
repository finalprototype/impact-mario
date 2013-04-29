BiolabTitle=ig.Class.extend({

    introTimer:null,
    noise:null,
    sound:new ig.Sound('media/anamanaguchi.ogg',false),
    logo:new ig.Image('media/tmp-logo.png'),
    font:new ig.Font('media/04b03.font.png'),
    
    init:function(){
        if(!BiolabTitle.initialized){
            ig.input.bind(ig.KEY.ENTER,'enter');
            ig.input.bind(ig.KEY.SPACE,'space');
            BiolabTitle.initialized=true;
        }
        this.introTimer=new ig.Timer(1);
    },
    
    run:function(){
        if(ig.input.pressed('shoot')||ig.input.pressed('jump')){
            ig.system.setGame(BiolabGame);
            return;
        }
        var d=this.introTimer.delta();
        if(!this.soundPlayed&&d>-0.3){
            this.soundPlayed=true;this.sound.play();
        }
        if(ig.ua.mobile){
            ig.system.clear('#0d0c0b');
            this.biolab.draw((d*d*-d).limit(0,1).map(1,0,-160,12),6);
            this.disaster.draw((d*d*-d).limit(0,1).map(1,0,300,12),46);
            this.player.draw((d*d*-d).limit(0,1).map(0.5,0,240,70),56);
            if(d>0&&(d%1<0.5||d>2)){
            this.font.draw('Press Button to Play',80,140,ig.Font.ALIGN.CENTER);
            }
        }else{
            ig.system.clear('#0d0c0b');
            this.biolab.draw((d*d*-d).limit(0,1).map(1,0,-160,44),26);
            this.disaster.draw((d*d*-d).limit(0,1).map(1,0,300,44),70);
            this.player.draw((d*d*-d).limit(0,1).map(0.5,0,240,166),56);
            if(d>0&&(d%1<0.5||d>2)){
                this.font.draw('Press X or C to Play',120,140,ig.Font.ALIGN.CENTER);
            }
        }
    }
});