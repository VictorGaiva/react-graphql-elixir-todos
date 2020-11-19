import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles'

import { useQuery } from "@apollo/react-hooks";

import { GET_FOLDERS } from '../../gql/query';
import { TodoList } from './todo-list';
import { FolderList } from './folder-list';

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: '300px 1fr',
    minHeight: "100vh",
  },
});

interface TodoItemsQueryResult {
  folders: Folder[];
}

export default function HomePage() {
  const { container } = useStyles();

  const [selected, setSelected] = useState('');

  const { data, loading } = useQuery<TodoItemsQueryResult>(GET_FOLDERS);

  const folders = data?.folders ?? [];
  const folder = folders.find(({ id }) => selected === id);

  return (
    <div className={container}>
      <FolderList folders={folders} selected={selected} onChange={setSelected} />
      <TodoList folder={folder} />
    </div>
  )
}