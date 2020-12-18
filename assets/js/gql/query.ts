import { gql } from "@apollo/client";

export const ITEM_FRAGMENT = gql`
  fragment itemFields on TodoItem {
    id
    content
    isCompleted
  }
`;

export const FOLDER_FRAGMENT = gql`
  fragment folderFields on Folder {
    id
    name
    items {
      ...itemFields
    }
  }
  ${ITEM_FRAGMENT}
`;

export const GET_SELF = gql`
  {
    self {
      id
      username
      folders {
        ...folderFields
      }
    }
  }
  ${FOLDER_FRAGMENT}
`;
