import { useState } from "react";
import {
  Box,
  Heading,
  Topbar,
  TopbarActions,
  Button,
  ButtonGroup,
  Tooltip,
  page,
  MenuButton,
  useMenuState,
  Menu,
  MenuItem,
} from "@twilio-paste/core";

import { LogoTwilioIcon } from "@twilio-paste/icons/esm/LogoTwilioIcon";
import { MenuIcon } from "@twilio-paste/icons/esm/MenuIcon";
import { CallActiveIcon } from "@twilio-paste/icons/esm/CallActiveIcon";
import { UsersIcon } from "@twilio-paste/icons/esm/UsersIcon";
import { HistoryIcon } from "@twilio-paste/icons/esm/HistoryIcon";
import { DirectoryIcon } from "@twilio-paste/icons/esm/DirectoryIcon";

const styles = {
  wrapper: { width: "100%" },
  headTwoColumnLayout: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "20px",
  },
  headLeftColumn: {
    width: "200px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
  headRightColumn: {
    flex: 1,
    textAlign: "left",
    color: "#ffffff",
  },
};

const AppHeader = (props) => {
  const menu = useMenuState();

  const handlePageClick = (page) => {
    props.setCurrentPage(page);
    menu.hide();
  };

  let layout = (
    <Box>
      <Topbar id="header">
        <TopbarActions justify="start">
          <Box display="flex" alignItems="center">
            <Box paddingRight="space20">
              <LogoTwilioIcon
                size={"sizeIcon50"}
                color="red"
                decorative={false}
                title="Description of icon"
              />
            </Box>
            <Heading
              marginBottom="space0"
              paddingLeft="space30"
              as="h2"
              variant="heading20"
              color={{ color: "#ffffff" }}
            >
              ConversationRelay
            </Heading>
          </Box>
        </TopbarActions>
        <TopbarActions justify="end">
          <Box display={["none", "none", "block"]}>
            <ButtonGroup attached>
              <Tooltip text="Demo ConversationRelay">
                <Button
                  variant="secondary"
                  disabled={page === "demo"}
                  onClick={() => handlePageClick("demo")}
                >
                  <CallActiveIcon decorative />
                  Demo
                </Button>
              </Tooltip>
              <Tooltip text="Manage Users">
                <Button
                  variant="secondary"
                  disabled={page === "users"}
                  onClick={() => handlePageClick("users")}
                >
                  <UsersIcon decorative />
                  Users
                </Button>
              </Tooltip>
              <Tooltip text="Manage AI Experiences">
                <Button
                  variant="secondary"
                  disabled={page === "useCases"}
                  onClick={() => handlePageClick("useCases")}
                >
                  <DirectoryIcon decorative />
                  Use Cases
                </Button>
              </Tooltip>
              <Tooltip text="View Previous Calls">
                <Button
                  variant="secondary"
                  disabled={page === "calls"}
                  onClick={() => handlePageClick("calls")}
                >
                  <HistoryIcon decorative />
                  Call History
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Box>
          {/* Responsive for mobile hamburger menu */}
          <Box display={["block", "block", "none"]}>
            <MenuButton {...menu} variant="primary_icon">
              <MenuIcon decorative={false} size="sizeIcon80" title="AppMenu" />
            </MenuButton>
            <Menu {...menu} aria-label="App Menu">
              <MenuItem
                {...menu}
                onClick={() => handlePageClick("demo")}
                disabled={props.currentPage === "demo"}
              >
                <Box display="flex" alignItems="center" columnGap="space30">
                  <CallActiveIcon decorative />
                  Demo
                </Box>
              </MenuItem>

              <MenuItem
                {...menu}
                onClick={() => handlePageClick("users")}
                disabled={props.currentPage === "users"}
              >
                <Box display="flex" alignItems="center" columnGap="space30">
                  <UsersIcon decorative />
                  Users
                </Box>
              </MenuItem>

              <MenuItem
                {...menu}
                onClick={() => handlePageClick("useCases")}
                disabled={props.currentPage === "useCases"}
              >
                <Box display="flex" alignItems="center" columnGap="space30">
                  <DirectoryIcon decorative />
                  Use Cases
                </Box>
              </MenuItem>

              <MenuItem
                {...menu}
                onClick={() => handlePageClick("calls")}
                disabled={props.currentPage === "calls"}
              >
                <Box display="flex" alignItems="center" columnGap="space30">
                  <HistoryIcon decorative />
                  Call History
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        </TopbarActions>
      </Topbar>
    </Box>
  );
  return layout;
};
export default AppHeader;
