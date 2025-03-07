import { TMentor } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, params: any) {
  const searchParams = await request.nextUrl.searchParams
  const id = searchParams.get('id')

  try {
    if (id) {
      const data = await sql<TMentor>`
            SELECT *
            FROM mentors
            WHERE mentors.telegram_id = ${id};
          `;

      if (data.rows[0]) {
        return Response.json(data.rows[0])
      } else {
        return Response.json(null)
      }
    } else {
      return Response.json(null);
    }

    // return Response.json({ data })
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch mentor by Id.');
  }
}