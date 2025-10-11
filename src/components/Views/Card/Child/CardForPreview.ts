import { CardImageCategory } from "../Parent/CardImageCategory";
import { eventsMap } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";


export class CardForPreview extends CardImageCategory {
  private _description: HTMLElement
  private _orderButton: HTMLButtonElement

  constructor(
    container: HTMLElement,
    events: IEvents,
    CDN_URL: string,
    category: Record<string, string>
  ){
    super(container, events, CDN_URL, category)
    this._description = ensureElement<HTMLElement>('.card__text', container)
    this._orderButton = ensureElement<HTMLButtonElement>('.card__button', container)

    // ------------LISTENERS------------
    this._orderButton.addEventListener('click', () => {
      this._events.emit(eventsMap.PRODUCT_SUBMIT, { id: this._id })
    })
  }

  // -----------------------------------

  set description(value: string){
    this._description.textContent = value
  }

  set orderButtonText(value: string){
    this._orderButton.textContent = value
  }

  // -----------------------------------

  toggleOrderButton(value: boolean): void {
    this._orderButton.toggleAttribute('disabled', !value)
  }
}