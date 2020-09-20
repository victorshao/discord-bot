const Discord = require('discord.js');
const fs = require('fs');
const auth = require('./auth.json');

const FS_DIR = 'src/';
const SOUND_DIR = FS_DIR + 'sounds/';
const ALLOWED_EXTENSIONS = ['mp3'];
const COMMANDS_CHANNEL = 'bot-commands';

const client = new Discord.Client();
let helpText = "";
let soundHelp = "";
const commandStats = {};

// TODO:
// command statistics
// emoji list command
// embed help message
// random sound

function main() {
  const sounds = loadSounds();
  client.on('message', message => {
    handleMessage(message, sounds);
  });
  client.on('ready', () => {
    console.log('Ready!');
  });
  // client.on('debug', message => {
  //   console.log(message);
  // });
  client.login(auth.token);
}

function loadSounds() {
  const soundFiles = [];
  fs.readdirSync(SOUND_DIR).forEach(file => {
    const ext = file.substring(file.lastIndexOf('.') + 1);
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      soundFiles.push(file);
      console.log('Loaded sound \'' + file + '\'');
    }
  });
  soundHelp = soundFiles.map(file => '!' + file.substring(0, file.lastIndexOf('.'))).join(' ');
  return soundFiles;
}

function handleMessage(message, soundFiles) {
  if (message.content.charAt(0) !== '!') {
    return;
  }

  if (message.channel.name !== COMMANDS_CHANNEL) {
    message.channel.send('Please enter commands in the #bot-commands channel.');
    return;
  }

  const commandList = {
    help: () => { help(message.channel); },
    ping: () => { ping(message.channel); },
    stats: () => { commandStats(message.channel); },
  };
  soundFiles.forEach(file => {
    const fileNoExt = file.substring(0, file.lastIndexOf('.'));
    commandList[fileNoExt] = () => {
      playSound(message, file);
    };
  });
  const command = message.content.substring(1);
  if (commandList.hasOwnProperty(command)) {
    commandList[command]();
    if (commandStats.hasOwnProperty(command)) {
      commandStats[command]++;
    } else {
      commandStats[command] = 1;
    }
  } else {
    message.channel.send('Sorry, I don\'t recognize that command. Type !help for a list.');
  }
}

function playSound(message, filename) {
  const voiceChannel = message.member.voice.channel;
  if (voiceChannel) {
    voiceChannel.join().then(connection => {
      connection.play(SOUND_DIR + filename, { volume: 0.4 });
    });
  } else {
    message.channel.send('I can\'t play sounds if you aren\'t in a voice channel.');
  }
}

function commandStats(channel) {
  let stats = '```Number of times each command has been called:\n';

  channel.send(stats);
}

function help(channel) {
  if (helpText) {
    channel.send(
        '```'
      + helpText
      + '\n'
      + '\nAvailable sounds:'
      + '\n' + soundHelp
      + '```'
    );
  } else {
    fs.readFile(FS_DIR + 'help.txt', 'utf8', (error, data) => {
      if (error) {
        channel.send('I\'m not feeling so well. Ask my owner for help.');
        console.log(error.name + ': ' + error.message);
      } else {
        helpText = data;
        // Async; must duplicate these lines
        channel.send(
            '```'
          + helpText
          + '\n'
          + '\nAvailable sounds:'
          + '\n' + soundHelp
          + '```'
        );
      }
    });
  }
}

function ping(channel) {
  channel.send('Pong!');
}

main();
