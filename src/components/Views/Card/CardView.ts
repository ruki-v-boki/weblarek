import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";


export abstract class CardView extends Component<IProduct> {
  protected _id: string;
  protected _title: HTMLElement
  protected _price: HTMLElement
  protected _image?: HTMLImageElement
  protected _category?: HTMLElement

  constructor(container: HTMLElement, protected _events: IEvents){
    super(container)
    this._id = ''
    this._title = ensureElement<HTMLElement>('.card__title', container)
    this._price = ensureElement<HTMLElement>('.card__price', container)
    this._image = container.querySelector('.card__image') as HTMLImageElement || undefined
    this._category = container.querySelector('.card__category') as HTMLElement || undefined
  }

  // -----------------------------------

  set id(value: string){
    this._id = value
  }

  set title(value: string){
    this._title.textContent = value
  }

  set price(value: number | null){
    this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно'
  }

  set image(src: string){
    if (this._image) {
      this.setImage(this._image,CDN_URL + `${src}`, this._title.textContent || '')
    }
  }

  set category(name: string){
    if (!this._category) return
    this.setCategoryText(name)
    this.updateCategoryClass(name)
  }

  // -----------------------------------

  private setCategoryText(value: string): void {
    this._category!.textContent = value
  }

  private updateCategoryClass(categoryName: string): void {
    Object.entries(categoryMap).forEach(([key, className]) => {
      this._category!.classList.toggle(className, key === categoryName)
    })
  }
}