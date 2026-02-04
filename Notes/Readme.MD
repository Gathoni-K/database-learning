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
