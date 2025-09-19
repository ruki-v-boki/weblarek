import './scss/styles.scss';
<<<<<<< HEAD
=======
import { Api, ApiClient } from './components/base/Api'
import { Products } from './components/Models/Products'
import { Basket } from './components/Models/Basket'
import { Buyer } from './components/Models/Buyer'
import { TPayment } from './types';

//Инициализация api
const baseUrl = 'https://larek-api.nomoreparties.co/api/weblarek'
const baseApi = new Api(baseUrl)
const apiClient = new ApiClient(baseApi)

//Инициализация моделей
const productsModel = new Products()
const basketModel = new Basket()
const buyerModel = new Buyer()

//Тестирование методов моделей

//-------------------ПОКУПАТЕЛЬ-----------------------
    const testData = {
    payment: 'online' as TPayment,
    email: '',
    phone: '+79991234567',
    address: '',
    }

    console.log('записываем данные покупателя в модель:')
    buyerModel.setBuyerData(testData)

    console.log(`получаем данные покупателя из модели:`, buyerModel.getBuyerData())
    console.log(`валидируем поля:`, buyerModel.validate())
    console.log(`очищаем поля:`)
    buyerModel.clear()
    console.log(`проверяем очистились ли поля:`,buyerModel.getBuyerData())


//Получаем данные с сервера
apiClient.getAllProducts().then(data => {

// -------------------ТОВАРЫ-----------------------
    console.log('записываем товары в модель:')
    productsModel.setProducts(data)
    console.log(`получили данные в модель:`, productsModel.getProducts())

    let selectedProduct = productsModel.getProductById('f3867296-45c7-4603-bd34-29cea3a061d5')

    console.log(`нашли товар по айди, найденный товар:`, selectedProduct)
    console.log('записываем найденный товар в модель:')
    if (selectedProduct) productsModel.setSelectedProduct(selectedProduct)
    console.log(`проверяем записался ли выбранный товар в модели:`, productsModel.getSelectedProduct())

// -------------------КОРЗИНА-----------------------
    console.log('добавляем товар в корзину:')
    if (selectedProduct) basketModel.addToBasket(selectedProduct)
    console.log(`добавился ли он?`, basketModel.isInBasketById('f3867296-45c7-4603-bd34-29cea3a061d5'))
    console.log(`количество товаров в корзине:`, basketModel.getQuantity())
    console.log(`полная стоимость товаров в корзине:`, basketModel.getTotalPrice())
    console.log(`какие товары в корзине:`, basketModel.getPurchases())

    //выбираем ещё один товар чтобы проверить его удаление из корзины
    let anotherProduct = productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390')

    console.log(`ещё один товар:`, anotherProduct)
    console.log('добавляем ещё один товар в корзину:')
    if (anotherProduct) basketModel.addToBasket(anotherProduct)
    console.log(`добавился ли он?`, basketModel.isInBasketById('854cef69-976d-4c2a-a18c-2aa45046c390'))
    console.log(`Изменилась ли полная стоимость товаров в корзине:`, basketModel.getTotalPrice())
    console.log(`какие товары в корзине:`, basketModel.getPurchases())
    console.log('удаляем товар из корзины:')
    if (anotherProduct) basketModel.removeFromBasket(anotherProduct)
    console.log(`есть ли теперь он в корзине?`, basketModel.isInBasketById('854cef69-976d-4c2a-a18c-2aa45046c390'))
})
.catch(e => console.error(`ошибка получения товаров:`, e))



>>>>>>> master
