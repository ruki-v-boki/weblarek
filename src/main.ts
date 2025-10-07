import './scss/styles.scss';
import { BasketViewPresenter } from './components/Views/BasketPresenter';
import { CardForCatalog } from './components/Views/Card/CardForCtalog';
// import { CardForBasket } from './components/Views/Card/CardForBasket';
import { CardForPreview } from './components/Views/Card/CardPreview';
// import { ContactsForm } from './components/Views/Forms/Contacts';
import { FormView } from './components/Views/Forms/FormView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { GalleryView } from './components/Views/GalleryView';
import { HeaderView } from './components/Views/HeaderView';
// import { BasketView } from './components/Views/BasketView';
import { OrderForm } from './components/Views/Forms/Order';
import { ModalView } from './components/Views/ModalView';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/Models/Products';
import { Api, ApiClient } from './components/base/Api';
import { eventsMap, API_URL } from './utils/constants';
// import { Success } from './components/Views/Success';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { TPayment, IProduct } from './types';


// ------------ Templates ------------
// Cards
const cardForCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog")
const cardForPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview")
export const cardForBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket") // экспорт для презентора корзины

// Basket
export const basketTemplate = ensureElement<HTMLTemplateElement>("#basket") // экспорт для презентора корзины

// Forms
const formOrderTemplate = ensureElement<HTMLTemplateElement>("#order")
// const formContactsTemplate = ensureElement<HTMLTemplateElement>("#contacts")
// const successTemplate = ensureElement<HTMLTemplateElement>("#success")


// ------------ Elements ------------
const headerElement = ensureElement<HTMLElement>(".header")
const galleryElement = ensureElement<HTMLElement>(".gallery")
const modalElement = ensureElement<HTMLElement>(".modal")
// const successElement = cloneTemplate<HTMLTemplateElement>(successTemplate)


// ------------ Initialization ------------

// Event Broker
export const events = new EventEmitter()

// Api
const baseApi = new Api(API_URL)
const apiClient = new ApiClient(baseApi)

// Models
const productsModel = new Products(events)
const basketModel = new Basket(events)
const buyerModel = new Buyer(events)

// Views
const headerView = new HeaderView(headerElement, events)
const modalView = new ModalView(modalElement, events)
const galleryView = new GalleryView(galleryElement)

// Presenter
const basketViewPresenter = new BasketViewPresenter(basketModel, cardForBasketTemplate, events)

// ----------------------------------------


// Получаем от сервера товары и записываем их в модель
apiClient.getAllProducts().then(data => {
  productsModel.setProducts(data)
})


//-------------------------- CARDS ---------------------------------

//СОБЫТИЕ 1) Рендерим каждую карточку товара в галерею
events.on(eventsMap.PRODUCTS_RECEIVED, (products: IProduct[]) => {
  const productCards = products.map(product =>
    new CardForCatalog(cloneTemplate(cardForCatalogTemplate), events)
    .render(product))
  galleryView.galleryList = productCards
})


//СОБЫТИЕ 2) Клик на карточку из галереи
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


// СОБЫТИЕ 4) Закрываем модальное окно
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


// СОБЫТИЕ 7) Клик на кнопку корзины
events.on(eventsMap.BASKET_OPEN, () => {
  const basketView = basketViewPresenter.render() // --------------- Новый рендер
  modalView.open(basketView)
});


// СОБЫТИЕ 8) Удалить товар из открытой корзины
events.on(eventsMap.CARD_DELETE, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  basketModel.remove(product!)

  // ----------- Checks ----------
  if (modalView.isOpen()) {
    const basketContent = basketViewPresenter.render() // ---------- Новый рендер
    modalView.content = basketContent
  }
})


//-------------------------- FORMS ---------------------------------


// СОБЫТИЕ 9) Клик по кнопке "Оформить"
events.on(eventsMap.BASKET_PLACE_ORDER, () => {
  const orderFormView = new OrderForm(cloneTemplate(formOrderTemplate), events)
  formManager.setCurrentForm(orderFormView)

  modalView.content = orderFormView.render()
  orderFormView.focusAddress()
})


// СОБЫТИЕ 10) Клик по кнопкам выбора оплаты
events.on(eventsMap.PAYMENT_CHANGED, (data: {
  payment: string,
  button: HTMLButtonElement,
  form: OrderForm
}) => {
  data.form.togglePaymentButtonStatus(data.form['_onlinePayButton'], false)
  data.form.togglePaymentButtonStatus(data.form['_cashPayButton'], false)
  data.form.togglePaymentButtonStatus(data.button, true)

  const currentData = buyerModel.getBuyerData()
  buyerModel.setBuyerData({
    ...currentData,
    payment: data.payment as TPayment
  })
})


// Событие 11) Ввод адреса в инпут
events.on(eventsMap.ADDRESS_CHANGED, (data: {
  address: string,
  form: OrderForm
}) => {
  const currentData = buyerModel.getBuyerData()
  buyerModel.setBuyerData({
    ...currentData,
    address: data.address
  })
})


// Событие 12) Данные в модели изменились
events.on(eventsMap.BUYER_CHANGE, () => {
  const errors = buyerModel.validate()
  const currentForm = formManager.getCurrentForm()
  
  if (currentForm) {
    const canSubmit = currentForm.checkIsFormValid(errors)
    currentForm.toggleSubmitButton(canSubmit)
  }
})

//------------------------------------------------------------------

const formManager = {
  current: null as FormView | null,

  setCurrentForm(form: FormView) {
    this.current = form;
  },
  getCurrentForm(): FormView | null {
    return this.current;
  },
  clearCurrentForm() {
    this.current = null;
  }
}