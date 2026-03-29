# AUTHENTICATION 101.

-Answers the question 'Who are you?' 

-Is the process of verifying a user's identity.

-Common factors include passwords, magic links, biometrics, social logins.

-After successful AuthN, the server gives the user a JWT or a Session Cookie, their 'ID card' for the rest of the visit.

-Tool of choice Supabase Auth.

-One is sufficient for both the backend and the frontend; this is how the relationship works in practice:

1.Frontend (ATM) - is where our users interact. Install the Supabase client here to show 'Loging with Google' button. When clicked, Supabase handles the complex OAuth handshake with Google, logs the user in, and hands the frontend a JWT.

2.Backend (The Vault) - will not handle the login process, instead when asked for private data, it passes the JWT along. It simply looks at our token and says 'Did Supabase sign this? Yes? Okay, let them in.'

