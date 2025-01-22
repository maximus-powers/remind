import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '167.99.8.156',
  port: 3306,
  user: 'study_bot_frontend',
  password: 'yeahBOI',
  database: 'study_bot',
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { id } = req.query;

    if (req.method === 'DELETE') {
      await connection.query('DELETE FROM tabs WHERE id = ?', [id]);
      res.status(204).end();
    } else if (req.method === 'PUT') {
      const { name } = req.body;
      await connection.query('UPDATE tabs SET name = ? WHERE id = ?', [name, id]);
      res.status(200).end();
    } else {
      res.status(405).end();
    }

    await connection.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
};

export default handler;