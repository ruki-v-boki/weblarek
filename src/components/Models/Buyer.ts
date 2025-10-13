import { IBuyer, TPayment, IValidationErrors } from "../../types";
import { AppEvents } from "../../utils/constants";
import { IEvents } from "../base/Events";


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

  set address(address: string){
    this._address = address,
    this._events.emit(AppEvents.BUYER_CHANGE, { field: 'address' })
  }

  set phone(phone: string){
    this._phone = phone.trim(),
    this._events.emit(AppEvents.BUYER_CHANGE, { field: 'phone' })
  }

  set email(email: string){
    this._email = email.trim(),
    this._events.emit(AppEvents.BUYER_CHANGE, { field: 'email' })
  }

  set payment(payment: TPayment){
    this._payment = payment,
    this._events.emit(AppEvents.BUYER_CHANGE, { field: 'payment' })
  }

  // -----------------------------------

  getAllBuyerData(): IBuyer {
    return {
      address: this._address,
      phone: this._phone,
      email: this._email,
      payment: this._payment,
    }
  }

  // -----------------------------------

  validate(): IValidationErrors {
    const errors: IValidationErrors = {}

    if (!this._payment) { errors.payment = 'Выберите способ оплаты' }
    if (!this._email) { errors.email = 'Необходимо указать email' }
    if (!this._phone) { errors.phone = 'Необходимо указать телефон' }
    if (!this._address) { errors.address = 'Необходимо указать адрес' }
    return errors
  }

  clear(): void {
    this._address = '',
    this._phone = '',
    this._email = '',
    this._payment = ''
  }
}