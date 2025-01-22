import { NextRequest, NextResponse } from 'next/server';
import mysql, { ResultSetHeader } from 'mysql2/promise';

const dbConfig = {
  host: '167.99.8.156',
  port: 3306,
  user: 'study_bot_frontend',
  password: 'yeahBOI',
  database: 'study_bot',
};

export async function POST(req: NextRequest) {
  const { title, text, tabId } = await req.json();
  const connection = await mysql.createConnection(dbConfig);
  const [result] = await connection.query<ResultSetHeader>('INSERT INTO cards (title, text, tab_id) VALUES (?, ?, ?)', [title, text, tabId]);
  await connection.end();
  return NextResponse.json({ id: result.insertId, title, text });
}