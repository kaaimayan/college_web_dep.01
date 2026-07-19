const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { hashPassword } = require('./utils/hashPassword');
require('dotenv').config();

const seed = async () => {
  const host = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || process.env.MYSQLPORT || 3306, 10);
  const user = process.env.DB_USER || process.env.MYSQLUSER || 'root';
  const password = process.env.DB_PASSWORD !== undefined 
    ? process.env.DB_PASSWORD 
    : (process.env.MYSQLPASSWORD !== undefined ? process.env.MYSQLPASSWORD : '');
  const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'library_for_college';

  const connConfig = {
    host,
    port,
    user,
    password,
    multipleStatements: true
  };

  if (process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true') {
    connConfig.ssl = { rejectUnauthorized: false };
  }

  let connection;
  try {
    connection = await mysql.createConnection(connConfig);
    console.log(`Connected to MySQL host ${host}:${port}. Initializing database...`);
  } catch (err) {
    // If connecting without database name fails (e.g. cloud restriction), connect with database name directly
    connConfig.database = dbName;
    connection = await mysql.createConnection(connConfig);
    console.log(`Connected directly to database ${dbName} on ${host}:${port}.`);
  }

  try {
    // 1. Create database if connecting to server root
    if (!connConfig.database) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      await connection.query(`USE \`${dbName}\``);
      console.log(`Database ${dbName} selected.`);
    }

    // 2. Read and run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error('schema.sql file not found at: ' + schemaPath);
    }
    
    const sqlSchema = fs.readFileSync(schemaPath, 'utf8');
    const sqlStatements = sqlSchema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (let statement of sqlStatements) {
      await connection.query(statement);
    }
    console.log('Schema tables created successfully.');

    // Ensure users table role column supports student
    await connection.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'librarian', 'student') DEFAULT 'student'");

    // 3. Clear existing seeds to prevent key conflicts
    console.log('Clearing old database seeds...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE fines');
    await connection.query('TRUNCATE TABLE issued_books');
    await connection.query('TRUNCATE TABLE reservations');
    await connection.query('TRUNCATE TABLE books');
    await connection.query('TRUNCATE TABLE students');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('TRUNCATE TABLE categories');
    await connection.query('TRUNCATE TABLE authors');
    await connection.query('TRUNCATE TABLE publishers');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 4. Seed Categories
    console.log('Seeding categories...');
    const categories = [
      ['Computer Science', 'Programming, Algorithms, AI, Web Dev'],
      ['Information Technology', 'Networking, Databases, Security'],
      ['Science', 'Physics, Chemistry, Mathematics'],
      ['Business & Management', 'Marketing, Management, MBA coursework'],
      ['Literature & Fiction', 'English Novels, Poetry, Tamil Classics'],
      ['Social Sciences & History', 'History, Sociology, Humanities'],
      ['Online Books', 'Digital textbooks, PDFs, and downloadable learning materials']
    ];
    for (let cat of categories) {
      await connection.query('INSERT INTO categories (name, description) VALUES (?, ?)', cat);
    }

    // 5. Seed Authors
    console.log('Seeding authors...');
    const authors = [
      ['Donald Knuth', 'Father of the analysis of algorithms'],
      ['Robert C. Martin', 'Creator of Clean Code principles'],
      ['Stephen Hawking', 'Theoretical physicist and cosmologist'],
      ['Philip Kotler', 'Professor of International Marketing'],
      ['William Shakespeare', 'Famous English playwright and poet']
    ];
    for (let auth of authors) {
      await connection.query('INSERT INTO authors (name, bio) VALUES (?, ?)', auth);
    }

    // 6. Seed Publishers
    console.log('Seeding publishers...');
    const publishers = [
      ['Pearson Education', 'London, UK', '+44 20 7010 2000', 'info@pearson.com'],
      ['O\'Reilly Media', 'Sebastopol, CA, USA', '+1 707-827-7000', 'support@oreilly.com'],
      ['Oxford University Press', 'Oxford, UK', '+44 1865 556767', 'academic.queries@oup.com'],
      ['S. Chand Publishing', 'New Delhi, India', '+91 11 2367 2051', 'info@schandpublishing.com']
    ];
    for (let pub of publishers) {
      await connection.query('INSERT INTO publishers (name, address, phone, email) VALUES (?, ?, ?, ?)', pub);
    }

    // 7. Seed Admin and Librarian
    console.log('Seeding library administrators...');
    const adminPass = await hashPassword('admin123');
    const librarianPass = await hashPassword('librarian123');
    const studentPass = await hashPassword('student123');
    
    await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Administrator', 'admin@krartsscience.edu', adminPass, 'admin']
    );
    await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Librarian One', 'librarian@krartsscience.edu', librarianPass, 'librarian']
    );

    // Get database IDs for references
    const [[{ id: catCS }]] = await connection.query('SELECT id FROM categories WHERE name = ?', ['Computer Science']);
    const [[{ id: catSci }]] = await connection.query('SELECT id FROM categories WHERE name = ?', ['Science']);
    const [[{ id: catOnline }]] = await connection.query('SELECT id FROM categories WHERE name = ?', ['Online Books']);
    
    const [[{ id: authKnuth }]] = await connection.query('SELECT id FROM authors WHERE name = ?', ['Donald Knuth']);
    const [[{ id: authMartin }]] = await connection.query('SELECT id FROM authors WHERE name = ?', ['Robert C. Martin']);
    const [[{ id: authHawking }]] = await connection.query('SELECT id FROM authors WHERE name = ?', ['Stephen Hawking']);

    const [[{ id: pubPearson }]] = await connection.query('SELECT id FROM publishers WHERE name = ?', ['Pearson Education']);
    const [[{ id: pubOReilly }]] = await connection.query('SELECT id FROM publishers WHERE name = ?', ['O\'Reilly Media']);
    const [[{ id: pubOxford }]] = await connection.query('SELECT id FROM publishers WHERE name = ?', ['Oxford University Press']);

    // 8. Seed Books
    console.log('Seeding college books...');
    const books = [
      [
        'The Art of Computer Programming', '9780201896831', authKnuth, catCS, pubPearson,
        15, 10, 'Vol 1-4 fundamental algorithms text', '3rd Edition', 2011, 'English', 'CS-SHELF-01', null
      ],
      [
        'Clean Code', '9780132350884', authMartin, catCS, pubPearson,
        18, 12, 'A handbook of agile software craftsmanship', '1st Edition', 2008, 'English', 'CS-SHELF-02', null
      ],
      [
        'A Brief History of Time', '9780553380163', authHawking, catSci, pubOxford,
        10, 7, 'Cosmology and theoretical astrophysics guide', 'Updated Edition', 1998, 'English', 'SCI-SHELF-A4', null
      ],
      [
        'Designing Data-Intensive Applications', '9781449373320', authMartin, catCS, pubOReilly,
        12, 8, 'Reliable, scalable, and maintainable systems', '1st Edition', 2017, 'English', 'CS-SHELF-04', null
      ],
      [
        'Introduction to Algorithms (PDF)', '9780262033848', authKnuth, catOnline, pubOxford,
        100, 100, 'Comprehensive guide to algorithms and data structures.', '3rd Edition', 2009, 'English', 'DIGITAL', 'https://vru.vnu.edu.vn/wp-content/uploads/2020/07/Introduction-to-Algorithms-3rd-Edition.pdf'
      ],
      [
        'Clean Architecture (PDF)', '9780134494166', authMartin, catOnline, pubPearson,
        100, 100, 'A craftsman\'s guide to software structure and design.', '1st Edition', 2017, 'English', 'DIGITAL', 'https://www.cleancoder.com'
      ]
    ];

    for (let book of books) {
      await connection.query(
        `INSERT INTO books (
          title, isbn, author_id, category_id, publisher_id,
          total_copies, available_copies, description, edition, year, language, shelf_location, download_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        book
      );
    }

    // 9. Seed Students and Student User accounts
    console.log('Seeding students and user accounts...');
    const students = [
      ['KR24CS001', 'Arun Kumar', 'arunkumar@krartsscience.edu', '9876543210', 'Computer Science', 3, '12 Main Rd, Kovilpatti', 1],
      ['KR24CS002', 'Deepika R', 'deepika@krartsscience.edu', '9876543211', 'Computer Science', 3, '45 West Car St, Kovilpatti', 1],
      ['KR24IT005', 'Manoj S', 'manojs@krartsscience.edu', '9876543212', 'Information Technology', 2, '78 South St, Kovilpatti', 1],
      ['KR24BCA08', 'Priya K', 'priyak@krartsscience.edu', '9876543213', 'Computer Applications', 1, '23 North Colony, Kovilpatti', 1],
      ['KR24BSc09', 'Sanjay Kumar', 'sanjay@krartsscience.edu', '9876543214', 'Physics', 2, '56 East Street, Ettayapuram', 1]
    ];

    for (let stud of students) {
      await connection.query(
        `INSERT INTO students (student_id, name, email, phone, department, year, address, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        stud
      );
      // Create student user login
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [stud[1], stud[2], studentPass, 'student']
      );
    }

    // 10. Seed transaction logs to rank Top Students
    console.log('Seeding student borrowing records for ranking...');
    const [allStuds] = await connection.query('SELECT id, student_id FROM students');
    const [allBooks] = await connection.query('SELECT id FROM books');
    const [[{ id: adminUserId }]] = await connection.query('SELECT id FROM users WHERE role = ?', ['admin']);

    const arun = allStuds.find(s => s.student_id === 'KR24CS001');
    const deepika = allStuds.find(s => s.student_id === 'KR24CS002');
    const manoj = allStuds.find(s => s.student_id === 'KR24IT005');

    const issueDates = [
      new Date(Date.now() - 20 * 86400000),
      new Date(Date.now() - 15 * 86400000),
      new Date(Date.now() - 10 * 86400000),
      new Date(Date.now() - 5 * 86400000),
      new Date(Date.now() - 1 * 86400000)
    ];

    if (arun) {
      for (let i = 0; i < 5; i++) {
        const bId = allBooks[i % allBooks.length].id;
        const due = new Date(issueDates[i].getTime() + 14 * 86400000);
        await connection.query(
          `INSERT INTO issued_books (book_id, student_id, issued_by, issued_date, due_date, status) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [bId, arun.id, adminUserId, issueDates[i], due, i < 2 ? 'returned' : 'issued']
        );
      }
    }

    if (deepika) {
      for (let i = 0; i < 3; i++) {
        const bId = allBooks[(i + 1) % allBooks.length].id;
        const due = new Date(issueDates[i].getTime() + 14 * 86400000);
        await connection.query(
          `INSERT INTO issued_books (book_id, student_id, issued_by, issued_date, due_date, status) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [bId, deepika.id, adminUserId, issueDates[i], due, 'issued']
        );
      }
    }

    if (manoj) {
      for (let i = 0; i < 2; i++) {
        const bId = allBooks[(i + 2) % allBooks.length].id;
        const due = new Date(issueDates[i].getTime() + 14 * 86400000);
        await connection.query(
          `INSERT INTO issued_books (book_id, student_id, issued_by, issued_date, due_date, status) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [bId, manoj.id, adminUserId, issueDates[i], due, 'issued']
        );
      }
    }

    console.log('Database successfully seeded with student credentials & ranking data complete!');

  } catch (err) {
    console.error('Seeding process failed:', err);
  } finally {
    await connection.end();
  }
};

seed();
