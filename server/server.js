/*jshint esversion: 6 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors');
var uuid = require('uuid');
var multer = require("multer");
var fs = require("fs");
var _ = require('lodash');


// Store active rooms
var rooms = [];

// Enable CORS for all calls
app.use(cors());

// Enable all pre-flight requests
//app.options('*', cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Config body-parser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

// Creates a new room
app.post('/createRoom', (req, res) => {
    // Create user
    var user = createUser(req.body.user);

    // Create room
    var room = createRoom(req.body.room, user);

    // Add room
    rooms.push(room);

    // Return room
    res.send(JSON.stringify({ room: room, user: user }));
});

// Creates a new user for a room
app.post('/createUser', (req, res) => {
    // Create user
    var user = createUser(req.body);

    // Find room
    let room = _.filter(rooms, (room) => {
        return room.id === user.roomId;
    })[0];

    if (room && !room.isLocked) {
        // Add newly created user to room
        room.users.push(user);

        // Return room and user 
        res.send(JSON.stringify({ room: room, user: user }));
    }
});

io.on('connection', (socket) => {

    socket.on('join-room', (roomId) => {

        socket.join(roomId);

        joinRoom(roomId);
    });

    socket.on('update-player', (user) => {
        updatePlayer(user);
    });

    socket.on('add-user', (room) => {
        addUser(room);
    });

    socket.on('remove-user', (user) => {
        removeUser(user);
    });

    socket.on('kick-user', (user) => {
        kickUser(user);
    });

    socket.on('get-room', (id) => {
        getRoom(id);
    });

    socket.on('lock-room', (locked) => {
        lockRoom(locked);
    });

    socket.on('freeze-room', (frozen) => {
        freezeRoom(frozen);
    });

    socket.on('edit-name', (room) => {
        editName(room);
    });

    socket.on('set-points', (user) => {
        setPoints(user);
    });

    socket.on('reveal-points', (room) => {
        revealPoints(room);
    });

    socket.on('start-timer', (room) => {
        startTimer(room);
    });

    socket.on('stop-timer', (room) => {
        stopTimer(room);
    });

    socket.on('pause-timer', (room) => {
        pauseTimer(room);
    });

    socket.on('unpause-timer', (room) => {
        unpauseTimer(room);
    });

    socket.on('reset-points', (room) => {
        resetPoints(room);
    });
});

function joinRoom(id) {
    let room = findRoom(id);

    if (room) {
        io.in(room.id).emit('room-joined', { room: room });
    }
}

function startTimer(timerRoom) {
    let room = findRoom(timerRoom.id);

    if (room) {
        io.in(room.id).emit('update-start-timer', { room: room });
    }
}

function stopTimer(timerRoom) {
    let room = findRoom(timerRoom.id);

    if (room) {
        io.in(room.id).emit('update-stop-timer', { room: room });
    }
}

function pauseTimer(timerRoom) {
    let room = findRoom(timerRoom.id);

    if (room) {
        io.in(room.id).emit('update-pause-timer', { room: room });
    }
}

function unpauseTimer(timerRoom) {
    let room = findRoom(timerRoom.id);

    if (room) {
        io.in(room.id).emit('update-unpause-timer', { room: room });
    }
}

function revealPoints(revealedRoom) {
    let room = findRoom(revealedRoom.id);

    if (room) {
        room.reveal = revealedRoom.reveal;

        io.in(room.id).emit('update-room', { room: room });
    }
}

function setPoints(user) {
    let room = findRoom(user.roomId);

    if (room && !room.isFrozen) {
        let pointedUser = _.filter(room.users, (roomUser) => {
            return roomUser.id === user.id;
        })[0];

        pointedUser.points = user.points;
        pointedUser.hasNewPoints = true;

        io.in(room.id).emit('update-points', { user: user });
    }

}

function resetPoints(resetPointsRoom) {
    let room = findRoom(resetPointsRoom.id);

    if (room) {
        room.reveal = false;

        _.each(room.users, (user) => {
            user.points = null;
            user.hasNewPoints = false;
        });

        // Unfreeze room on reset
        room.isFrozen = false;

        // Reset room timer
        // io.in(room.id).emit('start-timer');

        // Update room with new points
        io.in(room.id).emit('update-room', { room: room });
    }
}

function editName(userRoom) {
    let room = findRoom(userRoom.id);

    if (room) {
        room.name = userRoom.name;

        io.in(room.id).emit('update-room', { room: room });
    }
}

function addUser(userRoom) {
    let room = findRoom(userRoom.roomId);

    if (room) {
        room.users.push(userRoom.user);

        io.in(room.id).emit('update-room', { room: room });
    }
}

function lockRoom(lockedRoom) {
    let room = findRoom(lockedRoom.id);

    if (room) {
        room.isLocked = lockedRoom.isLocked;

        io.in(room.id).emit('update-room', { room: room });
    }
}

function freezeRoom(frozenRoom) {
    let room = findRoom(frozenRoom.id);

    if (room) {
        room.isFrozen = frozenRoom.isFrozen;

        io.in(room.id).emit('update-room', { room: room });
    }
}

function getRoom(id) {
    let room = findRoom(id);

    if (room) {
        io.in(room.id).emit('update-room', { room: room });
    }
}

function kickUser(user) {
    let room = findRoom(user.roomId);

    if (room) {
        // Remove user
        let kickedUser = _.remove(room.users, (roomUser) => {
            return roomUser.id === user.id;
        })[0];

        // Kick the user
        io.in(room.id).emit('kicked-user', { user: kickedUser });

        // Update room
        io.in(room.id).emit('update-room', { room: room });
    }
}

function updatePlayer(player) {
    let room = findRoom(player.roomId);

    if (room) {

        _.each(room.users, (user) => {
            if (user.id === player.id) {
                user.isPlayer = player.isPlayer;
            }
        });

        io.in(room.id).emit('update-room', { room: room });
    }
}

function removeUser(user) {
    // Find room
    let room = findRoom(user.roomId);

    if (room) {
        // Remove user
        _.remove(room.users, (roomUser) => {
            return roomUser.id === user.id;
        });

        // Remove room or update existing users
        if (!room.users) {
            // Remove room
            _.remove(rooms, (currentRoom) => {
                return currentRoom.id === user.roomId;
            });
        } else {
            // Update users
            io.in(room.id).emit('update-room', { room: room });
        }
    }
}

function findRoom(id) {
    return _.filter(rooms, (room) => {
        return room.id === id;
    })[0];
}


function createUser(user) {
    return {
        id: uuid.v4(),
        name: user.name,
        avatar: user.avatar,
        isOwner: user.isOwner,
        roomId: user.roomId,
        points: null,
        hasNewPoints: true,
        isPlayer: true
    };
}

function createRoom(room, user) {
    var roomId = uuid.v4();
    var users = [];

    user.roomId = roomId;

    // Owners do not start off as players
    user.isPlayer = false;

    users.push(user);

    return {
        id: roomId,
        name: room.name,
        ownerId: user.id,
        users: users,
        isLocked: false,
        isFrozen: false,
        reveal: false,
        time: 0
    };
}

http.listen(3000, function () {
    console.log('Server started on *:3000');
});