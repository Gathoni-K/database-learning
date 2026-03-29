# AUTHENTICATION 101.

-Answers the question 'Who are you?' 

-Is the process of verifying a user's identity.

-Common factors include passwords, magic links, biometrics, social logins.

-After successful AuthN, the server gives the user a JWT or a Session Cookie, their 'ID card' for the rest of the visit.

-Tool of choice Supabase Auth.

-One is sufficient for both the backend and the frontend; this is how the relationship works in practice:

1.Frontend (ATM) - is where our users interact. Install the Supabase client here to show 'Loging with Google' button. When clicked, Supabase handles the complex OAuth handshake with Google, logs the user in, and hands the frontend a JWT.

2.Backend (The Vault) - will not handle the login process, instead when asked for private data, it passes the JWT along. It simply looks at our token and says 'Did Supabase sign this? Yes? Okay, let them in.'


## How JWT Authentication works.

1.User sends email + password.

2.Server checks credentials against DB.

3.Credentials correct? Server generates a JWT token.

4.Token sent back to client.

5.Client sends token with every future request.

6.Server verifies token on protected routes.

7.Valid token? Request goes through.
 Invalid token? 401 Unauthorized.

-A JWT looks like so:

    eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMyIsInJvbGUiOiJsaWJyYXJpYW4ifQ.abc123
        ↑                         ↑                              ↑
    header                     payload                       signature
  (algorithm)              (your data)                   (verification)


## Setup.

-Install using:

    npm install bcrypt jsonwebtoken
    npm install -D @types/bcrypt @types/jsonwebtoken

    bcrypt - hashes passwords
    jsonwebtoken - generates and verifies JWT tokens.





