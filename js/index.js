var matrix = [];
var letters = [];

$(function () {

    $(".instructions").hide();
    Initialize();

    letters.push(new Letter(5, 10, "111101111101101111"));
    letters.push(new Letter(5, 15, "111100110100100111"));
    letters.push(new Letter(5, 20, "100100100100100111"));
    letters.push(new Letter(5, 25, "111100100100100111"));
    letters.push(new Letter(5, 30, "101101111101101101"));
    letters.push(new Letter(5, 35, "111010010010010111"));
    letters.push(new Letter(5, 40, "111101101101101111"));
    letters.push(new Letter(5, 45, "111101101111110101"));

    setInterval(GenerateMatrix, 200);
});

function Letter(x, y, pos) {
    this.x = x;
    this.y = y;
    this.pos = pos;
}

function DrawMatrix() {
    $(".led-display").html("");

    matrix.forEach(row => {
        for (j = 0; j < 32; j++) {
            if (row[j] == "ON") {
                $(".led-display").append("<span class='led-point led-on'></span>");
            } else {
                $(".led-display").append("<span class='led-point led-off'></span>");
            }
        }
    })
}

function GenerateMatrix() {
    matrix = [];

    for (i = 0; i < 16; i++) {
        var row = [];

        for (j = 0; j < 32; j++) {
            row.push("OFF");
        }

        matrix.push(row);
    }

    letters.forEach(o => {
        for (i = 0; i < o.pos.length; i++) {
            var pos = o.pos[i];

            var row = (parseInt(i / 3)) + o.x;
            var col = ((i % 3)) + o.y;

            if (pos === "1") {
                matrix[row][col] = "ON";
            }
        }

        o.y--;

        if (o.y == -3) o.y = 40;
    });

    DrawMatrix();
}

function AddRamValue(pos, value) {
    function getHtml(p, v) {
        return "<tr>" +
            "<td>" + p + "</td>" +
            "<td>" + v + "</td>" +
            "</tr>";
    }

    var ram = $("#ram-table");

    ram.append(getHtml(pos, value));
}


function Initialize() {
    FillInstructions();

    $('#instructionPicker').sortable({
        connectWith: '.code-drag',
        //forcePlaceholderSize: false,
        revert: true,
        helper: function (e, li) {
            copyHelper = li.clone().insertAfter(li);
            return li.clone();
        },
        stop: function () {
            copyHelper && copyHelper.remove();
        },
    });

    $('#code').sortable({
        revert: true,
        receive: function (e, ui) {
            MakeEditable(ui.item);
            copyHelper = null;
        }
    });
}

function FillInstructions() {
    let divPicker = $('#instructionPicker');

    for (let instruction in InstructionCodes) {
        let template = $($('#instructionSrc').html());

        template.attr('instruction-code', InstructionCodes[instruction]);
        template.find('.instruction-desc').text(instruction);

        divPicker.append(template);
    }
}

function MakeEditable(block) {
    let btnDelete = $($('#btnDelete').html());
    btnDelete.on('click', function (e) {
        $(e.target).closest('.instruction-block').remove();
    })

    block.prepend(btnDelete);

    if (new Instruction(block.attr('instruction-code')).hasOperand) {
        block.append($('#inputInstructionValue').html());
    }
}

function Execute() {
    let instructions = [];
    let interpreter = new AssemblyInterpreter();

    let errors = [];

    function addError(line, instructionCode, error) {
        errors.push("Linha " + (line + 1) + " [" + Object.keys(InstructionCodes).find(key => InstructionCodes[key] == parseInt(instructionCode)) + "]: " + error);
    }

    $('#code > .instruction-block').each((i, v) => {
        let code = $(v).attr('instruction-code');
        let operand = $(v).find('input').val();
        let instr = new Instruction(code, operand);

        if (instr.hasOperand && isNaN(parseInt(operand))) {
            addError(i, code, "Operando da instrução não pode ser vazio");
        }

        instructions.push(new Instruction(code, operand));
    });

    $("#ram-table tr").each(function(index, row) {
        if(index == 0) return;

        var rowValue = $(row).children();

        interpreter.state.RAM[parseInt(rowValue[0].innerText)] = parseInt(rowValue[1].innerText);
    });
    

    if (instructions.length > 0) {
        let lastInstruction = instructions[instructions.length - 1];
        if (lastInstruction.code != InstructionCodes.HLT) {
            addError(instructions.length - 1, lastInstruction.code, "A última instrução do programa deve ser um HLT");
        }
    }

    if (errors.length > 0) {
        console.log(errors);
        return errors;
    }

    interpreter.interpret(instructions, (curState) => {
        // chamado na execução de cada instrução

    });
}

function AddToRam() {
    var pos = $("#ram-pos").val();
    var value = $("#ram-value").val();

    if(!pos || !value) return;

    AddRamValue(pos, value);
}

function setLED(led, value)
{
    led.removeClass("led-on");
    led.removeClass("led-off");

    if(value) 
    {
        led.addClass();
    }
}


function OpenInstructions() {
    $(".open-instructions").hide();

    $(".instructions").addClass("open");
    $(".instructions").show();
}

function CloseInstructions() {
    $(".open-instructions").show();

    $(".instructions").removeClass("open");
    $(".instructions").hide();
}