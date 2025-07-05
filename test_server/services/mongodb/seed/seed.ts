import dotenv from 'dotenv'
dotenv.config()
import {IAuthor, IAuthorDocument, IBook, IBookDocument, IBookPopulated, IPublisherDocument} from "../schemas/types";

const mongoose = require('mongoose');
import { Author, Publisher, Book } from "../schemas" // Adjust path to your models

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Clear existing data
const clearDatabase = async () => {
    try {
        await Book.deleteMany({});
        await Author.deleteMany({});
        await Publisher.deleteMany({});
        console.log('🗑️  Database cleared successfully');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        throw error;
    }
};

// Sample data
const sampleAuthors = [
    {
        firstName: 'George',
        lastName: 'Orwell',
        email: 'george.orwell@example.com',
        biography: 'English novelist and essayist, journalist and critic, whose work is characterized by lucid prose, biting social criticism, opposition to totalitarianism, and outspoken support of democratic socialism.',
        birthDate: new Date('1903-06-25'),
        nationality: 'British',
        website: 'https://georgeorwell.org',
        socialMedia: {
            twitter: '@GeorgeOrwell',
            facebook: 'GeorgeOrwellOfficial'
        }
    },
    {
        firstName: 'J.K.',
        lastName: 'Rowling',
        email: 'jk.rowling@example.com',
        biography: 'British author, best known for the Harry Potter series of fantasy novels.',
        birthDate: new Date('1965-07-31'),
        nationality: 'British',
        website: 'https://www.jkrowling.com',
        socialMedia: {
            twitter: '@jk_rowling',
            instagram: 'jkrowling_official'
        }
    },
    {
        firstName: 'Stephen',
        lastName: 'King',
        email: 'stephen.king@example.com',
        biography: 'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.',
        birthDate: new Date('1947-09-21'),
        nationality: 'American',
        website: 'https://stephenking.com',
        socialMedia: {
            twitter: '@StephenKing',
            facebook: 'StephenKingWriter'
        }
    },
    {
        firstName: 'Agatha',
        lastName: 'Christie',
        email: 'agatha.christie@example.com',
        biography: 'English writer known for her sixty-six detective novels and fourteen short story collections.',
        birthDate: new Date('1890-09-15'),
        nationality: 'British',
        website: 'https://www.agathachristie.com'
    },
    {
        firstName: 'Isaac',
        lastName: 'Asimov',
        email: 'isaac.asimov@example.com',
        biography: 'American writer and professor of biochemistry, best known for his works of science fiction and popular science.',
        birthDate: new Date('1920-01-02'),
        nationality: 'American',
        socialMedia: {
            facebook: 'IsaacAsimovOfficial'
        }
    }
];

const samplePublishers = [
    {
        name: 'Penguin Random House',
        address: {
            street: '1745 Broadway',
            city: 'New York',
            state: 'NY',
            zipCode: '10019',
            country: 'USA'
        },
        contactInfo: {
            email: 'info@penguinrandomhouse.com',
            phone: '+1-212-782-9000',
            website: 'https://www.penguinrandomhouse.com'
        },
        foundedYear: 2013,
        description: 'The world\'s largest trade book publisher, formed by the merger of Penguin and Random House.'
    },
    {
        name: 'HarperCollins Publishers',
        address: {
            street: '195 Broadway',
            city: 'New York',
            state: 'NY',
            zipCode: '10007',
            country: 'USA'
        },
        contactInfo: {
            email: 'info@harpercollins.com',
            phone: '+1-212-207-7000',
            website: 'https://www.harpercollins.com'
        },
        foundedYear: 1989,
        description: 'One of the Big Five English-language publishers, known for publishing literary fiction and non-fiction.'
    },
    {
        name: 'Simon & Schuster',
        address: {
            street: '1230 Avenue of the Americas',
            city: 'New York',
            state: 'NY',
            zipCode: '10020',
            country: 'USA'
        },
        contactInfo: {
            email: 'info@simonandschuster.com',
            phone: '+1-212-698-7000',
            website: 'https://www.simonandschuster.com'
        },
        foundedYear: 1924,
        description: 'American publishing company and a subsidiary of ViacomCBS.'
    },
    {
        name: 'Macmillan Publishers',
        address: {
            street: '120 Broadway',
            city: 'New York',
            state: 'NY',
            zipCode: '10271',
            country: 'USA'
        },
        contactInfo: {
            email: 'info@macmillan.com',
            phone: '+1-646-307-5151',
            website: 'https://us.macmillan.com'
        },
        foundedYear: 1843,
        description: 'International publishing company owned by Holtzbrinck Publishing Group.'
    }
];

const sampleBooks = [
    {
        title: '1984',
        isbn: '978-0-452-28423-4',
        isbn13: '9780452284234',
        publicationDate: new Date('1949-06-08'),
        genre: ['Fiction', 'Science Fiction'],
        language: 'English',
        pages: 328,
        format: 'Paperback',
        price: {
            amount: 13.95,
            currency: 'USD'
        },
        description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
        rating: {
            average: 4.2,
            count: 150000
        },
        tags: ['dystopia', 'totalitarianism', 'surveillance', 'classic'],
        stock: 250
    },
    {
        title: 'Animal Farm',
        isbn: '978-0-452-28424-1',
        isbn13: '9780452284241',
        publicationDate: new Date('1945-08-17'),
        genre: ['Fiction', 'Political Satire'],
        language: 'English',
        pages: 112,
        format: 'Paperback',
        price: {
            amount: 10.99,
            currency: 'USD'
        },
        description: 'An allegorical novella about a group of farm animals who rebel against their human farmer.',
        rating: {
            average: 3.9,
            count: 120000
        },
        tags: ['allegory', 'politics', 'animals', 'revolution'],
        stock: 180
    },
    {
        title: 'Harry Potter and the Philosopher\'s Stone',
        subtitle: 'Book 1',
        isbn: '978-0-7475-3269-9',
        isbn13: '9780747532699',
        publicationDate: new Date('1997-06-26'),
        genre: ['Fantasy', 'Children', 'Young Adult'],
        language: 'English',
        pages: 223,
        format: 'Hardcover',
        price: {
            amount: 24.99,
            currency: 'USD'
        },
        description: 'The first novel in the Harry Potter series about a young wizard\'s journey.',
        rating: {
            average: 4.7,
            count: 500000
        },
        tags: ['magic', 'wizards', 'hogwarts', 'adventure'],
        stock: 500
    },
    {
        title: 'The Shining',
        isbn: '978-0-307-74365-9',
        isbn13: '9780307743659',
        publicationDate: new Date('1977-01-28'),
        genre: ['Horror', 'Fiction'],
        language: 'English',
        pages: 447,
        format: 'Paperback',
        price: {
            amount: 16.99,
            currency: 'USD'
        },
        description: 'A horror novel about a family\'s stay at an isolated hotel during the winter.',
        rating: {
            average: 4.1,
            count: 80000
        },
        tags: ['horror', 'psychological', 'hotel', 'supernatural'],
        stock: 120
    },
    {
        title: 'Murder on the Orient Express',
        isbn: '978-0-06-207350-4',
        isbn13: '9780062073504',
        publicationDate: new Date('1934-01-01'),
        genre: ['Mystery', 'Fiction'],
        language: 'English',
        pages: 256,
        format: 'Paperback',
        price: {
            amount: 14.99,
            currency: 'USD'
        },
        description: 'A detective novel featuring Hercule Poirot investigating a murder on a train.',
        rating: {
            average: 4.3,
            count: 95000
        },
        tags: ['detective', 'poirot', 'train', 'murder'],
        stock: 75
    },
    {
        title: 'Foundation',
        isbn: '978-0-553-29335-0',
        isbn13: '9780553293357',
        publicationDate: new Date('1951-05-01'),
        genre: ['Science Fiction', 'Fiction'],
        language: 'English',
        pages: 244,
        format: 'Paperback',
        price: {
            amount: 15.99,
            currency: 'USD'
        },
        description: 'The first novel in Asimov\'s Foundation Trilogy about the decline and fall of a galactic empire.',
        rating: {
            average: 4.0,
            count: 60000
        },
        tags: ['space', 'empire', 'psychohistory', 'future'],
        stock: 90
    }
];

// Seed authors
const seedAuthors = async () => {
    try {
        const authors = await Author.insertMany(sampleAuthors);
        console.log(`✅ Seeded ${authors.length} authors`);
        return authors;
    } catch (error) {
        console.error('❌ Error seeding authors:', error);
        throw error;
    }
};

// Seed publishers
const seedPublishers = async () => {
    try {
        const publishers = await Publisher.insertMany(samplePublishers);
        console.log(`✅ Seeded ${publishers.length} publishers`);
        return publishers;
    } catch (error) {
        console.error('❌ Error seeding publishers:', error);
        throw error;
    }
};

// Seed books with author and publisher references
const seedBooks = async (authors:IAuthorDocument[], publishers:IPublisherDocument[]) => {
    try {
        // Map books to authors and publishers
        const booksWithReferences = [
            {
                ...sampleBooks[0], // 1984
                authors: [authors[0]._id], // George Orwell
                publisher: publishers[0]._id // Penguin Random House
            },
            {
                ...sampleBooks[1], // Animal Farm
                authors: [authors[0]._id], // George Orwell
                publisher: publishers[0]._id // Penguin Random House
            },
            {
                ...sampleBooks[2], // Harry Potter
                authors: [authors[1]._id], // J.K. Rowling
                publisher: publishers[1]._id // HarperCollins
            },
            {
                ...sampleBooks[3], // The Shining
                authors: [authors[2]._id], // Stephen King
                publisher: publishers[2]._id // Simon & Schuster
            },
            {
                ...sampleBooks[4], // Murder on the Orient Express
                authors: [authors[3]._id], // Agatha Christie
                publisher: publishers[1]._id // HarperCollins
            },
            {
                ...sampleBooks[5], // Foundation
                authors: [authors[4]._id], // Isaac Asimov
                publisher: publishers[3]._id // Macmillan
            }
        ];

        const books = await Book.insertMany(booksWithReferences);
        console.log(`✅ Seeded ${books.length} books`);
        return books;
    } catch (error) {
        console.error('❌ Error seeding books:', error);
        throw error;
    }
};

// Create additional sample data with relationships
const createAdditionalData = async (authors:IAuthorDocument[], publishers:IPublisherDocument[]) => {
    try {
        // Create a book with multiple authors
        const collaborativeBook = new Book({
            title: 'The Ultimate Guide to Programming',
            isbn: '978-1-234567-89-0',
            authors: [authors[2]._id, authors[4]._id], // Stephen King & Isaac Asimov (fictional collaboration)
            publisher: publishers[0]._id,
            publicationDate: new Date('2024-01-15'),
            genre: ['Technology', 'Non-Fiction'],
            language: 'English',
            pages: 580,
            format: 'Hardcover',
            price: {
                amount: 49.99,
                currency: 'USD'
            },
            description: 'A comprehensive guide to modern programming practices.',
            rating: {
                average: 4.5,
                count: 1200
            },
            tags: ['programming', 'technology', 'guide', 'comprehensive'],
            stock: 200
        });

        await collaborativeBook.save();
        console.log('✅ Created additional collaborative book');

        // Create another author with books
        const newAuthor = new Author({
            firstName: 'Margaret',
            lastName: 'Atwood',
            email: 'margaret.atwood@example.com',
            biography: 'Canadian poet, novelist, literary critic, essayist, teacher, environmental activist, and inventor.',
            birthDate: new Date('1939-11-18'),
            nationality: 'Canadian',
            website: 'https://margaretatwood.ca',
            socialMedia: {
                twitter: '@MargaretAtwood'
            }
        });

        await newAuthor.save();

        const atwoodBook = new Book({
            title: 'The Handmaid\'s Tale',
            isbn: '978-0-385-49081-8',
            authors: [newAuthor._id],
            publisher: publishers[2]._id,
            publicationDate: new Date('1985-08-17'),
            genre: ['Fiction', 'Science Fiction'],
            language: 'English',
            pages: 311,
            format: 'Paperback',
            price: {
                amount: 17.99,
                currency: 'USD'
            },
            description: 'A dystopian novel set in a totalitarian society.',
            rating: {
                average: 4.1,
                count: 200000
            },
            tags: ['dystopia', 'feminism', 'totalitarian', 'classic'],
            stock: 300
        });

        await atwoodBook.save();
        console.log('✅ Created additional author and book');

    } catch (error) {
        console.error('❌ Error creating additional data:', error);
        throw error;
    }
};

// Verify seeded data
const verifyData = async () => {
    try {
        const authorCount = await Author.countDocuments();
        const publisherCount = await Publisher.countDocuments();
        const bookCount = await Book.countDocuments();

        console.log('\n📊 Database Statistics:');
        console.log(`   Authors: ${authorCount}`);
        console.log(`   Publishers: ${publisherCount}`);
        console.log(`   Books: ${bookCount}`);

        // Show some populated data
        const booksWithAuthors = await Book.find()
            .populate('authors', 'firstName lastName')
            .populate('publisher', 'name')
            .limit(3);

        console.log('\n📚 Sample Books with Authors and Publishers:');
        booksWithAuthors.forEach((book:any) => {
            const authorNames = book.authors.map((author:IAuthor) => `${author.firstName} ${author.lastName}`).join(', ');
            console.log(`   "${book.title}" by ${authorNames} (${book.publisher.name})`);
        });

    } catch (error) {
        console.error('❌ Error verifying data:', error);
        throw error;
    }
};

// Main seeding function
interface seedDatabaseOptions {
    clearFirst?: boolean;
    skipAdditional?: boolean;
}
const seedDatabase = async (options:seedDatabaseOptions = {}) => {
    const { clearFirst = true, skipAdditional = false } = options;

    try {
        await connectDB();

        if (clearFirst) {
            await clearDatabase();
        }

        console.log('🌱 Starting database seeding...');

        // Seed in order to maintain relationships
        const authors = await seedAuthors();
        const publishers = await seedPublishers();
        const books = await seedBooks(authors, publishers);

        if (!skipAdditional) {
            await createAdditionalData(authors, publishers);
        }

        await verifyData();

        console.log('🎉 Database seeding completed successfully!');

    } catch (error) {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Export for use in other files
module.exports = {
    seedDatabase,
    clearDatabase,
    seedAuthors,
    seedPublishers,
    seedBooks,
    verifyData
};

// Run seeding if this file is executed directly
if (require.main === module) {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const clearFirst = !args.includes('--no-clear');
    const skipAdditional = args.includes('--skip-additional');

    seedDatabase({ clearFirst, skipAdditional });
}

// Usage examples:
// node seed.js                          // Full seeding with clear
// node seed.js --no-clear              // Seed without clearing existing data
// node seed.js --skip-additional       // Skip additional collaborative data
// node seed.js --no-clear --skip-additional  // Minimal seeding