import * as SQLite from 'expo-sqlite';

/**
 * Serviço de banco de dados usando SQLite
 * Gerencia todas as operações de persistência de dados
 */
class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Inicializa o banco de dados e cria as tabelas
   */
  async init(): Promise<void> {
    try {
      // SDK 54 / expo-sqlite ~16: usar API JSI síncrona para abrir o DB
      this.db = SQLite.openDatabaseSync('arssetima.db');
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  /**
   * Cria todas as tabelas necessárias
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      // Tabela de personagens
      `CREATE TABLE IF NOT EXISTS characters (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER,
        appearance TEXT,
        powers TEXT,
        goals TEXT,
        secrets TEXT,
        relations TEXT,
        notes TEXT,
        imageUri TEXT,
        tags TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,

      // Tabela de locais
      `CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        imageUri TEXT,
        coordinates TEXT,
        relatedCharacters TEXT,
        tags TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,

      // Tabela de eventos
      `CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        links TEXT,
        category TEXT,
        importance TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,

      // Tabela de notas
      `CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        priority TEXT,
        tags TEXT,
        relatedTo TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,

      // Tabela de magias
      `CREATE TABLE IF NOT EXISTS spells (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT,
        level INTEGER,
        requirements TEXT,
        effects TEXT,
        knownBy TEXT,
        imageUri TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,

      // Tabela de itens
      `CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT,
        rarity TEXT,
        ownedBy TEXT,
        powers TEXT,
        imageUri TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,

      // Tabela de criaturas
      `CREATE TABLE IF NOT EXISTS creatures (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        description TEXT NOT NULL,
        abilities TEXT,
        habitat TEXT,
        dangerLevel TEXT,
        imageUri TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,

      // Tabela de facções
      `CREATE TABLE IF NOT EXISTS factions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        leader TEXT,
        members TEXT,
        goals TEXT,
        headquarters TEXT,
        alignment TEXT,
        imageUri TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,

      // Tabela de capítulos
      `CREATE TABLE IF NOT EXISTS chapters (
        id TEXT PRIMARY KEY,
        number INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        wordCount INTEGER NOT NULL,
        status TEXT,
        notes TEXT,
        targetWordCount INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,

      // Tabela de configurações
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`,
    ];

    for (const sql of tables) {
      // Nova API: execAsync aceita statements SQL diretamente
      await this.db!.execAsync(sql);
    }
  }

  /**
   * Executa uma query genérica
   */
  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');
    try {
      const rows = await this.db.getAllAsync<T>(sql, params);
      return rows;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  /**
   * Executa um comando (INSERT, UPDATE, DELETE)
   */
  async execute(sql: string, params: any[] = []): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    try {
      await this.db.runAsync(sql, params);
    } catch (error) {
      console.error('Execute error:', error);
      throw error;
    }
  }

  /**
   * Insere um registro em uma tabela
   */
  async insert(table: string, data: Record<string, any>): Promise<void> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    await this.execute(sql, values);
  }

  /**
   * Atualiza um registro em uma tabela
   */
  async update(
    table: string,
    id: string,
    data: Record<string, any>
  ): Promise<void> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    await this.execute(sql, [...values, id]);
  }

  /**
   * Deleta um registro de uma tabela
   */
  async delete(table: string, id: string): Promise<void> {
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    await this.execute(sql, [id]);
  }

  /**
   * Busca todos os registros de uma tabela
   */
  async getAll<T>(table: string): Promise<T[]> {
    return this.query<T>(`SELECT * FROM ${table}`);
  }

  /**
   * Busca um registro por ID
   */
  async getById<T>(table: string, id: string): Promise<T | null> {
    const results = await this.query<T>(
      `SELECT * FROM ${table} WHERE id = ?`,
      [id]
    );
    return results[0] || null;
  }

  /**
   * Limpa todas as tabelas (para testes ou reset)
   */
  async clearAll(): Promise<void> {
    const tables = [
      'characters',
      'locations',
      'events',
      'notes',
      'spells',
      'items',
      'creatures',
      'factions',
      'chapters',
    ];

    for (const table of tables) {
      await this.execute(`DELETE FROM ${table}`);
    }
  }
}

export const databaseService = new DatabaseService();
