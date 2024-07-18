# RichCRM Backend

## API Documentation
### Authentication
- POST - **v1/auth/register**
    ```json
    {
        "emailAddress": "",
        "password": "",
        "userName": "",
        "role": "0 | 1 | 2"
    }
    ```
- POST - **v1/auth/login**
    ```json
    {
        "emailAddress": "",
        "password": ""
    }
    ```
- POST - **v1/auth/delete**
    ```json
    {
        "emailAddress": "",
        "password": ""
    }
    ```
- POST - **v1/auth/update**
    ```json
    {
        "emailAddress": "",
        "password": "",
        "userName": "",
        "role": "admin | attorney | client"
    }
    ```


## Deployment Locally
make sure you create a ```.env``` file in the express.js project

```bash
# .env
# DEVELOPMENT
NODE_ENV=local | development | production

# PORT
PORT=3001

# DYNAMODB
ACCESSKEYID=AKIA...
SECRETACCESSKEY=
REGION=us-east-1
```

## Elastic Beanstalk Deployment
### 0. Pre-requisite
#### 0.a. Install EB CLI
Please following [this Git Repo](https://github.com/aws/aws-elastic-beanstalk-cli-setup) accordingly to install EB CLI.

#### 0.b. Clean local files
Make sure that the following files are removed, you can run the following scripts:
```
rm -rf node_modules
rm package-lock.json
```

### 1. Run EB CLI
#### 1.a. eb init
In order to use express JS we need to make sure that the node version is greater than 18, we recommend using the following platform on AWS.  
You can replace the region with other regions you prefer.
```
eb init --platform "Node.js 20 running on 64bit Amazon Linux 2023" --region us-east-1
```

#### 1.b. eb create
Run ```eb create```, you should be able to see the following insdruction steps:
```
eb create                
Enter Environment Name
(default is tagme-backend-dev): 
Enter DNS CNAME prefix
(default is tagme-backend-dev): 

Select a load balancer type
1) classic
2) application
3) network
(default is 2): 

Your account has one or more sharable load balancers. Would you like your new environment to use a shared load balancer? (y/N): 

Would you like to enable Spot Fleet requests for this environment? (y/N): 
```
Then Voila, it is now depolyed to the server

#### 1.c. eb deploy (Only to update the newer version of the application)

```
eb deploy
```



## <a name="dynamo"></a>Interact with DynamoDB

### 0. Run DynanoDB Server locally (OPTIONAL)
**Noted if you are running DynamoDB locally with a endpoint, adding _--endpoint-url_, else ignore it!**  

## 0. Run DynamoDB docker locally
To run DynamoDB locally, you also need to run the docker image from [AWS](https://hub.docker.com/r/amazon/dynamodb-local), you can run the following command:
```bash
docker run -p 8000:8000 amazon/dynamodb-local
``` 

Export the AWS profile to the local environment: 
```bash
export AWS_PROFILE=richtech-ai-lab
```


### 1. Create Table

```bash
# User
aws dynamodb create-table \
    --table-name User \
    --attribute-definitions \
        AttributeName=EmailAddress,AttributeType=S \
    --key-schema AttributeName=EmailAddress,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=1 \
    --table-class STANDARD \
    --endpoint-url http://localhost:8000

# Address
aws dynamodb create-table \
    --table-name Address \
    --attribute-definitions \
        AttributeName=AddressId,AttributeType=S \
    --key-schema AttributeName=AddressId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=1 \
    --table-class STANDARD \
    --endpoint-url http://localhost:8000

# Case
aws dynamodb create-table \
    --table-name Case \
    --attribute-definitions \
        AttributeName=CaseId,AttributeType=S \
    --key-schema AttributeName=CaseId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=100,WriteCapacityUnits=1 \
    --table-class STANDARD \
    --endpoint-url http://localhost:8000

# Client
aws dynamodb create-table \
    --table-name Client \
    --attribute-definitions \
        AttributeName=ClientId,AttributeType=S \
    --key-schema AttributeName=ClientId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=1 \
    --table-class STANDARD \
    --endpoint-url http://localhost:8000
```
### 2. Delete table
```bash
aws dynamodb delete-table --table-name User \
    --endpoint-url http://localhost:8000

```

### 3. Scan for a table
Replace the MetamaskAddress with the address you want to query.

```bash

aws dynamodb scan --table-name User

aws dynamodb get-item \
    --table-name User \
    --key '{"EmailAddress":{"S":"test@gmail.com"}}' \
    --endpoint-url http://localhost:8000

aws dynamodb query \
    --table-name User \
    --key-condition-expression "EmailAddress = :emailAddress" \
    --expression-attribute-values '{":userName":{"S": "test user"}, ":emailAddress":{"S": "test@gmail.com"}}' \
    --filter-expression "UserName = :userName" \
    --endpoint-url http://localhost:8000
```

### 4. Update to a table

```bash
aws dynamodb update-item \
    --table-name User \
    --key '{"EmailAddress":{"S":"test@gmail.com"}}' \
    --update-expression "SET #n = :n , #r = :r" \
    --expression-attribute-names '{"#n": "UserName", "#r": "Role"}' \
    --expression-attribute-values '{":n": {"S":"Eden"}, ":r": {"S":"admin"}}' \
    --return-values ALL_NEW \
    --endpoint-url http://localhost:8000
```

### 5. **Batch Write to Tables (Local Debugging Purposes)**

```bash
# Addresses
aws dynamodb batch-write-item --request-items file://mock-data-dynamo/addresses.json \
    --endpoint-url http://localhost:8000

# Clients
aws dynamodb batch-write-item --request-items file://mock-data-dynamo/clients.json \
    --endpoint-url http://localhost:8000
```