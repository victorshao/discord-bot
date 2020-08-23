const ytdl = require('ytdl-core');

class Jukebox {
  
  constructor() {
    this.queue = [];
    this.dispatcher = null;
  }

  handleMessage(message, command) {
    if (command.length === 2 && command[0] === 'queue') {
      this.queue.push(command[1]);
      message.channel.send('Song queued.');
    } else if (command.length === 1 && command[0] === 'play') {
      const voiceChannel = message.member.voiceChannel;
      if (voiceChannel) {
        if (this.dispatcher && this.dispatcher.paused) {
          this.dispatcher.resume();
        } else if (this.queue.length === 0) {
          message.channel.send('No songs queued. !queue a song before playing!');
        } else {
          this.playSongs(voiceChannel);
        }
      } else {
        message.channel.send('I can\'t play songs if you aren\'t in a voice channel.');
      }
    } else if (command.length === 1 && command[0] === 'pause') {
      if (this.dispatcher) {
        this.dispatcher.pause();
      }
    } else if (command.length === 1 && command[0] === 'skip') {
      if (this.dispatcher) {
        this.dispatcher.end();
      }
    } else {
      return false;
    }

    return true;
  }

  playSongs(voiceChannel) {
    if (this.queue.length > 0) {
      const nextSong = this.queue.shift();
      const streamOptions = { volume: 0.1 };
      const audio = ytdl(`https://www.youtube.com/watch?v=${nextSong}`, { filter: 'audioonly' })

      voiceChannel.join().then(connection => {
        this.dispatcher = connection.playStream(audio);
        this.dispatcher.on('end', () => {
          setTimeout(this.playSongs, 1000, voiceChannel);
        });
      });
    }
  }

}

module.exports = Jukebox;