class LogicalUtils {

    Value(value: any): LogicalValue {
        return new LogicalValue(value);
    }

    Reference(value: any): LogicalReference {
        return new LogicalReference(value);
    }

    Exactly(value: LogicalVariable): PlayerChoicePreposition{
        return new PlayerChoicePreposition(PlayerChoicePrepositionValues.EXACTLY, value);
    }

    UpTo(value: LogicalVariable): PlayerChoicePreposition{
        return new PlayerChoicePreposition(PlayerChoicePrepositionValues.UP_TO, value);
    }

    CreateEvent(eventId: EventIds, eventGeneratorArgs: EventArgs): GameEvent {
        return GameEvent.create(eventId, eventGeneratorArgs.data);
    }

    ResolveVariable(variable: LogicalVariable, logicalBuffer: LogicalBuffer): any {
        if (variable.type == LogicalVariableType.VALUE) {
            return variable.value;
        }
        else if (variable.type == LogicalVariableType.REFERENCE) {
            //Log.send(variable.value + " = " + logicalBuffer.storedData[variable.value]);
            return logicalBuffer.storedData[variable.value];
        }
    }

    SerializeString2DTOMap(valueMap: any) {
        var result = {};
        for (var key in valueMap) {
            if (valueMap.hasOwnProperty(key)) {
                result[key] = [];
                valueMap[key].forEach((value, index) => { 
                    result[key].push(value.convertToDTO());
                })

            }
        }

        return result;
    }


    SerializeDTOArray(dtoArray: any) {
        var result = [];

        dtoArray.forEach((value: any) => {
            result.push(value.convertToDTO());
        })

        return result;
    }

}