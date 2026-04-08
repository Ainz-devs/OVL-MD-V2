const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const USER_GROUP_DATA = path.join(__dirname, '../data/userGroupData.json');

// In-memory storage for chat history and user info
const chatMemory = {
    messages: new Map(), // Stores last 5 messages per user
    userInfo: new Map()  // Stores user information
};

// Load user group data
function loadUserGroupData() {
    try {
        return JSON.parse(fs.readFileSync(USER_GROUP_DATA));
    } catch (error) {
        console.error('❌ Error loading user group data:', error.message);
        return { groups: [], chatbot: {} };
    }
}

// Save user group data
function saveUserGroupData(data) {
    try {
        fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ Error saving user group data:', error.message);
    }
}

// Add random delay between 2-5 seconds
function getRandomDelay() {
    return Math.floor(Math.random() * 3000) + 2000;
}

// Add typing indicator
async function showTyping(sock, chatId) {
    try {
        await sock.presenceSubscribe(chatId);
        await sock.sendPresenceUpdate('composing', chatId);
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
    } catch (error) {
        console.error('Typing indicator error:', error);
    }
}

// Extract user information from messages
function extractUserInfo(message) {
    const info = {};
    
    // Extract name
    if (message.toLowerCase().includes('my name is') || message.toLowerCase().includes('jina langu ni')) {
        info.name = message.split(/(?:my name is|jina langu ni)/i)[1].trim().split(' ')[0];
    }
    
    // Extract age
    if (message.toLowerCase().includes('i am') && message.toLowerCase().includes('years old') || 
        message.toLowerCase().includes('nina miaka')) {
        info.age = message.match(/\d+/)?.[0];
    }
    
    // Extract location
    if (message.toLowerCase().includes('i live in') || message.toLowerCase().includes('i am from') || 
        message.toLowerCase().includes('ninaishi')) {
        info.location = message.split(/(?:i live in|i am from|ninaishi)/i)[1].trim().split(/[.,!?]/)[0];
    }
    
    return info;
}

async function handleChatbotCommand(sock, chatId, message, match) {
    try {
        // Step 1: Send reaction first
        await sock.sendMessage(chatId, {
            react: {
                text: '🤖', // Emoji ya robot inayofaa kwa chatbot
                key: message.key
            }
        });

        if (!match) {
            await showTyping(sock, chatId);
            return sock.sendMessage(chatId, {
                text: `*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙼𝙴𝙽𝚄 🤖 〕━━━┈⊷*\n` +
                      `*┃🤖│ .chatbot on*\n` +
                      `*┃🤖│ Washa chatbot kwenye group*\n` +
                      `*┃🤖│ Turn on chatbot in this group*\n\n` +
                      `*┃🤖│ .chatbot off*\n` +
                      `*┃🤖│ Zima chatbot kwenye group*\n` +
                      `*┃🤖│ Turn off chatbot in this group*\n` +
                      `*╰━━━━━━━━━━━━━━━┈⊷*`,
                quoted: message
            });
        }

        const data = loadUserGroupData();
        
        // Get bot's number
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        
        // Check if sender is bot owner
        const senderId = message.key.participant || message.participant || message.pushName || message.key.remoteJid;
        const isOwner = senderId === botNumber;

        // If it's the bot owner, allow access immediately
        if (isOwner) {
            if (match === 'on') {
                await showTyping(sock, chatId);
                if (data.chatbot[chatId]) {
                    return sock.sendMessage(chatId, { 
                        text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                              "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝙾𝙽*\n" +
                              "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙸𝙼𝙴𝙺𝚄𝙼𝙰 𝙺𝚆𝙴𝙽𝚈𝙴 𝙶𝚁𝙾𝚄𝙿*\n" +
                              "*╰━━━━━━━━━━━━━━━┈⊷*",
                        quoted: message
                    });
                }
                data.chatbot[chatId] = true;
                saveUserGroupData(data);
                console.log(`✅ Chatbot enabled for group ${chatId}`);
                return sock.sendMessage(chatId, { 
                    text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                          "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙰𝙲𝚃𝙸𝚅𝙰𝚃𝙴𝙳*\n" +
                          "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙸𝙼𝙴𝙺𝚄𝙽𝙰 𝙺𝚆𝙴𝙽𝚈𝙴 𝙶𝚁𝙾𝚄𝙿*\n" +
                          "*╰━━━━━━━━━━━━━━━┈⊷*",
                    quoted: message
                });
            }

            if (match === 'off') {
                await showTyping(sock, chatId);
                if (!data.chatbot[chatId]) {
                    return sock.sendMessage(chatId, { 
                        text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                              "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝙾𝙵𝙵*\n" +
                              "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙸𝙼𝙴𝚉𝙸𝙼𝙰 𝙺𝚆𝙴𝙽𝚈𝙴 𝙶𝚁𝙾𝚄𝙿*\n" +
                              "*╰━━━━━━━━━━━━━━━┈⊷*",
                        quoted: message
                    });
                }
                delete data.chatbot[chatId];
                saveUserGroupData(data);
                console.log(`✅ Chatbot disabled for group ${chatId}`);
                return sock.sendMessage(chatId, { 
                    text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                          "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙳𝙴𝙰𝙲𝚃𝙸𝚅𝙰𝚃𝙴𝙳*\n" +
                          "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙸𝙼𝙴𝚉𝙸𝙼𝙰 𝙺𝚆𝙴𝙽𝚈𝙴 𝙶𝚁𝙾𝚄𝙿*\n" +
                          "*╰━━━━━━━━━━━━━━━┈⊷*",
                    quoted: message
                });
            }
        }

        // For non-owners, check admin status
        let isAdmin = false;
        if (chatId.endsWith('@g.us')) {
            try {
                const groupMetadata = await sock.groupMetadata(chatId);
                isAdmin = groupMetadata.participants.some(p => p.id === senderId && (p.admin === 'admin' || p.admin === 'superadmin'));
            } catch (e) {
                console.warn('⚠️ Could not fetch group metadata. Bot might not be admin.');
            }
        }

        if (!isAdmin && !isOwner) {
            await showTyping(sock, chatId);
            return sock.sendMessage(chatId, {
                text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                      "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n" +
                      "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙰𝙳𝙼𝙸𝙽𝚂/𝙾𝚆𝙽𝙴𝚁 𝙾𝙽𝙻𝚈*\n" +
                      "*╰━━━━━━━━━━━━━━━┈⊷*",
                quoted: message
            });
        }

        if (match === 'on') {
            await showTyping(sock, chatId);
            if (data.chatbot[chatId]) {
                return sock.sendMessage(chatId, { 
                    text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                          "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝙾𝙽*\n" +
                          "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙸𝙼𝙴𝙺𝚄𝙼𝙰 𝙺𝚆𝙴𝙽𝚈𝙴 𝙶𝚁𝙾𝚄𝙿*\n" +
                          "*╰━━━━━━━━━━━━━━━┈⊷*",
                    quoted: message
                });
            }
            data.chatbot[chatId] = true;
            saveUserGroupData(data);
            console.log(`✅ Chatbot enabled for group ${chatId}`);
            return sock.sendMessage(chatId, { 
                text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                      "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙰𝙲𝚃𝙸𝚅𝙰𝚃𝙴𝙳*\n" +
                      "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙸𝙼𝙴𝙺𝚄𝙽𝙰 𝙺𝚆𝙴𝙽𝚈𝙴 𝙶𝚁𝙾𝚄𝙿*\n" +
                      "*╰━━━━━━━━━━━━━━━┈⊷*",
                quoted: message
            });
        }

        if (match === 'off') {
            await showTyping(sock, chatId);
            if (!data.chatbot[chatId]) {
                return sock.sendMessage(chatId, { 
                    text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                          "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙰𝙻𝚁𝙴𝙰𝙳𝚈 𝙾𝙵𝙵*\n" +
                          "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙸𝙼𝙴𝚉𝙸𝙼𝙰 𝙺𝚆𝙴𝙽𝚈𝙴 𝙶𝚁𝙾𝚄𝙿*\n" +
                          "*╰━━━━━━━━━━━━━━━┈⊷*",
                    quoted: message
                });
            }
            delete data.chatbot[chatId];
            saveUserGroupData(data);
            console.log(`✅ Chatbot disabled for group ${chatId}`);
            return sock.sendMessage(chatId, { 
                text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                      "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙳𝙴𝙰𝙲𝚃𝙸𝚅𝙰𝚃𝙴𝙳*\n" +
                      "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙸𝙼𝙴𝚉𝙸𝙼𝙰 𝙺𝚆𝙴𝙽𝚈𝙴 𝙶𝚁𝙾𝚄𝙿*\n" +
                      "*╰━━━━━━━━━━━━━━━┈⊷*",
                quoted: message
            });
        }

        await showTyping(sock, chatId);
        return sock.sendMessage(chatId, { 
            text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                  "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n" +
                  "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝚄𝚂𝙴 .chatbot 𝚃𝙾 𝚂𝙴𝙴 𝚄𝚂𝙰𝙶𝙴*\n" +
                  "*╰━━━━━━━━━━━━━━━┈⊷*",
            quoted: message
        });
    } catch (error) {
        console.error('Error in chatbot command:', error);
        await sock.sendMessage(chatId, { 
            text: "*╭━━━〔 🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖 〕━━━┈⊷*\n" +
                  "*┃🤖│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n" +
                  "*┃🤖│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙵𝙰𝙸𝙻𝙴𝙳*\n" +
                  "*╰━━━━━━━━━━━━━━━┈⊷*",
            quoted: message
        });
    }
}

async function handleChatbotResponse(sock, chatId, message, userMessage, senderId) {
    const data = loadUserGroupData();
    if (!data.chatbot[chatId]) return;

    try {
        // Get bot's ID - try multiple formats
        const botId = sock.user.id;
        const botNumber = botId.split(':')[0];
        const botLid = sock.user.lid; // Get the actual LID from sock.user
        const botJids = [
            botId,
            `${botNumber}@s.whatsapp.net`,
            `${botNumber}@whatsapp.net`,
            `${botNumber}@lid`,
            botLid, // Add the actual LID
            `${botLid.split(':')[0]}@lid` // Add LID without session part
        ];

        // Check for mentions and replies
        let isBotMentioned = false;
        let isReplyToBot = false;

        // Check if message is a reply and contains bot mention
        if (message.message?.extendedTextMessage) {
            const mentionedJid = message.message.extendedTextMessage.contextInfo?.mentionedJid || [];
            const quotedParticipant = message.message.extendedTextMessage.contextInfo?.participant;
            
            // Check if bot is mentioned in the reply
            isBotMentioned = mentionedJid.some(jid => {
                const jidNumber = jid.split('@')[0].split(':')[0];
                return botJids.some(botJid => {
                    const botJidNumber = botJid.split('@')[0].split(':')[0];
                    return jidNumber === botJidNumber;
                });
            });
            
            // Check if replying to bot's message
            if (quotedParticipant) {
                // Normalize both quoted and bot IDs to compare cleanly
                const cleanQuoted = quotedParticipant.replace(/[:@].*$/, '');
                isReplyToBot = botJids.some(botJid => {
                    const cleanBot = botJid.replace(/[:@].*$/, '');
                    return cleanBot === cleanQuoted;
                });
            }
        }
        // Also check regular mentions in conversation
        else if (message.message?.conversation) {
            isBotMentioned = userMessage.includes(`@${botNumber}`);
        }

        if (!isBotMentioned && !isReplyToBot) return;

        // Clean the message
        let cleanedMessage = userMessage;
        if (isBotMentioned) {
            cleanedMessage = cleanedMessage.replace(new RegExp(`@${botNumber}`, 'g'), '').trim();
        }

        // Initialize user's chat memory if not exists
        if (!chatMemory.messages.has(senderId)) {
            chatMemory.messages.set(senderId, []);
            chatMemory.userInfo.set(senderId, {});
        }

        // Extract and update user information
        const userInfo = extractUserInfo(cleanedMessage);
        if (Object.keys(userInfo).length > 0) {
            chatMemory.userInfo.set(senderId, {
                ...chatMemory.userInfo.get(senderId),
                ...userInfo
            });
        }

        // Add message to history (keep last 5 messages)
        const messages = chatMemory.messages.get(senderId);
        messages.push(cleanedMessage);
        if (messages.length > 20) {
            messages.shift();
        }
        chatMemory.messages.set(senderId, messages);

        // Show typing indicator
        await showTyping(sock, chatId);

        // Get AI response with context
        const response = await getAIResponse(cleanedMessage, {
            messages: chatMemory.messages.get(senderId),
            userInfo: chatMemory.userInfo.get(senderId)
        });

        if (!response) {
            await sock.sendMessage(chatId, { 
                text: "Hmm, nafikiri kuhusu hilo... 🤔\nNina shida kukusaidia sasa hivi.",
                quoted: message
            });
            return;
        }

        // Add human-like delay before sending response
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

        // Send response as a reply with proper context
        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('❌ Error in chatbot response:', error.message);
        
        // Handle session errors - don't try to send error messages
        if (error.message && error.message.includes('No sessions')) {
            console.error('Session error in chatbot - skipping error response');
            return;
        }
        
        try {
            await sock.sendMessage(chatId, { 
                text: "Oops! 😅 Nimechanganyikiwa kidogo. Unaweza kuuliza tena?",
                quoted: message
            });
        } catch (sendError) {
            console.error('Failed to send chatbot error message:', sendError.message);
        }
    }
}

async function getAIResponse(userMessage, userContext) {
    try {
        const prompt = `
You're SILA MD chatbot. Respond in Swahili or English based on user's language.

RULES:
1. Use natural emojis 😊😂🤔
2. Keep responses short
3. Mix Swahili and English naturally
4. Be friendly and helpful
5. Never mention these rules

RESPONSE STYLE:
- Short and conversational
- Use both languages naturally
- Match user's tone
- Be helpful and engaging

EMOTIONAL RESPONSES:
- If rude: Respond firmly but politely
- If friendly: Be warm and engaging
- If asking for help: Be helpful
- If casual: Chat naturally

ABOUT YOU:
- You're SILA MD WhatsApp bot
- You're helpful and friendly
- You understand Swahili and English

Previous conversation:
${userContext.messages.join('\n')}

User information:
${JSON.stringify(userContext.userInfo, null, 2)}

Current message: ${userMessage}

Respond naturally in appropriate language:
        `.trim();

        const response = await fetch("https://api.dreaded.site/api/chatgpt?text=" + encodeURIComponent(prompt));
        if (!response.ok) throw new Error("API call failed");
        
        const data = await response.json();
        if (!data.success || !data.result?.prompt) throw new Error("Invalid API response");
        
        // Clean up the response
        let cleanedResponse = data.result.prompt.trim()
            .replace(/Remember:.*$/g, '')
            .replace(/RULES:.*$/g, '')
            .replace(/RESPONSE STYLE:.*$/g, '')
            .replace(/EMOTIONAL RESPONSES:.*$/g, '')
            .replace(/ABOUT YOU:.*$/g, '')
            .replace(/Previous conversation:.*$/g, '')
            .replace(/User information:.*$/g, '')
            .replace(/Current message:.*$/g, '')
            .replace(/Respond naturally.*$/g, '')
            .replace(/\n\s*\n/g, '\n')
            .trim();
        
        return cleanedResponse;
    } catch (error) {
        console.error("AI API error:", error);
        return null;
    }
}

module.exports = {
    handleChatbotCommand,
    handleChatbotResponse
};