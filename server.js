const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('contact_message', (data) => {
        // Broadcast the message to admin dashboard (to be implemented)
        io.emit('new_message', data);
        socket.emit('message_received', { status: 'success' });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// API Routes
app.get('/api/projects', (req, res) => {
    // Sample project data - can be replaced with database
    const projects = [
        {
            id: 1,
            title: 'Financial Tracker',
            description: 'Real-time stock market tracker with chatbot integration',
            image: 'https://via.placeholder.com/300',
            technologies: ['Node.js', 'Socket.IO', 'Chart.js'],
            liveLink: '#',
            sourceCode: '#'
        },
        {
            id: 2,
            title: 'Snake and Ladder Game',
            description: 'Interactive game built with Pygame',
            image: 'https://via.placeholder.com/300',
            technologies: ['Python', 'Pygame'],
            liveLink: '#',
            sourceCode: '#'
        },
        {
            id: 3,
            title: 'Car and Ship Animations',
            description: '3D animations created in Blender',
            image: 'https://via.placeholder.com/300',
            technologies: ['Blender', '3D Modeling'],
            liveLink: '#',
            sourceCode: '#'
        }
    ];
    res.json(projects);
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    // Here you would typically save to a database and send email
    // For now, we'll just emit the message via Socket.IO
    io.emit('new_contact', { name, email, message });
    res.json({ status: 'success' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});