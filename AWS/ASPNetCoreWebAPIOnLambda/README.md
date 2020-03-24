# ASP.NET Core Web API on AWS Lambda

## What to do before deploying

Modify a value of "s3-bucket" in aws-lambda-tools-defaults.json:

```json
{
	"profile": "default",
	"stack-name": "AspNetWebApiOnLambda",
	"region": "ap-northeast-1",
	"configuration": "Release",
	"framework": "netcoreapp2.1",
	"s3-bucket": "<please input your S3 bucket name>", <--- Modify
	"s3-prefix": "AspNetWebApiOnLambda/",
	"template": "template.json"
}
```

## Deploy to AWS

Install Amazon.Lambda.Tools .NET Core Global Tool:

```
dotnet tool install -g Amazon.Lambda.Tools
```

Run a deploy command:

```
dotnet lambda deploy-serverless
```

## What AWS resources will be deployed?

Please look at template.json that is a AWS SAM template.
