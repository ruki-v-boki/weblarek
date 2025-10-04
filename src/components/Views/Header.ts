import { Component } from "../base/Component";
import { IHeaderData } from "../../types";


export class Header extends Component<IHeaderData> {
  private _basketButton: HTMLButtonElement;
  private _basketCounter: HTMLElement;

  constructor(container: HTMLElement){
    super(container)
    this._basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this._basketCounter = container.querySelector('.header__basket-counter') as HTMLElement;
  }

  set counter(value: number){
    this._basketCounter.textContent = value.toString()
  }
}
