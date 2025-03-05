import { Mentor } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, params: any) {
  try {
    const searchParams = request.nextUrl.searchParams

    if (searchParams.get('id')) {
      const data = await sql<Mentor>`
            SELECT name, stack, price, description, date, status
            FROM mentors
            WHERE mentors.telegram_id = ${searchParams.get('id')};
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