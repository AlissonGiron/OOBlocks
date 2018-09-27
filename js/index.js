var matrix = [];
var letters = [];

$(function() {
    letters.push(new Letter(5, 10, "010101101111101101"));
    letters.push(new Letter(5, 15, "100100100100100111"));
    letters.push(new Letter(5, 19, "010010010010010010"));
    letters.push(new Letter(5, 24, "111100111001001111"));
    letters.push(new Letter(5, 29, "111100111001001111"));
    letters.push(new Letter(5, 34, "111101101101101111"));
    letters.push(new Letter(5, 39, "101111111101101101"));

    //GenerateMatrix();

$(function () {
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
            }
            else {
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

function AddRamValue(pos, value)
{
    function getHtml(p, v)
    {
        return  "<tr>" +
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
    btnDelete.on('click', function(e) {
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

    interpreter.state.RAM[0] = 356;
    interpreter.state.RAM[1] = 1;

    $('#code > .instruction-block').each((i, v) => {
        let code = $(v).attr('instruction-code');
        let operator = $(v).find('input').val();

        instructions.push(new Instruction(code, operator));
    });

    interpreter.interpret(instructions, (curState) => {
        // chamado na execução de cada instrução
    });
}

