import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../../base/Events";
import { CardView } from "./CardView";


export abstract class CardImageCategory extends CardView {
  protected _image: HTMLImageElement
  protected _CDN_URL: string
  protected _category: HTMLElement
  protected _categoryMap: Record<string, string>

  constructor(
    container: HTMLElement,
    events: IEvents,
    CDN_URL: string,
    category: Record<string, string>
  ){
    super(container, events)
    this._image = ensureElement<HTMLImageElement>('.card__image', container)
    this._CDN_URL = CDN_URL
    this._category = ensureElement<HTMLElement>('.card__category', container)
    this._categoryMap = category
  }

  // -----------------------------------

  set image(src: string){
    this.setImage(
      this._image,
      this._CDN_URL + `${src.slice(0, -3) + 'png'}`,
      this._title.textContent
    )
  }

  set category(name: string){
    this.setCategoryText(name)
    this.updateCategoryClass(name)
  }

  // -----------------------------------

  protected setCategoryText(value: string): void {
    this._category!.textContent = value
  }

  protected updateCategoryClass(categoryName: string): void {
    Object.entries(this._categoryMap).forEach(([key, className]) => {
      this._category!.classList.toggle(className, key === categoryName)
    })
  }
}