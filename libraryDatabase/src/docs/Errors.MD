# ERRORS.

-The following are errors encountered while building the app:

1. auth.service.ts file

    const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    //the error on 'sign' reads that no overload matches this call.

    const result = await db.insert(members).values({
        ...rest,
        password: hashedPassword
    }).returning();

    //same error on 'values'

-This is because looking at our code, rest is being spread into 'values' before it is declared.

    docker build -t librarysystem .                                                           13:01 
    [+] Building 0.1s (1/1) FINISHED                                                                                                           docker:desktop-linux
    => [internal] load build definition from Dockerfile                                                                                                       0.0s
    => => transferring dockerfile: 2B                                                                                                                         0.0s
    ERROR: failed to build: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory

-Our Dockerfile cannot be found. 

-This is because we were running build in the wrong directory, ensure the Dockerfile and .dockergitignore are in the root directory.

3. 

    Dockerfile:10
    --------------------
    8 |     
    9 |     COPY src/ ./src/
    10 | >>> RUN npm run build
    11 |     
    12 |     FROM node:20-alpine AS production
    --------------------
    ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1

-The 'npm run build' command executed but the build process failed and it threw an error.

-Possible causes, issues with tsconfig.json or type mismatches etc in our code.

-Try running the build locally using:

    npm run build

-This will print out all the ts errors we need to fix.
