import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Basir',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      // _id: '1',
      name: 'Nike Slim shirt',
      slug: 'nike-slim-shirt',
      category: 'Shirts',
      image: '/images/p1.jpg', // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      // _id: '2',
      name: 'Adidas Fit Shirt',
      slug: 'adidas-fit-shirt',
      category: 'Shirts',
      image: '/images/p2.jpg',
      price: 250,
      countInStock: 0,
      brand: 'Adidas',
      rating: 4.0,
      numReviews: 10,
      description: 'high quality product',
    },
  ],
  devotionals: [
    {
      title: 'In veilige bewaring',
      bibleVersion: 'Afrikaans 1983 (AFR83)',
      bibleReading: 'Psalm 121:1-8; 125:1-2',
      bible:
        '125:1 n Pelgrimslied. Dié wat op die Here vertrou, is soos Sionsberg wat nie wankel nie en altyd vas bly staan.  2 Soos die berge Jerusalem aan alle kante beskerm, so beskerm die Here sy volk, nou en vir altyd.',

      body: 'Vertrektyd! Hoeveel uiteenlopende gedagtes spoed nie deur ons gedagtes nie! Tog bly daar n knaende onsekerheid wat deel is van...',
      quoteAuthor: 'David Nicholas',
      quote:
        'God se beloftes is soos die sterre, hoe donkerder die nag, hoe helderder skyn hulle.',
      bookId: 1,
    },
  ],
};
export default data;
