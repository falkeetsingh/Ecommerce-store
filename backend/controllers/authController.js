const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// generate jwt
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }  
    );
};

// @desc Sign up 
// @route POST /api/auth/signup
// @access public

const registerUser = async(req,res)=>{
    try{
        const {name, email, password} = req.body;
        const profilePhoto = req.file ? `/uploads/userProfile/${req.file.filename}` : '';

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: 'User already exist!'});
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profilePhoto,
        });
        res.status(201).json({message: 'User Registered Successfully!'});

    }catch(error){
        res.status(400).json({message: error.message});
    }
};



// @desc Login user
// @route POST /api/auth/login
// @access public 

const loginUser = async(req,res)=>{
    try{
        const { email, password, rememberMe } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required'});
        }

        // Explicitly select password field since it's excluded by default
        const user = await User.findOne({email}).select('+password');

        if(!user) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        //generate token
        const token = generateToken(user);

        //setting cookie
        const cookieOptions = {
          httpOnly: true,
          // secure: true, // use only on production HTTPS
          sameSite: 'Lax',
        };

        if (rememberMe) {
          cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        } // else, no maxAge → session cookie

        res.cookie('token', token, cookieOptions);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePhoto: user.profilePhoto,
            isAdmin: user.isAdmin,
        });
    }catch(error){
        console.error('Login error:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}


// // @desc    Logout user
// // @route   POST /api/auth/logout
// // @access  Private

const logoutUser = (req,res)=>{
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
}

const me = async (req, res) => {
    try {
      // You should have middleware to set req.user from the token/cookie
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      console.error('Error in /me endpoint:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, email } = req.body;
      let updateData = { name, email };
  
      if (req.file) {
        updateData.profilePhoto = `/uploads/userProfile/${req.file.filename}`;
      }
  
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
const changePassword = async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(userId).select('+password');
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    me,
    updateProfile,
    changePassword,
};
