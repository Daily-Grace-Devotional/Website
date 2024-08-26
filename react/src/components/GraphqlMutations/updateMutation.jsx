import { gql } from '@apollo/client';

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($postId: ID!, $postInput: PostInput!) {
    updatePost(id: $postId, postInput: $postInput) {
      id
      topic
      text
      audioName
      imageName
      date
    }
  }
`;
