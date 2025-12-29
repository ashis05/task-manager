import express from 'express';

import * as authController from '../controller/authController';
import * as taskController from '../controller/taskController';
import * as tagController from '../controller/tagController';


const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signUp);
router.post('/validateOtp', authController.validateOtp);
router.post('/getUser', authController.getUser);
router.post('/createTask', taskController.createTask);
router.get('/getAllTasks', taskController.getAllTasks);
router.get('/getRemainingTasks', taskController.getRemainingTasks);
router.get('/getCompletedTasks', taskController.getCompletedTasks);
router.put('/completeTask', taskController.completeTask)
router.put('/updateTask', taskController.updateTask);
router.delete('/deleteTask', taskController.deleteTask);
router.post('/createTag', tagController.createTag);
router.get('/getTags', tagController.getTags);
router.get('/getTagsById', tagController.getTagById)

export default router;