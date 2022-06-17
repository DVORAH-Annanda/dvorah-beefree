import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Devotional from '../models/devotionalModel.js';
import { isAuth, isAdmin } from '../utils.js';

const devotionalRouter = express.Router();

devotionalRouter.get('/', async (req, res) => {
  const devotionals = await Devotional.find();
  res.send(devotionals);
});

devotionalRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newDevotional = new Devotional({
      title: 'title ' + Date.now(),
      bibleVersion: 'Bible version',
      bibleReading: 'Bible chapters',
      bible: 'Bible verses',
      devotional: 'devotional body',
      quoteAuthor: 'quote author',
      quote: 'quote',
      bookId: 1,
    });
    const devotional = await newDevotional.save();
    res.send({ message: 'Devotional saved', devotional });
  })
);

devotionalRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const devotionalId = req.params.id;
    const devotional = await Devotional.findById(devotionalId);
    if (devotional) {
      devotional.title = req.body.title;
      devotional.bibleVersion = req.body.bibleVersion;
      devotional.bibleReading = req.body.bibleReading;
      devotional.bible = req.body.bible;
      devotional.devotional = req.body.devotional;
      devotional.quoteAuthor = req.body.quoteAuthor;
      devotional.quote = req.body.quote;
      devotional.book = req.body.book;
      await devotional.save();
      res.send({ message: 'Devotional updated.' });
    } else {
      res.status(404).send({ message: 'Devotional not found.' });
    }
  })
);

devotionalRouter.post(
  '/:id/notes',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const devotionalId = req.params.id;
    const devotional = await Devotional.findById(devotionalId);
    if (devotional) {
      if (devotional.notes.find((x) => x.name === req.user.name)) {
        //TODO?
        return res.send(devotionalNotes);
      }

      const userNotes = {
        name: req.user.name,
        notes: req.body.notes,
        location: req.body.location,
      };
      devotional.notes.push(userNotes);
      const updatedDevotional = await devotional.save();
      res.status(201).send({
        message: 'Devotional notes saved.',
      });
    } else {
      res.status(404).send({ message: 'Devotional not found.' });
    }
  })
);

const PAGE_SIZE = 3;

devotionalRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const devotionals = await Devotional.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countDevotionals = await Devotional.countDocuments();
    res.send({
      devotionals,
      countDevotionals,
      page,
      pages: Math.ceil(countDevotionals / pageSize),
    });
  })
);

devotionalRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const title = query.title || '';
    const bibleReading = query.bibleReading || '';
    const bible = query.bible || '';
    const quote = query.quote || '';
    const quoteAuthor = query.quoteAuthor || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const titleFilter = title && title !== 'all' ? { title } : {};
    const bibleReadingFilter =
      bibleReading && bibleReading !== 'all'
        ? {
            bibleReading,
          }
        : {};
    const bibleFilter =
      bible && bible !== 'all'
        ? {
            bible,
          }
        : {};
    const quoteFilter =
      quote && quote !== 'all'
        ? {
            quote,
          }
        : {};
    const quoteAuthorFilter =
      quoteAuthor && quoteAuthor !== 'all'
        ? {
            quoteAuthor,
          }
        : {};

    const products = await Product.find({
      ...queryFilter,
      ...titleFilter,
      ...bibleReadingFilter,
      ...bibleFilter,
      ...quoteFilter,
      ...quoteAuthorFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countDevotionals = await Devotional.countDocuments({
      ...queryFilter,
      ...titleFilter,
      ...bibleReadingFilter,
      ...bibleFilter,
      ...quoteFilter,
      ...quoteAuthorFilter,
    });
    res.send({
      devotionals,
      countDevotionals,
      page,
      pages: Math.ceil(countDevotionals / pageSize),
    });
  })
);

devotionalRouter.get(
  '/bibleversions',
  expressAsyncHandler(async (req, res) => {
    const bibleVersions = await Devotional.find().distinct('bibleVersion');
    res.send(bibleVersions);
  })
);

devotionalRouter.get('/title/:title', async (req, res) => {
  const devotional = await Devotional.findOne({ title: req.params.title });
  if (devotional) {
    res.send(devotional);
  } else {
    res.status(404).send({ message: 'Devotional not found.' });
  }
});

devotionalRouter.get('/:id', async (req, res) => {
  const devotional = await Devotional.findById(req.params.id);
  if (devotional) {
    res.send(devotional);
  } else {
    res.status(404).send({ message: 'Devotional not found.' });
  }
});

export default devotionalRouter;
