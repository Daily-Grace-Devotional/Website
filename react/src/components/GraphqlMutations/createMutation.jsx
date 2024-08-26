import { gql } from '@apollo/client';

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($postInput: PostInput!) {
    createPost(postInput: $postInput) {
      id
      topic
      text
      audioName
      imageName
      date
    }
  }
`;
