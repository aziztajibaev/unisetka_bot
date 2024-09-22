const User = require('../models/user');
const axios = require('axios');
const config = require('../../config/config'); // Import your config for Telegram token

// Get all users with pagination, filtering, and Telegram profile photos
exports.getAllUsers = async (req, res) => {
    try {
        const { search = '', page_no = 0, status = 'A' } = req.query;
        const pageSize = 10;


        const result = await User.findWithPagination({ search, status, page_no, pageSize });

        const usersWithPhotos = await Promise.all(result.users.map(async (user) => {
            try {
                const photoUrl = await fetchProfilePhoto(user.chat_id); // Use user.chat_id for each user
                user.photoUrl = photoUrl || null; // Assign the photo URL or null
            } catch (error) {
                console.error(`Failed to fetch photo for user ${user.chat_id}:`, error);
                user.photoUrl = null; // Set photoUrl to null on error
            }
            return user; // Return the user object
        }));
        

        const page_count = Math.ceil(result.count / pageSize);

        res.status(200).json({
            users: usersWithPhotos,
            page_count
        });
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).send('Server error');
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).send('Server error');
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Server error');
    }
};

// Update user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    Object.assign(user, req.body);

    try {
        await user.update();
        res.status(200).json(user);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Server error');
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.delete(id);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Server error');
    }
};

// Function to fetch Telegram profile photo using bot's API
async function fetchProfilePhoto(chatId) {
    const token = config.TELEGRAM_TOKEN;
    try {
        const profilePhotosRes = await axios.get(`https://api.telegram.org/bot${token}/getUserProfilePhotos`, {
            params: { user_id: chatId }
        });

        if (!profilePhotosRes.data.ok) {
            throw new Error(`Error fetching profile photos: ${profilePhotosRes.data.description}`);
        }

        if (profilePhotosRes.data.result && profilePhotosRes.data.result.photos.length > 0) {
            const fileId = profilePhotosRes.data.result.photos[0][0].file_id;
            const fileRes = await axios.get(`https://api.telegram.org/bot${token}/getFile`, {
                params: { file_id: fileId }
            });

            const filePath = fileRes.data.result.file_path;
            return `https://api.telegram.org/file/bot${token}/${filePath}`;
        }

        return null;
    } catch (err) {
        console.error(`Failed to fetch profile photo for chat ID ${chatId}:`, err.message);
        return null; // Return null on error
    }
}
