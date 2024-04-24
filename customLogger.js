const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs', 'app.log'); // Chemin vers le fichier de logs

const writeLog = (level, message, error = null) => {
  let logEntry = `${new Date().toISOString()} [${level.toUpperCase()}]: ${message}`; // Utilisez let au lieu de const
  if (error) {
    logEntry += `\n${error.stack}`;
  }
  fs.appendFileSync(logFilePath, logEntry + '\n');
};

module.exports = {
  info: (message) => writeLog('info', message),
  warn: (message) => writeLog('warn', message),
  error: (message, error) => writeLog('error', message, error),
};
