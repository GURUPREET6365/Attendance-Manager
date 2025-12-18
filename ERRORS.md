***This is the file where i will write down my all error.***

ERROR 1:

    raise ImproperlyConfigured("Error loading psycopg2 or psycopg module")
    django.core.exceptions.ImproperlyConfigured: Error loading psycopg2 or psycopg module

    WHY:
    We are connecting the server with the postgresql, so we need to have the adaptor which will connect both python server and the postgresql.

    And here, psycopg2 or psycopg is the adaptor, and it is telling that it is not properly or not installed.

    SOLUTION:

    "pip install psycopg"

    This is the command, use it to install the psycopg.

