var matrix = [];
var letters = [];
var numbers = [];

var message = [];

$(function () {
    
    $(".instructions").hide();
    Initialize();
    
    numbers.push("111101101101101101111"); // 0
    numbers.push("110010010010010010111"); // 1
    numbers.push("111001001111100100111"); // 2
    numbers.push("111001001111001001111"); // 3
    numbers.push("101101101111001001001"); // 4
    numbers.push("111100100111001001111"); // 5
    numbers.push("111100100111101101111"); // 6
    numbers.push("111001001001001001001"); // 7
    numbers.push("111101101111101101111"); // 8
    numbers.push("111101101111001001111"); // 9

    setInterval(GenerateMatrix, 200);
});

function setDisplay(mes)
{
    var displayChars = [];

    mes = mes.toString();

    for(i = 0; i < mes.length; i++)
    {
        displayChars.push(numbers[parseInt(mes[i])]);
    }

    AdjustMessage(displayChars);
}

function clearDisplay() {
    message = [];
}

function AdjustMessage(mes) {
    
    message = [];

    for(i = 0; i < mes.length; i++)
    {
        message.push(new Number(32 + (i * 5), mes[i]));
    }
}

function Number(coluna, pos)
{
    this.coluna = coluna;
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
    });
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

    message.forEach((o) => {
        for (i = 0; i < o.pos.length; i++) {
            var pos = o.pos[i];

            var row = (parseInt(i / 3)) + 5;
            var col = ((i % 3)) + o.coluna;

            if (pos === "1") {
                matrix[row][col] = "ON";
            }
        }

        o.coluna--;

        if(o.coluna <= 0) { o.coluna = 32; }
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
        setLED($("#led-ZF"), curState.ZF);
        setLED($("#led-GF"), curState.GF);
        setLED($("#led-OF"), curState.OF);
        setLED($("#led-SF"), curState.SF);
        setLED($("#led-LF"), curState.LF);

        $(".AC").html("AC = " + curState.AC);
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
        led.addClass("led-on");
    }
    else {
        led.addClass("led-off");
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