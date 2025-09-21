import Link from "next/link";
import { Cards } from "../types";
import { memo } from "react";

const Cards = memo(({ data }: Cards) => {
  return (
    <>
      {Array.isArray(data) &&
        data.map((addressItem, key) => (
          <div key={key} className="card" style={{ width: "366px" }}>
            <div className="content">
              <div className="header">Address of this campaign:</div>
              <div className="meta">{addressItem}</div>
              <Link href={`campaigns/${addressItem}`}>View Campaign</Link>
            </div>
          </div>
        ))}
    </>
  );
});
Cards.displayName = "Cards";
export default Cards;
