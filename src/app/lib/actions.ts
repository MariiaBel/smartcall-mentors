'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TValidationFieldErrors } from './definitions';
// import { signIn } from '@/auth';
// import { AuthError } from 'next-auth';


const FormSchema = z.object({
  username: z.string(),
  date: z.string(),
  telegram_id: z.string(),
  status: z.string(),

  name: z.string().min(3, { message: "Введите имя. Минимум 3 символа." }),
  stack: z.string().min(2, { message: "Введите стек технологий. Минимум 2 символа" }),
  price: z.string().min(1, { message: "Введите цену или напишите 'по договоренности'." }),
  description: z.string().min(100, { message: "Введите минимум 100 символов о себе. Опишите чем вы можете помочь менти." }),
});

const FormSchemaMentors = FormSchema.omit({ date: true, status: true, username: true, telegram_id: true });

function mentorValidation(formData: FormData) {
  const validatedFields = FormSchemaMentors.safeParse({
    name: formData.get('name'),
    stack: formData.get('stack'),
    price: formData.get('price'),
    description: formData.get('description'),
  })

  if (!validatedFields.success) {
    const fieldErrors: TValidationFieldErrors = validatedFields.error.flatten().fieldErrors
    let message = ''
    for (let key in fieldErrors) {
      message += ` ${key}`
    }
    // const message = Object.keys(fieldErrors).reduce((acc, fieldKey) => `${acc} ${fieldErrors[fieldKey]}`, '')

    return {
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Не все поля заполнены.' + message,
    };
  }

  return validatedFields.data
}

export async function createMentor(formData: FormData) {
  const validationResult = doValidation(formData)
  if (validationResult.status !== 'success') return validationResult

  const { name, stack, price, description } = validationResult
  const status = formData.get('status') as string
  const username = formData.get('username') as string
  const telegram_id = formData.get('telegram_id') as string
  const date = new Date().toISOString().split('T')[0];


  try {
    await sql`
      INSERT INTO mentors (telegram_id, username, name, stack, price, description, date, status)
      VALUES (${telegram_id}, ${username}, ${name}, ${stack}, ${price}, ${description}, ${date}, ${status})
    `;

    return {
      status: 'success',
      message: 'Поздравляю! Данные успешно сохранены. Вы в списке менторов.'
    }
  } catch (error: any) {

    return {
      status: 'error',
      message: 'Ментор не создан. Проверте, что вы заполнили все поля корректно.',
      detail: error.detail
    };
  }

}

export async function updateMentor(formData: FormData) {

  const validationResult = doValidation(formData)
  if (validationResult.status !== 'success') return validationResult

  const { name, stack, price, description } = validationResult
  const status = formData.get('status')
  const username = formData.get('username')
  const telegram_id = formData.get('telegram_id')

  try {
    await sql`
      UPDATE mentors
      SET name = ${name}, stack =${stack}, price=${price}, description=${description}, status=${status}, username=${username}
      WHERE telegram_id = ${telegram_id}
    `
    return {
      status: 'success',
      message: 'Поздравляю! Данные успешно обновлены.'
    }
  } catch (error: Error) {
    return {
      status: 'error',
      message: 'Не получилось обновить данные ментора.',
      detail: error.detail
    };
  }
  // revalidatePath('/mentor');
  // redirect('/mentor');
}


function doValidation(formData: FormData) {
  const validationResult = mentorValidation(formData);

  if ('status' in validationResult && validationResult.status === 'error') return validationResult

  if (!('name' in validationResult) || !('stack' in validationResult) && !('price' in validationResult) && !('description' in validationResult)) {
    return {
      status: 'error',
      message: 'Ошибка при записи ментора. Обратитесь в поддержку.',
    }
  }

  return {
    status: 'success',
    ...validationResult
  }
}