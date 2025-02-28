import mysql from 'mysql2/promise';
const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 2000,
};
export async function getAllTabsAndCards(userEmail) {
    const connection = await mysql.createConnection(dbConfig);
    const [tabs] = await connection.query(`
    SELECT tabs.id, tabs.name
    FROM tabs
    JOIN users ON tabs.user_id = users.id
    WHERE users.email = ?
  `, [userEmail]);
    const tabsWithCards = await Promise.all(tabs.map(async (tab) => {
        const [cards] = await connection.query('SELECT * FROM cards WHERE tab_id = ?', [tab.id]);
        return Object.assign(Object.assign({}, tab), { cards });
    }));
    await connection.end();
    return tabsWithCards;
}
export async function addNewTab(name, userEmail) {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(`
    INSERT INTO tabs (name, user_id)
    SELECT ?, id FROM users WHERE email = ?
  `, [name, userEmail]);
    await connection.end();
    return { id: result.insertId, name, cards: [] };
}
export async function deleteTabById(id) {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('DELETE FROM tabs WHERE id = ?', [id]);
    await connection.end();
}
export async function updateTabNameById(id, name) {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('UPDATE tabs SET name = ? WHERE id = ?', [name, id]);
    await connection.end();
}
export async function addNewCard(title, text, tabId, userEmail) {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(`
    INSERT INTO cards (title, text, tab_id, user_id)
    SELECT ?, ?, ?, id FROM users WHERE email = ?
  `, [title, text, tabId, userEmail]);
    await connection.end();
    return { id: result.insertId, title, text };
}
export async function deleteCardById(id) {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('DELETE FROM cards WHERE id = ?', [id]);
    await connection.end();
}
export async function updateCardContentById(id, title, text) {
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
    const [rows] = await connection.query(`
    SELECT tab_id
    FROM cards
    GROUP BY tab_id
    ORDER BY AVG(last_included) ASC
    LIMIT 3
  `);
    await connection.end();
    return rows.map((row) => row.tab_id);
}
export async function getOldestCardsByTab(tabIds) {
    const connection = await mysql.createConnection(dbConfig);
    const cardsByTab = await Promise.all(tabIds.map(async (tabId) => {
        const [cards] = await connection.query(`
        SELECT * FROM cards
        WHERE tab_id = ?
        ORDER BY last_included ASC
        LIMIT 25
      `, [tabId]);
        return { tabId, cards };
    }));
    await connection.end();
    return cardsByTab;
}
export async function getTabNameFromID(id) {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(`
    SELECT *
    FROM tabs
    WHERE id = ?
  `, [id]);
    await connection.end();
    return rows[0];
}
export async function updateAudioUrlInDatabase(rowId, field, fileId) {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(`UPDATE audio SET ${field} = ? WHERE id = ?`, [
        fileId,
        rowId,
    ]);
    await connection.end();
}
export async function createNewAudioRow(userEmail) {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(`
    INSERT INTO audio (was_played, intro, section1, section2, section3, conclusion, script, user_id)
    SELECT 0, NULL, NULL, NULL, NULL, NULL, NULL, id FROM users WHERE email = ?
  `, [userEmail]);
    await connection.end();
    return result.insertId;
}
export async function updateLastIncludedDate(cardId) {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('UPDATE cards SET last_included = NOW() WHERE id = ?', [cardId]);
    await connection.end();
}
export async function getAudioUrlsFromDatabase(userEmail) {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(`
    SELECT section1, section2, section3
    FROM audio
    JOIN users ON audio.user_id = users.id
    WHERE users.email = ?
    ORDER BY audio.created_at DESC
    LIMIT 1
  `, [userEmail]);
    await connection.end();
    return rows[0];
}
export async function saveScriptToDB(script, rowId) {
    const connection = await mysql.createConnection(dbConfig);
    const scriptJson = JSON.stringify(script);
    await connection.query('UPDATE audio SET script = ? WHERE id = ?', [
        scriptJson,
        rowId,
    ]);
    await connection.end();
}
export async function getUserByEmail(email) {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    await connection.end();
    return rows[0];
}
export async function addUserByEmail(email) {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query('INSERT INTO users (email) VALUES (?)', [email]);
    await connection.end();
    return { id: result.insertId, email };
}
