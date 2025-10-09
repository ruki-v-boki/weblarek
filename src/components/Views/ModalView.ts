import { ensureElement } from "../../utils/utils";
import { eventsMap } from "../../utils/constants";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IModalData } from "../../types";


export class ModalView extends Component<IModalData> {
  private _closeButton: HTMLButtonElement
  private _content: HTMLElement

  constructor(container: HTMLElement, private _events: IEvents){
    super(container)
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container)
    this._content = ensureElement<HTMLElement>('.modal__content', container)

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

  // -----------------------------------

  set content(content: HTMLElement){
    this._content.replaceChildren(content)
  }

  // -----------------------------------

  open(content: HTMLElement): void {
    this._content.replaceChildren(content)
    this.container.classList.add('modal_active')
  }

  close(): void {
    this.container.classList.remove('modal_active')
  }

  isOpen(): boolean {
    return this.container.classList.contains('modal_active')
  }
}