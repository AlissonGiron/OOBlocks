const InstructionCodes = {
    NOP: 0,

    LDA: 1,
    STR: 2,

    ADD: 3,
    SUB: 4,

    AND: 5,
    OR: 6,
    XOR: 7,
    NOT: 8,

    JMP: 9,
    JE: 10,
    JL: 11,
    JG: 12,
    JLE: 13,
    JGE: 14,

    HLT: 15
};

class Instruction {
    constructor(code, operand) {
        this.code = parseInt(code);
        this.operand = parseInt(operand);

        this.isLogic = code >= InstructionCodes.AND && code <= InstructionCodes.NOT;
        this.isArithmetic = code >= InstructionCodes.ADD && code <= InstructionCodes.SUB;
        this.hasOperand = code >= InstructionCodes.LDA && code <= InstructionCodes.JGE && code != InstructionCodes.NOP;
    }
}