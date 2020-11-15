import { gql } from "@apollo/client";

export const TOGGLE_TODO_ITEM = gql`
  mutation toggle($id:ID!){
    toggleTodoItem(id:$id) { id isCompleted }
  }
`;

export const UPDATE_TODO_ITEM = gql`
  mutation update($id:ID! $content: String!){
    updateTodoItem(content:$content, id:$id){ id content }
  }
`;

export const DELETE_TODO_ITEM = gql`
  mutation delete($id:ID!){
    deleteTodoItem(id:$id)
  }
`;

export const CREATE_TODO_ITEM = gql`
  mutation new_item($content: String!){
    createTodoItem(content: $content){
      id isCompleted content
    }
  }
`;