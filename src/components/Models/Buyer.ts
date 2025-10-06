import { IEvents } from "../base/Events";
import { eventsMap } from "../../utils/constants";
import { IBuyer, TPayment, IValidationErrors } from "../../types";


export class Buyer {
  private _address: string
  private _phone: string
  private _email: string
  private _payment: TPayment

  constructor(private _events: IEvents){
    this._address = ''
    this._phone = ''
    this._email = ''
    this._payment = ''
  }

  // -----------------------------------

  setBuyerData(data: IBuyer) {
    this._address = data.address
    this._phone = data.phone.trim()
    this._email = data.email.trim()
    this._payment = data.payment

    this._events.emit(eventsMap.BUYER_CHANGE, data)
  }

  // -----------------------------------

  getBuyerData(): IBuyer {
    return {
      address: this._address,
      phone: this._phone,
      email: this._email,
      payment: this._payment,
    }
  }

  // -----------------------------------

  clear(): void {
    this._address = '',
    this._phone = '',
    this._email = '',
    this._payment = ''

    this._events.emit(eventsMap.BUYER_CLEAR)
  }

  validate(): IValidationErrors {
    let errors: IValidationErrors = {}

    if (!this._payment) { errors.payment = 'Выберите способ оплаты' }
    if (!this._email) { errors.email = 'Укажите email' }
    if (!this._phone) { errors.phone = 'Укажите телефон' }
    if (!this._address) { errors.address = 'Укажите адрес' }

    this._events.emit(eventsMap.BUYER_VALIDATE, errors)
    return errors
  }
}