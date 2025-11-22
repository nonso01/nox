import { useState } from "react";
import { Battery, XCircle } from "lucide-react";
import { MobileMenu } from "../ui-shared/Svgs";

import Logo from "/images/favicon.png";
const imgSize = 40;

export default function MobileNav({ batteryInfo }) {
  const [showMenu, setShowMenu] = useState((p) => false);

  return (
    <nav className="m-nav flex between debug">
      <MobileMenu setState={setShowMenu} />
      <div className="logo " title="Martin">
        <img
          src={Logo}
          alt="Nonso Martin"
          data-x="r"
          width={imgSize}
          height={imgSize}
        />
      </div>
      <div className="battey-info">
        <Battery />
      </div>
      {/* list should be absolute*/}
      {showMenu ? (
        <div className="menu-list debug">
          <XCircle
            onClick={(e) => {
              setShowMenu((p) => !p);
            }}
          />
          <p>menu: {`${showMenu}`}</p>
        </div>
      ) : null}
    </nav>
  );
}
