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


