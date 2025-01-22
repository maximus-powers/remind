import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

const dbConfig = {
  host: '167.99.8.156',
  port: 3306,
  user: 'study_bot_frontend',
  password: 'yeahBOI',
  database: 'study_bot',
};

export async function getAllTabsAndCards() {
  const connection = await mysql.createConnection(dbConfig);
  const [tabs] = await connection.query<RowDataPacket[]>('SELECT * FROM tabs');
  const tabsWithCards = await Promise.all(
    (tabs as { id: number; name: string }[]).map(async (tab) => {
      const [cards] = await connection.query<RowDataPacket[]>('SELECT * FROM cards WHERE tab_id = ?', [tab.id]);
      return { ...tab, cards };
    })
  );
  await connection.end();
  return tabsWithCards;
}

export async function addNewTab(name: string) {
  const connection = await mysql.createConnection(dbConfig);
  const [result] = await connection.query<ResultSetHeader>('INSERT INTO tabs (name) VALUES (?)', [name]);
  await connection.end();
  return { id: result.insertId, name, cards: [] };
}

export async function deleteTabById(id: string) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('DELETE FROM tabs WHERE id = ?', [id]);
  await connection.end();
}

export async function updateTabNameById(id: string, name: string) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('UPDATE tabs SET name = ? WHERE id = ?', [name, id]);
  await connection.end();
}

export async function addNewCard(title: string, text: string, tabId: number) {
  const connection = await mysql.createConnection(dbConfig);
  const [result] = await connection.query<ResultSetHeader>('INSERT INTO cards (title, text, tab_id) VALUES (?, ?, ?)', [title, text, tabId]);
  await connection.end();
  return { id: result.insertId, title, text };
}

export async function deleteCardById(id: string) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('DELETE FROM cards WHERE id = ?', [id]);
  await connection.end();
}

export async function updateCardContentById(id: string, title: string, text: string) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('UPDATE cards SET title = ?, text = ? WHERE id = ?', [title, text, id]);
  await connection.end();
}

export async function getTabsWithOldestAverageLastIncluded() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query<RowDataPacket[]>(`
    SELECT tab_id
    FROM cards
    GROUP BY tab_id
    ORDER BY AVG(last_included) ASC
    LIMIT 3
  `);
  await connection.end();
  return rows.map(row => row.tab_id);
}

export async function getOldestCardsByTab(tabIds: number[]) {
  const connection = await mysql.createConnection(dbConfig);
  const cardsByTab = await Promise.all(
    tabIds.map(async (tabId) => {
      const [cards] = await connection.query<RowDataPacket[]>(`
        SELECT * FROM cards
        WHERE tab_id = ?
        ORDER BY last_included ASC
        LIMIT 25
      `, [tabId]);
      return { tabId, cards };
    })
  );
  await connection.end();
  return cardsByTab;
}
