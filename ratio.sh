#!/bin/bash
while  [ 1  ]; do 
    sleep 1; 
    curl --location --request POST 'http://localhost:14621/graphql'  --header 'Content-Type: application/json'  --data-raw '{"query":"{\r\n    ratioDuplicate\r\n}","variables":{}}'; 
done
