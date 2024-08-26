import {gql} from '@apollo/client';

export const Subscribe = gql`
    mutation Subscribe($emailSubscription: EmailSubscription!) {
        subscribe(emailSubscription: $emailSubscription) {
            email
        }
    }
`;
