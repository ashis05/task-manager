import {Request, Response} from 'express';

const jwt = require('jsonwebtoken');
const pool = require('../db');

export const createTag = async (req: Request, res: Response) => {
    const {name, color} = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({msg: 'No token provided'});

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id;
        const newTag = await pool.query('INSERT INTO tags(user_id, name, color) VALUES($1, $2, $3)', [userId, name, color]);
        res.status(201).send({msg: 'Tag created successfully'});
    } catch (err) {
        console.log(err);
        res.status(500).send({error: 'Error during tag creation'});
    }
};

export const getTags = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({msg: 'No token provided'});
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id;
        const tags = await pool.query('SELECT * FROM tags WHERE user_id = $1', [userId]);
        res.json(tags.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({error: 'Error during tag retrieval'});
    }
}

export const getTagById = async (req: Request, res: Response) => {
    const {task_id} = req.query;
    try {
        const tags = await pool.query('SELECT t.* FROM tags t JOIN task_tags tt ON t.tag_id = tt.tag_id WHERE tt.task_id = $1', [task_id]);
        res.status(200).json(tags.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({error: 'Error during tag retrieval'});
    }
}