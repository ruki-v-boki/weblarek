import { IProduct } from "../../types"


export class Basket {
  protected purchases: Set<IProduct> = new Set()

  constructor(){
    this.purchases = new Set()
  }

// -------------GET-------------------------------------
  getPurchases(): IProduct[] {
    return Array.from(this.purchases)
  }

  getTotalPrice(): number {
    let totalPrice = 0

    this.purchases.forEach(product => {
      totalPrice += product.price || 0
    })
    return totalPrice
  }

  getQuantity(): number {
    return this.purchases.size
  }
// -----------------------------------------------------

  addToBasket(product: IProduct) {
    this.purchases.add(product)
  }

  removeFromBasket(product: IProduct) {
    this.purchases.delete(product)
  }

  isInBasketById(id: string): boolean {
    return Array.from(this.purchases)
    .some(product => product.id === id)
  }
}