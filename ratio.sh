#!/bin/bash
curl --location --request POST 'http://localhost:14621/graphql'  --header 'Content-Type: application/json'  --data-raw '{"query":"{\r\n    ratioDuplicate\r\n}","variables":{}}'