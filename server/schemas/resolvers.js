const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password");
                    return userData;
            }
            throw new AuthenticationError ("Not logged in");
        },
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});
            if (!user) {
                throw new AuthenticationError("Incorrect Credentials");
            } 
            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new AuthenticationError("Incorrect Credentials");
            }
            const token = signToken(user);
            return {token, user};
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);  
            return {token, user};
        },
        saveBook: async (parent, {input}, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate (
                    {_id: context.user._id},
                    {$addtoSet: {savedBooks: input}},
                    {new: true, runValidators: true}
                );
                return updateUser;
            }
            throw new AuthenticationError("Please login");
        },
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: bookId}}},
                    {new: true},
                );
                return updateUser;
            }
            throw new AuthenticationError("Please login");
        }, 
    },
};


module.exports = resolvers;
