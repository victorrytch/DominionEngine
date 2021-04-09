class LogBox {

    render(htmlElement: any, document: any) {
        htmlElement.style.height = "50%";
        htmlElement.style.overflow = "scroll";
        Log.subscribe((message) => {
            var newLine = document.createElement('div');
            newLine.innerHTML = message["message"];
            htmlElement.appendChild(newLine);
            htmlElement.scrollTop = htmlElement.scrollHeight;
        });
        setTimeout(() => {
            new LogBoxClient().listen(3000);
        }, 50);
    }

}