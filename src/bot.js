const FS_PREFIX = 'src/';
const REQUIRE_PREFIX = './';
const Discord = require('discord.js');
const fs = require('fs');
// const ChatWheel = require('./chat-wheel.js');
// const Jukebox = require('./jukebox.js');
// const SoundController = require('./sound-controller.js');
const auth = require(REQUIRE_PREFIX + 'auth.json');


const client = new Discord.Client();
// const controller = new SoundController();
// const chatWheelHandler = new ChatWheel();
// controller.subscribe(chatWheelHandler);
// const jukebox = new Jukebox();
// controller.subscribe(jukebox);

let helpText = "";

function handleMessage(message) {
  if (message.content.charAt(0) !== '!') {
    return;
  }

  const command = message.content.substring(1);
  const commandArgs = command.split(' ');
  const commandList = {
    help: () => { help(message); },
    ping: () => { ping(message); },
  };

  if (commandList.hasOwnProperty(command)) {
    commandList[command]();
  } else {
    message.channel.send('Sorry, I don\'t recognize that command. Type !help for a list.');
  }
}

function help(message) {
  if (helpText) {
    message.channel.send('Available sounds: ');
    message.channel.send('`' + helpText + '`');
  } else {
    fs.readFile(FS_PREFIX + 'help.txt', 'utf8', (error, data) => {
      if (error) {
        message.channel.send('I\'m not feeling so well. Ask my owner for help.');
        console.log(error.name + ': ' + error.message);
      } else {
        helpText = data;
        // Async
        message.channel.send('Available sounds: ');
        message.channel.send('`' + helpText + '`');
      }
    });
  }
}

function ping(message) {
  message.channel.send('Pong!');
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