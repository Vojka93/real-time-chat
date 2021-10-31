class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = db.collection("chats");
    this.unsub;
  }

  async addChat(message) {
    // format a chat object
    const now = new Date(); // when the user submited chat
    const chat = {
      message: message, // or ES6 just "message"
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now),
    };
    // save the chat document
    const response = await this.chats.add(chat);
    return response;
  }

  getChats(callback) {
    this.unsub = this.chats
      // Now, if one saves the code using the 'onSnapshot' method into a variable (say, 'snap' for example),
      // the 'snap' variable will now act as a function. If/when 'snap' is ever called ( like so 'snap()' )
      // the listener is removed from the code contained within the 'snap' variable. In this case, snapshots will no longer be taken.
      .where("room", "==", this.room)
      .orderBy("created_at")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            // update ui
            callback(change.doc.data());
          }
        });
      });
  }

  updateName(username) {
    this.username = username;
    localStorage.setItem("username", username);
  }

  updateRoom(room) {
    // updating the room
    this.room = room;
    console.log("room updated");
    // unsubscribing from changes from the old room
    if (this.unsub) {
      this.unsub();
    }
  }
}

// chatroom
//   .addChat("hello everyone")
//   .then(() => console.log("chat added"))
//   .catch((err) => console.log(err));

// setTimeout(() => {
//   chatroom.updateRoom("gaming");
//   chatroom.updateName("Yoshi");
//   chatroom.getChats((data) => {
//     console.log(data);
//   });
//   chatroom.addChat("hello");
// }, 3000);
