export type TMentor = {
  id: string,
  telegram_id: string,
  name: string,
  stack: string,
  price: string,
  description: string,
  date: Date,
  status: EStatusMentor | null,
}

export enum EStatusMentor {
  hidden = 'hidden'
}
