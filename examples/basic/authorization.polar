
allow(actor, action, resource) if
  has_permission(actor, action, resource);

actor User {}

has_role(user: User, name: String, _resource: Secret) if
  user.role = name;

resource Secret {
  permissions = ["read", "write"];
  roles = ["admin", "user"];

  "read" if "user";

  "write" if "admin";

  "user" if "admin";
}
