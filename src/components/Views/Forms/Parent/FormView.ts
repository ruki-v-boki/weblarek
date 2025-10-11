import { IFormErrorData, IValidationErrors } from "../../../../types";
import { ensureElement } from "../../../../utils/utils"; 
import { Component } from "../../../base/Component";
import { IEvents } from "../../../base/Events"; 


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

  abstract checkIsFormValid(errors: IValidationErrors): boolean

  resetFormState(): void {
    this.clearError()
    this._submitButton.toggleAttribute('disabled', true)
  }

  toggleSubmitButton(value: boolean): void {
    this._submitButton.toggleAttribute('disabled', !value)
  }

  toggleErrorClass(value: boolean): void {
    this._error.classList.toggle('form__errors-active', value)
  }

  clearError(): void {
    this._error.textContent = ''
  }
}