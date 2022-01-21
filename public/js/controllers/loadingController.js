
const enable = (btn) => {
    document.querySelector(btn).innerHTML = "";

    const div = document.createElement('div');
    div.classList.add('spinner-border', 'spinner-border');

    document.querySelector(btn).appendChild(div);
    document.querySelector(btn).disabled = true;
}

const disable = (btn, text) => {
    document.querySelector(btn).innerHTML = text;
    document.querySelector(btn).disabled = false;
}

export const Loading = {
    enable,
    disable
}