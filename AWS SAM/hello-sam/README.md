# 使用方法

```sh
# SAM CLI をインストールする
pip install aws-sam-cli

# Function のコードを格納するための S3 バケットを作成する
aws s3 mb s3://hello-sam-functions

# template.yaml をパッケージングする
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket hello-sam-functions

# template.yaml で指定した構成を AWS にデプロイする (hello-samというスタック名で)
sam deploy --template-file packaged.yaml --stack-name hello-sam --capabilities CAPABILITY_IAM

```
