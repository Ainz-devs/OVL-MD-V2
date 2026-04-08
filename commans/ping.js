const os = require('os');
const settings = require('../settings.js');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {
        // Step 1: Send reaction first
        await sock.sendMessage(chatId, {
            react: {
                text: '🏓', // Emoji ya ping pong
                key: message.key
            }
        });

        // Step 2: Calculate ping
        const start = Date.now();
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);

        // Step 3: Send ping result - message tu ya PONG na ms
        const pingResult = `𝙿𝙾𝙽𝙶! ${ping}𝚖𝚜`;

        await sock.sendMessage(chatId, { 
            text: pingResult 
        }, { quoted: message });

    } catch (error) {
        console.error('Error in ping command:', error);
        
        // Send error message simple
        await sock.sendMessage(chatId, { 
            text: '𝙴𝚁𝚁𝙾𝚁' 
        });
    }
}

module.exports = pingCommand;