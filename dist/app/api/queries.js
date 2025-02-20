import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
// these get imported in the routes files
dotenv.config();
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_NAME:', process.env.DB_NAME);
const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
export async function getAllTabsAndCards() {
    const connection = await mysql.createConnection(dbConfig);
    const [tabs] = await connection.query('SELECT * FROM tabs');
    const tabsWithCards = await Promise.all(tabs.map(async (tab) => {
        const [cards] = await connection.query('SELECT * FROM cards WHERE tab_id = ?', [tab.id]);
        return Object.assign(Object.assign({}, tab), { cards });
    }));
    await connection.end();
    return tabsWithCards;
}
export async function addNewTab(name) {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query('INSERT INTO tabs (name) VALUES (?)', [name]);
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
export async function addNewCard(title, text, tabId) {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query('INSERT INTO cards (title, text, tab_id) VALUES (?, ?, ?)', [title, text, tabId]);
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
    await connection.query('UPDATE cards SET title = ?, text = ? WHERE id = ?', [title, text, id]);
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
    return rows.map(row => row.tab_id);
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
// still need to make this table in the db: should have an id column for autoinc, and then cols for: title, intro, section1, section2, section3, conclusion, was_played, created_for
export async function saveAudioToDatabase(rowId, field, buffer) {
    const connection = await mysql.createConnection(dbConfig);
    // might need to turn buffer mp3 into base64 blob
    await connection.query(`UPDATE audio SET ${field} = ? WHERE id = ?`, [buffer, rowId]);
    await connection.end();
}
export async function createNewAudioRow() {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query('INSERT INTO audio (was_played) VALUES (0)');
    await connection.end();
    return result.insertId;
}
