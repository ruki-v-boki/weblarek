import { Component } from "../../base/Component";
import { IFormErrorData } from "../../../types";


export abstract class FormView extends Component<IFormErrorData> {
  protected _submitButton: HTMLButtonElement;
  protected _error: HTMLElement;

  constructor(container: HTMLElement){
    super(container)
    this._submitButton = container.querySelector('[type = "submit"]') as HTMLButtonElement;
    this._error = container.querySelector('.form__errors') as HTMLElement;
  }

  set error(message: string){
    this._error.textContent = message
  }

  toggleSubmitButton(value: boolean): void {
    value
    ? this._submitButton.disabled = false
    : this._submitButton.disabled = true
  }

  clearError(): void {
    this._error.textContent = '';
  }
}