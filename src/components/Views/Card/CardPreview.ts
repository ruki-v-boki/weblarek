import { CardView } from "./CardView";


export class CardForPreview extends CardView {
  private _description: HTMLElement;
  private _orderButton: HTMLButtonElement;

  constructor(container: HTMLElement){
    super(container)
    this._description = container.querySelector('.card__text') as HTMLElement;
    this._orderButton = container.querySelector('.card__button') as HTMLButtonElement;
  }

  set description(value: string){
    this._description.textContent = value
  }

  set orderButtonText(value: string){
    this._orderButton.textContent = value
  }

  toggleOrderButton(value: boolean): void {
    value
    ? this._orderButton.disabled = false
    : this._orderButton.disabled = true
  }
}