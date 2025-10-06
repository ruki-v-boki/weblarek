import { IEvents } from "../../base/Events";
import { FormView } from "./FormView";
import { eventsMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";


export class OrderForm extends FormView {
  private _onlinePayButton: HTMLButtonElement
  private _cashPayButton: HTMLButtonElement
  private _address: HTMLInputElement

  constructor(container: HTMLElement, events: IEvents){
    super(container, events)
    this._onlinePayButton = ensureElement<HTMLButtonElement>('[name="online"]', container)
    this._cashPayButton = ensureElement<HTMLButtonElement>('[name="cash"]', container)
    this._address = ensureElement<HTMLInputElement>('[name="address"]', container)

    // ------------LISTENERS------------
    this._onlinePayButton.addEventListener('click', () => {
      this._events.emit(eventsMap.PAYMENT_CHANGED, { payment: 'online' })
    })
    this._cashPayButton.addEventListener('click', () => {
      this._events.emit(eventsMap.PAYMENT_CHANGED, { payment: 'cash' })
    })
    this._address.addEventListener('input', () => {
      this._events.emit(eventsMap.ADDRESS_CHANGED, { address: this._address.value })
    })
    this._submitButton.addEventListener('click', () => {
      this._events.emit(eventsMap.ORDER_SUBMIT)
    })
  }

  // -----------------------------------

  togglePaymentButtonStatus(button: HTMLButtonElement, status: boolean): void {
    button.classList.toggle('button_alt-active', status)
  }
}

// Скорее всего придется создать одно событие для всех полей формы
