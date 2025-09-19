import { IBuyer, TPayment, IValidationErrors } from "../../types"

export class Buyer {
    constructor(
        private address: string = '',
        private phone: string = '',
        private email: string = '',
        private payment: TPayment = '',
    ) {}

// -------------SET-------------------------
    setBuyerData(data: IBuyer) {
        this.address = data.address
        this.phone = data.phone.trim()
        this.email = data.email.trim()
        this.payment = data.payment
    }

// -------------GET-------------------------
    getBuyerData(): IBuyer {
        return {
            address: this.address,
            phone: this.phone,
            email: this.email,
            payment: this.payment,
        }
    }

// -----------------------------------------
    clear() {
        this.address = '',
        this.phone = '',
        this.email = '',
        this.payment = ''
    }

    validate(): IValidationErrors {
        let errors: IValidationErrors = {};

        // Валидация способа оплаты
        if (!this.payment) { errors.payment = 'Не выбран способ оплаты' }
        else { errors.payment = 'Данные валидны' }

        // Валидация email
        if (!this.email) { errors.email = 'еmail не указан' }
        else { errors.email = 'Данные валидны' }

        // Валидация телефона
        if (!this.phone) { errors.phone = 'Телефон не указан' }
        else { errors.phone = 'Данные валидны' }

        // Валидация адреса
        if (!this.address) { errors.address = 'Адрес не указан' }
        else { errors.address = 'Данные валидны' }

        return errors
    }
}