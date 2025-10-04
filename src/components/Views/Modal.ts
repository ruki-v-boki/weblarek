import { Component } from "../base/Component";
import { IModalData } from "../../types";


export class Modal extends Component<IModalData> {
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;

  constructor(container: HTMLElement){
    super(container)
    this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this._content = container.querySelector('.modal__content') as HTMLElement;
  }

  set content(content: HTMLElement){
    this._content.replaceChildren(content)
  }

  open(): void {
    this.container.classList.add('modal_active')
  }

  close(): void {
    this.container.classList.remove('modal_active')
  }
}