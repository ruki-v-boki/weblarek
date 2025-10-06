import './scss/styles.scss';
import { CardForCatalog } from './components/Views/Card/CardForCtalog';
import { CardForBasket } from './components/Views/Card/CardForBasket';
import { CardForPreview } from './components/Views/Card/CardPreview';
// import { ContactsForm } from './components/Views/Forms/Contacts';
import { cloneTemplate, ensureElement } from './utils/utils';
// import { CardView } from './components/Views/Card/CardView';
// import { OrderForm } from './components/Views/Forms/Order';
import { BasketView } from './components/Views/BasketView';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/Models/Products';
import { Api, ApiClient } from './components/base/Api';
// import { Success } from './components/Views/Success';
import { GalleryView } from './components/Views/GalleryView';
import { Basket } from './components/Models/Basket';
import { HeaderView } from './components/Views/HeaderView';
// import { Buyer } from './components/Models/Buyer';
import { ModalView } from './components/Views/ModalView';
import { eventsMap } from './utils/constants';
import { API_URL } from './utils/constants';
import { IBasketViewData } from './types';
import { IProduct } from './types';
import { OrderForm } from './components/Views/Forms/Order';


// ------------ Templates ------------
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket")
// Forms
// const formOrderTemplate = ensureElement<HTMLTemplateElement>("#order")
// const formContactsTemplate = ensureElement<HTMLTemplateElement>("#contacts")
// const successTemplate = ensureElement<HTMLTemplateElement>("#success")
// Cards
const cardForCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog")
const cardForPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview")
const cardForBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket")


// ------------ Elements ------------
const headerElement = ensureElement<HTMLElement>(".header")
const galleryElement = ensureElement<HTMLElement>(".gallery")
const modalElement = ensureElement<HTMLElement>(".modal")

// const basketElement = cloneTemplate<HTMLTemplateElement>(basketTemplate)
// const formOrderElement = cloneTemplate<HTMLTemplateElement>(formOrderTemplate)
// const formContactsElement = cloneTemplate<HTMLTemplateElement>(formContactsTemplate)
// const successElement = cloneTemplate<HTMLTemplateElement>(successTemplate)


// ------------ Initialization ------------

// Event Broker
const events = new EventEmitter()

// Api
const baseApi = new Api(API_URL)
const apiClient = new ApiClient(baseApi)

// Models
const productsModel = new Products(events)
const basketModel = new Basket(events)
// const buyerModel = new Buyer(events)

// Views
const headerView = new HeaderView(headerElement, events)
const modalView = new ModalView(modalElement, events)
const galleryView = new GalleryView(galleryElement)
// const basketView = new BasketView(basketElement, events);


// Получаем от сервера товары и записываем их в модель
apiClient.getAllProducts().then(data => {
  productsModel.setProducts(data)
})


// ------------ Presenter ------------

//СОБЫТИЕ 1) Рендерим каждую карточку товара в галерею
events.on(eventsMap.PRODUCTS_RECEIVED, (products: IProduct[]) => {
  const productCards = products.map(product =>
    new CardForCatalog(cloneTemplate(cardForCatalogTemplate), events)
    .render(product))
  galleryView.galleryList = productCards
})


//СОБЫТИЕ 2) Пользователь кликает на карточку из галереи
events.on(eventsMap.CARD_SELECT, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  productsModel.setSelectedProduct(product!) // он точно тут ЕСТЬ
})


//СОБЫТИЕ 3) Рисуем выбранную карточку и открываем модальное окно с превью
events.on(eventsMap.SELECTED_PRODUCT_SET, (product: IProduct) => {
  const cardForPreview = new CardForPreview(cloneTemplate(cardForPreviewTemplate), events)

  // ----------- Checks ----------
  if (product.price === null) {
      cardForPreview.toggleOrderButton(false)
      cardForPreview.orderButtonText = 'Недоступно'
  } else if (basketModel.isInBasket(product.id)) {
      cardForPreview.orderButtonText = 'Удалить из корзины'
  } else cardForPreview.orderButtonText = 'Купить'

  // ----------- Render ----------
  modalView.open(cardForPreview.render(product))
})


// СОБЫТИЕ 4) Пользователь закрывает модальное окно
events.on(eventsMap.MODAL_CLOSE, () => {
  modalView.close()
  productsModel.clearSelectedProduct()
})


// СОБЫТИЕ 5) Добавляем/удаляем товар в корзину
events.on(eventsMap.CARD_SUBMIT, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  const productInBasket = basketModel.isInBasket(data.id)

  // ----------- Checks ----------
  if (product && !productInBasket) {
      basketModel.add(product)
      modalView.close()
  } else if (product && productInBasket) {
      basketModel.remove(product)
      modalView.close()
  }
})


// СОБЫТИЕ 6) Меняем счетчик товаров корзины в хедере
events.on(eventsMap.BASKET_COUNT_CHANGE, (data: { quantity: number }) => {
  headerView.counter = data.quantity
})


// СОБЫТИЕ 7) Пользователь кликает на кнопку корзины
events.on(eventsMap.BASKET_OPEN, () => {
  const basketView = renderBasket()
  modalView.open(basketView)
})


// СОБЫТИЕ 8) Пользователь удаляет товар в открытой корзине
events.on(eventsMap.CARD_DELETE, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  basketModel.remove(product!) // тут он точно-точно ЕСТЬ в корзине

  // ----------- Checks ----------
  if (modalView.isOpen()) {
    const basketContent = renderBasket()
    modalView.content = basketContent
  }
})

// СОБЫТИЕ 9) Пользователь кликает кнопку "Оформить"
// events.on(eventsMap.BASKET_SUBMIT, () => {

// })


// ------------ Functions ------------

// ------ Basket

// Получаем данные корзины из модели
function getBasketViewData(): IBasketViewData {
  const purchases = basketModel.getPurchases()
  const totalPrice = basketModel.getTotalPrice()
  const quantity = basketModel.getQuantity()
  const hasProducts = quantity > 0

  return {
    purchases,
    totalPrice,
    quantity,
    hasProducts,
  }
}

// Рисуем карточки для корзины
function renderBasketCards(purchases: IProduct[]): HTMLElement[] {
  return purchases.map((product: IProduct, index: number) => {
    const cardForBasketView = new CardForBasket(cloneTemplate(cardForBasketTemplate), events)
    cardForBasketView.index = index + 1
    return cardForBasketView.render(product)
  })
}

// Конфигурация отображения корзины
function configureBasketView(basketView: BasketView, data: IBasketViewData): void {
  basketView.setEmptyMessage(data.hasProducts!)
  basketView.toggleSubmitButton(data.hasProducts!)
  basketView.setButtonText('Оформить')

  basketView.totalPrice = data.totalPrice
  basketView.basketList = data.hasProducts ? renderBasketCards(data.purchases!) : []
}

// Рисуем корзину
function renderBasket(): HTMLElement {
  const basketView = new BasketView(cloneTemplate(basketTemplate), events)
  const basketViewData = getBasketViewData()
  configureBasketView(basketView, basketViewData)
  return basketView.render()
}