import { AppEvents } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { IValidationErrors } from "../../../../types";
import { IEvents } from "../../../base/Events";
import { FormView } from "../Parent/FormView"; 


export class FormContactsView extends FormView {
  private _email: HTMLInputElement
  private _phone: HTMLInputElement

  constructor(container: HTMLElement, events: IEvents){
    super(container, events)
    this._email = ensureElement<HTMLInputElement>('[name="email"]', container)
    this._phone = ensureElement<HTMLInputElement>('[name="phone"]', container)

    // ------------LISTENERS------------
    this._email.addEventListener('input', () => {
      this._events.emit(AppEvents.FORM_EMAIL_CHANGED, { email: this._email.value })
    })

    this._phone.addEventListener('input', () => {
      this._events.emit(AppEvents.FORM_PHONE_CHANGED, { phone: this._phone.value })
    })

    this._submitButton.addEventListener('click', (event) => { event.preventDefault()
      this._events.emit(AppEvents.FORM_CONTACTS_SUBMIT)
    })

    this.container.addEventListener('focusin', (event) => {
      if (event.target instanceof HTMLInputElement)
      this._events.emit(AppEvents.FORM_INPUT_FOCUS)
    })
  }

  // -----------------------------------

  // fromAbstract
  checkIsFormValid(errors: IValidationErrors): boolean {
    this.clearError()
    this.error = errors.email || errors.phone || ''
    return !errors.email && !errors.phone
  }

  // childMethod
  resetFormState(): void {
    super.resetFormState()
    this.clear()
  }

  clear(): void {
    this._phone.value = ''
    this._email.value = ''
  }
}