import tr from './tr.js';
import en from './en.js';
import { GuildModel } from '../database/models/guild.js';

const locales = { tr, en };
const langCache = new Map();

export function t(guildId, key, vars = {}) {
  let lang = langCache.get(guildId);

  if (!lang) {
    try {
      const config = GuildModel.findById(guildId);
      lang = config?.language || 'tr';
    } catch {
      lang = 'tr';
    }
    langCache.set(guildId, lang);
  }

  const strings = locales[lang] || locales.tr;
  let text = strings[key] || locales.tr[key] || key;

  for (const [k, v] of Object.entries(vars)) {
    text = text.replaceAll(`{${k}}`, v);
  }

  return text;
}

export function clearLangCache(guildId) {
  if (guildId) {
    langCache.delete(guildId);
  } else {
    langCache.clear();
  }
}

export function getAvailableLanguages() {
  return Object.keys(locales);
}
