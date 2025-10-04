import { Component } from "../base/Component";
import { IBasketViewData } from "../../types";


export class BasketView extends Component<IBasketViewData> {
  private _basketList: HTMLUListElement;
  private _submitButton: HTMLButtonElement;
  private _totalPrice: HTMLElement;

  constructor(container: HTMLElement){
    super(container)
    this._basketList = container.querySelector('.basket__list') as HTMLUListElement;
    this._submitButton = container.querySelector('.basket__button') as HTMLButtonElement;
    this._totalPrice = container.querySelector('.basket__price') as HTMLElement;
  }

  set basketList(purchases: HTMLElement[]){
    this._basketList.replaceChildren(...purchases)
  }

  set totalPrice(value: number){
    this._totalPrice.textContent = `${value} синапсов`
  }

  toggleSubmitButton(value: boolean): void {
    value
    ? this._submitButton.disabled = false
    : this._submitButton.disabled = true
  }
}