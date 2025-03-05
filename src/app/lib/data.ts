import { sql } from '@vercel/postgres';
import { Mentor } from './definitions';
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchMentors(): Promise<Mentor[] | undefined> {
  try {
    const data = await sql<Mentor[]>`SELECT * FROM mentors`;
    // console.log(data.rows)
    return data.rows;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch mentors data.');
  }
}

export async function fetchMentor(userId: string): Promise<Mentor | undefined> {
  try {
    const response = await fetch(`/api/mentor/?id=${userId}`);
    const data = await response.json();
    return data
  } catch (error) {
    console.error('Request mentor Error:', error);
    throw new Error('Failed to fetch mentor data.');
  }
}