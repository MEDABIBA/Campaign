// import "./index.css";
"use client";
import Link from "next/link";
import { Menu, MenuMenu } from "semantic-ui-react";

export const Header = () => {
  return (
    <Menu size="huge">
      <Link className="item" href={"/"}>
        CrowdCoin
      </Link>
      <MenuMenu position="right">
        <Link className="item" href={"/"}>
          Campaigns
        </Link>
        <Link className="item" href={"/campaigns/new"}>
          +
        </Link>
      </MenuMenu>
    </Menu>
  );
};
