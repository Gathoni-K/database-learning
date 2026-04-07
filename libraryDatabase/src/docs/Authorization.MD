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


**The industry standard would be to combine Level 1 and Level 3.**

-Supabase uses RLS (Row Level Security) in the database, which is basically level 3 on steroids.


### RBAC.

-In our project, the roles assigned are librarian and members.

-To achieve this, we create the role.middleware.ts file.

    import { Request, Response, NextFunction } from 'express';

    <!-- SINGLE ROLE CHECK -->
    export const requireRole = (...roles: string[]) => {

        return (req: Request, res: Response, next: NextFunction) : void => {

            if(!req.user){
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                //ensure auth middleware runs first

                return;
            }

            const userRole = req.user.user_metadata?.role ?? req.user.role;
            //extract role - checks user_metadata first, falls back to token root

            //check if user's role is in the allowed list
            if (!roles.includes(userRole)) {
                res.status(403).json({
                    success: false,
                    message: 'Forbidden: You do not have permission to perform this action',
                });
                return;
            }

            next();

        };
    };

    <!-- ROLE CHECK -->
    <!-- Used when a resource owner or a privileged role can access something 
    -Used when the resource belongs to a specific user, and both the owner and privileged role are to have access.-->

    export const requireOwnerOrRole = (...roles: string[]) => {
        return (req: Request, res: Response, next: NextFunction) : void => {

            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const userRole = req.user.user_metadata?.role ?? req.user.role;
            const isOwner = req.params.id === req.user.sub;
            const hasRole = roles.includes(userRole);


            if(!isOwner && !hasRole) {
                res.status(403).json({
                    success: false,
                    message: 'Forbidden: You do not have permission to perform this action',
                });
                return;
            }

            next();
        }
    }

401 - no user attached, auth problem.
403 - wrong role, permission problem.


