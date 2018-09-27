const InstructionCodes = {
    NOP: 0,

    LDA: 1,
    STR: 2,

    ADD: 3,
    
    AND: 4,
    OR: 5,
    XOR: 6,
    NOT: 7,

    JMP: 8,
    JE: 9,
    JL: 10,
    JG: 11,
    JLE: 12,
    JGE: 13,
    
    HLT: 14
};

class Instruction {
    constructor(code, operand) {
        this.code = parseInt(code);
        this.operand = parseInt(operand);

        this.isLogic = code >= 4 && code <= 7;
        this.isArithmetic = code == 3;
        this.hasOperand = code > 0 && code < 14 && code != 7;
    }
}