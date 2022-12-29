console.log("load the html js file");
window.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById('btn');

    const div_file = document.getElementById('div_file');
    const set_path = document.getElementById('set_path');
    // console.log(window.electronAPI.openFile()); 
    btn.addEventListener("click", async () => {
        let filePath = await window.electronAPI.openFile()
        console.log(filePath);  
    })

    window.electronAPI.getStatus((event, value) => {
        const {status, message} = value;
        if(status == 1){
            div_file.removeAttribute("hidden");
            console.log("value: =>", value);
            console.log("message =>", message);
            set_path.textContent = value.file_path
        } else {
            div_file.setAttribute("hidden");
        }
    })

})