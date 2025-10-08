import './scss/styles.scss';
import { FormContactsView } from './components/Views/Forms/FormContactsView';
import { BasketViewPresenter } from './components/Views/BasketPresenter';
import { FormOrderView } from './components/Views/Forms/FormOrdeViewr';
import { CardForCatalog } from './components/Views/Card/CardForCtalog';
import { CardForPreview } from './components/Views/Card/CardPreview';
import { SuccessView } from './components/Views/SuccessView';
import { FormView } from './components/Views/Forms/FormView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { GalleryView } from './components/Views/GalleryView';
import { HeaderView } from './components/Views/HeaderView';
import { ModalView } from './components/Views/ModalView';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/Models/Products';
import { Api, ApiClient } from './components/base/Api';
import { eventsMap, API_URL } from './utils/constants';
import { TPayment, IProduct, TOrder } from './types';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

// ------------- Sounds -------------

const soundClick = ensureElement<HTMLAudioElement>("#soundClick")
const soundClose = ensureElement<HTMLAudioElement>("#soundClose")
const soundBasketAdd = ensureElement<HTMLAudioElement>("#soundAddToBasket")
const soundBasketRemove = ensureElement<HTMLAudioElement>("#soundRemoveFromBasket")
const soundPaymentOnline = ensureElement<HTMLAudioElement>("#soundPaymentOnline")
const soundPaymentCash = ensureElement<HTMLAudioElement>("#soundPaymentCash")
const soundKeyboard = ensureElement<HTMLAudioElement>("#soundKeyboard")
const soundFormSubmit = ensureElement<HTMLAudioElement>("#soundFormSubmit")
const soundSuccess = ensureElement<HTMLAudioElement>("#soundSuccess")


// ------------ Templates ------------

// Cards
const cardForCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog")
const cardForPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview")
export const cardForBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket") // экспорт для презентора корзины
// Basket
export const basketTemplate = ensureElement<HTMLTemplateElement>("#basket") // экспорт для презентора корзины
// Forms
const formOrderTemplate = ensureElement<HTMLTemplateElement>("#order")
const formContactsTemplate = ensureElement<HTMLTemplateElement>("#contacts")
const successTemplate = ensureElement<HTMLTemplateElement>("#success")


// ------------ Elements ------------
const headerElement = ensureElement<HTMLElement>(".header")
const galleryElement = ensureElement<HTMLElement>(".gallery")
const modalElement = ensureElement<HTMLElement>(".modal")


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
const successView = new SuccessView(cloneTemplate(successTemplate), events)

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
events.on(eventsMap.PRODUCT_SELECT, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  productsModel.setSelectedProduct(product!) // он точно тут ЕСТЬ
})


//СОБЫТИЕ 3) Рисуем выбранную карточку и открываем модальное окно с превью
events.on(eventsMap.SELECTED_PRODUCT_SET, (product: IProduct) => {
  const cardForPreview = new CardForPreview(cloneTemplate(cardForPreviewTemplate), events)

  if (product.price === null) {
      cardForPreview.toggleOrderButton(false)
      cardForPreview.orderButtonText = 'Недоступно'
  } else if (basketModel.isInBasket(product.id)) {
      cardForPreview.orderButtonText = 'Удалить из корзины'
  } else cardForPreview.orderButtonText = 'Купить'

  modalView.open(cardForPreview.render(product))
  playSound(soundClick)
})


// СОБЫТИЕ 4) Закрываем модальное окно
events.on(eventsMap.MODAL_CLOSE, () => {
  modalView.close()
  productsModel.clearSelectedProduct()
  buyerModel.clear()
  playSound(soundClose)
})


// СОБЫТИЕ 5) Добавляем/удаляем товар в корзину
events.on(eventsMap.PRODUCT_SUBMIT, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  const productInBasket = basketModel.isInBasket(data.id)

  if (product && !productInBasket) {
      basketModel.add(product)
      playSound(soundBasketAdd)
      modalView.close()
  } else if (product && productInBasket) {
      basketModel.remove(product)
      playSound(soundBasketRemove)
      modalView.close()
  }
})


// СОБЫТИЕ 6) Меняем счетчик товаров корзины в хедере
events.on(eventsMap.BASKET_COUNT_CHANGE, (data: { quantity: number }) => {
  headerView.counter = data.quantity
})


// СОБЫТИЕ 7) Клик на кнопку корзины в хедере
events.on(eventsMap.BASKET_OPEN, () => {
  const basketView = basketViewPresenter.render() // --------------- Новый рендер
  modalView.open(basketView)
  playSound(soundClick)
})


// СОБЫТИЕ 8) Удалить товар из открытой корзины
events.on(eventsMap.PRODUCT_DELETE, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  basketModel.remove(product!)

  if (modalView.isOpen()) {
    const basketContent = basketViewPresenter.render() // ---------- Новый рендер
    modalView.content = basketContent
  }
  playSound(soundBasketRemove)
})


//-------------------------- FORMS ---------------------------------


// СОБЫТИЕ 9) Клик по кнопке "Оформить" в корзине
events.on(eventsMap.BASKET_PLACE_ORDER, () => {
  const formOrderView = new FormOrderView(cloneTemplate(formOrderTemplate), events)
  currentForm.set(formOrderView)

  modalView.content = formOrderView.render()
  playSound(soundFormSubmit)
})


// СОБЫТИЕ 10) Клик по кнопкам выбора оплаты
events.on(eventsMap.FORM_PAYMENT_CHANGED, (data: {
  payment: string,
  button: HTMLButtonElement,
  form: FormOrderView,
  soundId: string
}) => {
  data.form.togglePaymentButtonStatus(data.form['_onlinePayButton'], false)
  data.form.togglePaymentButtonStatus(data.form['_cashPayButton'], false)
  data.form.togglePaymentButtonStatus(data.button, true)

  const currentData = buyerModel.getBuyerData()
  buyerModel.setBuyerData({
    ...currentData,
    payment: data.payment as TPayment
  })

  if (data.soundId === 'paymentOnline') {
    playSound(soundPaymentOnline)
  } else if (data.soundId === 'paymentCash') {
    playSound(soundPaymentCash)
  }
})


// Событие 11) Ввод адреса в инпут
events.on(eventsMap.FORM_ADDRESS_CHANGED, (data: {
  address: string,
  form: FormOrderView
}) => {
  const currentData = buyerModel.getBuyerData()
  buyerModel.setBuyerData({
    ...currentData,
    address: data.address
  })
  playSound(soundKeyboard)
})


// Событие 12) Данные в модели изменились
events.on(eventsMap.BUYER_CHANGE, () => {
  const errors = buyerModel.validate()
  const form = currentForm.get()

  if (form) {
    const canSubmit = form.checkIsFormValid(errors)
    form.toggleSubmitButton(canSubmit)
    form.toggleErrorClass(!canSubmit)
  }
})


// СОБЫТИЕ 13) Клик по кнопке сабмита формы заказа
events.on(eventsMap.FORM_ORDER_SUBMIT, () => {
  const formContactsView = new FormContactsView(cloneTemplate(formContactsTemplate), events)
  currentForm.set(formContactsView)

  modalView.content = formContactsView.render()
  playSound(soundFormSubmit)
})


// СОБЫТИЕ 14) Ввод email в инпут
events.on(eventsMap.FORM_EMAIL_CHANGED, (data: { email: string }) => {
  const currentData = buyerModel.getBuyerData()
  buyerModel.setBuyerData({
    ...currentData,
    email: data.email
  })
  playSound(soundKeyboard)
})


// СОБЫТИЕ 15) Ввод телефона в инпут
events.on(eventsMap.FORM_PHONE_CHANGED, (data: { phone: string }) => {
  const currentData = buyerModel.getBuyerData()
  buyerModel.setBuyerData({
    ...currentData,
    phone: data.phone
  })
  playSound(soundKeyboard)
})


// СОБЫТИЕ 16) Фокус на инпуте
events.on(eventsMap.FORM_INPUT_FOCUS, () => {
  playSound(soundClick)
})


//-------------------------- PLACING ORDER ---------------------------------


// СОБЫТИЕ 17) Клик по кнопке сабмита формы контактов
events.on(eventsMap.FORM_CONTACTS_SUBMIT, () => {
  const buyerData = buyerModel.getBuyerData()
  const purchases = basketModel.getPurchases()

  const orderData: TOrder = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: basketModel.getTotalPrice(),
    items: purchases.map(product => product.id),
  }
  playSound(soundFormSubmit)

  setTimeout(() => {
    apiClient.placeOrder(orderData).then(response => {
      if (response) {
        basketModel.clear()
        buyerModel.clear()
        headerView.counter = basketModel.getQuantity()
        successView.totalPrice = response.total
        modalView.content = successView.render()
        playSound(soundSuccess)
      }
    })
      .catch(error =>
        console.log('Не удалось разместить заказ на сервере: ', error))
  }, 1000)
})


// СОБЫТИЕ 18) Клик по кнопке "За новыми покупками"
events.on(eventsMap.SUCCESS_CONFIRM, () => {
  modalView.close()
  playSound(soundFormSubmit)
})


//------------------------------------------------------------------

const currentForm = {
  current: null as FormView | null,

  set(form: FormView): void {
    this.current = form
  },
  get(): FormView | null {
    return this.current
  },
  clear(): void {
    this.current = null
  }
}

//------------------------------------------------------------------

function playSound(audio: HTMLAudioElement): void {
  if(audio){
    audio.currentTime = 0
    audio.play().catch((e: Error) => console.log('Неудалось воспроизвести', e))
  }
}
