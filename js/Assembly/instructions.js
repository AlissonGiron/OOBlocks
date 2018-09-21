const InstructionCodes = {
    NOP = 0,

    LDA = 1,
    STR = 2,

    ADD = 3,
    SUB = 4,
    MPY = 5,
    DIV = 6,
    
    AND = 7,
    OR = 8,
    NOT = 9,
    XOR = 10,

    JMP = 11//,
    // JE = 12,
    // JL = 13,
    // JG = 14,
    // JLE = 15,
    // JGE = 16,
    // HLT = 17
};

class Instruction {
    constructor(code, operand) {
        this.code = code;
        this.operand = operand;
    }
}