const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        me: User
    }
    type User {
        _id: ID
        name: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        user: User
        token: ID!
    }

    type Mutation {  
        login (email: String!, password: String!): Auth
        addUser (username: String!, email: String!, password: String!): Auth
        saveBook (input: SaveBookInput): User
        removeBook (bokoId: String!): User
    }
`;

module.exports = typeDefs;
