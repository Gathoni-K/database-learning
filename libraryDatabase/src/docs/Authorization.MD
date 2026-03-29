# AUTHORIZATION 101.

-Is what defines the actions a user is allowed to take.

-Is the step happening after authentication.

-Controls security, privacy and system integrity.

-How do we organize these rules?

## 1.Roles (RBAC - Role-Based Access Control)

-Assign roles to users and give them specific permissions.

-Rules: Admins can view, edit, delete anything. Users are view-only.

-Is used when the app has a very clear, rigid hierarchy.

## 2.Permissions (PBAC- Permission-Based Access Control)

-Instead of checking someone's title, we check the specific skills.

-Define a list of things a user can do.

-Is very precise and flexible.

-One has to keep track of a lot of different permissions.

-Is used when a user needs highly customized access.

-Mostly in B2B Saas apps, enterprise software or tools where users have overlapping, highly specific duties.


## 3.Ownership/Attributes (ABAC- Attribute-Based Access Control)

-Say we have a standard 'User' profile, they are allowed to edit only their profile but now another's.

-Roles are not enough here, thus the attributes of the data are checked.

-Used when users start creating their own data.


**The industry standard wouldbe to combine Level 1 and Level 3.**

-Supabase uses RLS (Row Level Security) in the database, which is basically level 3 on steroids.
