const Note = require('../models/Note');
const AppError = require('../utils/appError');
const logger = require('../config/logger');

const createNote = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const note = await Note.create({ title, content, tags, user: req.user._id });

    logger.info(`Note created by ${req.user.email}: ${note._id}`);

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return next(new AppError(404, 'Note not found'));
    if (note.user.toString() !== req.user._id.toString()) return next(new AppError(403, 'Not authorized to access this note'));

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return next(new AppError(404, 'Note not found'));
    if (note.user.toString() !== req.user._id.toString()) return next(new AppError(403, 'Not authorized to update this note'));

    const updates = (({ title, content, tags }) => ({ title, content, tags }))(req.body);

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) note[key] = updates[key];
    });

    await note.save();

    logger.info(`Note updated by ${req.user.email}: ${note._id}`);

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return next(new AppError(404, 'Note not found'));
    if (note.user.toString() !== req.user._id.toString()) return next(new AppError(403, 'Not authorized to delete this note'));

    await note.remove();

    logger.info(`Note deleted by ${req.user.email}: ${note._id}`);

    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote };
