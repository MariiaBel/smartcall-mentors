export type TMentor = {
  id: string,
  username: string,
  telegram_id: string,
  name: string,
  stack: string,
  price: string,
  description: string,
  date: Date,
  status: EStatusMentor | null,
}

export type TValidationFieldErrors = {
  name?: string[];
  stack?: string[];
  price?: string[];
  description?: string[];
}

export enum EStatusMentor {
  hidden = 'hidden'
}
