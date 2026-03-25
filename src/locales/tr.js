export default {
  // Tag Checker logs
  'tag.added': 'Tag Rolü Eklendi',
  'tag.added.desc': '{user} kullanıcısı **{tag}** tagına sahip olduğu için {role} rolü verildi.',
  'tag.removed': 'Tag Rolü Kaldırıldı',
  'tag.removed.desc.different': '{user} kullanıcısının farklı bir tag\'i var ({currentTag}), {role} rolü alındı.',
  'tag.removed.desc.none': '{user} kullanıcısının clan tag\'i bulunmuyor, {role} rolü alındı.',
  'tag.requirement.fail': '{user} tag gereksinimlerini karşılamıyor (hesap: {accountAge}, sunucu: {serverTime}).',
  'batch.complete': 'Periyodik Kontrol Tamamlandı',
  'batch.complete.desc': '{changed} üyenin rol durumu güncellendi.',

  // Welcome
  'welcome.title': 'Hoş Geldin!',
  'welcome.tagged': '<@{userId}> sunucumuza katıldı!\n\n**{tag}** tagına sahip olduğun için otomatik olarak rolün verildi. Aramıza hoş geldin!',
  'welcome.untagged': '<@{userId}> sunucumuza katıldı!\n\nClan tagını ekleyerek özel role sahip olabilirsin!',

  // Commands - Tag
  'cmd.tag.add.success.title': 'Tag Eşlemesi Eklendi',
  'cmd.tag.add.success.desc': '**{tag}** tagı artık {role} rolüne eşlendi.\n\nBu taga sahip kullanıcılara otomatik olarak rol verilecek.',
  'cmd.tag.add.exists': '**{tag}** tagı zaten tanımlı — {role} rolüne eşlenmiş.',
  'cmd.tag.add.limit': 'Maksimum {max} tag eşlemesi tanımlayabilirsiniz.',
  'cmd.tag.add.empty': 'Tag adı boş olamaz.',
  'cmd.tag.remove.success.title': 'Tag Eşlemesi Silindi',
  'cmd.tag.remove.success.desc': '**{tag}** → {role} eşlemesi kaldırıldı.\n\nMevcut rollere dokunulmadı, bir sonraki kontrolde güncellenecek.',
  'cmd.tag.remove.notfound': '**{tag}** adında bir tag eşlemesi bulunamadı.',
  'cmd.tag.list.title': 'Tag Listesi',
  'cmd.tag.list.empty': 'Henüz tanımlı bir tag eşlemesi yok.\n\n`/tag-ekle` komutu ile yeni bir eşleme ekleyebilirsiniz.',
  'cmd.tag.list.desc': 'Bu sunucuda **{count}** tag eşlemesi tanımlı:',

  // Commands - Check
  'cmd.check.title': 'Tag Kontrolü',
  'cmd.check.has_tag': '<@{userId}> kullanıcısı **{tag}** tagına sahip.',
  'cmd.check.no_tag': '<@{userId}> kullanıcısının eşleşen bir tagı yok.',
  'cmd.check.notfound': 'Kullanıcı bu sunucuda bulunamadı.',
  'cmd.check.role_added': 'Rol verildi',
  'cmd.check.role_removed': 'Rol alındı',
  'cmd.check.no_change': 'Değişiklik yok',

  // Commands - Full Check
  'cmd.fullcheck.started': 'Kontrol Başlatıldı',
  'cmd.fullcheck.started.desc': 'Tüm üyeler kontrol ediliyor... Bu işlem biraz zaman alabilir.',
  'cmd.fullcheck.cooldown': 'Bu komut {seconds} saniye sonra tekrar kullanılabilir.',

  // Commands - Stats
  'cmd.stats.title': 'Tag Sistemi İstatistikleri',
  'cmd.stats.desc': 'Bu sunucunun tag kontrol istatistikleri.',
  'cmd.stats.total': 'Toplam Üye',
  'cmd.stats.tagged': 'Taglı Üye',
  'cmd.stats.untagged': 'Tagsız Üye',
  'cmd.stats.checks': 'Toplam Tarama',
  'cmd.stats.added': 'Rol Ekleme',
  'cmd.stats.removed': 'Rol Kaldırma',
  'cmd.stats.interval': 'Kontrol Aralığı',
  'cmd.stats.interval.val': '{min} dakika',
  'cmd.stats.lastcheck': 'Son Kontrol',
  'cmd.stats.lastcheck.none': 'Henüz yok',
  'cmd.stats.tags': 'Tanımlı Taglar',
  'cmd.stats.tags.none': 'Tanımlı tag yok',
  'cmd.stats.ratio': 'Taglı Üye Oranı',
  'cmd.stats.requirements': 'Tag Gereksinimleri',
  'cmd.stats.req.account': 'Hesap yaşı: {days} gün',
  'cmd.stats.req.server': 'Sunucu süresi: {days} gün',
  'cmd.stats.req.none': 'Yok',

  // Commands - Leaderboard
  'cmd.leaderboard.title': 'Tag Sıralaması',
  'cmd.leaderboard.title.streak': 'Streak Sıralaması',
  'cmd.leaderboard.empty': 'Henüz sıralama verisi yok. Tag kontrolleri başladıktan sonra sıralama oluşacak.',
  'cmd.leaderboard.desc': 'En uzun süredir tag tutan üyeler:',
  'cmd.leaderboard.desc.streak': 'En yüksek aktif streak\'e sahip üyeler:',

  // Commands - Streak
  'cmd.streak.title': 'Tag Streak',
  'cmd.streak.active': '<@{userId}> kullanıcısının aktif streak\'i:',
  'cmd.streak.none': '<@{userId}> kullanıcısının aktif streak\'i yok.',
  'cmd.streak.days': '{days} gün',
  'cmd.streak.start': 'Başlangıç',
  'cmd.streak.tag': 'Tag',

  // Commands - Audit
  'cmd.audit.title': 'Denetim Kayıtları',
  'cmd.audit.empty': 'Henüz denetim kaydı yok.',
  'cmd.audit.desc': 'Son {count} işlem:',

  // Commands - Settings
  'cmd.settings.title': 'Sunucu Ayarları',
  'cmd.settings.desc': '**{guild}** için mevcut ayarlar:',
  'cmd.settings.log_channel': 'Log Kanalı',
  'cmd.settings.check_interval': 'Kontrol Aralığı',
  'cmd.settings.dm_notify': 'DM Bildirim',
  'cmd.settings.welcome_channel': 'Hoşgeldin Kanalı',
  'cmd.settings.welcome': 'Hoşgeldin Mesajı',
  'cmd.settings.language': 'Dil',
  'cmd.settings.req_account': 'Min. Hesap Yaşı',
  'cmd.settings.req_server': 'Min. Sunucu Süresi',
  'cmd.settings.dashboard': 'Dashboard',
  'cmd.settings.notset': 'Ayarlanmamış',
  'cmd.settings.on': 'Açık',
  'cmd.settings.off': 'Kapalı',
  'cmd.settings.days': '{days} gün',
  'cmd.settings.minutes': '{min} dakika',
  'cmd.settings.updated': 'Ayar Güncellendi',
  'cmd.settings.log_channel.set': 'Log kanalı {channel} olarak ayarlandı.',
  'cmd.settings.interval.set': 'Kontrol aralığı **{min} dakika** olarak ayarlandı.',
  'cmd.settings.dm.set': 'DM bildirimleri **{status}**.',
  'cmd.settings.welcome_channel.set': 'Hoşgeldin kanalı {channel} olarak ayarlandı.',
  'cmd.settings.welcome.set': 'Hoşgeldin mesajları **{status}**.',
  'cmd.settings.language.set': 'Dil **{lang}** olarak ayarlandı.',
  'cmd.settings.req_account.set': 'Minimum hesap yaşı **{days} gün** olarak ayarlandı.',
  'cmd.settings.req_server.set': 'Minimum sunucu süresi **{days} gün** olarak ayarlandı.',
  'cmd.settings.req.disabled': '{type} gereksinimi kapatıldı.',
  'cmd.settings.dashboard.set': 'Dashboard {channel} kanalında oluşturuldu.',
  'cmd.settings.dashboard.off': 'Dashboard kapatıldı.',

  // Commands - Help
  'cmd.help.title': 'Komut Listesi',
  'cmd.help.desc': 'Clan Bot v2.1 komutları:',
  'cmd.help.tag_mgmt': 'Tag Yönetimi',
  'cmd.help.control': 'Kontrol',
  'cmd.help.info': 'Bilgi',
  'cmd.help.settings': 'Ayarlar',

  // Commands - About
  'cmd.about.title': 'Clan Bot v2.1',
  'cmd.about.desc': 'Discord clan tag takip botu. Kullanıcıların clan taglarını otomatik olarak kontrol eder ve eşleşen rolleri yönetir.',

  // Permissions
  'perm.denied': 'Yetersiz Yetki',
  'perm.denied.desc': 'Bu komutu kullanmak için **{perm}** yetkisine ihtiyacınız var.',

  // Generic
  'error': 'Hata',
  'generic.error': 'Bu komutu çalıştırırken bir hata oluştu!',
  'field.user': 'Kullanıcı',
  'field.tag': 'Tag',
  'field.role': 'Rol',
  'field.time': 'Zaman',
  'field.checked': 'Kontrol Edilen',
  'field.role_change': 'Rol Değişimi',
  'field.current_tag': 'Mevcut Tag',
  'field.no_tag': 'Tag yok',
  'field.added_by': 'Ekleyen',

  // Audit action names
  'audit.tag_add': 'Tag Ekleme',
  'audit.tag_remove': 'Tag Silme',
  'audit.settings_change': 'Ayar Değişikliği',
  'audit.manual_check': 'Manuel Kontrol',
  'audit.full_check': 'Tam Tarama',
  'audit.requirement_set': 'Gereksinim Ayarı',
  'audit.dashboard_set': 'Dashboard Ayarı',
  'audit.language_change': 'Dil Değişikliği',

  // Dashboard
  'dashboard.title': 'Clan Bot Dashboard',
  'dashboard.members': 'Üyeler',
  'dashboard.tags': 'Tanımlı Taglar',
  'dashboard.streaks': 'Top Streak',
  'dashboard.stats': 'İstatistikler',
  'dashboard.no_streaks': 'Henüz streak yok',
  'dashboard.checks': 'Tarama: {count}',
  'dashboard.role_adds': 'Ekleme: {count}',
  'dashboard.last_check': 'Son Kontrol',
  'dashboard.interval': 'Aralık',
};
