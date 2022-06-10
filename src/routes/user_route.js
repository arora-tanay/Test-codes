var express = require('express');
var router = express.Router()
const { check, validationResult } = require('express-validator');
const userHandler = require('../controllers/user')
const validator = require('../utils/validator');
const utility = require("../utils/utility");

router.post('/login', [
  check('email').not().isEmpty(),
  check('password').not().isEmpty(),
],
  (req, res, next) => {
    validator(req, res, next)
  },
  (req, res) => {
    userHandler.login(req, res)
  })

router.post('/addUser', [
  check('email').not().isEmpty(),
  check('mobile').not().isEmpty(),
  check('user_name').not().isEmpty(),
  check('dob').not().isEmpty(),
  check('usertype').not().isEmpty(),
  check('password').not().isEmpty(),
],
  [utility.verify_token],
  (req, res, next) => {
    validator(req, res, next)
  },
  (req, res) => {
    userHandler.addUser(req, res)
  })

router.get('/viewUser',
  [
    check('user_id').not().isEmpty(),
  ],
  [utility.verify_token],
  (req, res, next) => {

    validator(req, res, next)
  },
  (req, res) => {
    userHandler.viewUser(req, res)
  })

router.get('/listUser',
  (req, res, next) => {

    validator(req, res, next)
  },
  [utility.verify_token],
  (req, res) => {
    userHandler.listUser(req, res)
  })

router.put('/updateUser', [
  check('user_id').not().isEmpty(),
],
  [utility.verify_token],
  (req, res, next) => {
    validator(req, res, next)
  },
  (req, res) => {
    userHandler.updateUser(req, res)
  })

router.delete('/deleteUser', [
  check('user_id').not().isEmpty(),
],
  [utility.verify_token],
  (req, res, next) => {
    validator(req, res, next)
  },
  (req, res) => {
    userHandler.deleteUser(req, res)
  })

module.exports = router;
