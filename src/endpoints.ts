const baseUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

export default {
  baseUrl     : baseUrl, // TODO improve, this should not be here
  getMe       : `${baseUrl}/getMe`,
  getUpdates  : `${baseUrl}/getUpdates`,
  sendMessage : `${baseUrl}/sendMessage`,
}
