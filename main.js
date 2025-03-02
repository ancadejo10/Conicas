document.addEventListener("DOMContentLoaded", function(){
    window.requestAnimationFrame(Render)
})

document.addEventListener("selectstart", (event) => event.preventDefault());