import { FormView } from "./Form";


export class ContactsForm extends FormView {
  private _email: HTMLInputElement;
  private _phone: HTMLInputElement;

  constructor(container: HTMLElement){
    super(container)
    this._email = container.querySelector('[name = "email"]') as HTMLInputElement;
    this._phone = container.querySelector('[name = "phone"]') as HTMLInputElement;
  }
}