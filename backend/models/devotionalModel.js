import mongoose from 'mongoose';

const devotionalNotesSchema = new mongoose.Schema(
  {
    name: { type: String },
    notes: { type: String },
    location: { type: String },
  },
  {
    timestamps: true,
  }
);

const devotionalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    bibleVersion: { type: String, required: true },
    bibleReading: { type: String, required: true },
    bible: { type: String, required: true },
    devotional: { type: String, required: true },
    quoteAuthor: { type: String, required: true },
    quote: { type: String, required: true, unique: true },
    //book: { type: mongoose.Schema.Types.ObjectID, ref: 'Book' },
    bookId: { type: Number, required: true },
    notes: [devotionalNotesSchema],
    user: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Devotional = mongoose.model('Devotional', devotionalSchema);
export default Devotional;
