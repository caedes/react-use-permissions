# React Use Permissions

## Foreword

While nearly all of our authentication system are role-based-authentication, we can't rely on a combination of roles in our front apps. We need an abstraction around our resources and actions for a good code maintenance.

## Installation

```shell
yarn add @caedes/react-use-permissions
```

## Usage

```javascript
const permissions = {
  developper: [{ action: "read", resource: "home" }],
  techLead: [
    { action: "read", resource: "home" },
    { action: "create", resource: "issue" },
  ],
  admin: [
    { action: "read", resource: "home" },
    { action: ["create", "delete"], resource: "issue" },
  ],
};

const App = () => {
  return (
    <PermissionsProvider permissions={permissions}>
      <HomeScreen />
    </PermissionsProvider>
  );
};

const HomeScreen = () => {
  const { roles } = useSomeAuthentication();
  const { can } = usePermissions(roles);

  const canReadHome = can("read", "home");
  const canCreateIssue = can("create", "issue");
  const canDeleteIssue = can("delete", "issue");

  return (
    <>
      {canReadHome && <h2>OK</h2>}
      {canCreateIssue && <input type="text" name="issue-name" />}
      {canDeleteIssue && <button>Delete</button>}
    </>
  );
};
```

## Writing Permissions

### Inheritance

While sometimes permissions and roles are inherited, you can write them like so:

```javascript
const developerPermissions = [{ action: "read", resource: "home" }];

const permissions = {
  developper: developerPermissions,
  techLead: [...developerPermissions, { action: "create", resource: "issue" }],
  admin: [
    ...developerPermissions,
    { action: ["create", "delete"], resource: "issue" },
  ],
};
```

### Wildcard

It's sometimes easier to give all access to a particular role. It can be done with the `*` wildcard action:

```javascript
const developerPermissions = [{ action: "read", resource: "home" }];

const permissions = {
  developper: developerPermissions,
  techLead: [...developerPermissions, { action: "create", resource: "issue" }],
  admin: [...developerPermissions, { action: "*", resource: "issue" }],
};
```
