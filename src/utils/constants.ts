/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 

/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

export const settings = {

};

export const classMap = {
  headerBasket: '.header__basket',
  headerBasketCounter: '.header__basket-counter',
  modalClose: '.modal__close',
  modalContent: '.modal__content',
  modalActive: '.modal_active',
  SuccesstotalPrice: '.order-success__description',
  SuccessConfirmButton: '.order-success__close',
  basketList: '.basket__list',
  basketButton: '.basket__button',
  basketPrice: '.basket__price',
  basketItemIndex: '.basket__item-index',
  basketDeleteButton: '.basket__item-delete',
  paymentActiveButton: 'button_alt-active',
  cardTitle: '.card__title',
  cardPrice: '.card__price',
  cardImage: '.card__image',
  cardCategory: '.card__category',
  cardDescription: '.card__text',
  cardButton: '.card__button',
}
