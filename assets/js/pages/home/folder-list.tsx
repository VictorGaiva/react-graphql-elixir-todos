import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles'
import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, TextField, TextFieldProps } from '@material-ui/core';
import { Folder as FolderIcon, Add as AddIcon, Delete as DeleteIcon, CheckCircle } from '@material-ui/icons';
import { useMutation } from '@apollo/client';
import { GET_FOLDERS } from '../../gql/query';
import { CREATE_FOLDER, UPDATE_FOLDER, DELETE_FOLDER } from '../../gql/mutation';

const useStyles = makeStyles({
  folderList: {
    // display: 'grid',
    borderRight: "1px solid #eee"
  },
  folderListHeader: {
    fontFamily: '"Nunito", sans-serif',
    fontWeight: 800,
    fontSize: "24px",
    margin: "0",
    color: "rgb(0, 122, 225)"
  },
  folderItem: {
    cursor: 'pointer'
  }
});

function FolderItem({ folder, onClick, isSelected }: { isSelected: boolean; folder: Folder, onClick: () => void }) {
  const { folderItem } = useStyles();

  const [hasFocus, setHasFocus] = useState(false);
  const [editing, setEditing] = useState(false);
  const [folderName, setFolderName] = useState(folder.name);

  const [updateFolder] = useMutation(UPDATE_FOLDER);
  const [deleteFolder] = useMutation(DELETE_FOLDER, {
    update(cache) {
      const data = cache.readQuery<{ folders: Folder[] }>({ query: GET_FOLDERS });
      cache.writeQuery({ query: GET_FOLDERS, data: { ...data, folders: data.folders.filter(({ id }) => id !== folder.id) } });
    }
  });

  function HandleDelete() {
    if (hasFocus) {
      setHasFocus(false);
      deleteFolder({ variables: { id: folder.id } })
    }
  }

  function HandleUpdate() {
    if (folderName !== folder.name && folderName.trim()) {
      updateFolder({ variables: { id: folder.id, name: folderName } }).then(
        () => setEditing(false)
      )
    } else
      setEditing(false);
  }

  return (
    <ListItem key={folder.id} onClick={onClick} selected={isSelected} className={folderItem}>
      <ListItemAvatar>
        <Avatar >
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>

      {editing
        ? <TextField
          onFocus={e => folderName === folder.name && e.target.setSelectionRange(0, e.target.value.length)}
          onChange={e => setFolderName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && HandleUpdate()}
          value={folderName}
          autoFocus
        />
        : <ListItemText primary={folder.name} onDoubleClick={() => setEditing(true)} />
      }

      {editing
        ? (
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={HandleUpdate} disabled={folderName === folder.name}>
              <CheckCircle color={folderName === folder.name ? "disabled" : "primary"} />
            </IconButton>
          </ListItemSecondaryAction>
        )
        : isSelected && (
          <ListItemSecondaryAction>
            <IconButton edge="end" onFocus={() => setHasFocus(true)} onBlur={() => setHasFocus(false)} onClick={HandleDelete}>
              {hasFocus ? <CheckCircle color="error" /> : <DeleteIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        )
      }

    </ListItem>
  )
}

export function FolderList({ folders, selected, onChange }: { folders: Folder[], selected: string, onChange: (selected: string) => void }) {
  const { folderList, folderItem } = useStyles();
  const [newFolder, setNewFolder] = useState(false);
  const [folderName, setFolderName] = useState('');

  const [createFolder] = useMutation<{ createFolder: Folder }>(CREATE_FOLDER, {
    update(cache, { data: { createFolder: newFolder } }) {
      const data = cache.readQuery<{ folders: Folder[] }>({ query: GET_FOLDERS });
      cache.writeQuery({ query: GET_FOLDERS, data: { ...data, folders: [...data.folders, newFolder] } });
    }
  });

  function HandleOnBlur() {
    if (folderName.trim()) {
      createFolder({ variables: { folderName } }).then(() => {
        setNewFolder(false);
        setFolderName("");
      });
    } else {
      setNewFolder(false);
      setFolderName("");
    }
  }

  return (
    <div className={folderList}>
      <List>
        {folders.map(folder =>
          <FolderItem key={folder.id} folder={folder} onClick={() => onChange(folder.id)} isSelected={folder.id === selected} />
        )}
        <Divider />
        <ListItem onClick={() => setNewFolder(true)} className={folderItem}>
          <ListItemAvatar>
            <Avatar >
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          {newFolder
            ? <TextField
              onChange={e => setFolderName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && HandleOnBlur()}
              onBlur={HandleOnBlur}
              value={folderName}
              autoFocus
            />
            : <ListItemText primary="Create folder" />
          }
        </ListItem>
      </List>
    </div>
  )
}