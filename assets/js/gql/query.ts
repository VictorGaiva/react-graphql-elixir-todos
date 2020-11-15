import { gql } from "@apollo/client";

export const GET_TODO_ITEMS = gql`{
  todoItems {
    id content isCompleted
  }
}`;
