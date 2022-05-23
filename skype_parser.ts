import fs from 'fs';
import { exit } from 'process';
import readline from 'readline';

interface LogFile {
    userId: string;
    exportDate: string;
    conversations: Conversation[];
}

interface Conversation {
    id: string;
    displayName?: string;
    version?: string;
    properties?: any;
    threadProperties?: any;
    MessageList?: Message[];
}

interface Message {
    id: string;
    displayName?: string;
    originalarrivaltime: string;
    messagetype: string;
    version: any;
    content: string;
    conversationid: string;
    from: string;
    properties?: any;
    amsreferences?: any;
}

const filename = process.argv[2];
if (!filename) {
    console.error('Please specify the file to parse');
    console.error('ex: npm start messages.json')
    exit(1);
}


const data = fs.readFileSync(filename);
const jsonData: LogFile = JSON.parse(data.toString());

// for ([key, value] of Object.entries(jsonData.conversations[0])) {
//     console.log(key);
// }

// get id property of each element of jsonData.conversations
const names = jsonData.conversations.map((e: any) => e.displayName);
names.forEach((name: any) => console.log(name));

// // ask user which element to display by selecting it from the list of names
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = () => {
    rl.question('Which conversation do you want to display? ', (answer) => {
        // const index = names.index(answer); // <=== to change (or verify)
        const index = names.indexOf(answer);
        if (index === -1) {
            // search a similar name
            const similar = names.filter((e: any) => e?.includes(answer));
            if (similar.length === 0) {
                console.log('No conversation found with this name');
            } else {
                console.log('Did you mean one of these? ');
                similar.forEach((e: any) => {if (e) console.log(e)});
            }
            askQuestion();
            return;
        }
        const conversation = jsonData.conversations[index];
        createOrganizedConversations(conversation);
        process.exit(0);
    }
    );
}

askQuestion();
/**
 * create a folder with the displayName, inside create folders for each years, inside for each month, inside a text file of each day of a conversation part
 */
const createOrganizedConversations = (conversation: Conversation) => {
    conversation!.MessageList!.forEach((message: Message) => {
        const date = new Date(message.originalarrivaltime);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const path = `output/${conversation.displayName}/${year}/${month}`;
        fs.mkdirSync(path, { recursive: true });
        fs.appendFileSync(`${path}/${day}.txt`, `${message.displayName}: ${message.content}\n`);
    });
}


// const displayName = conversation.displayName;
// const year = conversation.properties.originalarrivaltime.substring(0, 4);
// const month = conversation.properties.originalarrivaltime.substring(5, 7);
// const day = conversation.properties.originalarrivaltime.substring(8, 10);
// const date = `${year}-${month}-${day}`;
// const path = `./${displayName}/${year}/${month}/${date}.txt`;
// const content = conversation.MessageList.map((e: any) => e.content).join('\n');
// fs.mkdirSync(`./${displayName}/${year}`, { recursive: true });
// fs.mkdirSync(`./${displayName}/${year}/${month}`, { recursive: true });
// fs.writeFileSync(path, content);