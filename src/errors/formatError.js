// Підтягує локалізований текст за кодом та підставляє параметри
export const formatError = (t, appError) => {
  if (!appError || !appError.code) return String(appError || '');
  const key = `${appError.code}_tpl`; // напр.: ERR_INVALID_A_tpl
  const fallbackKey = appError.code;  // на випадок, якщо без _tpl збережете
  const msg = t(key, appError.params) || t(fallbackKey, appError.params) || appError.code;
  return msg;
};
