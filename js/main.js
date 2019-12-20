/* global TimelineMax Back */
var modalIsOpen = false
const ariaAnnouncement = document.getElementById('event-announcement')
const modalButton = document.getElementById('jsModalButton')
const modalCloseButton = document.getElementById('jsModalClose')
const modalOverlay = document.querySelector('.modal-overlay')
const selectElement = document.getElementById('selectable-options')

const closeModal = _ => {
  document.body.classList.remove('modal-is-open')
  modalOverlay.setAttribute('aria-modal', 'false')
  modalIsOpen = false
  modalButton.focus()
  ariaAnnouncement.innerText = 'Closing modal'
}

const openModal = _ => {
  modalIsOpen = true
  document.body.classList.add('modal-is-open')
  modalOverlay.setAttribute('aria-modal', 'true')
  modalCloseButton.focus()
}

modalOverlay.addEventListener('keydown', event => {
  const KEY_ESC = 27
  const KEY_TAB = 9

  switch(event.keyCode) {
    case KEY_ESC:
      event.stopPropagation()
      closeModal()
      break
    case KEY_TAB:
      if(event.shiftKey && document.activeElement === modalCloseButton) {
        event.stopPropagation()
        console.log('Current focus: ' + document.activeElement)
        selectElement.focus()
        console.log('Now focused on: ' + document.activeElement)
      } else if(document.activeElement === selectElement) {
        //console.log('Tabbing from select.')  
        event.stopPropagation()
        console.log('Current focus: ' + document.activeElement)
        modalCloseButton.focus()
        console.log('Now focused on: ' + document.activeElement)
      }
      break
  }
})

modalButton.addEventListener('click', event => {
  openModal()
})

modalCloseButton.addEventListener('click', event => {
  closeModal()
})

modalOverlay.addEventListener('click', event => {
  if (!event.target.closest('.modal')) {
    closeModal()
  }  // End if
})  // End event listener