import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '167.99.8.156',
  port: 3306,
  user: 'study_bot_frontend',
  password: 'yeahBOI',
  database: 'study_bot',
};

export async function GET() {
  const connection = await mysql.createConnection(dbConfig);
  const [tabs] = await connection.query('SELECT * FROM tabs');
  const tabsWithCards = await Promise.all(
    tabs.map(async (tab: { id: number; name: string }) => {
      const [cards] = await connection.query('SELECT * FROM cards WHERE tab_id = ?', [tab.id]);
      return { ...tab, cards };
    })
  );
  await connection.end();
  return NextResponse.json(tabsWithCards);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const connection = await mysql.createConnection(dbConfig);
  const [result] = await connection.query('INSERT INTO tabs (name) VALUES (?)', [name]);
  await connection.end();
  return NextResponse.json({ id: result.insertId, name, cards: [] });
}