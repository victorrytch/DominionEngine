class ReactionStack {
    buffers: ReactionBuffer[];
    static currentOutput: ReactionStackOutput;

    processAndAdvance(gameDTO: GameDTO): ReactionStackOutput {
        ReactionStack.currentOutput = new ReactionStackOutput();
        var topBuffer = this.buffers[this.buffers.length - 1];
        var isComplete = topBuffer.processAndAdvance(gameDTO);
        if (isComplete) {
            GameDTOAccess.removeTopReactionBuffer(gameDTO);
            ReactionStack.currentOutput.currentBufferFinished = true;
        }
        if (this.buffers.length <= 0) {
            ReactionStack.currentOutput.isEmpty = true;
        }
        return ReactionStack.currentOutput;
        
    }

}

class ReactionStackOutput {
    isEmpty: boolean;
    createdLogicalOutput: boolean;
    currentBufferFinished: boolean;
}