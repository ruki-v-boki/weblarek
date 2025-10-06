import { IEvents } from "../base/Events"
import { IProduct } from "../../types"
import { eventsMap } from "../../utils/constants"


export class Basket {
  private _purchases: Set<IProduct>

  constructor(private _events: IEvents){
    this._purchases = new Set()
  }

  // -----------------------------------

  getPurchases(): IProduct[] {
    return Array.from(this._purchases)
  }

  getTotalPrice(): number {
    return Array.from(this._purchases)
    .reduce((totalPrice, product) => {
        return totalPrice + (product.price || 0)
    }, 0)
  }

  getQuantity(): number {
    return this._purchases.size
  }

  // -----------------------------------

  add(product: IProduct): void {
    this._purchases.add(product)
    this._events.emit(eventsMap.BASKET_COUNT_CHANGE, {
      quantity: this.getQuantity(),
    })
    this._events.emit(eventsMap.BASKET_CHANGE, {
      purchases: this.getPurchases(),
      totalPrice: this.getTotalPrice(),
      quantity: this.getQuantity(),
    })
  }

  remove(product: IProduct): void {
    this._purchases.delete(product)
    this._events.emit(eventsMap.BASKET_COUNT_CHANGE, {
      quantity: this.getQuantity(),
    })
    this._events.emit(eventsMap.BASKET_CHANGE, {
      purchases: this.getPurchases(),
      totalPrice: this.getTotalPrice(),
      quantity: this.getQuantity(),
    })
  }

  // -----------------------------------

  isInBasket(id: string): boolean {
    return Array.from(this._purchases)
    .some(product => product.id === id)
  }

  clear(): void {
    this._purchases.clear()
    this._events.emit(eventsMap.BASKET_CLEAR)
  }
}