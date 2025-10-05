import { IEvents } from "../../base/Events";
import { CardView } from "./CardView";
import { eventsMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";


export class CardForBasket extends CardView {
  private _indexElement: HTMLElement;
  private _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents){
    super(container, events)
    this._indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    // ------------LISTENERS------------
    this._deleteButton.addEventListener('click', () => {
      this._events.emit(eventsMap.PRODUCT_DELETE, { id: this._id })
    })
  }

  set index(value: number){
    this._indexElement.textContent = value.toString()
  }
}