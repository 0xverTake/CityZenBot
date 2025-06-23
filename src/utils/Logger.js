const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../../logs');
        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    formatMessage(level, message, extra = null) {
        const timestamp = this.getTimestamp();
        let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        if (extra) {
            if (extra instanceof Error) {
                formattedMessage += `\n${extra.stack}`;
            } else if (typeof extra === 'object') {
                formattedMessage += `\n${JSON.stringify(extra, null, 2)}`;
            } else {
                formattedMessage += `\n${extra}`;
            }
        }
        
        return formattedMessage;
    }

    writeToFile(level, message) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const logFile = path.join(this.logDir, `${today}.log`);
            
            fs.appendFileSync(logFile, message + '\n', 'utf8');
        } catch (error) {
            console.error('Erreur lors de l\'écriture du log:', error);
        }
    }

    info(message, extra = null) {
        const formattedMessage = this.formatMessage('info', message, extra);
        console.log('\x1b[32m%s\x1b[0m', formattedMessage); // Vert
        this.writeToFile('info', formattedMessage);
    }

    warn(message, extra = null) {
        const formattedMessage = this.formatMessage('warn', message, extra);
        console.warn('\x1b[33m%s\x1b[0m', formattedMessage); // Jaune
        this.writeToFile('warn', formattedMessage);
    }

    error(message, extra = null) {
        const formattedMessage = this.formatMessage('error', message, extra);
        console.error('\x1b[31m%s\x1b[0m', formattedMessage); // Rouge
        this.writeToFile('error', formattedMessage);
    }

    debug(message, extra = null) {
        if (process.env.NODE_ENV === 'development') {
            const formattedMessage = this.formatMessage('debug', message, extra);
            console.log('\x1b[36m%s\x1b[0m', formattedMessage); // Cyan
            this.writeToFile('debug', formattedMessage);
        }
    }

    // Méthode pour nettoyer les anciens logs
    cleanup(daysToKeep = 7) {
        try {
            const files = fs.readdirSync(this.logDir);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

            files.forEach(file => {
                if (file.endsWith('.log')) {
                    const filePath = path.join(this.logDir, file);
                    const stats = fs.statSync(filePath);
                    
                    if (stats.mtime < cutoffDate) {
                        fs.unlinkSync(filePath);
                        this.info(`Log supprimé: ${file}`);
                    }
                }
            });
        } catch (error) {
            this.error('Erreur lors du nettoyage des logs:', error);
        }
    }
}

module.exports = new Logger();
