import { IEvents } from "../base/Events";
import { eventsMap } from "../../utils/constants";
import { Component } from "../base/Component";
import { IModalData } from "../../types";
import { ensureElement } from "../../utils/utils";


export class Modal extends Component<IModalData> {
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;

  constructor(container: HTMLElement, private _events: IEvents){
    super(container)
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);

    // ------------LISTENERS------------
    this._closeButton.addEventListener('click', () => {
      this._events.emit(eventsMap.MODAL_CLOSE)
    })
    this.container.addEventListener('click', event => {
      if(event.target === event.currentTarget) {
        this._events.emit(eventsMap.MODAL_CLOSE)
      }
    })
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