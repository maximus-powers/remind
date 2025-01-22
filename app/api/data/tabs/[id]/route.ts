import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '167.99.8.156',
  port: 3306,
  user: 'study_bot_frontend',
  password: 'yeahBOI',
  database: 'study_bot',
};

export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/').pop();
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('DELETE FROM tabs WHERE id = ?', [id]);
    await connection.end();
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tab' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/').pop();
    const { name } = await req.json();
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('UPDATE tabs SET name = ? WHERE id = ?', [name, id]);
    await connection.end();
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tab' }, { status: 500 });
  }
}