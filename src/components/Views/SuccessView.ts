import { ensureElement } from "../../utils/utils";
import { AppEvents } from "../../utils/constants";
import { Component } from "../base/Component";
import { ISuccessData } from "../../types";
import { IEvents } from "../base/Events";


export class SuccessView extends Component<ISuccessData>{
  private _totalPrice: HTMLElement
  private _confirmButton: HTMLButtonElement

  constructor(container: HTMLElement, private _events: IEvents){
    super(container)
    this._totalPrice = ensureElement<HTMLElement>('.order-success__description', container)
    this._confirmButton = ensureElement<HTMLButtonElement>('.order-success__close', container)

    // ------------LISTENERS------------
    this._confirmButton.addEventListener('click', () => {
      this._events.emit(AppEvents.SUCCESS_CONFIRM)
    })
  }

  // -----------------------------------

  set totalPrice(value: number){
    this._totalPrice.textContent = `Списано ${value} синапсов`
  }
}