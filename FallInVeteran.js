const express = require('express')
const Connect_DB = require('./connect_DB/Connect_DB.js')
const Route = require('./Routes.js')
const clusters = require('cluster')
const os = require('os')
const totalCpu = os.cpus().length
const cors = require('cors')
const app = express()

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//modal

const MessageModal = require('./models/MessageModal.js')
const ChatUsers = require('./models/ChatUsersModal.js')
const User = require('./models/UserModal.js')

console.log("total CPU: " + totalCpu)


const PORT = 3000

app.use(express.json())
app.use(cors())

app.use('/uploads', express.static('upload/images/Profile_Picture'));
app.use('/Post_Pictures', express.static('upload/images/Post_Pictures'));

//connnecting db
Connect_DB()



io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('login', async (data) => {
        try {
            // Validate user input (for example, check if data.id is a valid MongoDB ObjectId)

            // Save user details to MongoDB
            console.log('User logged in:', data);

            console.log("data", data);

            await User.updateOne({ _id: data._id }, { $set: { socketId: socket.id } });

            console.log('Successfully Updated', socket.id);

            // Send a success response back to the client if needed
            socket.emit('loginSuccess', { message: 'Login successful' });

            const onlineUsers = await User.find({ socketId: { $ne: "" } });

            const temp = []
            onlineUsers.forEach((res)=>{
                console.log("return ", res._id)

                temp.push(res._id)
            })

            socket.emit('onlineUsers', temp);   

            // console.log("Online Users:", onlineUsers);


        } catch (error) {
            console.error('Error updating:', error.message);

            // Send an error response back to the client if needed
            socket.emit('loginError', { message: 'Error updating user details' });
        }
    });





    socket.on('sendMessage', async (messageData) => {
        console.log("Sending message", messageData);

        const senderId = messageData.Sender_id;
        const reciverId = messageData.Reciver_id;

        const data = {
            sender: senderId,
            receiver: reciverId,
            text: messageData.Message,
        }

        io.emit(`${reciverId}_${senderId}_message`, { data });
        // io.emit(`${reciverId}_${senderId}_message`, { data })

        console.log("message send ?", senderId, reciverId,)

        const CreateChat = await MessageModal({
            sender: senderId,
            receiver: reciverId,
            text: messageData.Message,
        });

        await CreateChat.save();

    });



    socket.on('Sender_Reciver_data', async (data) => {

        const senderId = data.Sender_id._id
        const reciverId = data.Reciver_id._id

        console.log("dadasdada", data)

        // Check if the chat already exists
        const existingChat = await ChatUsers.findOne({
            $or: [
                { sender_id: senderId, receiver_id: reciverId },
                { sender_id: reciverId, receiver_id: senderId }
            ]
        });

        if (existingChat) {



            await ChatUsers.updateOne({
                $or: [
                    { sender_id: senderId, receiver_id: reciverId },
                    { sender_id: reciverId, receiver_id: senderId }
                ]
            }, {
                $set: { LastMessage: data.lastMessage }
            })


        } else {
            const ChatUserModal = await ChatUsers({
                sender_data: data.Sender_id,
                reciver_data: data.Reciver_id,
                sender_id: senderId,
                receiver_id: reciverId,
                lastMessage: data.lastMessage

            })

            await ChatUserModal.save()

        }

    })


    // // Handle user disconnect
    socket.on('disconnect', async () => {
        console.log('a user disconnected', socket.id);

        await User.updateOne({ socketId: socket?.id }, { $set: { socketId: "" } })
        // Perform any cleanup or additional actions upon user disconnect, if needed
    });


});

if (clusters.isPrimary) {

    for (i = 0; i < totalCpu; i++) {
        clusters.fork()
    }
} else {
    //just for testing
    app.get('/', (req, res) => {
        res.send({
            "Service": `Start ${process.pid}`
        })
    })




    //makeinng routing
    app.use("/fallinveteran/api", Route)

    //listening port runnig server
    server.listen(3000, () => {
        console.log('listening on *:3000');
    });
}

