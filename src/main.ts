import './scss/styles.scss';
import { FormContactsView } from './components/Views/Forms/Child/FormContactsView';
import { CardForPreview } from './components/Views/Card/Child/CardForPreview';
import { eventsMap, categoryMap, API_URL, CDN_URL } from './utils/constants';
import { FormOrderView } from './components/Views/Forms/Child/FormOrdeView'; 
import { CardForCatalog } from './components/Views/Card/Child/CardForCtalog';
import { CardForBasket } from './components/Views/Card/Child/CardForBasket';
import { cloneTemplate, ensureElement, playSound } from './utils/utils';
import { SuccessView } from './components/Views/SuccessView';
import { GalleryView } from './components/Views/GalleryView';
import { BasketView } from './components/Views/BasketView';
import { HeaderView } from './components/Views/HeaderView';
import { ModalView } from './components/Views/ModalView';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/Models/Products';
import { Api, ApiClient } from './components/base/Api';
import { TPayment, IProduct, TOrder } from './types';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';


// ------------ ♫ Sounds:) ♫ -------------

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
const cardForBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket")
// Basket
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket")
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
const basketView = new BasketView(cloneTemplate(basketTemplate), events)
const modalView = new ModalView(modalElement, events)
const galleryView = new GalleryView(galleryElement)
const formOrderView = new FormOrderView(cloneTemplate(formOrderTemplate), events)
const formContactsView = new FormContactsView(cloneTemplate(formContactsTemplate), events)
const successView = new SuccessView(cloneTemplate(successTemplate), events)


// ------------ API ------------

// Получаем от сервера товары и записываем их в модель
apiClient.getAllProducts().then(data => {
  productsModel.setProducts(data)
})
.catch(error => console.error('Ошибка загрузки товаров:', error))


//-------------------------- CARDS ---------------------------------

//СОБЫТИЕ 1) Рисуем карточки, вставляем в галерею
events.on(eventsMap.PRODUCTS_RECEIVED, (products: IProduct[]) => {
  const cards = products.map(product => {
    return new CardForCatalog(
      cloneTemplate(cardForCatalogTemplate),
      events,
      CDN_URL,
      categoryMap
    )
    .render(product)
  })
  galleryView.galleryList = cards
})


//СОБЫТИЕ 2) Клик на карточку из галереи
events.on(eventsMap.PRODUCT_SELECT, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  productsModel.setSelectedProduct(product!) // он точно тут ЕСТЬ
})


//СОБЫТИЕ 3) Рисуем выбранную карточку и открываем модальное окно с превью
events.on(eventsMap.SELECTED_PRODUCT_SET, (product: IProduct) => {
  const card = new CardForPreview(
    cloneTemplate(cardForPreviewTemplate),
    events,
    CDN_URL,
    categoryMap
  )

  if (product.price === null) {
      card.toggleButtonState(false)
      card.buttonText = 'Недоступно'

  } else if (basketModel.isInBasket(product.id)) {
      card.buttonText = 'Удалить из корзины'

  } else card.buttonText = 'Купить'

  const renderedCard = card.render(product)
  modalView.open(renderedCard)
  playSound(soundClick)
})


// СОБЫТИЕ 4) Добавляем/удаляем товар в корзину из превью карточки
events.on(eventsMap.PRODUCT_SUBMIT, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  const productInBasket = basketModel.isInBasket(data.id)

  if (product && !productInBasket) {
      basketModel.addProduct(product)
      modalView.close()
      playSound(soundBasketAdd)

  } else if (product && productInBasket) {
      basketModel.removeProduct(product)
      modalView.close()
      playSound(soundBasketRemove)
  }
})


//-------------------------- BASKET ---------------------------------

// СОБЫТИЕ 5) Товары в корзине изменились
events.on(eventsMap.BASKET_LIST_CHANGE, (data: {
  purchases: IProduct[]
  totalPrice: number
  quantity: number
}) => {
  const renderedCards = data.purchases.map((product, index) => {
    const card = new CardForBasket(cloneTemplate(cardForBasketTemplate), events)
    card.index = index + 1
    return card.render(product)
  })
  headerView.counter = data.quantity
  basketView.basketList = renderedCards
  basketView.totalPrice = data.totalPrice
  basketView.setEmptyMessage(data.quantity > 0)
  basketView.toggleSubmitButton(data.quantity > 0)
})


// СОБЫТИЕ 6) Клик на кнопку корзины в хедере
events.on(eventsMap.BASKET_OPEN, () => {
  const hasProducts = basketModel.getQuantity() !== 0
  const renderedBasket = basketView.render()

  basketView.toggleSubmitButton(hasProducts)
  basketView.setEmptyMessage(hasProducts)

  modalView.open(renderedBasket)
  playSound(soundClick)
})


// СОБЫТИЕ 7) Удалить товар из открытой корзины
events.on(eventsMap.PRODUCT_DELETE, (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  basketModel.removeProduct(product!) // и тут он точно ЕСТЬ
  playSound(soundBasketRemove)
})


// СОБЫТИЕ 8) Клик по кнопке "Оформить" в корзине
events.on(eventsMap.BASKET_PLACE_ORDER, () => {
  modalView.content = formOrderView.render()
  playSound(soundFormSubmit)
})


//-------------------------- FORMS ---------------------------------

// СОБЫТИЕ 9) Клик по кнопкам выбора оплаты
events.on(eventsMap.FORM_PAYMENT_CHANGED, (data: { payment: TPayment }) => {
  buyerModel.payment = data.payment

  if (data.payment === 'online') {
    playSound(soundPaymentOnline)

  } else if (data.payment === 'cash') {
    playSound(soundPaymentCash)
  }
})


// Событие 10) Ввод адреса в инпут
events.on(eventsMap.FORM_ADDRESS_CHANGED, (data: { address: string }) => {
  buyerModel.address = data.address
  playSound(soundKeyboard)
})


// СОБЫТИЕ 11) Клик по кнопке сабмита формы заказа
events.on(eventsMap.FORM_ORDER_SUBMIT, () => {
  modalView.content = formContactsView.render()
  playSound(soundFormSubmit)
})

// -----------------------------------------------------------------

// СОБЫТИЕ 12) Ввод email в инпут
events.on(eventsMap.FORM_EMAIL_CHANGED, (data: { email: string }) => {
  buyerModel.email = data.email
  playSound(soundKeyboard)
})


// СОБЫТИЕ 13) Ввод телефона в инпут
events.on(eventsMap.FORM_PHONE_CHANGED, (data: { phone: string }) => {
  buyerModel.phone = data.phone
  playSound(soundKeyboard)
})


// Событие 14) Данные покупателя в модели изменились
events.on(eventsMap.BUYER_CHANGE, (data: { field: string }) => {
  const errors = buyerModel.validate()
  const selectedPayment = buyerModel.getAllBuyerData().payment

  if (data.field === 'payment' || data.field === 'address') {
    const isValid = formOrderView.checkIsFormValid(errors)
    formOrderView.toggleSubmitButton(isValid)
    formOrderView.toggleErrorClass(!isValid)
    formOrderView.togglePaymentButtonStatus(selectedPayment)

  } else if (data.field === 'email' || data.field === 'phone') {
    const isValid = formContactsView.checkIsFormValid(errors)
    formContactsView.toggleSubmitButton(isValid)
    formContactsView.toggleErrorClass(!isValid)
  }
})


// СОБЫТИЕ 15) Фокус на инпуте
events.on(eventsMap.FORM_INPUT_FOCUS, () => {
  playSound(soundClick)
})


//-------------------------- PLACING ORDER ---------------------------------


// СОБЫТИЕ 16) Клик по кнопке сабмита формы контактов
events.on(eventsMap.FORM_CONTACTS_SUBMIT, () => {
  const buyerData = buyerModel.getAllBuyerData()
  const purchases = basketModel.getPurchases()

  modalView.showLoader()

  const orderData: TOrder = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: basketModel.getTotalPrice(),
    items: purchases.map(product => product.id),
  }
  playSound(soundFormSubmit)

  const timeOut = 1000
  setTimeout(() => {
    apiClient.placeOrder(orderData).then(response => {
      if (response) {
        basketModel.clear()
        buyerModel.clear()
        headerView.counter = basketModel.getQuantity()
        modalView.content = successView.render()
        formOrderView.resetFormState()
        formContactsView.resetFormState()
        successView.totalPrice = response.total
        playSound(soundSuccess)
      }
    })
      .catch(error => console.error('Не удалось разместить заказ: ', error))
  }, timeOut)
})


//-------------------------- SUCCESS ---------------------------------

// СОБЫТИЕ 17) Клик по кнопке "За новыми покупками"
events.on(eventsMap.SUCCESS_CONFIRM, () => {
  modalView.close()
  playSound(soundFormSubmit)
})


//-------------------------- MODAL ---------------------------------

// СОБЫТИЕ 18) Закрываем модальное окно
events.on(eventsMap.MODAL_CLOSE, () => {
  productsModel.clearSelectedProduct()
  modalView.close()
  playSound(soundClose)
})