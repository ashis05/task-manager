import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../db');

const sendOtp = async (email: String, otp: String) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Set this in .env
            pass: process.env.EMAIL_PASS, // Use an App Password for Gmail
        },
    });

    const message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };

    try {
        await transporter.sendMail(message);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send email');
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if(user.rowCount === 0){
        res.status(400).json({msg: 'Invalid Credentials'});
    }
    try{
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if(!isMatch) return res.status(400).json({msg: 'Invalid Credentials'});
        const token = jwt.sign({user_id: user.rows[0].user_id}, process.env.JWT_SECRET, {expiresIn: '90d'});
        res.status(200).send({token});
    }catch(err){
        console.log(err);
        res.status(500).send({error: 'Error during login'});
    }
}

export const signUp = async (req: Request, res: Response) => {
    const { name, email, password ,confirmPassword} = req.body;
    if(password !== confirmPassword){
        return res.status(400).json({msg: 'Passwords do not match'});
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const newUser = await pool.query('INSERT INTO users(name, email, password, otp, otp_expiry) VALUES($1, $2, $3, $4, $5) RETURNING *', [name, email, hashedPassword, otp, otpExpiry]);
        await sendOtp(email, otp);
        
        const token = jwt.sign({user_id: newUser.rows[0].user_id}, process.env.JWT_SECRET, {expiresIn: '90d'});
        res.status(201).json({message: 'Signup Successful', token});
    }catch(err){
        console.log(err);
        res.status(500).send({error: 'Error during signup'});
    }
}

export const validateOtp = async (req: Request, res: Response) => {
    const { otp } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ msg: 'No token provided' });
    
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id;

        const user = await pool.query('SELECT * FROM users WHERE user_id = $1 AND otp = $2', [userId, otp]);
        if(user.rowCount === 0){
            return res.status(400).json({msg: 'Invalid OTP'});
        }
        await pool.query('UPDATE users SET otp = null, otp_expiry = NULL WHERE user_id = $1', [userId]);
        res.status(200).send({message: 'OTP Validated'});
    }catch(err){
        console.log(err);
        res.status(500).send({error: 'Error during OTP validation'});
    }
}

export const getUser = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query('SELECT user_id, name, email FROM users WHERE user_id = $1', [decoded.user_id]);
        
        if (user.rowCount === 0) return res.status(404).json({ msg: 'User not found' });
        
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Invalid Token' });
    }
}