import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { GuildModel } from '../database/models/guild.js';
import { AuditLogModel } from '../database/models/auditLog.js';
import { createSuccessEmbed, createInfoEmbed } from '../utils/embeds.js';
import { requirePermission } from '../utils/permissions.js';
import { restart as restartScheduler } from '../services/scheduler.js';
import { updateDashboard, deleteDashboard } from '../services/dashboard.js';
import { clearLangCache } from '../locales/index.js';
import { t } from '../locales/index.js';

export const data = new SlashCommandBuilder()
  .setName('ayarlar')
  .setDescription('Bot ayarlarını yönetir.')
  .addSubcommand(sub =>
    sub.setName('goster')
      .setDescription('Mevcut ayarları gösterir.')
  )
  .addSubcommand(sub =>
    sub.setName('log-kanal')
      .setDescription('Log kanalını ayarlar.')
      .addChannelOption(opt =>
        opt.setName('kanal')
          .setDescription('Log mesajlarının gönderileceği kanal')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub.setName('kontrol-araligi')
      .setDescription('Otomatik kontrol aralığını ayarlar.')
      .addIntegerOption(opt =>
        opt.setName('dakika')
          .setDescription('Kontrol aralığı (1-60 dakika)')
          .setMinValue(1)
          .setMaxValue(60)
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub.setName('bildirim')
      .setDescription('DM bildirimlerini açar/kapatır.')
      .addStringOption(opt =>
        opt.setName('durum')
          .setDescription('Bildirim durumu')
          .setRequired(true)
          .addChoices({ name: 'Aç', value: 'on' }, { name: 'Kapat', value: 'off' })
      )
  )
  .addSubcommand(sub =>
    sub.setName('hosgeldin-kanal')
      .setDescription('Hoşgeldin mesajı kanalını ayarlar.')
      .addChannelOption(opt =>
        opt.setName('kanal')
          .setDescription('Hoşgeldin mesajlarının gönderileceği kanal')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub.setName('hosgeldin')
      .setDescription('Hoşgeldin mesajlarını açar/kapatır.')
      .addStringOption(opt =>
        opt.setName('durum')
          .setDescription('Hoşgeldin durumu')
          .setRequired(true)
          .addChoices({ name: 'Aç', value: 'on' }, { name: 'Kapat', value: 'off' })
      )
  )
  .addSubcommand(sub =>
    sub.setName('dil')
      .setDescription('Bot dilini değiştirir.')
      .addStringOption(opt =>
        opt.setName('dil')
          .setDescription('Dil seçimi')
          .setRequired(true)
          .addChoices({ name: 'Türkçe', value: 'tr' }, { name: 'English', value: 'en' })
      )
  )
  .addSubcommand(sub =>
    sub.setName('gereksinim-hesap')
      .setDescription('Minimum hesap yaşı gereksinimi (gün).')
      .addIntegerOption(opt =>
        opt.setName('gun')
          .setDescription('Minimum hesap yaşı (0 = kapalı)')
          .setMinValue(0)
          .setMaxValue(365)
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub.setName('gereksinim-sunucu')
      .setDescription('Minimum sunucu süresi gereksinimi (gün).')
      .addIntegerOption(opt =>
        opt.setName('gun')
          .setDescription('Minimum sunucu süresi (0 = kapalı)')
          .setMinValue(0)
          .setMaxValue(365)
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub.setName('dashboard')
      .setDescription('Canlı dashboard embed kanalını ayarlar.')
      .addChannelOption(opt =>
        opt.setName('kanal')
          .setDescription('Dashboard kanalı')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub.setName('dashboard-kapat')
      .setDescription('Dashboard\'u kapatır ve mesajı siler.')
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction, client) {
  const sub = interaction.options.getSubcommand();
  const guildId = interaction.guildId;

  if (sub === 'goster') return showSettings(interaction);

  if (!await requirePermission(interaction, PermissionFlagsBits.ManageGuild)) return;

  switch (sub) {
    case 'log-kanal': return setLogChannel(interaction, guildId);
    case 'kontrol-araligi': return setCheckInterval(interaction, client, guildId);
    case 'bildirim': return setDmNotify(interaction, guildId);
    case 'hosgeldin-kanal': return setWelcomeChannel(interaction, guildId);
    case 'hosgeldin': return setWelcomeEnabled(interaction, guildId);
    case 'dil': return setLanguage(interaction, guildId);
    case 'gereksinim-hesap': return setReqAccount(interaction, guildId);
    case 'gereksinim-sunucu': return setReqServer(interaction, guildId);
    case 'dashboard': return setDashboard(interaction, client, guildId);
    case 'dashboard-kapat': return disableDashboard(interaction, client, guildId);
  }
}

async function showSettings(interaction) {
  const guildId = interaction.guildId;
  const config = GuildModel.findById(guildId);

  if (!config) {
    return interaction.reply({
      embeds: [createInfoEmbed(t(guildId, 'cmd.settings.title'), t(guildId, 'cmd.settings.notset'))],
      ephemeral: true,
    });
  }

  const accountDays = config.min_account_age > 0 ? `${Math.round(config.min_account_age / 24)} ${t(guildId, 'cmd.settings.days', { days: Math.round(config.min_account_age / 24) }).split(' ').pop()}` : t(guildId, 'cmd.settings.off');
  const serverDays = config.min_server_time > 0 ? `${Math.round(config.min_server_time / 24)} ${t(guildId, 'cmd.settings.days', { days: Math.round(config.min_server_time / 24) }).split(' ').pop()}` : t(guildId, 'cmd.settings.off');

  await interaction.reply({
    embeds: [createInfoEmbed(
      t(guildId, 'cmd.settings.title'),
      t(guildId, 'cmd.settings.desc', { guild: interaction.guild.name }),
      [
        { name: t(guildId, 'cmd.settings.log_channel'), value: config.log_channel_id ? `<#${config.log_channel_id}>` : t(guildId, 'cmd.settings.notset'), inline: true },
        { name: t(guildId, 'cmd.settings.check_interval'), value: t(guildId, 'cmd.settings.minutes', { min: config.check_interval / 60 }), inline: true },
        { name: t(guildId, 'cmd.settings.dm_notify'), value: config.dm_notify ? t(guildId, 'cmd.settings.on') : t(guildId, 'cmd.settings.off'), inline: true },
        { name: t(guildId, 'cmd.settings.welcome_channel'), value: config.welcome_channel_id ? `<#${config.welcome_channel_id}>` : t(guildId, 'cmd.settings.notset'), inline: true },
        { name: t(guildId, 'cmd.settings.welcome'), value: config.welcome_enabled ? t(guildId, 'cmd.settings.on') : t(guildId, 'cmd.settings.off'), inline: true },
        { name: t(guildId, 'cmd.settings.language'), value: config.language?.toUpperCase() || 'TR', inline: true },
        { name: t(guildId, 'cmd.settings.req_account'), value: accountDays, inline: true },
        { name: t(guildId, 'cmd.settings.req_server'), value: serverDays, inline: true },
        { name: t(guildId, 'cmd.settings.dashboard'), value: config.dashboard_channel_id ? `<#${config.dashboard_channel_id}>` : t(guildId, 'cmd.settings.off'), inline: true },
      ]
    )],
    ephemeral: true,
  });
}

async function setLogChannel(interaction, guildId) {
  const channel = interaction.options.getChannel('kanal');
  GuildModel.updateLogChannel(guildId, channel.id);
  AuditLogModel.record(guildId, interaction.user.id, 'settings_change', `log_channel → ${channel.name}`);
  await interaction.reply({ embeds: [createSuccessEmbed(t(guildId, 'cmd.settings.updated'), t(guildId, 'cmd.settings.log_channel.set', { channel: `<#${channel.id}>` }))], ephemeral: true });
}

async function setCheckInterval(interaction, client, guildId) {
  const minutes = interaction.options.getInteger('dakika');
  GuildModel.updateCheckInterval(guildId, minutes * 60);
  restartScheduler(client, guildId);
  AuditLogModel.record(guildId, interaction.user.id, 'settings_change', `check_interval → ${minutes}m`);
  await interaction.reply({ embeds: [createSuccessEmbed(t(guildId, 'cmd.settings.updated'), t(guildId, 'cmd.settings.interval.set', { min: minutes }))], ephemeral: true });
}

async function setDmNotify(interaction, guildId) {
  const enabled = interaction.options.getString('durum') === 'on';
  GuildModel.updateDmNotify(guildId, enabled);
  AuditLogModel.record(guildId, interaction.user.id, 'settings_change', `dm_notify → ${enabled}`);
  await interaction.reply({ embeds: [createSuccessEmbed(t(guildId, 'cmd.settings.updated'), t(guildId, 'cmd.settings.dm.set', { status: enabled ? t(guildId, 'cmd.settings.on') : t(guildId, 'cmd.settings.off') }))], ephemeral: true });
}

async function setWelcomeChannel(interaction, guildId) {
  const channel = interaction.options.getChannel('kanal');
  GuildModel.updateWelcomeChannel(guildId, channel.id);
  AuditLogModel.record(guildId, interaction.user.id, 'settings_change', `welcome_channel → ${channel.name}`);
  await interaction.reply({ embeds: [createSuccessEmbed(t(guildId, 'cmd.settings.updated'), t(guildId, 'cmd.settings.welcome_channel.set', { channel: `<#${channel.id}>` }))], ephemeral: true });
}

async function setWelcomeEnabled(interaction, guildId) {
  const enabled = interaction.options.getString('durum') === 'on';
  GuildModel.updateWelcomeEnabled(guildId, enabled);
  AuditLogModel.record(guildId, interaction.user.id, 'settings_change', `welcome → ${enabled}`);
  await interaction.reply({ embeds: [createSuccessEmbed(t(guildId, 'cmd.settings.updated'), t(guildId, 'cmd.settings.welcome.set', { status: enabled ? t(guildId, 'cmd.settings.on') : t(guildId, 'cmd.settings.off') }))], ephemeral: true });
}

async function setLanguage(interaction, guildId) {
  const lang = interaction.options.getString('dil');
  GuildModel.updateLanguage(guildId, lang);
  clearLangCache(guildId);
  AuditLogModel.record(guildId, interaction.user.id, 'language_change', lang);
  await interaction.reply({ embeds: [createSuccessEmbed(t(guildId, 'cmd.settings.updated'), t(guildId, 'cmd.settings.language.set', { lang: lang.toUpperCase() }))], ephemeral: true });
}

async function setReqAccount(interaction, guildId) {
  const days = interaction.options.getInteger('gun');
  const hours = days * 24;
  GuildModel.updateMinAccountAge(guildId, hours);
  AuditLogModel.record(guildId, interaction.user.id, 'requirement_set', `min_account_age → ${days}d`);
  const msg = days === 0
    ? t(guildId, 'cmd.settings.req.disabled', { type: t(guildId, 'cmd.settings.req_account') })
    : t(guildId, 'cmd.settings.req_account.set', { days });
  await interaction.reply({ embeds: [createSuccessEmbed(t(guildId, 'cmd.settings.updated'), msg)], ephemeral: true });
}

async function setReqServer(interaction, guildId) {
  const days = interaction.options.getInteger('gun');
  const hours = days * 24;
  GuildModel.updateMinServerTime(guildId, hours);
  AuditLogModel.record(guildId, interaction.user.id, 'requirement_set', `min_server_time → ${days}d`);
  const msg = days === 0
    ? t(guildId, 'cmd.settings.req.disabled', { type: t(guildId, 'cmd.settings.req_server') })
    : t(guildId, 'cmd.settings.req_server.set', { days });
  await interaction.reply({ embeds: [createSuccessEmbed(t(guildId, 'cmd.settings.updated'), msg)], ephemeral: true });
}

async function setDashboard(interaction, client, guildId) {
  const channel = interaction.options.getChannel('kanal');
  GuildModel.updateDashboardChannel(guildId, channel.id);
  GuildModel.updateDashboardMessage(guildId, null);
  AuditLogModel.record(guildId, interaction.user.id, 'dashboard_set', channel.name);
  await updateDashboard(client, guildId);
  await interaction.reply({ embeds: [createSuccessEmbed(t(guildId, 'cmd.settings.updated'), t(guildId, 'cmd.settings.dashboard.set', { channel: `<#${channel.id}>` }))], ephemeral: true });
}

async function disableDashboard(interaction, client, guildId) {
  await deleteDashboard(client, guildId);
  AuditLogModel.record(guildId, interaction.user.id, 'dashboard_set', 'disabled');
  await interaction.reply({ embeds: [createSuccessEmbed(t(guildId, 'cmd.settings.updated'), t(guildId, 'cmd.settings.dashboard.off'))], ephemeral: true });
}
