import { gql } from '@apollo/client';

export const ADMIN_LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
    }
  }
`;
