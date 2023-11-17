
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { type } from "os";
import React from "react";
import { User, signOut } from "firebase/auth";

type UserMenuProps = {
    user?: User | null;
};

const UserMenu = () => {
  return (
    <Menu>
      <MenuButton as={Button}>User Menu</MenuButton>
      <MenuList>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
