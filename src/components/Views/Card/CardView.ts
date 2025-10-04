import { Component } from "../../base/Component";
import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";


export abstract class CardView extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;

  constructor(container: HTMLElement){
    super(container)
    this._title = container.querySelector('.card__title') as HTMLElement;
    this._price = container.querySelector('.card__price') as HTMLElement;
    this._image = container.querySelector('.card__image') as HTMLImageElement;
    this._category = container.querySelector('.card__category') as HTMLElement;
  }

  set title(value: string){
    this._title.textContent = value
  }

  set price(value: number | null){
    this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно'
  }

  set image(src: string){
    this._image 
    ? this.setImage(this._image, src, this._title.textContent)
    : ''
  }

  set category(name: string){
    if (!this._category) return
    this.setText(name)
    this.updateCategoryClass(name)
  }

// -------------------------------------
  private setText(value: string): void {
    this._category!.textContent = value
  }

  private updateCategoryClass(categoryName: string): void {
    Object.entries(categoryMap).forEach(([key, className]) => {
      this._category!.classList.toggle(className, key === categoryName)
    })
  }
}