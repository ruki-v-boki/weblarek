import { eventsMap } from "../../utils/constants";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";


export class Products {
  private _allProducts: IProduct[]
  private _selectedProduct: IProduct | null

  constructor(private _events: IEvents){
    this._allProducts = []
    this._selectedProduct = null
  }

  // -----------------------------------

  setProducts(products: IProduct[]): void {
    this._allProducts = products
    this._events.emit(eventsMap.PRODUCTS_RECEIVED, products)
  }

  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product
    this._events.emit(eventsMap.SELECTED_PRODUCT_SET, product)
  }

  // -----------------------------------

  getAllProducts(): IProduct[] {
    return this._allProducts
  }

  getProductById(id: string): IProduct | undefined {
    return this._allProducts.find(product => product.id === id)
  }

  getSelectedProduct(): IProduct {
    if (!this._selectedProduct) {
      console.log('Ничего не выбрано')
    }
    return this._selectedProduct as IProduct
  }

  // -----------------------------------

  clearSelectedProduct(): void {
    this._selectedProduct = null
  }
}