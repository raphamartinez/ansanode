$('#smartwizard').on('showStep', function (e, anchorObject, stepNumber, stepDirection, stepPosition) {
    if (stepPosition === 'first') {
        $("#prev-btn").addClass('disabled');
        $("#finish-btn").hide();
    } else if (stepPosition === 'final') {
        $("#next-btn").hide();
        $("#finish-btn").hide();
        $("#prev-btn").show();
    } else {
        $("#finish-btn").hide();
        $("#next-btn").show();
        $("#prev-btn").removeClass('disabled');
    }
});

$("#smartwizard").on("leaveStep", function (e, anchorObject, stepNumber, stepDirection) {
    var elmForm = $("#form-step-" + stepNumber);
    if (stepDirection === 'forward' && elmForm) {
        elmForm.validator('validate');
        var elmErr = elmForm.children('.has-error');
        if (elmErr.length > 0) {
            alert("llena todos los campos");
            return false;
        }
    }
    return true;
});


function changeDisabled() {
    var radios = document.getElementsByName("type");
    if (radios[0].checked) {
        $("#btnmail").prop('disabled', false);
    } else if (radios[1].checked) {
        $("#btnmail").prop('disabled', false);
    }
}

function resetday() {
    $('#day option').prop('selected', function () {
        return this.defaultSelected;
    });
}

function resettime() {
    $('#time option').prop('selected', function () {
        return this.defaultSelected;
    });
}

function resetweek() {
    $('#week option').prop('selected', function () {
        return this.defaultSelected;
    });
}

function resetdayweek() {
    $('#dayweek option').prop('selected', function () {
        return this.defaultSelected;
    });
}

function resetmonth() {
    $('#month option').prop('selected', function () {
        return this.defaultSelected;
    });
}