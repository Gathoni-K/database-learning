# DATABASE LEARNING.

-The following repo contains all the learning resources for database management using PostgreSQL.

-Install using:

    sudo pacman -Syu postgresql

    psql --version
    //checks the version of PostgreSQL installed.

    systemctl status postgresql
    //confirms that the server service exists
    //if status reads as inactive it means postgres is installed but not yet running.

    sudo systemctl start postgresql
    //starts the server
    sudo systemctl enable postgresql
    //makes postgres start automatically on boot.

    sudo -u postgres initdb -D /var/lib/postgres/data
    //start the server for the first time only

    sudo -u postgres psql
    //connects to PostgreSQL.

-The output for running the last command is:

    Type:  \copyright for distribution terms
       \h for help with SQL commands
       \? for help with psql commands
       \g or terminate with semicolon to execute query
       \q to quit





