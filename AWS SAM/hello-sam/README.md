# 使い方
```sh
# SAM CLI をインストールする
pip install aws-sam-cli

# template.json の UserPoolArn の値を更新する
nano template.yaml

# Function のコードを格納するための S3 バケットを作成する
export S3_BUCKET=hello-sam-functions-`date "+%s"`
aws s3 mb s3://$S3_BUCKET

# template.yaml をパッケージングする
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $S3_BUCKET

# template.yaml で指定した構成を AWS にデプロイする (hello-samというスタック名で)
sam deploy --template-file packaged.yaml --stack-name hello-sam --capabilities CAPABILITY_IAM
```

# コードの更新
```sh
# コードの更新
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $S3_BUCKET
sam deploy --template-file packaged.yaml --stack-name hello-sam --capabilities CAPABILITY_IAM
```

# ローカルテスト
```sh
# ローカルテスト (消費CPU時間やメモリ量を把握することができる)
sam local generate-event apigateway aws-proxy --body "{}" --method GET > event.json
sam local invoke HelloFunction -e event.json
```
