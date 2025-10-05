import { IEvents } from "../../base/Events";
import { CardView } from "./CardView";
import { eventsMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";


export class CardForPreview extends CardView {
  private _description: HTMLElement;
  private _orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents){
    super(container, events)
    this._description = ensureElement<HTMLElement>('.card__text', container);
    this._orderButton = ensureElement<HTMLButtonElement>('.card__button', container);

    // ------------LISTENERS------------
    this._orderButton.addEventListener('click', () => {
      this._events.emit(eventsMap.PRODUCT_ADD, { id: this._id })
    })
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