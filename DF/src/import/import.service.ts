import { Inject, Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'src/redisService';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as https from 'https';
import axios, { AxiosInstance } from 'axios';
import { MongoClient, Db } from 'mongodb';
import * as FormData from 'form-data';
import { Readable } from 'stream';

// Vault configuration from environment
const VAULT_URL = process.env.VAULT_URL ;
const VAULT_TOKEN = process.env.VAULT_TOKEN ;
const VAULT_KEY = process.env.VAULT_KEY ;
const VAULT_CONTEXT = process.env.VAULT_CONTEXT || 'redis-backup-context';

export interface ImportClientOptions {
  fileName: string;
  dbNumber?: number;
  mongoHost?: string;
  mongoPort?: number | string;
  mongoDbName?: string;
  LOGTYPE?: 'mongo' | 'dfs';
  mongo?: {
    MONGODB_HOST?: string;
    MONGODB_PORT?: string;
    MONGODB_USERNAME?: string;
    MONGODB_PASSWORD?: string;
    MONGODB_DATABASENAME?: string;
  };
  dfs?: {
    SEAWEED_URL?: string;
    SEAWEED_USERNAME?: string;
    SEAWEED_PASSWORD?: string;
  };
  CK: string;
  FNK?: string;
  CATK: string;
  AFGK: string;
}

export interface BackupData {
  timestamp: string;
  totalKeys: number;
  keys: Array<{
    key: string;
    value: string;
    ttl: number;
    type: string;
  }>;
}

@Injectable()
export class ImportClientService {
  private readonly logger = new Logger(ImportClientService.name);
  private readonly vaultClient: AxiosInstance;
  private readonly encryptedBackupDir: string;

  constructor(@Inject(RedisService) private readonly redisService: RedisService) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true,
      timeout: 60000,
    });

    this.vaultClient = axios.create({
      baseURL: VAULT_URL,
      httpsAgent,
      timeout: 60000,
      headers: {
        'X-Vault-Token': VAULT_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    this.encryptedBackupDir = path.join(process.cwd(), 'encrypted-backups');
  }

  /**
   * Encrypt data using Vault Transit secrets engine
   */
  private async encryptWithVaultTransit(plaintext: string): Promise <string> {
    if (!VAULT_URL || !VAULT_TOKEN || !VAULT_KEY) {
      throw new Error('VAULT_URL, VAULT_TOKEN, and VAULT_KEY must be configured');
    }

    const context = Buffer.from(VAULT_CONTEXT).toString('base64');
    const base64Plaintext = Buffer.from(plaintext, 'utf-8').toString('base64');

    this.logger.log(`Encrypting data with Vault Transit using key: ${VAULT_KEY}`);

    try {
      const response = await this.vaultClient.post(`/v1/transit/encrypt/${VAULT_KEY}`, {
        plaintext: base64Plaintext,
        context: context,
      });

      const ciphertext = response.data?.data?.ciphertext;
      if (!ciphertext) {
        throw new Error('No ciphertext returned from Vault');
      }

      this.logger.log('Data encrypted successfully with Vault Transit');
      return ciphertext;
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.join(', ') || error.message;
      this.logger.error(`Vault Transit encrypt error: ${errorMessage}`);
      throw new Error(`Failed to encrypt with Vault Transit: ${errorMessage}`);
    }
  }

  /**
   * Decrypt data using Vault Transit secrets engine
   */
  private async decryptWithVaultTransit(ciphertext: string, encryptionConfig?: any): Promise<string> {
   

    const context = Buffer.from(VAULT_CONTEXT).toString('base64');  

    this.logger.log(`Decrypting data with Vault Transit using key: ${encryptionConfig.key}`);

    try {
      const response = await this.vaultClient.post(`/v1/transit/decrypt/${encryptionConfig.key}`, {
        ciphertext: ciphertext,
        context: context,
      });

      const base64Plaintext = response.data?.data?.plaintext;
      if (!base64Plaintext) {
        throw new Error('No plaintext returned from Vault');
      }

      const plainText = Buffer.from(base64Plaintext, 'base64').toString('utf-8');

      this.logger.log('Data decrypted successfully with Vault Transit');
      return plainText;
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.join(', ') || error.message;
      this.logger.error(`Vault Transit decrypt error: ${errorMessage}`);
      throw new Error(`Failed to decrypt with Vault Transit: ${errorMessage}`);
    }
  }

  /**
   * Read backup from local file
   */
  private async readEncryptedBackup(fileName: string): Promise<{ ciphertext: string; metadata: Record<string, any> }> {
    const filePath = path.join(this.encryptedBackupDir, fileName);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content);

      if (!parsed.ciphertext) {
        throw new Error('Invalid backup file: missing ciphertext');
      }

      return {
        ciphertext: parsed.ciphertext,
        metadata: parsed.metadata || {},
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Backup file not found: ${fileName}`);
      }
      throw error;
    }
  }

  /**
   * Extract CK, FNGK, FNK, CATK, and AFGK values from a Redis key string
   * Key format: CK:value:FNGK:value:FNK:value:CATK:value:AFGK:value:AFK:value:AFVK:value:...
   */
  private extractKeySegments(key: string): { CK?: string; FNGK?: string; FNK?: string; CATK?: string; AFGK?: string } {
    const parts = key.split(':');
    const result: { CK?: string; FNGK?: string; FNK?: string; CATK?: string; AFGK?: string } = {};

    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === 'CK' && i + 1 < parts.length) {
        result.CK = parts[i + 1];
      } else if (parts[i] === 'FNGK' && i + 1 < parts.length) {
        result.FNGK = parts[i + 1];
      } else if (parts[i] === 'FNK' && i + 1 < parts.length) {
        result.FNK = parts[i + 1];
      } else if (parts[i] === 'CATK' && i + 1 < parts.length) {
        result.CATK = parts[i + 1];
      } else if (parts[i] === 'AFGK' && i + 1 < parts.length) {
        result.AFGK = parts[i + 1];
      }
    }

    return result;
  }

  /**
   * Extract all key segments including AFK and AFVK from a Redis key string
   */
  private extractAllKeySegments(key: string): { CK?: string; FNGK?: string; FNK?: string; CATK?: string; AFGK?: string; AFK?: string; AFVK?: string } {
    const parts = key.split(':');
    const result: { CK?: string; FNGK?: string; FNK?: string; CATK?: string; AFGK?: string; AFK?: string; AFVK?: string } = {};

    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === 'CK' && i + 1 < parts.length) {
        result.CK = parts[i + 1];
      } else if (parts[i] === 'FNGK' && i + 1 < parts.length) {
        result.FNGK = parts[i + 1];
      } else if (parts[i] === 'FNK' && i + 1 < parts.length) {
        result.FNK = parts[i + 1];
      } else if (parts[i] === 'CATK' && i + 1 < parts.length) {
        result.CATK = parts[i + 1];
      } else if (parts[i] === 'AFGK' && i + 1 < parts.length) {
        result.AFGK = parts[i + 1];
      } else if (parts[i] === 'AFK' && i + 1 < parts.length) {
        result.AFK = parts[i + 1];
      } else if (parts[i] === 'AFVK' && i + 1 < parts.length) {
        result.AFVK = parts[i + 1];
      }
    }

    return result;
  }

  /**
   * Check if a key matches the FNK filter
   * Returns true if FNK is "*" (wildcard) or if the key's FNK matches the filter
   */
  private keyMatchesFNKFilter(key: string, fnkFilter: string): boolean {
    if (fnkFilter === '*') {
      return true;
    }

    const segments = this.extractKeySegments(key);
    return segments.FNK === fnkFilter;
  }

  /**
   * Replace CK, CATK, and AFGK segments in a Redis key string
   * Key format: CK:value:FNGK:value:FNK:value:CATK:value:AFGK:value:AFK:value:AFVK:value:...
   */
  private replaceKeySegments(originalKey: string, newCK: string, newCATK: string, newAFGK: string): string {
    const parts = originalKey.split(':');
    const result: string[] = [];

    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === 'CK' && i + 1 < parts.length) {
        result.push('CK', newCK);
        i++; // Skip the old value
      } else if (parts[i] === 'CATK' && i + 1 < parts.length) {
        result.push('CATK', newCATK);
        i++; // Skip the old value
      } else if (parts[i] === 'AFGK' && i + 1 < parts.length) {
        result.push('AFGK', newAFGK);
        i++; // Skip the old value
      } else {
        result.push(parts[i]);
      }
    }

    return result.join(':');
  }

  /**
   * Build key pattern for matching/replacement
   * Pattern: CK:value:FNGK:value:FNK:value:CATK:value:AFGK:value
   */
  private buildKeyPattern(ck: string, fngk: string, fnk: string, catk: string, afgk: string): string {
    return `CK:${ck}:FNGK:${fngk}:FNK:${fnk}:CATK:${catk}:AFGK:${afgk}`;
  }

  /**
   * Recursively replace the OLD key pattern with NEW key pattern in data
   * Only replaces exact pattern matches
   */
  private replacePatternInData(
    data: any,
    oldPattern: string,
    newPattern: string
  ): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      // Check if string contains the old pattern
      if (oldPattern && newPattern && oldPattern !== newPattern && data.includes(oldPattern)) {
        return data.split(oldPattern).join(newPattern);
      }
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.replacePatternInData(item, oldPattern, newPattern));
    }

    if (typeof data === 'object') {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        // Replace pattern in object keys too
        let newKey = key;
        if (oldPattern && newPattern && oldPattern !== newPattern && key.includes(oldPattern)) {
          newKey = key.split(oldPattern).join(newPattern);
        }
        result[newKey] = this.replacePatternInData(value, oldPattern, newPattern);
      }
      return result;
    }

    // For numbers, booleans, etc., return as-is
    return data;
  }

  /**
   * Recursively replace ALL occurrences of CK, CATK, AFGK values in data
   * Used when FNK = "*" (wildcard) - replaces everywhere
   */
  private replaceAllValuesInData(
    data: any,
    replacements: { oldValue: string; newValue: string }[]
  ): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      let result = data;
      for (const { oldValue, newValue } of replacements) {
        if (oldValue && oldValue !== newValue) {
          // Replace CK:oldValue, CATK:oldValue, AFGK:oldValue patterns
          result = result.split(`CK:${oldValue}`).join(`CK:${newValue}`);
          result = result.split(`CATK:${oldValue}`).join(`CATK:${newValue}`);
          result = result.split(`AFGK:${oldValue}`).join(`AFGK:${newValue}`);
        }
      }
      return result;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.replaceAllValuesInData(item, replacements));
    }

    if (typeof data === 'object') {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        // Replace in object keys too
        let newKey = key;
        for (const { oldValue, newValue } of replacements) {
          if (oldValue && oldValue !== newValue) {
            newKey = newKey.split(`CK:${oldValue}`).join(`CK:${newValue}`);
            newKey = newKey.split(`CATK:${oldValue}`).join(`CATK:${newValue}`);
            newKey = newKey.split(`AFGK:${oldValue}`).join(`AFGK:${newValue}`);
          }
        }
        result[newKey] = this.replaceAllValuesInData(value, replacements);
      }
      return result;
    }

    // For numbers, booleans, etc., return as-is
    return data;
  }

  /**
   * Helper method to import decoded value to Redis based on type
   */
  private async importDecodedValue(redis: any, key: string, decoded: any, ttl: number): Promise<void> {
    if (decoded.type === 'json') {
      const jsonData = typeof decoded.data === 'string' ? decoded.data : JSON.stringify(decoded.data);
      await redis.call('JSON.SET', key, '$', jsonData);
    } else if (decoded.type === 'string') {
      await redis.set(key, decoded.data);
    } else if (decoded.type === 'hash') {
      await redis.hset(key, decoded.data);
    } else if (decoded.type === 'list') {
      if (decoded.data.length > 0) {
        await redis.rpush(key, ...decoded.data);
      }
    } else if (decoded.type === 'set') {
      if (decoded.data.length > 0) {
        await redis.sadd(key, ...decoded.data);
      }
    } else if (decoded.type === 'zset') {
      const args: (string | number)[] = [];
      for (let i = 0; i < decoded.data.length; i += 2) {
        args.push(decoded.data[i + 1], decoded.data[i]);
      }
      if (args.length > 0) {
        await redis.zadd(key, ...args);
      }
    } else if (decoded.type === 'dump') {
      const dumpBuffer = Buffer.from(decoded.data, 'base64');
      await redis.restore(key, ttl, dumpBuffer, 'REPLACE');
    }

    // Set TTL if applicable
    if (ttl > 0) {
      await redis.pexpire(key, ttl);
    }
  }

  /**
   * Save decoded data to MongoDB using insertOne
   * Uses CK as the collection name and stores all key segments with the data
   */
  private async saveToMongoDB(db: Db, key: string, decoded: any): Promise<void> {
    try {
      const segments = this.extractAllKeySegments(key);

      if (!segments.CK) {
        this.logger.warn(`Cannot save to MongoDB: CK not found in key ${key}`);
        return;
      }

      const collection = db.collection(segments.CK + '-AMDKEYS');

      const document: Record<string, any> = { redisKey: key };
      if (segments.FNGK !== undefined) document.FNGK = segments.FNGK;
      if (segments.FNK !== undefined) document.FNK = segments.FNK;
      if (segments.CATK !== undefined) document.CATK = segments.CATK;
      if (segments.AFGK !== undefined) document.AFGK = segments.AFGK;
      if (segments.AFK !== undefined) document.AFK = segments.AFK;
      if (segments.AFVK !== undefined) document.AFVK = segments.AFVK;

      let data = decoded.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch { }
      }

      document.type = decoded.type;
      document.value = data;
      document.updatedAt = new Date();

      await collection.insertOne(document);

      this.logger.debug(`Saved to MongoDB collection ${segments.CK}: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to save to MongoDB for key ${key}: ${error.message}`);
    }
  }

  /**
   * Save decoded data to SeaweedFS (DFS)
   * Uploads the key data as a JSON file to SeaweedFS
   */
  private async saveToDFS(
    dfsConfig: { seaweedUrl: string; seaweedUsername: string; seaweedPassword: string },
    key: string,
    decoded: any,
  ): Promise<void> {
    try {
      const segments = this.extractAllKeySegments(key);

      let data = decoded.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch { }
      }

      const document: Record<string, any> = {
        redisKey: key,
        type: decoded.type,
        value: data,
        updatedAt: new Date().toISOString(),
      };
      if (segments.CK !== undefined) document.CK = segments.CK;
      if (segments.FNGK !== undefined) document.FNGK = segments.FNGK;
      if (segments.FNK !== undefined) document.FNK = segments.FNK;
      if (segments.CATK !== undefined) document.CATK = segments.CATK;
      if (segments.AFGK !== undefined) document.AFGK = segments.AFGK;
      if (segments.AFK !== undefined) document.AFK = segments.AFK;
      if (segments.AFVK !== undefined) document.AFVK = segments.AFVK;

      // Build folder path: /{bucketName}/{CK}/{FNGK}/{FNK}/{CATK}/{AFGK}/{AFK}/{AFVK}
      const bucketName = `${segments.CK}-AMDKEYS`;
      const folderParts = [
        segments.CK, segments.FNGK, segments.FNK,
        segments.CATK, segments.AFGK, segments.AFK, segments.AFVK,
      ].filter(Boolean);
      const folderPath = folderParts.join('/');

      // Filename from the last meaningful segment
      const filename = (segments.AFVK || segments.AFK || segments.AFGK || 'data') + '.json';

      const fileUrl = `${dfsConfig.seaweedUrl}/${bucketName}/${folderPath}/${filename}`;

      // Upload plain JSON data (same as Redis/MongoDB storage)
      const plaintext = JSON.stringify(document, null, 2);
      const buffer = Buffer.from(plaintext, 'utf-8');
      const form = new FormData();
      form.append('file', Readable.from(buffer), {
        filename,
        contentType: 'application/octet-stream',
      });

      const response = await axios.post(fileUrl, form, {
        headers: { ...form.getHeaders() },
        auth: {
          username: dfsConfig.seaweedUsername,
          password: dfsConfig.seaweedPassword,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      this.logger.debug(`Saved to DFS at /${bucketName}/${folderPath}/${filename}: ${key} (status: ${response.status})`);
    } catch (error) {
      this.logger.error(`Failed to save to DFS for key ${key}: ${error.message}`);
    }
  }

  /**
   * Import keys from backup file to Redis with CK, CATK, AFGK replacement
   */
  

   async importToRedisWithReplacement(options: ImportClientOptions, dpdKey: string): Promise<{
      imported: number;
      failed: number;
      totalKeys: number;
      replacedKeys: string[];

    }> {
      const LOGTYPE = process.env.LOGTYPE;
      if (!LOGTYPE || !['mongodb', 'dfs'].includes(LOGTYPE)) {
        throw new Error('LOGTYPE is required ("mongodb" or "dfs")');
      }
      const dpddata=JSON.parse(await this.redisService.getJsonData(dpdKey + 'NDP',process.env.CLIENTCODE))
      let dpdkeyData:any = Object.values(dpddata)[0]
      const selectedEncryptionType =dpdkeyData?.data?.encryption?.encryptionType?.value;

if (!selectedEncryptionType) {
  throw new Error('Encryption type not selected in DPD');
}
const encryptionItems =dpdkeyData?.data?.encryption?.encryptionInfo?.items;

if (!Array.isArray(encryptionItems)) {
  throw new Error('Encryption info items not found in DPD');
}
const encryptionConfig = encryptionItems.find((item: any) => item.type === selectedEncryptionType);

if (!encryptionConfig) {
  throw new Error(
    `Encryption configuration not found for type: ${selectedEncryptionType}`,
  );
}

      // Setup MongoDB or DFS based on logType from env
      let mongoClient: MongoClient | null = null;
      let mongoDb: Db | null = null;
      let resolvedDfsConfig: { seaweedUrl: string; seaweedUsername: string; seaweedPassword: string } | null = null;

      if (LOGTYPE === 'mongodb') {
        const mongoUrl = process.env.MONGODB_URL;

        if (!mongoUrl) {
          throw new Error('MONGODB_URL env variable is required when LOG_TYPE=mongo');
        }

        this.logger.log(`Connecting to MongoDB...`);

        mongoClient = new MongoClient(mongoUrl, { directConnection: true });
        try {
          await mongoClient.connect();
          mongoDb = mongoClient.db();
          this.logger.log(`Connected to MongoDB`);
        } catch (error) {
          this.logger.error(`MongoDB connection failed: ${error.message}`);
          throw new Error(`Failed to connect to MongoDB: ${error.message}`);
        }
      } else {
        // logType === 'dfs'
        const seaweedUrl = process.env.SEAWEED_OUTPUT_HOST;
        const seaweedUsername = process.env.SEAWEED_USERNAME || '';
        const seaweedPassword = process.env.SEAWEED_PASSWORD || '';

        if (!seaweedUrl) {
          throw new Error('SEAWEED_OUTPUT_HOST env variable is required when LOG_TYPE=dfs');
        }

        resolvedDfsConfig = { seaweedUrl, seaweedUsername, seaweedPassword };
        this.logger.log(`Using DFS at ${seaweedUrl}`);
      }

      try {
        await this.redisService.ping();
        this.logger.log(`Connected to Redis via RedisService`);

        if (options.dbNumber !== undefined && options.dbNumber !== null) {
          await this.redisService.select(options.dbNumber);
          this.logger.log(`Selected Redis DB: ${options.dbNumber}`);
        }

        // Read backup from SeaweedFS
        const seaweedUrl = process.env.SEAWEED_OUTPUT_HOST;
        const seaweedUser = process.env.SEAWEED_USERNAME || '';
        const seaweedPass = process.env.SEAWEED_PASSWORD || '';

        if (!seaweedUrl) {
          throw new Error('SEAWEED_OUTPUT_HOST env variable is required to read backup file');
        }

        const fileUrl = `${seaweedUrl}/export/${options.fileName}`;
        this.logger.log(`Reading backup from SeaweedFS: ${fileUrl}`);

        const authConfig: any = {};
        if (seaweedUser && seaweedPass) {
          authConfig.auth = { username: seaweedUser, password: seaweedPass };
        }

        let fileResponse;
        try {
          fileResponse = await axios.get(fileUrl, { responseType: 'text', ...authConfig });
        } catch (error) {
          const status = error.response?.status;
          if (status === 404) {
            throw new Error(`Backup file not found on SeaweedFS: ${fileUrl}`);
          }
          throw new Error(`Failed to download backup from SeaweedFS (${status || 'unknown'}): ${error.message}`);
        }
        const encryptedData = fileResponse.data;

        if (!encryptedData) {
          throw new Error(`Backup file is empty on SeaweedFS: ${fileUrl}`);
        }

        this.logger.log(`Downloaded backup file (${typeof encryptedData}, length: ${String(encryptedData).length})`);

        // Parse and decrypt the file downloaded from SeaweedFS
        let backupData: BackupData;
        const parsed = typeof encryptedData === 'string' ? JSON.parse(encryptedData) : encryptedData;

        if (parsed.ciphertext) {
          // File has { metadata, ciphertext } structure — decrypt the ciphertext field
          this.logger.log('Decrypting backup file from SeaweedFS...');
          const decryptedJson = await this.decryptWithVaultTransit(parsed.ciphertext, encryptionConfig);
          backupData = JSON.parse(decryptedJson);
        } else {
          // File is plain (not encrypted), use directly
          backupData = parsed;
        }

        this.logger.log(`Parsed backup data - top-level keys: ${Object.keys(backupData).join(', ')}`);

        if (!backupData.keys || !Array.isArray(backupData.keys)) {
          throw new Error(`Invalid backup format: expected "keys" array but got ${typeof backupData.keys}. Top-level keys: ${Object.keys(backupData).join(', ')}`);
        }

        this.logger.log(`Importing ${backupData.keys.length} keys with CK=${options.CK}, CATK=${options.CATK}, AFGK=${options.AFGK}, logType=${LOGTYPE}...`);

        let imported = 0;
        let failed = 0;
        const replacedKeys: string[] = [];

        for (const item of backupData.keys) {
          try {
            const originalKey = item.key;
            const oldSegments = this.extractKeySegments(originalKey);

            // Replace CK, CATK, AFGK in the key name
            const newKey = this.replaceKeySegments(originalKey, options.CK, options.CATK, options.AFGK);

            if (originalKey !== newKey) {
              this.logger.debug(`Key transformed: ${originalKey} -> ${newKey}`);
              replacedKeys.push(`${originalKey} -> ${newKey}`);
            }

            // Decrypt the individual value
            let decoded: any;
            const rawValue = typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
            try {
              if (typeof item.value === 'string' && item.value.startsWith('vault:v')) {
                const decryptedValue = await this.decryptWithVaultTransit(item.value, encryptionConfig);
                decoded = JSON.parse(decryptedValue);
              } else if (typeof item.value === 'string') {
                decoded = JSON.parse(item.value);
              } else {
                decoded = item.value;
              }
            } catch {
              decoded = typeof item.value === 'object' ? item.value : JSON.parse(rawValue);
            }

            // Replace CK, CATK, AFGK values inside the data
            if (decoded.data) {
              let dataToProcess = decoded.data;
              let wasString = false;

              if (typeof decoded.data === 'string') {
                try {
                  dataToProcess = JSON.parse(decoded.data);
                  wasString = true;
                } catch {
                  dataToProcess = decoded.data;
                }
              }

              const replacements: { oldValue: string; newValue: string }[] = [];
              if (oldSegments.CK && oldSegments.CK !== options.CK) {
                replacements.push({ oldValue: oldSegments.CK, newValue: options.CK });
              }
              if (oldSegments.CATK && oldSegments.CATK !== options.CATK) {
                replacements.push({ oldValue: oldSegments.CATK, newValue: options.CATK });
              }
              if (oldSegments.AFGK && oldSegments.AFGK !== options.AFGK) {
                replacements.push({ oldValue: oldSegments.AFGK, newValue: options.AFGK });
              }

              const processedData = this.replaceAllValuesInData(dataToProcess, replacements);
              decoded.data = wasString ? JSON.stringify(processedData) : processedData;
            }

            await this.redisService.del(newKey);
            await this.importDecodedValue(this.redisService, newKey, decoded, item.ttl);

            // Save based on logType
            if (LOGTYPE === 'mongodb' && mongoDb) {
              await this.saveToMongoDB(mongoDb, newKey, decoded);
            } else if (LOGTYPE === 'dfs' && resolvedDfsConfig) {
              await this.saveToDFS(resolvedDfsConfig, newKey, decoded);
            }

            imported++;
          } catch (error) {
            this.logger.error(`Failed to import key ${item.key}: ${error.message}`);
            failed++;
          }
        }

        this.logger.log(`Import completed: ${imported} imported, ${failed} failed, ${replacedKeys.length} keys transformed`);

        return {
          imported,
          failed,
          totalKeys: backupData.totalKeys,
          replacedKeys,
        };
      } catch (error) {
        this.logger.error(`Import failed: ${error.message}`, error.stack);
        throw error;
      } finally {
        if (mongoClient) await mongoClient.close();
      }
    }


  
}
