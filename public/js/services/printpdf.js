const pages = [] // initiate an empty list here

async function printPage() {
    const tempWindow = window.open('', 'Print', 'height=600,width=800')

    const iframe = document.getElementById("viewbi");
    const newIframe = document.createElement('iframe')
    newIframe.src = iframe.src

    newIframe.style = `border: 0; width: 100%; height: 100%;`
    tempWindow.document.body.style = `margin: 0;`

    tempWindow.document.body.appendChild(newIframe)

    await sleep(2000);

    newIframe.onload = () => {
        tempWindow.print()
        tempWindow.close()
    }
}