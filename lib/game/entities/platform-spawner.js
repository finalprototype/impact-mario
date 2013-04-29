ig.module(
	'game.entities.platform-spawner'
)
.requires(
	'impact.entity',
	'game.entities.platform'
)
.defines(function(){

EntityPlatformSpawner = ig.Entity.extend({
	
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 0, 255, 0.7)',
	_wmScalable: true,
        
        direction:'down',
        length:48,
        spawnType:null,
        interval:3,
        timer:null,
        
        checkAgainst: ig.Entity.TYPE.NONE,
        
        update: function() {
            if(!this.timer){
                this.timer = new ig.Timer(this.interval);
                var objSettings = {direction:this.direction,length:this.length}
                ig.game.spawnEntity( EntityPlatform, this.pos.x+this.size.x/2-this.length/2, this.pos.y, objSettings );
            }else{
                var d= this.timer.delta();
                if(d>=0)
                    this.timer = null;
            }
        }
});

});