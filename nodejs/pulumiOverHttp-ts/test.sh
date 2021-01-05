#!/bin/bash

# Load the AWS credentials
. env.vars

echo '-----------------------------------------------'
echo '| Create and update the stack                 |'
echo '-----------------------------------------------'
echo ''
curl --header "Content-Type: application/json" --request POST --data '{"id":"hello","content":"hello world\n"}' http://localhost:1337/sites

echo ''
echo '-----------------------------------------------'
echo '| Update the stack                            |'
echo '-----------------------------------------------'
echo ''
curl --header "Content-Type: application/json" --request PUT --data '{"id":"hello","content":"hello updated world!\n"}' http://localhost:1337/sites/hello

echo ''
echo '-----------------------------------------------'
echo '| Delete the stack                            |'
echo '-----------------------------------------------'
echo ''
curl --header "Content-Type: application/json" --request DELETE http://localhost:1337/sites/hello
