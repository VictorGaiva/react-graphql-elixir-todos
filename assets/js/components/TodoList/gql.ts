import { gql } from "@apollo/react-hooks";

export const GET_TODO_ITEMS = gql`
  { todoItems { id content isCompleted } }
`;
