const fs = require('fs');
const path = require('path');

class Database {
  constructor(options = {}) {
    this.filePath = path.join(process.cwd(), options.folder || 'database', options.file || 'data.json');
    this.readable = options.readable || false;
    this.noBlankData = options.noBlankData || true;
    this.data = {};
    this.initialize();
  }

  initialize() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, JSON.stringify({}, null, this.readable ? 2 : 0));
      }

      // Veriyi oku
      const fileContent = fs.readFileSync(this.filePath, 'utf-8');
      this.data = JSON.parse(fileContent);
    } catch (error) {
      console.error('Veritabanı başlatılırken hata oluştu:', error);
      this.data = {};
    }
  }

  save() {
    try {
      const jsonData = JSON.stringify(this.data, null, this.readable ? 2 : 0);
      fs.writeFileSync(this.filePath, jsonData);
      return true;
    } catch (error) {
      console.error('Veritabanı kaydedilirken hata oluştu:', error);
      return false;
    }
  }

  get(key) {
    return this.fetch(key);
  }

  fetch(key) {
    if (!key) return this.data;

    const keys = key.split('.');
    let result = this.data;

    for (const k of keys) {
      if (result === undefined || result === null) return undefined;
      result = result[k];
    }

    return result;
  }

  set(key, value) {
    if (!key) return false;

    const keys = key.split('.');
    let obj = this.data;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!obj[k]) obj[k] = {};
      obj = obj[k];
    }

    obj[keys[keys.length - 1]] = value;
    return this.save();
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    if (!key) return false;

    const keys = key.split('.');
    let obj = this.data;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!obj[k]) return false;
      obj = obj[k];
    }

    const lastKey = keys[keys.length - 1];
    if (obj[lastKey] === undefined) return false;

    delete obj[lastKey];

    // Boş nesneleri temizle
    if (this.noBlankData) {
      this.cleanEmptyObjects();
    }

    return this.save();
  }

  add(key, value) {
    if (typeof value !== 'number') return false;

    const currentValue = this.get(key) || 0;
    if (typeof currentValue !== 'number') return this.set(key, value);

    return this.set(key, currentValue + value);
  }

  subtract(key, value) {
    if (typeof value !== 'number') return false;
    return this.add(key, -value);
  }

  push(key, value) {
    const array = this.get(key);
    if (!array) return this.set(key, [value]);
    if (!Array.isArray(array)) return this.set(key, [value]);

    array.push(value);
    return this.set(key, array);
  }

  unpush(key, value) {
    const array = this.get(key);
    if (!array || !Array.isArray(array)) return false;

    const newArray = array.filter(item => item !== value);
    return this.set(key, newArray);
  }

  delByPriority(key, index) {
    const array = this.get(key);
    if (!array || !Array.isArray(array)) return false;
    
    // Dizin 1 tabanlı olarak verilmiş, 0 tabanlıya çeviriyoruz
    const actualIndex = index - 1;
    if (actualIndex < 0 || actualIndex >= array.length) return false;
    
    array.splice(actualIndex, 1);
    return this.set(key, array);
  }

  setByPriority(key, value, index) {
    const array = this.get(key);
    if (!array || !Array.isArray(array)) return false;
    
    // Dizin 1 tabanlı olarak verilmiş, 0 tabanlıya çeviriyoruz
    const actualIndex = index - 1;
    if (actualIndex < 0 || actualIndex >= array.length) return false;
    
    array[actualIndex] = value;
    return this.set(key, array);
  }

  all() {
    return this.data;
  }

  deleteAll() {
    this.data = {};
    return this.save();
  }

  cleanEmptyObjects() {
    const cleanRecursive = (obj) => {
      for (const key in obj) {
        if (obj[key] !== null && typeof obj[key] === 'object') {
          cleanRecursive(obj[key]);
          if (Object.keys(obj[key]).length === 0) {
            delete obj[key];
          }
        }
      }
    };

    cleanRecursive(this.data);
  }

  setReadable(value) {
    this.readable = !!value;
    return this.save();
  }

  setNoBlankData(value) {
    this.noBlankData = !!value;
    return this;
  }

  setFolder(folder) {
    const newFilePath = path.join(process.cwd(), folder, path.basename(this.filePath));
    this.filePath = newFilePath;
    this.initialize();
    return this;
  }

  setFile(file) {
    const dir = path.dirname(this.filePath);
    this.filePath = path.join(dir, `${file}.json`);
    this.initialize();
    return this;
  }
}

module.exports = new Database({ 
  folder: 'database',
  file: 'data',
  readable: true, 
  noBlankData: true 
});
