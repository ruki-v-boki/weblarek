import { IProduct } from "../../types"


export class Products {
  private allProducts: IProduct[] = []
  protected selectedProduct: IProduct | null = null

  constructor(){
    this.allProducts = []
    this.selectedProduct = null
  }

// -------------SET-------------------------------------
  setProducts(products: IProduct[]) {
    this.allProducts = products
  }

  setSelectedProduct(product: IProduct) {
    this.selectedProduct = product
  }

// -------------GET-------------------------------------
  getProducts(): IProduct[] {
    return this.allProducts
  }

  getProductById(id: string): IProduct | undefined {
    return this.allProducts.find(product => product.id === id)
  }

  getSelectedProduct(): IProduct {
    if (!this.selectedProduct) {
      throw new Error('Ничего не выбрано')
    }
    return this.selectedProduct as IProduct
  }
}