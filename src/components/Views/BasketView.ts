import { IEvents } from "../base/Events";
import { eventsMap } from "../../utils/constants";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IBasketViewData } from "../../types";


export class BasketView extends Component<IBasketViewData> {
  private _basketList: HTMLUListElement
  private _submitButton: HTMLButtonElement
  private _totalPrice: HTMLElement
  private _emptyMessage: HTMLElement

  constructor(container: HTMLElement, private _events: IEvents){
    super(container)
    this._basketList = ensureElement<HTMLUListElement>('.basket__list', container)
    this._submitButton = ensureElement<HTMLButtonElement>('.basket__button', container)
    this._totalPrice = ensureElement<HTMLElement>('.basket__price', container)
    this._emptyMessage = ensureElement<HTMLElement>('.basket__empty', container)

    // ------------LISTENERS------------
    this._submitButton.addEventListener('click', () => {
      this._events.emit(eventsMap.BASKET_PLACE_ORDER)
    })
  }

  // -----------------------------------

  set basketList(purchases: HTMLElement[]){
    this._basketList.replaceChildren(...purchases)
  }

  set totalPrice(value: number){
    this._totalPrice.textContent = `${value} синапсов`
  }

  // -----------------------------------

  setButtonText(value: string): void {
    this._submitButton.textContent = value
  }

  setEmptyMessage(value: boolean): void {
    this._emptyMessage.classList.toggle('basket__empty-disabled', value)
    this._basketList.classList.toggle('basket__list-disabled', !value)
  }

  toggleSubmitButton(value: boolean): void {
    this._submitButton.toggleAttribute('disabled', !value)
  }
}