import { IEvents } from "../base/Events";
import { IProduct } from "../../types"
import { eventsMap } from "../../utils/constants";


export class Products {
  private _allProducts: IProduct[];
  private _selectedProduct: IProduct | null;

  constructor(private _events: IEvents){
    this._allProducts = [];
    this._selectedProduct = null;
  }

// ------------SET------------
  setProducts(products: IProduct[]) {
    this._allProducts = products
    this._events.emit(eventsMap.PRODUCTS_RECEIVED,
      { products: this._allProducts })
  }

  setSelectedProduct(product: IProduct) {
    this._selectedProduct = product
    this._events.emit(eventsMap.PRODUCT_SELECT,
      { selectedProduct: this._selectedProduct })
  }

// ------------GET------------
  getAllProducts(): IProduct[] {
    return this._allProducts
  }

  getProductById(id: string): IProduct | undefined {
    return this._allProducts.find(product => product.id === id)
  }

  getSelectedProduct(): IProduct {
    if (!this._selectedProduct) {
      throw new Error('Ничего не выбрано')
    }
    return this._selectedProduct as IProduct
  }
}