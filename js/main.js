var modalIsOpen = false
const ariaAnnouncement = document.getElementById('event-announcement')
const modalButton = document.getElementById('jsModalButton')
const modalCloseButton = document.getElementById('jsModalClose')
const modalOverlay = document.querySelector('.modal-overlay')
const modalContainer = document.querySelector('.modal')
const selectElement = document.getElementById('selectable-options')
var aria = {}
var aria.Utils = {}
aria.Utils.ignoreUtilFocusChanges = false
aria.Utils.focusFirstDescendant = (element) => {
  for(i = 0; i < element.childNodes.length; i++) {
    var child = element.childNodes[i]
    if(aria.Utils.attemptFocus(child)) {
      return true
    }  // End if attemptFocus
  }  // End children loop
  return false
}  // End aria.Utils.focusFirstDescendant function
aria.Utils.focusLastDescendant = (element) => {
  for(i = element.childNodes.length - 1; i > 0; i--) {
    var child = element.childNodes[i]
    if(aria.Utils.attemptFocus(child)) {
      return true
    }  // End if attemptFocus
  }  // End children loop
  return false
}  // End aria.Utils.focusLastDescendant function
aria.Utils.attemptFocus = (element) => {
  aria.Utils.ignoreUtilFocusChanges = true
  try {
    element.focus()
  }
  catch(e) {
    // catch anything
  }  // End catch
  aria.Utils.ignoreUtilFocusChanges = false
  return (document.activeElement === element)
}  // End attemptFocus function
aria.OpenDialogList = []
aria.getCurrentDialog = _ => {
  if(aria.OpenDialogList && aria.OpenDialogList.length) {
    return aria.OpenDialogList[aria.OpenDialogList.length - 1]
  }
}  // End getCurrentDialog function
aria.closeCurrentDialog = _ => {
  var currentDialog = aria.getCurrentDialog()
  if(currentDialog) {
    currentDialog.close()
    return true
  }
  return false
}  // End closeCurrentDialog function

aria.Dialog = function(dialogId, focusAfterClosed, focusFirst) {
  this.dialogNode = document.getElementById(dialogId)
  if(this.dialogNode === null) {
    throw new Error('No element with id "' + dialogId + '" found.')
  }  // End test for dialog element
  if(typeof focusAfterClosed === 'string') {
    this.focusAfterClosed = document.getElementById(focusAfterClosed)
  }  // End if focusAfterClosed is string
  else if(typeof focusAfterClosed === 'object') {
    this.focusAfterClosed = focusAfterClosed
  }  // End else if focusAfterClosed is object
  else {
    throw new Error('Dialog requires a focusAfterClosed parameter.')
  }  // Else throw error
  if(typeof focusFirst === 'string') {
    this.focusFirst = document.getElementById(focusFirst)
  }  // End if focusFirst is string
  else if(typeof focusFirst === 'object') {
    this.focusFirst = focusFirst
  }  // End else if focusFirst is object
  else {
    this.focusFirst = null
  }  // End else focusFirst equals null
  var preDiv = document.createElement('div')
  this.preNode = this.dialogNode.parentNode.insertBefore(preDiv, this.dialogNode)
  this.preNode.tabIndex = 0
  var postDiv = document.createElement('div')
  this.postNode = this.dialogNode.parentNode.insertBefore(postDiv, this.dialogNode.nextSibling)
  this.postNode.tabIndex = 0
  if(aria.OpenDialogList.length > 0) {
    aria.getCurrentDialog().removeListeners()
  }  // End if OpenDialogList has entries
  this.addListeners()
  aria.OpenDialogList.push(this)
  document.body.classList.add('modal-is-open')
  if(this.focusFirst) {
    this.focusFirst.focus()
  }  // End if focusFirst has a value
  else {
    aria.Utils.focusFirstDescendant(this)
  }  // Else focus the the first focusable descendant
  this.lastFocus = document.activeElement
}  // End Dialog constructor
aria.Dialog.prototype.close = _ => {
  aria.OpenDialogList.pop()
  this.removeListeners()
  aria.Utils.remove(this.preNode)
  aria.Utils.remove(this.postNode)
  document.body.classList.remove('modal-is-open')
  this.focusAfterClosed.focus()
  if(aria.OpenDialogList.length > 0) {
    aria.getCurrentDialog()
  }  // End if there are open dialogs
}  // End Dialog.close function
aria.Dialog.prototype.addListeners = _ => {
  document.addEventListener('focus', this.trapFocus, true)
}  // End addListeners method
aria.Dialog.prototype.removeListeners = _ => {
  document.removeEventListener('focus', this.trapFocus, true)
}  // End removeListeners method
aria.Utils.prototype.trapFocus = (event) {
  if(aria.Utils.ignoreUtilFocusChanges) {
    return
  }  // End if ignoreUtilFocusChanges
  var currentDialog = aria.getCurrentDialog()
  if(currentDialog.dialogNode.contains(event.target)) {
    currentDialog.lastFocus = event.target
  }  // End if the dialog contains the new focus point
  else {
    aria.Utils.focusFirstDescendant(currentDialog.dialogNode)
    if(currentDialog.lastFocus === document.activeElement) {
      aria.Utils.focusLastDescendant(currentDialog.dialogNode)
    }  // End if lastFocus is the active element
    currentDialog.lastFocus = document.activeElement
  }  // End else focus first or last element of the dialog
}  // End trapFocus method
window.openDialog = function(dialogId, focusAfterClosed, focusFirst) {
  var dialog = new this.aria.Dialog(dialogId, focusAfterClosed, focusFirst)
}  // End openDialog method

const closeModal = _ => {
  document.body.classList.remove('modal-is-open')
  modalContainer.setAttribute('aria-modal', 'false')
  modalButton.focus()
  ariaAnnouncement.innerText = 'Closing modal'
}

const openModal = _ => {
  document.body.classList.add('modal-is-open')
  modalContainer.setAttribute('aria-modal', 'true')
  modalCloseButton.focus()
}
