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

    $(".led-display").html("");

    matrix.forEach(row => {
                $(".led-display").append("<span class='led-point led-on'></span>");
            }
            else {
                $(".led-display").append("<span class='led-point led-off'></span>");
            }
        }
    })
}

    matrix = [];

        var row = [];

            row.push("OFF");
        }

        matrix.push(row);
    }

    letters.forEach(o => {
            var pos = o.pos[i];

            var row = (parseInt(i / 3)) + o.x;
            var col = ((i % 3)) + o.y;

                matrix[row][col] = "ON";
            }
        }

        o.y--;
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



