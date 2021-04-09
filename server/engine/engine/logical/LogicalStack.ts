class LogicalStack {
    buffers: LogicalBuffer[] = [];
    static currentOutput: LogicalStackOutput;

    processAndAdvance(gameDTO: GameDTO): LogicalStackOutput {
        LogicalStack.currentOutput = new LogicalStackOutput();
        var topBuffer = this.buffers[this.buffers.length - 1];
        var isComplete = topBuffer.processAndAdvance(gameDTO);
        if (isComplete) {
            LogicalStack.currentOutput.isCurrentBufferComplete = true;
            GameDTOAccess.removeLogicalBuffer(gameDTO, topBuffer);
        }
        if (this.buffers.length == 0) {
            LogicalStack.currentOutput.isEmpty = true;
            LogicalStack.currentOutput.isCurrentBufferComplete = true;
        }

        return LogicalStack.currentOutput;
    }

}

class LogicalStackOutput {
    isEmpty: boolean;
    isCurrentBufferComplete: boolean;
    eventsGenerated: boolean;
    isPlayerWaiting: boolean;
}