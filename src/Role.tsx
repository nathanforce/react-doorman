import React from "react";
import { DoormanContext } from "./Doorman";

export interface RoleProps {
  role: string;
}

const Role: React.SFC<RoleProps> = ({ role, children }) => {
  return (
    <DoormanContext.Consumer>
      {({ isRole }) => (isRole(role) ? children : null)}
    </DoormanContext.Consumer>
  );
};

export default Role;
