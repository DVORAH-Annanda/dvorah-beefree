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
        return res.status(400).send({ message: 'You already added a note.' });
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

/////WIP tot hier!

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;
