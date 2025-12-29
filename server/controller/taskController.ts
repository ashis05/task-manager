import {Request, Response} from "express";

const db = require('../db');
const jwt = require('jsonwebtoken');

export const createTask = async (req: Request, res: Response) => {
    const {title, description, due_date, tag_ids, priority} = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({msg: 'No token provided'});
    const token = authHeader.split(' ')[1];

    const client = await db.getClient();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id;

        await client.query('BEGIN');

        const insertTaskText = `
            INSERT INTO tasks(user_id, title, description, due_date, priority)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;

        const newTask = await client.query(insertTaskText, [userId, title, description, due_date, priority]);
        const newTaskId = newTask.rows[0].task_id;

        if (tag_ids && tag_ids.length > 0) {
            const tagPromises = tag_ids.map((tagId: number) => {
                return client.query(
                    'INSERT INTO task_tags(task_id, tag_id) VALUES($1, $2)',
                    [newTaskId, tagId]
                );
            });
            await Promise.all(tagPromises);
        }

        await client.query('COMMIT');

        res.status(201).send({msg: 'Task created successfully', task_id: newTaskId});

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).send({error: 'Error during task creation'});
    } finally {
        client.release();
    }
}

export const getRemainingTasks = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({msg: 'No token provided'});
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id;
        const tasks = await db.query('SELECT * FROM tasks WHERE user_id = $1 AND is_completed = false', [userId]);
        res.send(tasks.rows).status(200);
    } catch (err) {
        console.log(err);
        res.status(500).send({error: 'Error during task retrieval'});
    }
}

export const getCompletedTasks = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({msg: 'No token provided'});
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id;
        const tasks = await db.query('SELECT * FROM tasks WHERE user_id = $1 AND is_completed = true', [userId]);
        res.json(tasks.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({error: 'Error during task retrieval'});
    }
}

export const getAllTasks = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({msg: 'No token provided'});
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id;
        const query = `
            SELECT t.*,
                   COALESCE(
                           json_agg(
                                   json_build_object('tag_id', tags.tag_id, 'name', tags.name, 'color', tags.color)
                           ) FILTER(WHERE tags.tag_id IS NOT NULL),
                           '[]'
                   ) as tags
            FROM tasks t
                     LEFT JOIN task_tags tt ON t.task_id = tt.task_id
                     LEFT JOIN tags ON tt.tag_id = tags.tag_id
            WHERE t.user_id = $1
            GROUP BY t.task_id
        `;
        const tasks = await db.query(query, [userId]);
        res.json(tasks.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({error: 'Error during task retrieval'});
    }
}

export const completeTask = async (req: Request, res: Response) => {
    const {task_id, is_completed} = req.body;
    try {
        const client = await db.getClient();
        await client.query('BEGIN');
        await client.query('UPDATE tasks SET is_completed = $1 WHERE task_id = $2', [is_completed, task_id]);
        await client.query('COMMIT');
        res.status(200).send({msg: 'Task updated successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Error during task update'});
    }
}

export const updateTask = async (req: Request, res: Response) => {
    const {task_id, title, description, due_date, priority, tag_ids} = req.body;
    try {
        const client = await db.getClient();
        await client.query('BEGIN');
        await client.query('UPDATE tasks SET title = $1, description = $2, due_date = $3, priority = $4 WHERE task_id = $5', [title, description, due_date, priority, task_id]);
        if (tag_ids) {
            await client.query('DELETE FROM task_tags WHERE task_id = $1', [task_id]);
            if (tag_ids.length > 0) {
                const tagPromises = tag_ids.map((tagId: number) => {
                    return client.query(
                        'INSERT INTO task_tags(task_id, tag_id) VALUES($1, $2)',
                        [task_id, tagId]
                    );
                });
                await Promise.all(tagPromises);
            }
        }
        await client.query('COMMIT');
        res.status(200).send({msg: 'Task updated successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Error during task update'});
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    const {task_id} = req.body;
    try {
        const client = await db.getClient();
        await client.query('BEGIN');
        await client.query('DELETE FROM tasks WHERE task_id = $1', [task_id]);
        await client.query('DELETE FROM task_tags WHERE task_id = $1', [task_id]);
        await client.query('COMMIT');
        res.status(200).send({msg: 'Task deleted successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Error during task deletion'});
    }
}