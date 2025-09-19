
// -------------INTERFACE----------------------------------
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiResponse<T> {
    total: number;
    items: T[];
}

export interface IProduct {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IValidationErrors {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}

// -------------TYPE-----------------------------------------
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'online' | 'cash' | '';

export type TOrder = {
    payment: TPayment,
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[],
}

export type TOrderResponse = {
    id: string;
    total: number;
}

export type IProductsResponse = IApiResponse<IProduct>
export type IOrdersResponse = IApiResponse<TOrder>

