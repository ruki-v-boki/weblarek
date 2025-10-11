import { IBasketViewData, IBasketViewPresenter, IProduct } from "../../types";
import { CardForBasket } from "../Views/Card/Child/CardForBasket";
import { cloneTemplate } from "../../utils/utils";
import { BasketView } from "../Views/BasketView";
import { basketTemplate } from "../../main";
import { Basket } from "../Models/Basket";
import { IEvents } from "../base/Events";


export class BasketViewPresenter implements IBasketViewPresenter {
  constructor(
    private _basketModel: Basket,
    private _cardTemplate: HTMLTemplateElement,
    private _events: IEvents
  ) {}

  getViewData(): IBasketViewData {
    const purchases = this._basketModel.getPurchases()
    const totalPrice = this._basketModel.getTotalPrice()
    const quantity = this._basketModel.getQuantity()
    const hasProducts = quantity > 0

    return {
      purchases,
      totalPrice,
      quantity,
      hasProducts,
    }
  }

  renderCards(items: IProduct[]): HTMLElement[] {
    return items.map((product: IProduct, index: number) => {
      const cardForBasketView = new CardForBasket(
        cloneTemplate(this._cardTemplate), this._events)
      cardForBasketView.index = index + 1
      return cardForBasketView.render(product)
    })
  }

  render(): HTMLElement {
    const basketView = new BasketView(cloneTemplate(basketTemplate), this._events)
    const viewData = this.getViewData()

    basketView.setEmptyMessage(viewData.hasProducts!)
    basketView.toggleSubmitButton(viewData.hasProducts!)
    basketView.setButtonText('Оформить')
    basketView.totalPrice = viewData.totalPrice

    if (viewData.hasProducts && viewData.purchases) {
      basketView.basketList = this.renderCards(viewData.purchases)
    } else {
      basketView.basketList = []
    }
    return basketView.render()
  }
}