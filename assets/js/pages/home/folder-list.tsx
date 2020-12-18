import React, { useState } from "react";

import { makeStyles } from "@material-ui/styles";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  TextField,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { useMutation } from "@apollo/client";
import { GET_SELF } from "../../gql/query";
import { CREATE_FOLDER } from "../../gql/mutation";
import FolderItem from "./folder-item";

const useStyles = makeStyles({
  folderListHeader: {
    fontFamily: '"Nunito", sans-serif',
    fontWeight: 800,
    fontSize: "24px",
    margin: "0",
    color: "rgb(0, 122, 225)",
  },
  folderItem: {
    cursor: "pointer",
  },
});

export function FolderList({
  folders,
  selected,
  onChange,
}: {
  folders: Folder[];
  selected: string;
  onChange: (selected: string) => void;
}) {
  const { folderItem } = useStyles();
  const [newFolder, setNewFolder] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [createFolder] = useMutation<{ createFolder: Folder }>(CREATE_FOLDER, {
    update(cache, { data: { createFolder: newFolder } }) {
      const data = cache.readQuery<{ self: User }>({
        query: GET_SELF,
      });
      cache.writeQuery({
        query: GET_SELF,
        data: {
          ...data,
          self: { ...data.self, folders: [...data.self.folders, newFolder] },
        },
      });
    },
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
    <List subheader={<ListSubheader>Folders</ListSubheader>}>
      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          onClick={() => onChange(folder.id)}
          isSelected={folder.id === selected}
        />
      ))}
      <ListItem onClick={() => setNewFolder(true)} className={folderItem}>
        <ListItemAvatar>
          <Avatar>
            <AddIcon />
          </Avatar>
        </ListItemAvatar>
        {newFolder ? (
          <TextField
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && HandleOnBlur()}
            onBlur={HandleOnBlur}
            value={folderName}
            autoFocus
          />
        ) : (
          <ListItemText primary="Create folder" />
        )}
      </ListItem>
    </List>
  );
}
