import { CardView } from "./CardView";


export class CardForBasket extends CardView {
  private _indexElement: HTMLElement;
  private _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement){
    super(container)
    this._indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this._deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
  }

  set index(value: number){
    this._indexElement.textContent = value.toString()
  }
}