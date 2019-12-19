/* global TimelineMax Back */
var modalIsOpen = false
const ariaAnnouncement = document.getElementById('event-announcement')
const modalButton = document.getElementById('jsModalButton')
const modalCloseButton = document.getElementById('jsModalClose')
const modalOverlay = document.querySelector('.modal-overlay')
const wavingHand = document.querySelector('.wave-hand')
const selectElement = document.getElementById('selectable-options')

const wave = hand => {
  const tl = new TimelineMax({})
  // Sets transform origin
  tl.set(hand, { transformOrigin: 'bottom center' })
  tl.from(hand, 0.5, { scale: 0.25, opacity: 0, ease: Back.easeOut.config(1.5) })
  tl.to(hand, 0.2, { rotation: 15 })
  tl.to(hand, 0.2, { rotation: -15 })
  tl.to(hand, 0.2, { rotation: 15 })
  tl.to(hand, 0.2, { rotation: -15 })
  tl.to(hand, 0.2, { rotation: 0 })
}

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
  console.log("Does close button exist: " + modalCloseButton)
  //wave(wavingHand)
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