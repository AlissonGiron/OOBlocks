class ProgramState {
    constructor() {
        this.AC = 0;
        this.PC = 0;
        this.RAM = [];
    }
}

class AssemblyInterpreter {
    
    constructor() {
        this.state = new ProgramState();
    }

    interpret(instructions, stepByStepCallback){
        
        while (instructions[this.state.PC].code !== InstructionCodes.HLT) {
            execInstruction(this.state, instructions[this.state.PC]);
            stepByStepCallback();
        }
    }
}

function execInstruction(state, instruction) {
    switch (instruction.code) {
        case InstructionCodes.NOP:
        case InstructionCodes.HLT:
            return;

        case InstructionCodes.LDA: state.AC = state.RAM[instruction.operand]; break;
        case InstructionCodes.STR: state.RAM[instruction.operand] = state.AC; break;

        case InstructionCodes.ADD: state.AC += state.RAM[instruction.operand]; break;
        case InstructionCodes.SUB: state.AC -= state.RAM[instruction.operand]; break;
        case InstructionCodes.MPY: state.AC *= state.RAM[instruction.operand]; break;
        case InstructionCodes.DIV: state.AC /= state.RAM[instruction.operand]; break;

        case InstructionCodes.AND: state.AC &= state.RAM[instruction.operand]; break;
        case InstructionCodes.OR: state.AC |= state.RAM[instruction.operand]; break;
        case InstructionCodes.NOT: state.AC = !state.AC; break;
        case InstructionCodes.XOR: state.AC ^= state.RAM[instruction.operand]; break;

        case InstructionCodes.JMP: state.PC = instruction.operand; break;
    }
}
