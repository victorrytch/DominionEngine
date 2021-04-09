enum LogicalVariableType {
    VALUE,
    REFERENCE
}

abstract class LogicalVariable {
    type: LogicalVariableType;
    value: any;

    constructor(value: any) {
        this.value = value;
    }

    convertToDTO() {
        var dto = new GameDTO_LogicalBufferVariable();
        dto.type = this.type;
        dto.value = this.value;
        return dto;
    }

    static generateFromDTO(dto: GameDTO_LogicalBufferVariable) {
        if (dto.type == LogicalVariableType.VALUE) {
            return new LogicalValue(dto.value);
        }
        else if (dto.type == LogicalVariableType.REFERENCE) {
            return new LogicalReference(dto.value);
        }
    }
}

class LogicalValue extends LogicalVariable {
    type: LogicalVariableType = LogicalVariableType.VALUE;
}

class LogicalReference extends LogicalVariable {
    type: LogicalVariableType = LogicalVariableType.REFERENCE;
}
