var EMOTE_ELEMENT = document.querySelector('.div_emote');
var CLOCK_ELEMENT = document.querySelector('.clock');
var CLOCK_PROGRESS_ELEMENT = document.querySelector('.clock-ring-progress');
var EMOTE_TIMEOUT;
var CLOCK_CIRCUMFERENCE = 339.292;
var LIST_GIFS = [
    "Showering-in-money.gif",
    "cash.gif",
    "cooking-cook.gif",
    "gross.gif",
    "larroude.gif",
    "laught.gif",
    "money-rain-kim-kardashian.gif",
    "money.gif"
];
var LAST_GIF = -1;

var LIST_NAME = "DATA";
var INICIAL_DATE;
var FINAL_DATE;
var BASE_MONEY;
var CHOSE_THEME;
var THEME = [{
    id: 1,
    name: "Twilight",
    "--bg-page": "#2D1D4A",
    "--emote-bg": "#6B166A",
    "--text-light": "#ffffff",
    "--clock-face": "#333333",
    "--clock-ring-soft": "rgba(255, 255, 255, 0.18)",
    "--clock-ring": "#FC03AD",
    "--btn-color": "#CC0898",
    "--money-color": "#02DE2E",
    "--shadow-dark": "rgba(0, 0, 0, 0.5)"
},
{
    id: 2,
    name: "Nurture Nature",
    "--bg-page": "#0D1F01",
    "--emote-bg": "#233918",
    "--text-light": "#ffffff",
    "--clock-face": "#333333",
    "--clock-ring-soft": "rgba(255, 255, 255, 0.18)",
    "--clock-ring": "#8CF83A",
    "--btn-color": "#3C9000",
    "--money-color": "#8EC51F",
    "--shadow-dark": "rgba(0, 0, 0, 0.5)"
},
{
    id: 3,
    name: "Deep Blue",
    "--bg-page": "#011D28",
    "--emote-bg": "#183446",
    "--text-light": "#ffffff",
    "--clock-face": "#333333",
    "--clock-ring-soft": "rgba(255, 255, 255, 0.18)",
    "--clock-ring": "#0AC2FF",
    "--btn-color": "#046E8F",
    "--money-color": "#1FFFE1",
    "--shadow-dark": "rgba(0, 0, 0, 0.5)"
},
{
    id: 4,
    name: "Orange Sky",
    "--bg-page": "#290801",
    "--emote-bg": "#452317",
    "--text-light": "#ffffff",
    "--clock-face": "#333333",
    "--clock-ring-soft": "rgba(255, 255, 255, 0.18)",
    "--clock-ring": "#FF441F",
    "--btn-color": "#8F1904",
    "--money-color": "#FF1F33",
    "--shadow-dark": "rgba(0, 0, 0, 0.5)"
},
{
    id: 5,
    name: "Dark",
    "--bg-page": "#222222",
    "--emote-bg": "#4d4c4c",
    "--text-light": "#ffffff",
    "--clock-face": "#333333",
    "--clock-ring-soft": "rgba(255, 255, 255, 0.18)",
    "--clock-ring": "#E0E0E0",
    "--btn-color": "#707070",
    "--money-color": "#FFFFFF",
    "--shadow-dark": "rgba(0, 0, 0, 0.5)"
},
];

window.animarEmote = animarEmote;

function showTime() {
    updateGif();
    calculateMoney();
    animarEmote();
}

function setTheme() {
    var html = "";
    $.each(THEME, function (key, value) {
        var selected = CHOSE_THEME == value.id ? "selected" : "";
        html += `<option value="` + value.id + `" ` + selected + `>` + value.name + `</option>`;
    });
    $("#theme").html(html);
    $(".select2").select2();
}

function changeTheme() {
    var index = THEME.indexOf(THEME.find((element) => element.id == CHOSE_THEME));
    var data = THEME[index];

    Object.keys(data).forEach(function (key) {
        if (key.startsWith("--")) {
            document.documentElement.style.setProperty(key, data[key]);
        }
    });
}

function saveStoredData(data, callback) {
    localStorage.setItem(LIST_NAME, JSON.stringify(data));

    if (callback) {
        callback();
    }
}

function saveConfig(data) {
    saveStoredData(data, function () {
        const Toast = Swal.mixin({
            toast: true,
            position: "right",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
            willClose: () => {
                window.location.reload();
            }
        });

        Toast.fire({
            icon: "success",
            title: "Salvo Com Sucesso",
            background: "#19191a",
            color: "#e1e1e1",
        });
    });
}

function getTodayDateInputValue() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');

    return year + '-' + month + '-' + day;
}

function buildDateTime(dateValue, timeValue) {
    if (!dateValue || !timeValue) {
        return null;
    }

    return new Date(dateValue + 'T' + timeValue);
}

function calculateMoney(type) {
    var startDate = INICIAL_DATE;
    var currentDate = new Date();

    var diffInMilliseconds = currentDate.getTime() - startDate.getTime();
    var diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    var totalMoney = 0;

    if (type == 1) {
        for (var i = 0; i < diffInHours; i++) {
            var html = "";
            totalMoney += BASE_MONEY;

            if (i != 0) {
                html += `<div class="plus">+</div>`;
            }

            html += `<div class="partial_money">
                    R$ `+ BASE_MONEY.toFixed(2) + `
                </div>`;

            $('.div_partial_money').append(html);
        }
    } else {
        var html = "";

        for (var i = 0; i < diffInHours; i++) {
            totalMoney += BASE_MONEY;

            if (i != 0) {
                html += `<div class="plus">+</div>`;
            }

            html += `<div class="partial_money">
                    R$ `+ BASE_MONEY.toFixed(2) + `
                </div>`;
        }
        $('.div_partial_money').html(html);
    }

    $(".total_money").text("R$ " + totalMoney.toFixed(2));

    if (currentDate > FINAL_DATE) {
        Swal.fire({
            icon: 'success',
            title: 'PARABÉNS!!!!!!!!!!!',
            position: "top",
            text: 'Você SOBREVIVEU a mais um Plantãoooo!',
            footer: '(Atualize o horário para um novo CONTADOR DE DINHEIROS)',
            background: THEME[CHOSE_THEME]["--bg-page"],
            color: THEME[CHOSE_THEME]["--text-light"],
            showCloseButton: false,
            showConfirmButton: false,
        });
    }

    return true;
}

function setDefaultInfo() {

    try {
        var data = JSON.parse(localStorage.getItem(LIST_NAME) || '{}');

        console.log(data);

        var todayValue = getTodayDateInputValue();

        $('#inicial_date').val(data.dt_inicial || todayValue);
        $('#inicial_time').val(data.hr_inicial || '');
        $('#final_date').val(data.dt_final || todayValue);
        $('#final_time').val(data.hr_final || '');
        $('#base_money').val(data.base_money || '120.00');

        INICIAL_DATE = buildDateTime(data.dt_inicial, data.hr_inicial);
        FINAL_DATE = buildDateTime(data.dt_final, data.hr_final);
        BASE_MONEY = Number(data.base_money || 0);

        CHOSE_THEME = data.theme || 1;

        calculateMoney(1);
        changeTheme();
        setTheme();

    } catch (error) {
        console.log(error);
    }

}

function updateTime() {
    var timeElement = $('#time');
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    var timeString = `${hours}:${minutes}:${seconds}`;

    timeElement.text(timeString);

    if (seconds === '00' && minutes === '00') {
        showTime(2);
    }
}

function toggleConfig() {
    var configFields = document.querySelector('.config_fields');
    var animationDuration = 280;

    if (!configFields) {
        return;
    }

    if (configFields.classList.contains('is-leaving')) {
        return;
    }

    if (configFields.hidden) {
        configFields.hidden = false;
        configFields.classList.remove('is-leaving');
        configFields.classList.add('is-entering');

        requestAnimationFrame(function () {
            configFields.classList.remove('is-entering');
            configFields.classList.add('is-open');
        });
    } else {
        configFields.classList.remove('is-open', 'is-entering');
        configFields.classList.add('is-leaving');

        setTimeout(function () {
            configFields.hidden = true;
            configFields.classList.remove('is-leaving');
        }, animationDuration);
    }
}

function syncClockProgress() {
    var now;
    var totalMilliseconds;
    var progress;
    var dashOffset;

    if (!CLOCK_ELEMENT || !CLOCK_PROGRESS_ELEMENT) {
        return;
    }

    now = new Date();
    totalMilliseconds = ((now.getSeconds() % 10) * 1000) + now.getMilliseconds();
    progress = totalMilliseconds / 10000;
    dashOffset = CLOCK_CIRCUMFERENCE * (1 - progress);

    CLOCK_PROGRESS_ELEMENT.style.strokeDashoffset = dashOffset;
    requestAnimationFrame(syncClockProgress);
}

function animarEmote() {
    if (!EMOTE_ELEMENT) {
        return;
    }

    clearTimeout(EMOTE_TIMEOUT);
    EMOTE_ELEMENT.classList.add('is-visible');

    EMOTE_TIMEOUT = setTimeout(function () {
        EMOTE_ELEMENT.classList.remove('is-visible');
    }, 5500);
}

function updateGif() {
    var random;
    var randomItem;
    var result;

    if (!LIST_GIFS.length) {
        console.warn('Nenhum gif encontrado.');
        return false;
    }

    if (LIST_GIFS.length === 1) {
        LAST_GIF = 0;
        result = "gif/" + LIST_GIFS[0];
        $('#image').attr('src', result);
        return true;
    }

    do {
        random = Math.floor(Math.random() * LIST_GIFS.length);
    } while (random === LAST_GIF);

    randomItem = LIST_GIFS[random];
    LAST_GIF = random;

    result = "gif/" + randomItem;

    $('#image').attr('src', result);

    return true;
}

$(document).ready(function () {
    setDefaultInfo();

    updateGif();

    setInterval(updateTime, 1000);
    updateTime();
    syncClockProgress();
});

$(document).on("change", "#theme", function () {
    CHOSE_THEME = $(this).val();
    changeTheme();
});

$(document).on('click', '.clock', function () {

    if (EMOTE_ELEMENT.classList.contains('is-visible')) {
        EMOTE_ELEMENT.classList.remove('is-visible');
    } else {
        animarEmote();
    }
});

$(document).on("click", ".btn_config", function () {
    toggleConfig();
});

$(document).on("click", "#btn_save_config", function () {
    var dt_inicial = $('#inicial_date').val();
    var hr_inicial = $('#inicial_time').val();
    var dt_final = $('#final_date').val();
    var hr_final = $('#final_time').val();
    var base_money = parseFloat($('#base_money').val());

    if (!dt_inicial || !hr_inicial || !dt_final || !hr_final || isNaN(base_money)) {
        Toast.fire({
            icon: 'error',
            title: 'Por favor, preencha todos os campos corretamente.',
            background: THEME[CHOSE_THEME]["--bg-page"],
            color: THEME[CHOSE_THEME]["--text-light"],
        });
    } else {
        var data = {
            theme: CHOSE_THEME,
            dt_inicial: dt_inicial,
            hr_inicial: hr_inicial,
            dt_final: dt_final,
            hr_final: hr_final,
            base_money: base_money
        };

        saveConfig(data);
        toggleConfig();
    }
});
