import './scss/styles.scss';
// import { Api, ApiClient } from './components/base/Api'
// import { API_URL } from './utils/constants';
// import { Products } from './components/Models/Products'
// import { Basket } from './components/Models/Basket'
// import { Buyer } from './components/Models/Buyer'
// import { IBuyer, TPayment } from './types';
// import { apiProducts } from './utils/data';

// //Инициализация api
// const baseApi = new Api(API_URL)
// const apiClient = new ApiClient(baseApi)

// //Инициализация моделей
// const productsModel = new Products()
// const basketModel = new Basket()
// const buyerModel = new Buyer()

// //Тестирование методов моделей
// console.log(basketModel.getTotalPrice());
// //-------------------ПОКУПАТЕЛЬ-----------------------
// const testData: IBuyer = {
//   payment: 'online' as TPayment,
//   email: '',
//   phone: '+79991234567',
//   address: '',
// }

// console.group('записываем данные покупателя в модель:')
// buyerModel.setBuyerData(testData)

// console.log(`получаем данные покупателя из модели:`, buyerModel.getBuyerData())
// console.log(`валидируем поля:`, buyerModel.validate())
// console.log(`очищаем поля:`)
// buyerModel.clear()
// console.log(`проверяем очистились ли поля:`, buyerModel.getBuyerData())
// console.groupEnd();

// //Получаем данные с сервера
// apiClient.getAllProducts().then(data => {

// // -------------------ТОВАРЫ-----------------------
//   console.group('записываем товары в модель:')
//   productsModel.setProducts(data)
//   console.log(`получили данные в модель:`, productsModel.getProducts())

//   let selectedProduct = productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390')
//   if (!selectedProduct) { throw new Error('товар не найден') }

//   console.log(`нашли товар по айди, найденный товар:`, selectedProduct)
//   console.log('записываем найденный товар в модель:')
//   productsModel.setSelectedProduct(selectedProduct)
//   console.log(`проверяем записался ли выбранный товар в модели:`, productsModel.getSelectedProduct())
//   console.groupEnd()

// // -------------------КОРЗИНА-----------------------
//   console.group('добавляем товар в корзину:')
//   basketModel.addToBasket(selectedProduct)
//   console.log(`добавился ли он?`, basketModel.isInBasketById('854cef69-976d-4c2a-a18c-2aa45046c390'))
//   console.log(`количество товаров в корзине:`, basketModel.getQuantity())
//   console.log(`полная стоимость товаров в корзине:`, basketModel.getTotalPrice())
//   console.log(`какие товары в корзине:`, basketModel.getPurchases())

//   //выбираем ещё один товар чтобы проверить его удаление из корзины
//   selectedProduct = productsModel.getProductById('b06cde61-912f-4663-9751-09956c0eed67')
//   if (!selectedProduct) { throw new Error('товар не найден') }

//   console.log(`ещё один товар:`, selectedProduct)
//   console.log('добавляем ещё один товар в корзину:')
//   basketModel.addToBasket(selectedProduct)
//   console.log(`добавился ли он?`, basketModel.isInBasketById('54df7dcb-1213-4b3c-ab61-92ed5f845535'))
//   console.log(`Изменилась ли полная стоимость товаров в корзине:`, basketModel.getTotalPrice())
//   console.log(`какие товары в корзине:`, basketModel.getPurchases())
//   console.log('удаляем товар из корзины:')
//   basketModel.removeFromBasket(selectedProduct)
//   console.log(`есть ли теперь он в корзине?`, basketModel.isInBasketById('54df7dcb-1213-4b3c-ab61-92ed5f845535'))
//   console.groupEnd();
// })
// .catch(e => console.error(`ошибка получения товаров:`, e))
