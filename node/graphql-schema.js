const { gql } = require('apollo-server-express');

const schema = gql`
  type Post {
    id: ID
    topic: String
    text: String
    audioName: String
    imageName: String
    date: String
  }

  type Admin {
    username: String
  }

  type Subscribe {
    email: String
  }

  
  type Query {
    posts(offset: Int, limit: Int): [Post]
    post(id: ID): Post
    getPostByDate(date: String): Post
    login(username: String!, password: String!): Admin
    subscribe(emailSubscription: String!): Subscribe
  }

  input PostInput {
    postId: ID
    topic: String
    text: String
    audioName: String
    imageName: String
    date: String
  }

  input EmailSubscription {
    email: String
  }

  type Mutation {
    subscribe(emailSubscription: EmailSubscription): Subscribe
    createPost(postInput: PostInput): Post
    updatePost(id: ID, postInput: PostInput): Post
    deletePost(id: ID): ID
  }
`;

module.exports = schema;
