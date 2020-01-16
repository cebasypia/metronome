const subWindows = document.getElementsByClassName("sub--window");
const beatsWindow = document.getElementById("beats--window");
export const addWindowEvents = () => {
    beatsWindow.addEventListener("click", () => {
        beatsWindow.style.visibility = "hidden";
    });
};
export const setVisibility = (dom, boolean) => {
    dom.style.visibility = (boolean ? "visible" : "hidden");
}
export const hideAllSubWindow = () => {
    const subWindows = document.getElementsByClassName("sub--window");
    for (let i = 0; i < subWindows.length; i++) {
        subWindows[i].style.visibility = "hidden";
    }
};