const { Post } = require('./models/post_model');
const Admin = require('./models/admin_model');
const Subscribe = require('./models/subscribe_model');
const bcrypt = require('bcrypt');

// Query is different from mutation. QUERY ==> 'Performs all GET' MUTATION ==> 'Creates, Updates & Deletes'
const resolvers = {
  Query: {
    posts: async (_, { offset, limit}) => {
      const posts = await Post.find().sort({ date: -1 });
      //.skip(offset).limit(limit)
      return posts;
    },
    
    post: async (_, { id }) => {
      const post = await Post.findById(id);
      return post;
    },
    getPostByDate: async (_, { date }) => {
      const postByDate = await Post.findOne({ date: date });
      return postByDate;
    },

    login: async (_, { username, password }) => {
      const admin = await Admin.findOne({ username: username });

      if (!admin) {
        throw new Error('Admin not found');
      }

      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        throw new Error('Invalid password');
      }

      return {
        username: admin.username,
      };
    },
  },

  Mutation: {
    createPost: async (_, { postInput }) => {
      const newPost = await Post.create(postInput);
      return newPost;
    }, 
    updatePost: async (_, { id, postInput }) => {
      // Logic to update an existing post in the database
      const updatedPost = await Post.findByIdAndUpdate(id, postInput, { new: true });
      return updatedPost;
    },
    deletePost: async (_, { id }) => {
      // Logic to delete a post from the database
      const deletedPost = await Post.findByIdAndDelete(id);
      return deletedPost ? id : null;
    },
    subscribe: async (_, { emailSubscription }) => {
      console.log(emailSubscription);
      try {
        const newPost = await Subscribe.create(emailSubscription);
        return newPost;
      } catch (e) {
        if (e.code === 11000 && e.keyPattern && e.keyPattern.email) {
          // Handle duplicate key error (code 11000) for the 'email' field
          console.error(`Duplicate email: ${emailSubscription.email}`);
          return ({email: 'Duplicate email.'});
        } else {
          console.error(e);
          return('An error occurred while subscribing.');
        }
      }
    }    
  },
};

module.exports = resolvers;
