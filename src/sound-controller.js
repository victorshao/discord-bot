class SoundController {

  constructor() {
    this.subscribers = [];
  }

  subscribe(commandHandler) {
    this.subscribers.push(commandHandler);
  }

  handleMessage(message, command) {
    let messageHandled = false;
    for (let subscriber of this.subscribers) {
      let thisMessageHandled = subscriber.handleMessage(message, command);
      messageHandled = messageHandled || thisMessageHandled;
    }
    return messageHandled;
  }

}

module.exports = SoundController;