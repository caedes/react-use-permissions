import { flatten, pick, uniq, values } from "ramda";
import React from "react";

const PermissionsContext = React.createContext();

export const usePermissions = (roles) => {
  const { canWithRoles } = React.useContext(PermissionsContext);

  const can = canWithRoles(roles);

  return { can };
};

export const PermissionsProvider = ({ children, permissions }) => {
  const canWithRoles =
    (roles) =>
    ({ action, resource }) => {
      const currentUserPermissions = flatten(
        uniq(values(pick(roles, permissions)))
      );

      const currentUserResourcePermissions = currentUserPermissions.filter(
        (permisssion) => permisssion.resource === resource
      );

      const currentUserResourceActions = uniq(
        flatten(
          currentUserResourcePermissions.map(
            (permisssion) => permisssion.action
          )
        )
      );

      if (currentUserResourceActions.includes("*")) return true;

      return currentUserResourceActions.includes(action);
    };

  const value = {
    canWithRoles,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};
