import { ensureElement } from "../../utils/utils";
import { AppEvents } from "../../utils/constants";
import { Component } from "../base/Component";
import { IHeaderData } from "../../types";
import { IEvents } from "../base/Events";


export class HeaderView extends Component<IHeaderData> {
  private _basketButton: HTMLButtonElement
  private _basketCounter: HTMLElement

  constructor(container: HTMLElement, private _events: IEvents){
    super(container)
    this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container)
    this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container)

    // ------------LISTENERS------------
    this._basketButton.addEventListener('click', () => {
      this._events.emit(AppEvents.BASKET_OPEN)
    })
  }

  // -----------------------------------

  set counter(value: number){
    this._basketCounter.textContent = value.toString()
  }
}