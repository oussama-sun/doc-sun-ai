# Target your exact production database version
FROM postgres:alpine

# Seed database with placeholder data
COPY *.sql /docker-entrypoint-initdb.d/