class ProgramState {
    constructor() {
        this.AC = 0;
        this.PC = 0;

        this.ZF = false;
        this.SF = false;
        this.OF = false;
        this.GF = false;
        this.LF = false;

        this.RAM = [];
    }
}

class AssemblyInterpreter {

    constructor(instructions) {
        this.state = new ProgramState();
        this.instructions = instructions;
    }
    
    executeNext() {
        if (this.state.PC >= this.instructions.length || this.instructions[this.state.PC].code == InstructionCodes.HLT) {
            return false;
        }

        execInstruction(this.state, this.instructions[this.state.PC]);
        this.state.PC++;

        return true;
    }
}

function execInstruction(state, instruction) {
    var oldAC = state.AC;

    switch (instruction.code) {
        case InstructionCodes.NOP:
        case InstructionCodes.HLT:
            break;

        case InstructionCodes.LDA:
            state.AC = state.RAM[instruction.operand];
            break;
        case InstructionCodes.STR:
            state.RAM[instruction.operand] = state.AC;
            break;

        case InstructionCodes.ADD:
            state.AC += state.RAM[instruction.operand];
            break;
        case InstructionCodes.SUB:
            state.AC -= state.RAM[instruction.operand];
            break;

        case InstructionCodes.AND:
            state.AC &= state.RAM[instruction.operand];
            break;
        case InstructionCodes.OR:
            state.AC |= state.RAM[instruction.operand];
            break;
        case InstructionCodes.NOT:
            state.AC = ~state.AC;
            break;
        case InstructionCodes.XOR:
            state.AC ^= state.RAM[instruction.operand];
            break;

        case InstructionCodes.JMP:
            state.PC = instruction.operand;
            break;
    }

    let curRAM = state.RAM[instruction.operand];
    if (instruction.code == InstructionCodes.SUB) {
        curRAM = -1 * curRAM;
    }

    if (instruction.isLogic || instruction.isArithmetic) {
        state.ZF = state.AC === 0;
        state.SF = state.AC < 0; // Também funciona: (state.AC >> 31) & 1 == 1 
        state.OF = (oldAC >= 0 && curRAM >= 0 && state.AC < 0) || (oldAC < 0 && curRAM < 0 && state.AC >= 0);
        state.GF = state.SF === state.OF && !state.ZF;
        state.LF = state.SF !== state.OF;
    }

    var jump = false;
    // Jumps condicionais
    switch (instruction.code) {
        case InstructionCodes.JE:
            jump = state.ZF;
            break;
        case InstructionCodes.JL:
            jump = state.LF;
            break;
        case InstructionCodes.JG:
            jump = state.GF;
            break;
        case InstructionCodes.JLE:
            jump = state.ZF || state.LF;
            break;
        case InstructionCodes.JGE:
            jump = state.ZF || state.GF;
            break;
    }

    if (jump) state.PC = instruction.operand;
}