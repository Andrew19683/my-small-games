import express from "express";
import type { Request, Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import type { CheckResult, MastermindRoom } from "./types.js";
import { generateCode, checkGuess } from "./logic.js";

const app = express();
const PORT = 3000;
const rooms: Record<string, MastermindRoom> = {};
const answerLength: number = 4;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

function createRoom(currentUserId: string, answerLen: number): MastermindRoom {
  const room: MastermindRoom = {
    id: generateCode(4),
    player1: currentUserId,
    player2: null,
    answer: null,
    currentAttempt: 0,
    currentRound: {
      player1Guess: null,
      player1Result: null,
      player2Guess: null,
      player2Result: null,
    },
  };
  return room;
}

function joinRoom(roomId: string, currentUserId: string): never | void {
  const room = rooms[roomId];
  if (!room) {
    throw new Error(`Комната с номером ${roomId} не существует`);
  } else {
    room.player2 = currentUserId;
  }
}

// Define a route for the root URL
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const server = httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  console.log("Игрок подключился:", socket.id);

  socket.on("createRoom", () => {
    const room: MastermindRoom = createRoom(socket.id, 4);
    rooms[room.id] = room;
    socket.join(room.id);
    return socket.emit("roomCreated", room.id);
  });

  socket.on("joinRoom", (roomId) => {
    try {
      joinRoom(roomId, socket.id);
      socket.join(roomId);

      const room = rooms[roomId];
      if (room?.player2) {
        room.answer = generateCode(4);
        io.to(roomId).emit("gameStart", room.answer);
      }
    } catch (e) {
      socket.emit("failedToConnect", roomId);
    }
  });

  socket.on("sendGuess", (guess: string, roomId: string) => {
    const room = rooms[roomId];
    if (!room) {
      throw new Error(`Комната с номером ${roomId} не существует`);
    }
    const guessResult: CheckResult = checkGuess(guess, room.answer!);

    if (guessResult.rightPosition === answerLength) {
      io.to(roomId).emit("gameOver", socket.id);
      return;
    }

    if (room.player1 === socket.id) {
      room.currentRound.player1Guess = guess;
      room.currentRound.player1Result = guessResult;
    } else {
      room.currentRound.player2Guess = guess;
      room.currentRound.player2Result = guessResult;
    }
    socket.emit("guessResult", guessResult);

    if (room.currentRound.player1Guess && room.currentRound.player2Guess) {
      io.to(roomId).emit("bothAnswered", room.currentRound);

      room.currentRound = {
        player1Guess: null,
        player1Result: null,
        player2Guess: null,
        player2Result: null,
      };
      room.currentAttempt++;
    }
  });

  socket.on("disconnect", () => {
    console.log("Игрок отключился:", socket.id);
  });
});
