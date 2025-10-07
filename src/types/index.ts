
// ------------ INTERFACE ------------
// ------ Api ------
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiResponse<T> {
  total: number;
  items: T[];
}


// ------ Model ------
export interface IProduct {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image?: string;
  category?: string;
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


// ------ View ------
export interface IHeaderData {
  counter: number
}

export interface IBasketViewData {
  totalPrice: number
  purchases: IProduct[]
  quantity: number
  hasProducts: boolean
}

export interface IGalleryData {
  galleryList: HTMLElement[]
}

export interface IModalData {
  content: HTMLElement
}

export interface ISuccessData {
  totalPrice: number
}

export interface IFormErrorData {
  error: string
}

// ----------------------------------
export interface IBasketViewPresenter {
  render(): HTMLElement
}
// ----------------------------------


// ------------ TYPE ------------
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'online' | 'cash' | '';
export type TProductsResponse = IApiResponse<IProduct>

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

