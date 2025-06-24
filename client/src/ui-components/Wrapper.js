import { useState } from "react";

import { Flex, Box, Button, ButtonGroup, Tooltip } from "@twilio-paste/core";

import { CallActiveIcon } from "@twilio-paste/icons/esm/CallActiveIcon";
import { UsersIcon } from "@twilio-paste/icons/esm/UsersIcon";
import { HistoryIcon } from "@twilio-paste/icons/esm/HistoryIcon";
import { DirectoryIcon } from "@twilio-paste/icons/esm/DirectoryIcon";

import { Theme } from "@twilio-paste/core/dist/theme";

import Main from "./Main";
import Users from "./Users/Users";
import UseCases from "./UseCases/UseCases";
import CallHistory from "./CallHistory/CallHistory";
import AppHeader from "./AppHeader";

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

const Wrapper = () => {
  const [page, setPage] = useState("main");

  // handler to manage page selection
  const showPage = (page) => {
    switch (page) {
      case "demo":
        return <Main />;
      case "users":
        return <Users />;
      case "useCases":
        return <UseCases />;
      case "calls":
        return <CallHistory />;
      default:
        return <Main />;
    }
  };

  // handler to manage page selection
  const handlePageClick = (page) => {
    setPage(page);
  };

  // render component
  let layout = (
    <Theme.Provider theme="Twilio">
      <Flex>
        <Flex grow>
          <Box width="100%">
            <AppHeader currentPage={page} setCurrentPage={handlePageClick} />
            <Box>{showPage(page)}</Box>
          </Box>
        </Flex>
      </Flex>
    </Theme.Provider>
  );
  return layout;
};
export default Wrapper;
