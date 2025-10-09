import { eventsMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";
import { CardView } from "./CardView";


export class CardForCatalog extends CardView {
  constructor(container: HTMLElement, events: IEvents){
    super(container, events)

    // ------------LISTENERS------------
    this.container.addEventListener('click', () => {
      this._events.emit(eventsMap.PRODUCT_SELECT, { id: this._id })
    })
  }
}