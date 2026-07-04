const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }

  next();
};

const createNoteValidation = [
  body('title').trim().isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
  body('content').trim().isLength({ min: 2 }).withMessage('Content must be at least 2 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
  validate,
];

const updateNoteValidation = [
  body('title').optional().isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
  body('content').optional().isLength({ min: 2 }).withMessage('Content must be at least 2 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
  validate,
];

module.exports = { createNoteValidation, updateNoteValidation };
