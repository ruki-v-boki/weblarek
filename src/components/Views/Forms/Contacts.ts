import { IEvents } from "../../base/Events";
import { FormView } from "./FormView";
import { eventsMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";


export class ContactsForm extends FormView {
  private _email: HTMLInputElement;
  private _phone: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents){
    super(container, events)
    this._email = ensureElement<HTMLInputElement>('[name="email"]', container);
    this._phone = ensureElement<HTMLInputElement>('[name="phone"]', container);

    // ------------LISTENERS------------
    this._email.addEventListener('input', () => {
      this._events.emit(eventsMap.EMAIL_CHANGED, { email: this._email.value })
    })
    this._phone.addEventListener('input', () => {
      this._events.emit(eventsMap.PHONE_CHANGED, { phone: this._phone.value })
    })
    this._submitButton.addEventListener('click', () => {
      this._events.emit(eventsMap.CONTACTS_SUBMIT)
    })
  }
}