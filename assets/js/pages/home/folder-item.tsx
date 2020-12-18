import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from "@material-ui/core";
import {
  Folder as FolderIcon,
  Delete as DeleteIcon,
  CheckCircle,
} from "@material-ui/icons";
import { useMutation } from "@apollo/client";
import { GET_SELF } from "../../gql/query";
import { UPDATE_FOLDER, DELETE_FOLDER } from "../../gql/mutation";

const useStyles = makeStyles({
  folderItem: {
    cursor: "pointer",
  },
});

export default function FolderItem({
  folder,
  onClick,
  isSelected,
}: {
  isSelected: boolean;
  folder: Folder;
  onClick: () => void;
}) {
  const { folderItem } = useStyles();

  const [hasFocus, setHasFocus] = useState(false);
  const [editing, setEditing] = useState(false);
  const [folderName, setFolderName] = useState(folder.name);

  const [updateFolder] = useMutation(UPDATE_FOLDER);
  const [deleteFolder] = useMutation(DELETE_FOLDER, {
    update(cache) {
      const data = cache.readQuery<{ self: User }>({
        query: GET_SELF,
      });
      cache.writeQuery({
        query: GET_SELF,
        data: {
          ...data,
          self: {
            ...data.self,
            folders: data.self.folders.filter(({ id }) => id !== folder.id),
          },
        },
      });
    },
  });

  function HandleDelete() {
    if (hasFocus) {
      setHasFocus(false);
      deleteFolder({ variables: { id: folder.id } });
    }
  }

  function HandleUpdate() {
    if (folderName !== folder.name && folderName.trim()) {
      updateFolder({
        variables: { id: folder.id, name: folderName },
      }).then(() => setEditing(false));
    } else setEditing(false);
  }

  return (
    <ListItem
      key={folder.id}
      onClick={onClick}
      selected={isSelected}
      className={folderItem}
    >
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>

      {editing ? (
        <TextField
          onFocus={(e) =>
            folderName === folder.name &&
            e.target.setSelectionRange(0, e.target.value.length)
          }
          onChange={(e) => setFolderName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && HandleUpdate()}
          value={folderName}
          autoFocus
        />
      ) : (
        <ListItemText
          primary={folder.name}
          onDoubleClick={() => setEditing(true)}
        />
      )}

      {editing ? (
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            onClick={HandleUpdate}
            disabled={folderName === folder.name}
          >
            <CheckCircle
              color={folderName === folder.name ? "disabled" : "primary"}
            />
          </IconButton>
        </ListItemSecondaryAction>
      ) : (
        isSelected && (
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              onClick={HandleDelete}
            >
              {hasFocus ? <CheckCircle color="error" /> : <DeleteIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        )
      )}
    </ListItem>
  );
}
