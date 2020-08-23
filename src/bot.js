const Discord = require('discord.js');
const fs = require('fs');
const auth = require('./auth.json');

const FS_PREFIX = 'src/';
const SOUND_PREFIX = FS_PREFIX + 'sounds/';

const client = new Discord.Client();
let helpText = "";

// TODO: append sounds to commandList
// TODO: have !help check sounds/ instead of using help.txt
// TODO: queue chatwheel sounds
// TODO: emoji list command
function handleMessage(message) {
  if (message.content.charAt(0) !== '!') {
    return;
  }
  const commandList = {
    help: () => { help(message.channel); },
    ping: () => { ping(message.channel); },
  };
  const command = message.content.substring(1);
  if (commandList.hasOwnProperty(command)) {
    commandList[command]();
  } else if (fs.existsSync(`${SOUND_PREFIX}${command}.mp3`)) {
    chatwheel(message, `${SOUND_PREFIX}${command}.mp3`);
  } else {
    message.channel.send('Sorry, I don\'t recognize that command. Type !help for a list.');
  }
}

function chatwheel(message, filename) {
  const voiceChannel = message.member.voice.channel;
  if (voiceChannel) {
    voiceChannel.join().then(connection => {
      connection.play(filename);
    });
  } else {
    message.channel.send('I can\'t play sounds if you aren\'t in a voice channel.');
  }
}

function help(channel) {
  if (helpText) {
    channel.send('Available sounds: ');
    channel.send('`' + helpText + '`');
  } else {
    fs.readFile(FS_PREFIX + 'help.txt', 'utf8', (error, data) => {
      if (error) {
        channel.send('I\'m not feeling so well. Ask my owner for help.');
        console.log(error.name + ': ' + error.message);
      } else {
        helpText = data;
        // Async
        channel.send('Available sounds: ');
        channel.send('`' + helpText + '`');
      }
    });
  }
}

function ping(channel) {
  channel.send('Pong!');
}

function main() {
  client.on('ready', () => {
    console.log('Ready!');
  });
  // client.on('debug', message => {
  //   console.log(message);
  // });

  client.on('message', handleMessage);
  client.login(auth.token);
}

main();