const slagCreator = extend(Block, "slag-creator", {
    load(){
        this.super$load();
        this.topRegion = Core.atlas.find("unliquified-slag-creator-top");
    },

    // This handles the "ghost" blueprint visual while you are choosing where to place the block
    drawPlanRegion(plan, list){
        // 1. Draw the base block (static, no rotation)
        Draw.rect(this.region, plan.drawx(), plan.drawy());
        
        // 2. Draw the top layer and rotate it based on the plan's rotation
        if(this.topRegion.found()){
            Draw.rect(this.topRegion, plan.drawx(), plan.drawy(), plan.rotation * 90);
        }
    }
});

slagCreator.update = true;
slagCreator.rotate = true;
slagCreator.solid = true;

slagCreator.buildType = () => extend(Building, {
    draw(){
        // 1. Draw the base block sprite (slag-creator.png) normally
        this.super$draw();

        // 2. Overlay the rotating molten slag top layer
        if(slagCreator.topRegion.found()){
            // Using this.rotation * 90 ensures the JS math works perfectly every time
            Draw.rect(slagCreator.topRegion, this.x, this.y, this.rotation * 90);
        }
    },

    updateTile(){
        // 1. Get the tile directly in front based on the block's current rotation
        let targetTile = this.tile.nearby(this.rotation);

        // 2. Ensure the tile is valid and isn't already vanilla slag
        if(targetTile != null && targetTile.floor() != Blocks.slag){
            
            // 3. Set the floor to the base game's slag tile.
            // Blocks.slag references the vanilla environment block.
            // targetTile.overlay() ensures you don't delete ores like copper.
            Call.setFloor(targetTile, Blocks.slag.asFloor(), targetTile.overlay());
        }
    }
});