class EventStack {

    events: GameEvent[] = [];
    static currentOutput: EventStackOutput;

    processAndAdvance(gameDTO: GameDTO) {
        EventStack.currentOutput = new EventStackOutput();
        var topEvent = this.events[this.events.length - 1];
        //Log.send(EventIds[topEvent.getId()] + " " + EventStatus[topEvent.status] + " reactionsPolled? " + topEvent.reactionsPolled);
        if (topEvent.reactionsPolled == false) {
            var reactions = ReactionBuffer.pollReactions(topEvent, gameDTO);
            //Log.send("EventStack: " + JSON.stringify(gameDTO.engine.eventStack));
            //Log.send("Reactions: " + JSON.stringify(reactions));
            if (reactions.length > 0) {
                var newReactionBuffer: ReactionBuffer = new ReactionBuffer(topEvent.uuid, topEvent.status, reactions);
                GameDTOAccess.pushNewReactionBuffer(gameDTO, newReactionBuffer);
                EventStack.currentOutput.reactionsGenerated = true;
            }
            topEvent.reactionsPolled = true;
            GameDTOAccess.updateEvent(gameDTO, topEvent);
        }
        else {
            topEvent.reactionsPolled = false;
            if (topEvent.status == EventStatus.DECLARED) {
                topEvent.status = EventStatus.RESOLVING;
                GameDTOAccess.updateEvent(gameDTO, topEvent);
            }
            else if (topEvent.status == EventStatus.RESOLVING) {
                topEvent.execute(gameDTO);
                topEvent.status = EventStatus.RESOLVED;
                GameDTOAccess.updateEvent(gameDTO, topEvent);
            }
            else if (topEvent.status == EventStatus.RESOLVED) {
                EventStack.currentOutput.isCurrentBufferComplete = true;
                GameDTOAccess.removeEvent(gameDTO, topEvent);
            }

        }
        //Log.send("EventStack after EventStack.advance: " + JSON.stringify(gameDTO.engine.eventStack));
        return EventStack.currentOutput;
    }

}

class EventStackOutput {
    isEmpty: boolean;
    isCurrentBufferComplete: boolean;
    reactionsGenerated: boolean;
}