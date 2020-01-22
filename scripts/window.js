// const subWindows = document.getElementsByClassName('sub--window')
const beatsWindow = document.getElementById('beats--window')
const tempoElements = document.getElementById('tempo--control')
const barElements = document.getElementById('bar--control')

export const addWindowEvents = () => {
  beatsWindow.addEventListener('click', () => {
    beatsWindow.style.visibility = 'hidden'
  })
}
export const setVisibility = (dom, boolean) => {
  dom.style.visibility = boolean ? 'visible' : 'hidden'
}
export const hideAllSubWindow = () => {
  const subWindows = document.getElementsByClassName('sub--window')
  for (let i = 0; i < subWindows.length; i++) {
    subWindows[i].style.visibility = 'hidden'
  }
}

export const setControl = (dom) => {
  if (dom === 'tempo') {
    tempoElements.style.visibility = 'visible'
    barElements.style.visibility = 'hidden'
  } else if (dom === 'bar') {
    tempoElements.style.visibility = 'hidden'
    barElements.style.visibility = 'visible'
  }
}
