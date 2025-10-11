import { IValidationErrors, TPayment } from "../../../../types";
import { AppEvents } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { FormView } from "../Parent/FormView"; 


export class FormOrderView extends FormView {
  private _onlinePayButton: HTMLButtonElement
  private _cashPayButton: HTMLButtonElement
  private _address: HTMLInputElement

  constructor(container: HTMLElement, events: IEvents){
    super(container, events)
    this._onlinePayButton = ensureElement<HTMLButtonElement>('[name="online"]', container)
    this._cashPayButton = ensureElement<HTMLButtonElement>('[name="cash"]', container)
    this._address = ensureElement<HTMLInputElement>('[name="address"]', container)

    // ------------ LISTENERS ------------
    this._onlinePayButton.addEventListener('click', () => {
      this._events.emit(AppEvents.FORM_PAYMENT_CHANGED, { payment: 'online' })
    })

    this._cashPayButton.addEventListener('click', () => {
      this._events.emit(AppEvents.FORM_PAYMENT_CHANGED, { payment: 'cash' })
    })

    this._address.addEventListener('input', () => {
      this._events.emit(AppEvents.FORM_ADDRESS_CHANGED, { address: this._address.value })
    })

    this._submitButton.addEventListener('click', (event) => { event.preventDefault()
      this._events.emit(AppEvents.FORM_ORDER_SUBMIT)
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
    this.error = errors.payment || errors.address || ''
    return !errors.payment && !errors.address
  }

  // childMethod
  resetFormState(): void {
    super.resetFormState()
    this.clear()
    this._onlinePayButton.classList.remove('button_alt-active')
    this._cashPayButton.classList.remove('button_alt-active')
  }

  togglePaymentButtonStatus(status: TPayment): void {
    this._onlinePayButton.classList.toggle('button_alt-active', status === 'online')
    this._cashPayButton.classList.toggle('button_alt-active', status === 'cash')
  }

  clear(): void {
    this._address.value = ''
  }
}