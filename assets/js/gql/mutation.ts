import { gql } from "@apollo/client";
import { FOLDER_FRAGMENT, ITEM_FRAGMENT } from "./query";

export const TOGGLE_TODO_ITEM = gql`
  mutation toggle($id: ID!) {
    toggleTodoItem(id: $id) {
      ...itemFields
    }
  }
  ${ITEM_FRAGMENT}
`;

export const UPDATE_TODO_ITEM = gql`
  mutation update($id: ID!, $content: String!) {
    updateTodoItem(content: $content, id: $id) {
      ...itemFields
    }
  }
  ${ITEM_FRAGMENT}
`;

export const DELETE_TODO_ITEM = gql`
  mutation delete($id: ID!) {
    deleteTodoItem(id: $id)
  }
`;

export const CREATE_TODO_ITEM = gql`
  mutation new_item($content: String!, $folderId: ID!) {
    createTodoItem(content: $content, folderId: $folderId) {
      ...itemFields
    }
  }
  ${ITEM_FRAGMENT}
`;

export const CREATE_FOLDER = gql`
  mutation new_folder($folderName: String!) {
    createFolder(name: $folderName) {
      ...folderFields
    }
  }
  ${FOLDER_FRAGMENT}
`;

export const UPDATE_FOLDER = gql`
  mutation update_folder($id: ID!, $name: String!) {
    updateFolder(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation delete_folder($id: ID!) {
    deleteFolder(id: $id)
  }
`;
