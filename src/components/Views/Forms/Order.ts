import { FormView } from "./Form";


export class OrderForm extends FormView {
  private _onlinePayButton: HTMLButtonElement;
  private _cashPayButton: HTMLButtonElement;
  private _address: HTMLInputElement;

  constructor(container: HTMLElement){
    super(container)
    this._onlinePayButton = container.querySelector('[name = "online"]') as HTMLButtonElement;
    this._cashPayButton = container.querySelector('[name = "cash"]') as HTMLButtonElement;
    this._address = container.querySelector('[name = "address"]') as HTMLInputElement;
  }

  togglePaymentButtonStatus(button: HTMLButtonElement, status: boolean): void {
    button.classList.toggle('button_alt-active', status)
  }
}