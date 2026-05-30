// 1. Define the custom visual effect
const placementGlow = new Effect(45, e => {
    // Blend from orange to red as the effect progresses
    Draw.color(Color.orange, Color.red, e.fin());
    
    // Draw a shrinking solid circle
    Fill.circle(e.x, e.y, e.fout() * 10);
    
    // Draw an expanding outer ring
    Lines.stroke(e.fout() * 2);
    Lines.circle(e.x, e.y, e.fin() * 30);
});

const slagEncloser = extend(Wall, "slag-encloser", {});

slagEncloser.update = true;

slagEncloser.buildType = () => extend(Building, {
    
    updateTile(){
        if(!this.hasChecked){
            // 2. Trigger the visual effect at the block's coordinates
            placementGlow.at(this.x, this.y);
            
            this.checkEnclosure();
            this.hasChecked = true;
        }
    },

    checkEnclosure(){
        for(let i = 0; i < 4; i++){
            let nextTile = this.tile.nearby(i);
            
            if(nextTile != null && nextTile.block() != slagEncloser && nextTile.floor() != Blocks.slag){
                this.attemptFill(nextTile);
            }
        }
    },

    attemptFill(startTile){
        let queue = [startTile];
        let visited = {}; 
        
        visited[startTile.pos()] = true; 
        
        let toFill = [];
        let isEnclosed = true;
        let maxArea = 500; 

        while(queue.length > 0){
            let current = queue.shift();
            toFill.push(current);

            if(toFill.length > maxArea){
                isEnclosed = false;
                break;
            }

            for(let i = 0; i < 4; i++){
                let neighbor = current.nearby(i);
                
                if(neighbor == null){
                    isEnclosed = false;
                    break;
                }

                if(!visited[neighbor.pos()]){
                    if(neighbor.block() != slagEncloser){
                        visited[neighbor.pos()] = true;
                        queue.push(neighbor);
                    }
                }
            }
            
            if(!isEnclosed) break;
        }

        if(isEnclosed){
            for(let i = 0; i < toFill.length; i++){
                let t = toFill[i];
                if(t.floor() != Blocks.slag){
                    Call.setFloor(t, Blocks.slag.asFloor(), t.overlay());
                }
            }
        }
    }
});