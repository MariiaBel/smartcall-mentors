import { sql } from '@vercel/postgres';
import { Mentor } from './definitions';

export async function fetchMentors() {
  try {
    const data = await sql<Mentor>`SELECT * FROM mentors`;

    return data.rows;

  } catch(error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch mentors data.');
  }
}
