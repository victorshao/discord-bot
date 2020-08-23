const fs = require('fs');

class ChatWheel {

  handleMessage(message, command) {
    if (command.length === 1 && fs.existsSync(`src/sounds/${command[0]}.mp3`)) {
      const voiceChannel = message.member.voiceChannel;
      if (voiceChannel) {
        voiceChannel.join().then(connection => {
          connection.playFile(`src/sounds/${command[0]}.mp3`);
        });
      } else {
        message.channel.send('I can\'t play sounds if you aren\'t in a voice channel.');
      }
      return true;
    }

    return false;
  }

}

module.exports = ChatWheel;