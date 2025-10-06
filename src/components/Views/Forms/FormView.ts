import { IEvents } from "../../base/Events";
import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IFormErrorData } from "../../../types";


export abstract class FormView extends Component<IFormErrorData> {
  protected _submitButton: HTMLButtonElement
  protected _error: HTMLElement

  constructor(container: HTMLElement, protected _events: IEvents){
    super(container)
    this._submitButton = ensureElement<HTMLButtonElement>('[type="submit"]', container)
    this._error = ensureElement<HTMLElement>('.form__errors', container)
  }

  // -----------------------------------

  set error(message: string){
    this._error.textContent = message
  }

  // -----------------------------------

  toggleSubmitButton(value: boolean): void {
    this._submitButton.toggleAttribute('disabled', !value)
  }

  clearError(): void {
    this._error.textContent = ''
  }
}