import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 2000,
};

export async function getAllTabsAndCards(userEmail: string) {
  const connection = await mysql.createConnection(dbConfig);
  const [tabs] = await connection.query<RowDataPacket[]>(
    `
    SELECT tabs.id, tabs.name
    FROM tabs
    JOIN users ON tabs.user_id = users.id
    WHERE users.email = ?
  `,
    [userEmail]
  );
  const tabsWithCards = await Promise.all(
    (tabs as { id: number; name: string }[]).map(async (tab) => {
      const [cards] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM cards WHERE tab_id = ?',
        [tab.id]
      );
      return { ...tab, cards };
    })
  );
  await connection.end();
  return tabsWithCards;
}

export async function addNewTab(name: string, userEmail: string) {
  const connection = await mysql.createConnection(dbConfig);
  const [result] = await connection.query<ResultSetHeader>(
    `
    INSERT INTO tabs (name, user_id)
    SELECT ?, id FROM users WHERE email = ?
  `,
    [name, userEmail]
  );
  await connection.end();
  return { id: result.insertId, name, cards: [] };
}

export async function deleteTabById(id: number) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('DELETE FROM tabs WHERE id = ?', [id]);
  await connection.end();
}

export async function updateTabNameById(id: number, name: string) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('UPDATE tabs SET name = ? WHERE id = ?', [name, id]);
  await connection.end();
}

export async function addNewCard(
  title: string,
  text: string,
  tabId: number,
  userEmail: string
) {
  const connection = await mysql.createConnection(dbConfig);
  const [result] = await connection.query<ResultSetHeader>(
    `
    INSERT INTO cards (title, text, tab_id, user_id)
    SELECT ?, ?, ?, id FROM users WHERE email = ?
  `,
    [title, text, tabId, userEmail]
  );
  await connection.end();
  return { id: result.insertId, title, text };
}

export async function deleteCardById(id: number) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('DELETE FROM cards WHERE id = ?', [id]);
  await connection.end();
}

export async function updateCardContentById(
  id: number,
  title: string,
  text: string
) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('UPDATE cards SET title = ?, text = ? WHERE id = ?', [
    title,
    text,
    id,
  ]);
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
  return rows.map((row) => row.tab_id);
}

export async function getOldestCardsByTab(tabIds: number[]) {
  const connection = await mysql.createConnection(dbConfig);
  const cardsByTab = await Promise.all(
    tabIds.map(async (tabId) => {
      const [cards] = await connection.query<RowDataPacket[]>(
        `
        SELECT * FROM cards
        WHERE tab_id = ?
        ORDER BY last_included ASC
        LIMIT 25
      `,
        [tabId]
      );
      return { tabId, cards };
    })
  );
  await connection.end();
  return cardsByTab;
}

export async function getTabNameFromID(id: number) {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query<RowDataPacket[]>(
    `
    SELECT *
    FROM tabs
    WHERE id = ?
  `,
    [id]
  );
  await connection.end();
  return rows[0];
}

export async function updateAudioUrlInDatabase(
  rowId: number,
  field: string,
  fileId: string
) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query(`UPDATE audio SET ${field} = ? WHERE id = ?`, [
    fileId,
    rowId,
  ]);
  await connection.end();
}

export async function createNewAudioRow(userEmail: string) {
  const connection = await mysql.createConnection(dbConfig);
  const [result] = await connection.query<ResultSetHeader>(
    `
    INSERT INTO audio (was_played, intro, section1, section2, section3, conclusion, script, user_id)
    SELECT 0, NULL, NULL, NULL, NULL, NULL, NULL, id FROM users WHERE email = ?
  `,
    [userEmail]
  );
  await connection.end();
  return result.insertId;
}

export async function updateLastIncludedDate(cardId: number) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query(
    'UPDATE cards SET last_included = NOW() WHERE id = ?',
    [cardId]
  );
  await connection.end();
}

export async function getAudioUrlsFromDatabase(userEmail: string) {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query<RowDataPacket[]>(
    `
    SELECT section1, section2, section3
    FROM audio
    JOIN users ON audio.user_id = users.id
    WHERE users.email = ?
    ORDER BY audio.created_at DESC
    LIMIT 1
  `,
    [userEmail]
  );
  await connection.end();
  return rows[0];
}

export async function saveScriptToDB(script: object, rowId: number) {
  const connection = await mysql.createConnection(dbConfig);
  const scriptJson = JSON.stringify(script);
  await connection.query('UPDATE audio SET script = ? WHERE id = ?', [
    scriptJson,
    rowId,
  ]);
  await connection.end();
}

export async function getUserByEmail(email: string) {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query<RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  await connection.end();
  return rows[0];
}

export async function addUserByEmail(email: string) {
  const connection = await mysql.createConnection(dbConfig);
  const [result] = await connection.query<ResultSetHeader>(
    'INSERT INTO users (email) VALUES (?)',
    [email]
  );
  await connection.end();
  return { id: result.insertId, email };
}
