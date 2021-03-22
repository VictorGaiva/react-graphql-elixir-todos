import React, { useState } from "react";

import { makeStyles } from "@material-ui/styles";

import { GET_SELF } from "../../gql/query";
import { TodoList } from "./todo-list";
import { FolderList } from "./folder-list";

import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, ListSubheader } from "@material-ui/core";
import { PowerSettingsNew } from "@material-ui/icons";
import { gql, useQuery, useSubscription } from "@apollo/client";

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    minHeight: "100vh",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid #eee",
  },
  logoutButton: {
    cursor: "pointer",
  },
});

export default function HomePage({ logout }: { logout: () => void }) {
  const { container, sidebar, logoutButton } = useStyles();

  const [selected, setSelected] = useState("");

  const { data } = useQuery<{ self: User }>(GET_SELF);

  const folders = data?.self.folders ?? [];
  const folder = folders.find(({ id }) => selected === id);
  const data2 = useSubscription<{ todoAdded: { id: string } }>(
    gql`subscription TodoAdded{ todoAdded(folderId: "2bce4f96-95a4-4bb3-ba32-0adf7ec4bff4") { id } }`, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
    }
  });

  return (
    <div className={container}>
      <div className={sidebar}>
        <FolderList folders={folders} selected={selected} onChange={setSelected} />
        <List subheader={<ListSubheader>Profile</ListSubheader>}>
          <Divider />
          <ListItem className={logoutButton} onClick={logout}>
            <ListItemAvatar>
              <Avatar>
                <PowerSettingsNew color="error" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
      <TodoList folder={folder} />
    </div>
  );
}
