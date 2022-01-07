import { io } from "socket.io-client";
import userInputHandler from "./userInput.js";

var socket = io();

// var form = document.getElementById('form');
// var input = document.getElementById('input');

export default function server() {

  // form.addEventListener('submit', function (e) {
  //   e.preventDefault();
  //   if (input.value) {
  //     socket.emit('chat message', input.value);
  //     input.value = '';
  //   }
  // });

  userInputHandler(socket)

  // socket.on('message', function (msg) {
  //   var item = document.createElement('li');
  //   item.textContent = msg;
  //   messages.appendChild(item);
  //   window.scrollTo(0, document.body.scrollHeight);
  // });

}