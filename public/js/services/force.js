

function Check() {
    {
        var senha = document.getElementById("password").value;
        var confirmacao = document.getElementById("passwordconf").value;
        var forca = document.getElementById("meter");

        var strength = 0;

        if (senha.match(/[a-z]+/)) {
            strength += 1;
        }
        if (senha.length > 6) {
            $("#min6").css('background-color', '#bfffb9');
        } else {
            $("#min6").css('background-color', 'white');
        }
        if (senha.length < 16) {
            $("#max15").css('background-color', '#bfffb9');
        } else {
            $("#max15").css('background-color', 'white');
        }
        if (senha.match(/[A-Z]+/)) {
            strength += 1;
            $("#mai1").css('background-color', '#bfffb9');
        } else {
            $("#mai1").css('background-color', 'white');
        }
        if (senha.match(/[0-9]+/)) {
            strength += 1;
            $("#num1").css('background-color', '#bfffb9');
        } else {
            $("#num1").css('background-color', 'white');
        }
        if (senha.match(/[$@#&!]+/)) {
            strength += 1;
            $("#esp1").css('background-color', '#bfffb9');
        } else {
            $("#esp1").css('background-color', 'white');
        }
        if (senha === confirmacao) {
            $("#conf1").css('background-color', '#bfffb9');
        } else {
            $("#conf1").css('background-color', 'white');
        }

        switch (strength) {
            case 0:
                var progress = '<h8>Seguridad de la Contraseña</8><div class="progress"><div id="progress" class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" style="width: 1%" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100"></div></div>';
                forca.innerHTML = progress;
                break;

            case 1:
                var progress = '<h8>Seguridad de la Contraseña</8><div class="progress"><div id="progress" class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div>';
                forca.innerHTML = progress;
                break;

            case 2:
                var progress = '<h8>Seguridad de la Contraseña</8><div class="progress"><div id="progress" class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div></div>';
                forca.innerHTML = progress;
                break;

            case 3:
                $('.sw-btn-next').prop("disabled", false);
                var progress = '<h8>Seguridad de la Contraseña</8><div class="progress"><div id="progress" class="progress-bar bg-info progress-bar-striped progress-bar-animated" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div>';
                forca.innerHTML = progress;
                break;

            case 4:
                $('.sw-btn-next').prop("disabled", false);
                var progress = '<h8>Seguridad de la Contraseña</8><div class="progress"><div id="progress" class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div>';
                forca.innerHTML = progress;
                break;
        }

        if (senha.length > 6 && senha.length < 16 && senha === confirmacao && strength > 2) {
            $(".btn-success").prop('disabled', false);
        } else {
            if (confirmacao !== "") {
                $(".btn-success").prop('disabled', true);
                $("#passwordconf").val = "";
            }
        }
    }
}