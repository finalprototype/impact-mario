ig.module(
	'game.entities.block-unbreakable'
)
.requires(
        'plugins.tween',
	'game.entities.block'
)
.defines(function(){

EntityBlockUnbreakable = EntityBlock.extend({   
        
    init: function(x,y,settings){
		this.parent(x,y,settings);
		this.currentAnim = this.anims.unbreakable;
    },

    update: function() {
        this.parent();
    },
	
	collideWith: function(entity,axis){
		this.parent(entity,axis);
		if(!this.active && axis=='y')
		{
			if(entity.pos.y>this.pos.y)
			{
				entity.bumpSound.play();
			}
		}
    },
});

});