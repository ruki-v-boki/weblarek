import { CardImageCategory } from "../Parent/CardImageCategory";
import { AppEvents } from "../../../../utils/constants";
import { IEvents } from "../../../base/Events";


export class CardForCatalog extends CardImageCategory {
  constructor(
    container: HTMLElement,
    events: IEvents,
    CDN_URL: string,
    category: Record<string, string>
  ){
    super(container, events, CDN_URL, category)

    // ------------LISTENERS------------
    this.container.addEventListener('click', () => {
      this._events.emit(AppEvents.PRODUCT_SELECT, { id: this._id })
    })
  }
}