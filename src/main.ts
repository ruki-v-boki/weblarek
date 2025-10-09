import './scss/styles.scss';
import { FormContactsView } from './components/Views/Forms/FormContactsView';
import { BasketViewPresenter } from './components/Presenters/BasketPresenter';
import { cloneTemplate, ensureElement, playSound } from './utils/utils';
import { FormOrderView } from './components/Views/Forms/FormOrdeViewr';
import { CardForCatalog } from './components/Views/Card/CardForCtalog';
import { CardForPreview } from './components/Views/Card/CardPreview';
import { SuccessView } from './components/Views/SuccessView';
import { FormView } from './components/Views/Forms/FormView';
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
export const cardForBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket") // экспорт для презентера корзины
// Basket
export const basketTemplate = ensureElement<HTMLTemplateElement>("#basket") // экспорт для презентера корзины
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


// ------------ API ------------

// Получаем от сервера товары и записываем их в модель
apiClient.getAllProducts().then(data => {
  productsModel.setProducts(data)
})
.catch(error => console.error('Ошибка загрузки товаров:', error))


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


// СОБЫТИЕ 4) Добавляем/удаляем товар в корзину из карточки
events.on(eventsMap.PRODUCT_SUBMIT, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  const productInBasket = basketModel.isInBasket(data.id)

  if (product && !productInBasket) {
      basketModel.addProduct(product)
      playSound(soundBasketAdd)
      modalView.close()
  } else if (product && productInBasket) {
      basketModel.removeProduct(product)
      playSound(soundBasketRemove)
      modalView.close()
  }
})


//-------------------------- BASKET ---------------------------------

// СОБЫТИЕ 5) Меняем счетчик товаров корзины в хедере
events.on(eventsMap.BASKET_COUNT_CHANGE, (data: { quantity: number }) => {
  headerView.counter = data.quantity
})


// СОБЫТИЕ 6) Клик на кнопку корзины в хедере
events.on(eventsMap.BASKET_OPEN, () => {
  const basketView = basketViewPresenter.render()
  modalView.open(basketView)
  playSound(soundClick)
})


// СОБЫТИЕ 7) Удалить товар из открытой корзины
events.on(eventsMap.PRODUCT_DELETE, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  basketModel.removeProduct(product!)

  if (modalView.isOpen()) {
    const basketContent = basketViewPresenter.render()
    modalView.content = basketContent
  }
  playSound(soundBasketRemove)
})


// СОБЫТИЕ 8) Клик по кнопке "Оформить" в корзине
events.on(eventsMap.BASKET_PLACE_ORDER, () => {
  const formOrderView = new FormOrderView(cloneTemplate(formOrderTemplate), events)
  currentForm.set(formOrderView)

  modalView.content = formOrderView.render()
  playSound(soundFormSubmit)
})


//-------------------------- FORMS ---------------------------------

// Позволяет обращаться к нужной форме
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

// ------------ FORM ORDER ------------

// СОБЫТИЕ 9) Клик по кнопкам выбора оплаты
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


// Событие 10) Ввод адреса в инпут
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


// СОБЫТИЕ 11) Клик по кнопке сабмита формы заказа
events.on(eventsMap.FORM_ORDER_SUBMIT, () => {
  const formContactsView = new FormContactsView(cloneTemplate(formContactsTemplate), events)
  currentForm.set(formContactsView)

  modalView.content = formContactsView.render()
  playSound(soundFormSubmit)
})


// ------------ FORM CONTACTS ------------

// СОБЫТИЕ 12) Ввод email в инпут
events.on(eventsMap.FORM_EMAIL_CHANGED, (data: { email: string }) => {
  const currentData = buyerModel.getBuyerData()
  buyerModel.setBuyerData({
    ...currentData,
    email: data.email
  })
  playSound(soundKeyboard)
})


// СОБЫТИЕ 13) Ввод телефона в инпут
events.on(eventsMap.FORM_PHONE_CHANGED, (data: { phone: string }) => {
  const currentData = buyerModel.getBuyerData()
  buyerModel.setBuyerData({
    ...currentData,
    phone: data.phone
  })
  playSound(soundKeyboard)
})


// Событие 14) Данные в модели изменились
events.on(eventsMap.BUYER_CHANGE, () => {
  const errors = buyerModel.validate()
  const form = currentForm.get()

  if (form) {
    const canSubmit = form.checkIsFormValid(errors)
    form.toggleSubmitButton(canSubmit)
    form.toggleErrorClass(!canSubmit)
  }
})


// СОБЫТИЕ 15) Фокус на инпуте
events.on(eventsMap.FORM_INPUT_FOCUS, () => {
  playSound(soundClick)
})


//-------------------------- PLACING ORDER ---------------------------------


// СОБЫТИЕ 16) Клик по кнопке сабмита формы контактов
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
        // buyerModel.clear() // Данные пользователя и так очищаются при каждом закрытии модального окна
        headerView.counter = basketModel.getQuantity()
        successView.totalPrice = response.total
        modalView.content = successView.render()
        playSound(soundSuccess)
      }
    })
      .catch(error => console.error('Не удалось разместить заказ: ', error))
  }, 1000)
})


//-------------------------- SUCCESS ---------------------------------

// СОБЫТИЕ 17) Клик по кнопке "За новыми покупками"
events.on(eventsMap.SUCCESS_CONFIRM, () => {
  modalView.close()
  currentForm.clear()
  playSound(soundFormSubmit)
})


//-------------------------- MODAL ---------------------------------

// СОБЫТИЕ 18) Закрываем модальное окно
events.on(eventsMap.MODAL_CLOSE, () => {
  productsModel.clearSelectedProduct()
  buyerModel.clear()
  modalView.close()
  playSound(soundClose)
})
