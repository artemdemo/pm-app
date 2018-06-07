const express = require('express');
const boardsController = require('../controllers/boards');
const projectsController = require('../controllers/projects');
const tasksController = require('../controllers/tasks');
const userController = require('../controllers/user');
const settingsController = require('../controllers/settings');

const router = express.Router();

router.get('/boards', boardsController.all);
router.post('/boards', boardsController.add);
router.put('/boards', boardsController.update);
router.delete('/boards/:boardId', boardsController.delete);

router.get('/projects', projectsController.all);
router.post('/projects', projectsController.add);
router.put('/projects', projectsController.update);
router.get('/projects/:projectId', projectsController.one);
router.delete('/projects/:projectId', projectsController.delete);
router.get('/projects/:taskId/task/:projectId', projectsController.connectTask);
router.delete('/api/projects/:taskId/task/:projectId', projectsController.disconnectTask);

router.get('/tasks', tasksController.all);
router.post('/tasks', tasksController.add);
router.put('/tasks', tasksController.update);
router.get('/tasks/:taskId', tasksController.one);
router.delete('/tasks/:taskId', tasksController.delete);
router.get('/tasks/:taskId/project/:projectId', tasksController.connectProject);
router.delete('/tasks/:taskId/project/:projectId', tasksController.disconnectProject);
router.put('/tasks/position', tasksController.updatePositions);

router.get('/user', userController.user);
router.post('/user/signup', userController.signup);
router.put('/user/login', userController.login);

router.get('/settings', settingsController.all);

module.exports = router;
