ig.module(
	'game.entities.trigger-end'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTriggerEnd = ig.Entity.extend({
	
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 255, 0, 0.7)',
	_wmScalable: true,
        
    checkAgainst: ig.Entity.TYPE.BOTH,
        
    update: function() {},
	check: function(other){
		if(other instanceof EntityPlayer)
		{
			ig.game.levelComplete();
		}
	}
});

});