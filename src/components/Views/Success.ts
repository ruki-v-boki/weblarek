import { Component } from "../base/Component";
import { ISuccessData } from "../../types";


export class Success extends Component<ISuccessData>{
  private _totalPrice: HTMLElement;
  private _confirmButton: HTMLButtonElement;

  constructor(container: HTMLElement){
    super(container)
    this._totalPrice = container.querySelector('.order-success__description') as HTMLElement;
    this._confirmButton = container.querySelector('.order-success__close') as HTMLButtonElement;
  }

  set totalPrice(value: number){
    this._totalPrice.textContent = `Списано ${value} синапсов`
  }
}