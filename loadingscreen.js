class loadingScreen {
    constructor(atrb) {
        this.atrb = atrb;
        
    };
    
    show(props) {
        if(props.timer) {
            $(document.body).append(`<div id="loading" class="loading-container show">
                <div class="loading-img"></div>
                <div class="loading-text">Loading</div>
            </div>`);
            setTimeout(this.hide, props.timer);
        } else {
            $(document.body).append(`<div id="loading" class="loading-container show">
        <div class="loading-img"></div>
        <div class="loading-text">Loading</div>
      </div>`);
        }
    }

    hide() {
        $("#loading").remove();
    }
}