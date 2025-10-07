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

export const eventsMap = {
  // Products events
  PRODUCTS_RECEIVED: 'products:received',
  CARD_SELECT: 'card:select',
  CARD_SUBMIT: 'card:submit',
  CARD_DELETE: 'card:delete',
  SELECTED_PRODUCT_SET: 'selected:product:changed',
  SELECTED_PRODUCT_CLEAR: 'selected:product:clear',

  //Basket events
  BASKET_OPEN: 'basket:open',
  BASKET_PLACE_ORDER: 'basket:place:order',
  BASKET_CHANGE: 'basket:change',
  BASKET_COUNT_CHANGE: 'basket:change',
  BASKET_CLEAR: 'basket:clear',

  // OrderForm events
  PAYMENT_CHANGED: 'payment:changed',
  ADDRESS_CHANGED: 'address:changed',
  ORDER_SUBMIT: 'order:submit',

  // ContactsForm events
  EMAIL_CHANGED: 'email:changed',
  PHONE_CHANGED: 'phone:changed',
  CONTACTS_SUBMIT: 'contacts:submit',

  //Buyer events
  BUYER_CHANGE: 'buyer:change',
  BUYER_CLEAR: 'buyer:clear',
  BUYER_VALIDATE: 'buyer:validate',

  //Success events
  SUCCESS_CONFIRM: 'success:confirm',

  //Modal events
  MODAL_CLOSE: 'modal:close',
};



export const settings = {

};
