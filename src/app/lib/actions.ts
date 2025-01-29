'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { signIn } from '@/auth';
// import { AuthError } from 'next-auth';


const FormSchema = z.object({
  id: z.string(),
  telegram_id: z.string(),
  name:  z.string().min(1, { message: "Введите имя." }),
  stack:  z.string().min(1, { message: "Введите стек технологий." }),
  price:  z.string().min(1, { message: "Введите цену или напишите 'по договоренности'." }),
  description: z.string().min(100, { message: "Введите минимум 100 символов о себе. Опишите чем вы можете помочь менти." }),
  date: z.string()
});

const FormSchemaMentors = FormSchema.omit({ id: true, date: true, status: true });

function mentorValidation(formData: FormData) {
  const validatedFields = FormSchemaMentors.safeParse({
    telegram_id: formData.get('telegram_id'),
    name: formData.get('name'),
    stack: formData.get('stack'),
    price: formData.get('price'),
    description: formData.get('description'),
    status: formData.get('status')
  })

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors
    const message = Object.keys(fieldErrors).reduce((acc, fieldKey)=> `${acc} ${fieldErrors[fieldKey]}`, '')

    return {
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Не все поля заполнены.' + message,
    };
  }

  return validatedFields.data
  

}

export async function createMentor(formData: FormData) {
  const validationResult = mentorValidation(formData);
  if(validationResult.status === 'error') return validationResult

  const { telegram_id, name, stack, price, description } = validationResult
  const status =  formData.get('status')
  const date = new Date().toISOString().split('T')[0];

  try {
    const result = await sql`
      INSERT INTO mentors (telegram_id, name, stack, price, description, date, status)
      VALUES (${telegram_id}, ${name}, ${stack}, ${price}, ${description}, ${date}, ${status})
      `;
      
    return { 
      status: 'success', 
      message: 'Поздравляю! Данные успешно сохранены. Вы в списке менторов.'
    }
  } catch (error: Error) {

    return {
      status: 'error',
      message: 'Ментор не создан. Проверте, что вы заполнили все поля корректно.',
      detail: error.detail
    };
  }
  
}

export async function updateMentor(formData: FormData) {

  const validationResult = mentorValidation(formData);
  if(validationResult.status === 'error') return validationResult

  const { telegram_id, name, stack, price, description } = validationResult
  const status =  formData.get('status')

  try {
    await sql`
      UPDATE mentors
      SET name = ${name}, stack =${stack}, price=${price}, description=${description}, status=${status}
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
