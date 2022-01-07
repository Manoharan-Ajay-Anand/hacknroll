import * as keyboardjs from 'keyboardjs';
import { Socket } from 'socket.io-client';

export default function userInputHandler(socket: Socket) {
  keyboardjs.bind("w", () => {
    socket.emit("payload", {
      username: socket.id,
      action: "w"
    })
  })

  keyboardjs.bind("s", () => {
    socket.emit("payload", {
      username: socket.id,
      action: "s"
    })
  })
}